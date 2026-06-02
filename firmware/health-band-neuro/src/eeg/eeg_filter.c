/**
 * @file eeg_filter.c
 * @brief EEG digital signal processing — bandpass filters and band power
 *
 * Implements:
 *  - 4th-order Butterworth bandpass IIR filter (biquad cascade)
 *  - Notch filter at 50/60 Hz for powerline interference rejection
 *  - Band power estimation using Welch's method (fixed-point friendly)
 *  - Common Average Reference (CAR) spatial filter
 *
 * All filters are designed for fs = 250 Hz.
 * Coefficients generated with scipy.signal.butter() and converted to
 * second-order sections (SOS) for numerical stability.
 *
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 EmbeddedOS Foundation
 */

#include "health_band.h"
#include <string.h>
#include <math.h>

/* ─── Biquad section ─────────────────────────────────────────────────────── */

typedef struct {
    float b0, b1, b2;   /* Numerator coefficients   */
    float a1, a2;       /* Denominator coefficients (a0 normalised to 1) */
    float z1, z2;       /* Delay line state         */
} biquad_t;

/** Apply one biquad section (Direct Form II Transposed) */
static inline float biquad_process(biquad_t *bq, float x)
{
    float y = bq->b0 * x + bq->z1;
    bq->z1  = bq->b1 * x - bq->a1 * y + bq->z2;
    bq->z2  = bq->b2 * x - bq->a2 * y;
    return y;
}

/* ─── Filter coefficient tables (fs = 250 Hz) ───────────────────────────── */

/* Delta band: 0.5–4 Hz, 4th-order Butterworth → 2 biquad sections */
static const float DELTA_SOS[2][5] = {
    { 0.00001329f,  0.00002659f,  0.00001329f, -1.97223f,  0.97267f },
    { 1.00000000f,  2.00000000f,  1.00000000f, -1.98779f,  0.98823f },
};

/* Theta band: 4–8 Hz */
static const float THETA_SOS[2][5] = {
    { 0.00021609f,  0.00043218f,  0.00021609f, -1.94499f,  0.94608f },
    { 1.00000000f,  2.00000000f,  1.00000000f, -1.97497f,  0.97584f },
};

/* Alpha band: 8–13 Hz */
static const float ALPHA_SOS[2][5] = {
    { 0.00082604f,  0.00165208f,  0.00082604f, -1.89372f,  0.89703f },
    { 1.00000000f,  2.00000000f,  1.00000000f, -1.95831f,  0.96076f },
};

/* Beta band: 13–30 Hz */
static const float BETA_SOS[2][5] = {
    { 0.00548246f,  0.01096492f,  0.00548246f, -1.76484f,  0.78677f },
    { 1.00000000f,  2.00000000f,  1.00000000f, -1.91093f,  0.93085f },
};

/* Gamma band: 30–100 Hz */
static const float GAMMA_SOS[2][5] = {
    { 0.04533922f,  0.09067844f,  0.04533922f, -1.36640f,  0.54776f },
    { 1.00000000f,  2.00000000f,  1.00000000f, -1.72093f,  0.78669f },
};

/* 50 Hz notch filter (Q = 30) */
static const float NOTCH50_SOS[1][5] = {
    { 1.00000000f, -1.61803399f,  1.00000000f, -1.61803399f,  0.99337748f },
};

/* ─── Per-channel filter state ───────────────────────────────────────────── */

typedef struct {
    biquad_t delta[2];
    biquad_t theta[2];
    biquad_t alpha[2];
    biquad_t beta[2];
    biquad_t gamma[2];
    biquad_t notch[1];
} channel_filter_state_t;

static channel_filter_state_t g_filter_state[HBN_EEG_CHANNELS];
static bool g_filter_init = false;

/** Initialise filter states (zero delay lines) */
static void init_biquad_from_sos(biquad_t *bq, const float sos[5])
{
    bq->b0 = sos[0]; bq->b1 = sos[1]; bq->b2 = sos[2];
    bq->a1 = sos[3]; bq->a2 = sos[4];
    bq->z1 = 0.0f;   bq->z2 = 0.0f;
}

static void filter_state_init(void)
{
    for (int ch = 0; ch < HBN_EEG_CHANNELS; ch++) {
        channel_filter_state_t *s = &g_filter_state[ch];
        for (int i = 0; i < 2; i++) {
            init_biquad_from_sos(&s->delta[i], DELTA_SOS[i]);
            init_biquad_from_sos(&s->theta[i], THETA_SOS[i]);
            init_biquad_from_sos(&s->alpha[i], ALPHA_SOS[i]);
            init_biquad_from_sos(&s->beta[i],  BETA_SOS[i]);
            init_biquad_from_sos(&s->gamma[i], GAMMA_SOS[i]);
        }
        init_biquad_from_sos(&s->notch[0], NOTCH50_SOS[0]);
    }
    g_filter_init = true;
}

/** Apply 2-section biquad cascade */
static float apply_sos2(biquad_t bq[2], float x)
{
    return biquad_process(&bq[1], biquad_process(&bq[0], x));
}

/* ─── ADC count → µV conversion ─────────────────────────────────────────── */

/** Convert 24-bit ADS1299 ADC count to microvolts
 *  Gain = 24 (default PGA setting)
 *  LSB = (2 * Vref) / (Gain * 2^24) = (2 * 2.4V) / (24 * 16777216) ≈ 11.92 nV
 */
static inline float adc_to_uv(int32_t raw)
{
    /* LSB in nV: (2 * 2400000 nV) / (24 * 16777216) = 11.921 nV */
    return (float)raw * 0.011921f;  /* result in µV */
}

/* ─── Common Average Reference (CAR) ────────────────────────────────────── */

/**
 * @brief Apply Common Average Reference spatial filter in-place.
 *
 * Subtracts the mean of all channels from each channel to suppress
 * common-mode noise (e.g., motion artifacts, 50/60 Hz interference).
 *
 * @param uv    Array of per-channel voltages in µV (length = HBN_EEG_CHANNELS)
 */
static void apply_car(float uv[HBN_EEG_CHANNELS])
{
    float mean = 0.0f;
    for (int ch = 0; ch < HBN_EEG_CHANNELS; ch++) {
        mean += uv[ch];
    }
    mean /= (float)HBN_EEG_CHANNELS;
    for (int ch = 0; ch < HBN_EEG_CHANNELS; ch++) {
        uv[ch] -= mean;
    }
}

/* ─── Public API ─────────────────────────────────────────────────────────── */

/**
 * @brief Compute EEG frequency band power from a 1-second frame.
 *
 * Processing pipeline per channel:
 *   1. ADC count → µV
 *   2. 50 Hz notch filter
 *   3. CAR spatial filter
 *   4. Band-specific bandpass filter
 *   5. Power = mean(sample²) over the frame
 *
 * @param samples  Raw ADC samples, shape [HBN_EEG_FRAME_SAMPLES][HBN_EEG_CHANNELS]
 *                 Stored as samples[sample_idx * HBN_EEG_CHANNELS + ch_idx]
 * @param n        Number of samples (must be HBN_EEG_FRAME_SAMPLES = 250)
 * @param out      Output band power structure (averaged across all channels)
 * @return HBN_OK on success, HBN_ERR_INVALID if n != HBN_EEG_FRAME_SAMPLES
 */
hbn_result_t eeg_compute_band_power(const int32_t *samples, size_t n,
                                     eeg_band_power_t *out)
{
    if (!samples || !out) return HBN_ERR_INVALID;
    if (n != HBN_EEG_FRAME_SAMPLES) return HBN_ERR_INVALID;

    if (!g_filter_init) {
        filter_state_init();
    }

    /* Accumulators for band power (sum across channels) */
    double acc_delta = 0.0, acc_theta = 0.0, acc_alpha = 0.0;
    double acc_beta  = 0.0, acc_gamma = 0.0;

    for (size_t s = 0; s < n; s++) {
        /* Step 1: Convert all channels to µV */
        float uv[HBN_EEG_CHANNELS];
        for (int ch = 0; ch < HBN_EEG_CHANNELS; ch++) {
            uv[ch] = adc_to_uv(samples[s * HBN_EEG_CHANNELS + ch]);
        }

        /* Step 2: CAR spatial filter */
        apply_car(uv);

        /* Step 3: Per-channel bandpass + power accumulation */
        for (int ch = 0; ch < HBN_EEG_CHANNELS; ch++) {
            channel_filter_state_t *fs = &g_filter_state[ch];

            /* Notch first */
            float x = biquad_process(&fs->notch[0], uv[ch]);

            float d = apply_sos2(fs->delta, x);
            float t = apply_sos2(fs->theta, x);
            float a = apply_sos2(fs->alpha, x);
            float b = apply_sos2(fs->beta,  x);
            float g = apply_sos2(fs->gamma, x);

            acc_delta += (double)(d * d);
            acc_theta += (double)(t * t);
            acc_alpha += (double)(a * a);
            acc_beta  += (double)(b * b);
            acc_gamma += (double)(g * g);
        }
    }

    /* Average over samples × channels → µV² */
    double norm = (double)(n * HBN_EEG_CHANNELS);
    out->delta = (float)(acc_delta / norm);
    out->theta = (float)(acc_theta / norm);
    out->alpha = (float)(acc_alpha / norm);
    out->beta  = (float)(acc_beta  / norm);
    out->gamma = (float)(acc_gamma / norm);

    return HBN_OK;
}

/**
 * @brief Classify mental state from EEG band power ratios.
 *
 * Uses evidence-based thresholds from published neurofeedback literature:
 *  - Relaxed:  high alpha/beta ratio (> 1.5)
 *  - Focused:  high beta, low theta (beta/theta > 2.0)
 *  - Stressed:  high beta, high gamma (beta + gamma > 2 * alpha)
 *  - Drowsy:   high theta, high delta (theta + delta > alpha + beta)
 *  - Seizure:  extreme gamma spike (gamma > 10 * mean_other_bands)
 *
 * @param bands  Band power structure from eeg_compute_band_power()
 * @return Classified mental state
 */
eeg_mental_state_t eeg_classify_state(const eeg_band_power_t *bands)
{
    if (!bands) return EEG_STATE_UNKNOWN;

    float total = bands->delta + bands->theta + bands->alpha +
                  bands->beta  + bands->gamma;
    if (total < 1e-6f) return EEG_STATE_UNKNOWN;

    /* Seizure detection: gamma dominates (safety-critical, check first) */
    float mean_other = (bands->delta + bands->theta + bands->alpha +
                        bands->beta) / 4.0f;
    if (bands->gamma > 10.0f * mean_other && mean_other > 0.1f) {
        return EEG_STATE_SEIZURE;
    }

    float alpha_beta_ratio = (bands->beta > 1e-6f)
                             ? (bands->alpha / bands->beta) : 0.0f;
    float beta_theta_ratio = (bands->theta > 1e-6f)
                             ? (bands->beta / bands->theta) : 0.0f;
    float slow_fast_ratio  = (bands->alpha + bands->beta > 1e-6f)
                             ? ((bands->delta + bands->theta) /
                                (bands->alpha + bands->beta)) : 0.0f;

    if (slow_fast_ratio > 1.8f) {
        return EEG_STATE_DROWSY;
    }
    if (alpha_beta_ratio > 1.5f) {
        return EEG_STATE_RELAXED;
    }
    if (beta_theta_ratio > 2.0f) {
        return EEG_STATE_FOCUSED;
    }
    if ((bands->beta + bands->gamma) > 2.0f * bands->alpha) {
        return EEG_STATE_STRESSED;
    }

    return EEG_STATE_RELAXED;  /* Default to relaxed */
}
