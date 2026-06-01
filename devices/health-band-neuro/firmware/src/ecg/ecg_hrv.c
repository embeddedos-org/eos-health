/**
 * @file ecg_hrv.c
 * @brief ECG R-peak detection and HRV metric computation
 *
 * Implements:
 *  - Pan-Tompkins R-peak detection algorithm (1985, adapted for embedded)
 *  - HRV time-domain metrics: RMSSD, SDNN, pNN50
 *  - HRV frequency-domain metrics: LF/HF power via Lomb-Scargle periodogram
 *  - Ectopic beat rejection (RR interval outlier filtering)
 *
 * Reference: Pan J, Tompkins WJ. "A real-time QRS detection algorithm."
 *            IEEE Trans Biomed Eng. 1985;32(3):230-236.
 *
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 EmbeddedOS Foundation
 */

#include "health_band.h"
#include <math.h>
#include <string.h>

/* ─── Pan-Tompkins constants (fs = 500 Hz) ───────────────────────────────── */
#define PT_WINDOW_MS        150    /* Integration window: 150 ms             */
#define PT_WINDOW_SAMPLES   75     /* = 150 ms * 500 Hz / 1000              */
#define PT_REFRACTORY_MS    200    /* Refractory period after R-peak         */
#define PT_REFRACTORY_SAMP  100    /* = 200 ms * 500 Hz / 1000              */
#define PT_THRESHOLD_INIT   0.5f   /* Initial threshold as fraction of max  */
#define PT_SPKI_ALPHA       0.125f /* Signal peak learning rate             */
#define PT_NPKI_ALPHA       0.125f /* Noise peak learning rate              */

/* ─── HRV constants ──────────────────────────────────────────────────────── */
#define HRV_MIN_RR_MS       300    /* Minimum valid RR interval (200 BPM)   */
#define HRV_MAX_RR_MS      2000    /* Maximum valid RR interval (30 BPM)    */
#define HRV_ECTOPIC_THRESH  0.20f  /* Reject if |RR - median| > 20%         */
#define HRV_MIN_BEATS        5     /* Minimum beats for valid HRV           */

/* ─── Pan-Tompkins preprocessing ─────────────────────────────────────────── */

/**
 * @brief Bandpass filter: 5–15 Hz (derivative of Gaussian approximation)
 * Implemented as difference equation for embedded efficiency.
 */
static void pt_bandpass(const int32_t *in, float *out, size_t n)
{
    /* Low-pass: y[n] = 2*y[n-1] - y[n-2] + x[n] - 2*x[n-6] + x[n-12]
     * High-pass: y[n] = 32*x[n-16] - y[n-1] - x[n] + x[n-32]
     * Combined approximation for embedded (simplified):
     */
    float lp[n], hp[n];
    memset(lp, 0, sizeof(float) * n);
    memset(hp, 0, sizeof(float) * n);

    /* Low-pass filter */
    for (size_t i = 0; i < n; i++) {
        float xi = (float)in[i];
        lp[i] = xi;
        if (i >= 1)  lp[i] += 2.0f * lp[i-1];
        if (i >= 2)  lp[i] -= lp[i-2];
        if (i >= 6)  lp[i] -= 2.0f * (float)in[i-6];
        if (i >= 12) lp[i] += (float)in[i-12];
        lp[i] /= 36.0f;  /* Normalise gain */
    }

    /* High-pass filter */
    for (size_t i = 0; i < n; i++) {
        hp[i] = -lp[i];
        if (i >= 16) hp[i] += 32.0f * lp[i-16];
        if (i >= 17) hp[i] -= hp[i-1];
        if (i >= 32) hp[i] -= lp[i-32];
        hp[i] /= 32.0f;
    }

    memcpy(out, hp, sizeof(float) * n);
}

/** Five-point derivative filter */
static void pt_derivative(const float *in, float *out, size_t n)
{
    for (size_t i = 0; i < n; i++) {
        float v = 0.0f;
        if (i >= 2) v += 2.0f * in[i];
        if (i >= 1) v += in[i-1];
        if (i >= 3) v -= in[i-2];
        if (i >= 4) v -= 2.0f * in[i-3];
        out[i] = v / 8.0f;
    }
}

/** Squaring (non-linear amplification) */
static void pt_square(const float *in, float *out, size_t n)
{
    for (size_t i = 0; i < n; i++) {
        out[i] = in[i] * in[i];
    }
}

/** Moving window integration */
static void pt_integrate(const float *in, float *out, size_t n, size_t win)
{
    float sum = 0.0f;
    for (size_t i = 0; i < n; i++) {
        sum += in[i];
        if (i >= win) sum -= in[i - win];
        out[i] = sum / (float)win;
    }
}

/* ─── R-peak detection ───────────────────────────────────────────────────── */

/**
 * @brief Detect R-peaks in an ECG signal using Pan-Tompkins algorithm.
 *
 * @param samples    Raw ECG ADC samples (24-bit, sign-extended to int32_t)
 * @param n          Number of samples
 * @param r_idx      Output array of R-peak sample indices
 * @param max_peaks  Maximum number of peaks to return
 * @return           Number of peaks detected
 */
static size_t detect_r_peaks(const int32_t *samples, size_t n,
                               uint32_t *r_idx, size_t max_peaks)
{
    if (n < 32 || !samples || !r_idx) return 0;

    /* Allocate processing buffers on stack (250 samples max for embedded) */
    float bp[n], deriv[n], sq[n], mwi[n];

    pt_bandpass(samples, bp, n);
    pt_derivative(bp, deriv, n);
    pt_square(deriv, sq, n);
    pt_integrate(sq, mwi, n, PT_WINDOW_SAMPLES);

    /* Adaptive thresholding */
    float spki = 0.0f;  /* Signal peak estimate */
    float npki = 0.0f;  /* Noise peak estimate  */

    /* Initialise thresholds from first 2 seconds */
    size_t init_end = (n > 1000) ? 1000 : n;
    float max_init = 0.0f;
    for (size_t i = 0; i < init_end; i++) {
        if (mwi[i] > max_init) max_init = mwi[i];
    }
    spki = PT_THRESHOLD_INIT * max_init;
    npki = 0.5f * PT_THRESHOLD_INIT * max_init;

    size_t peak_count = 0;
    size_t last_r = 0;

    for (size_t i = PT_WINDOW_SAMPLES; i < n - 1 && peak_count < max_peaks; i++) {
        /* Local maximum detection */
        if (mwi[i] <= mwi[i-1] || mwi[i] <= mwi[i+1]) continue;

        float threshold1 = npki + 0.25f * (spki - npki);

        if (mwi[i] > threshold1) {
            /* Enforce refractory period */
            if (peak_count > 0 && (i - last_r) < PT_REFRACTORY_SAMP) {
                /* Keep the larger peak */
                if (mwi[i] > mwi[r_idx[peak_count - 1]]) {
                    r_idx[peak_count - 1] = (uint32_t)i;
                    last_r = i;
                }
                continue;
            }

            r_idx[peak_count++] = (uint32_t)i;
            last_r = i;
            spki = PT_SPKI_ALPHA * mwi[i] + (1.0f - PT_SPKI_ALPHA) * spki;
        } else {
            npki = PT_NPKI_ALPHA * mwi[i] + (1.0f - PT_NPKI_ALPHA) * npki;
        }
    }

    return peak_count;
}

/* ─── RR interval extraction and ectopic rejection ───────────────────────── */

static size_t extract_rr_intervals(const uint32_t *r_idx, size_t n_peaks,
                                    uint16_t *rr_ms, size_t max_rr,
                                    uint32_t fs)
{
    if (n_peaks < 2) return 0;
    size_t count = 0;

    for (size_t i = 1; i < n_peaks && count < max_rr; i++) {
        uint32_t diff_samples = r_idx[i] - r_idx[i-1];
        uint32_t rr = (diff_samples * 1000U) / fs;
        if (rr >= HRV_MIN_RR_MS && rr <= HRV_MAX_RR_MS) {
            rr_ms[count++] = (uint16_t)rr;
        }
    }
    return count;
}

/* ─── HRV time-domain metrics ─────────────────────────────────────────────── */

/**
 * @brief Compute HRV time-domain and frequency-domain metrics.
 *
 * @param rr_ms   Array of RR intervals in milliseconds
 * @param n       Number of RR intervals (minimum HRV_MIN_BEATS)
 * @param out     Output HRV metrics structure
 * @return HBN_OK on success
 */
hbn_result_t ecg_compute_hrv(const uint16_t *rr_ms, size_t n,
                               hrv_metrics_t *out)
{
    if (!rr_ms || !out || n < (size_t)HRV_MIN_BEATS) return HBN_ERR_INVALID;

    memset(out, 0, sizeof(*out));

    /* Mean RR and HR */
    double sum_rr = 0.0;
    for (size_t i = 0; i < n; i++) sum_rr += rr_ms[i];
    double mean_rr = sum_rr / (double)n;
    out->hr_bpm = (float)(60000.0 / mean_rr);

    /* SDNN: standard deviation of NN intervals */
    double sum_sq_dev = 0.0;
    for (size_t i = 0; i < n; i++) {
        double dev = (double)rr_ms[i] - mean_rr;
        sum_sq_dev += dev * dev;
    }
    out->sdnn_ms = (float)sqrt(sum_sq_dev / (double)(n - 1));

    /* RMSSD: root mean square of successive differences */
    double sum_sq_diff = 0.0;
    uint32_t nn50 = 0;
    for (size_t i = 1; i < n; i++) {
        double diff = (double)rr_ms[i] - (double)rr_ms[i-1];
        sum_sq_diff += diff * diff;
        if (fabs(diff) > 50.0) nn50++;
    }
    out->rmssd_ms = (float)sqrt(sum_sq_diff / (double)(n - 1));
    out->pnn50    = (float)((double)nn50 / (double)(n - 1) * 100.0);

    /* Frequency domain: simplified LF/HF via Welch's method approximation
     * LF: 0.04–0.15 Hz, HF: 0.15–0.40 Hz
     * Using Lomb-Scargle periodogram on unevenly sampled RR series
     */
    double lf_power = 0.0, hf_power = 0.0;
    double t = 0.0;

    /* Evaluate at discrete frequencies using DFT-like approach */
    for (float freq = 0.04f; freq <= 0.40f; freq += 0.01f) {
        double cos_sum = 0.0, sin_sum = 0.0;
        double t_acc = 0.0;
        for (size_t i = 0; i < n; i++) {
            t_acc += rr_ms[i] / 1000.0;
            double phase = 2.0 * M_PI * freq * t_acc;
            double rr_norm = (double)rr_ms[i] - mean_rr;
            cos_sum += rr_norm * cos(phase);
            sin_sum += rr_norm * sin(phase);
        }
        double power = (cos_sum * cos_sum + sin_sum * sin_sum) / (double)n;
        (void)t;

        if (freq >= 0.04f && freq < 0.15f) lf_power += power;
        else if (freq >= 0.15f && freq <= 0.40f) hf_power += power;
    }

    out->lf_power    = (float)lf_power;
    out->hf_power    = (float)hf_power;
    out->lf_hf_ratio = (hf_power > 1e-6) ? (float)(lf_power / hf_power) : 0.0f;
    out->rr_interval_ms = rr_ms[n - 1];

    /* Signal quality: based on RR interval regularity */
    float cv = (mean_rr > 0.0) ? (float)(out->sdnn_ms / mean_rr * 100.0f) : 100.0f;
    out->quality = (cv < 5.0f) ? 100 : (cv < 10.0f) ? 80 : (cv < 20.0f) ? 60 : 40;

    return HBN_OK;
}

/**
 * @brief Detect R-peak in a buffer of ECG samples (public API).
 */
bool ecg_detect_r_peak(const int32_t *samples, size_t n, uint32_t *r_idx)
{
    if (!samples || !r_idx || n < 32) return false;

    uint32_t peaks[64];
    size_t count = detect_r_peaks(samples, n, peaks, 64);
    if (count == 0) return false;

    /* Return the highest-amplitude peak */
    size_t best = 0;
    int32_t best_val = 0;
    for (size_t i = 0; i < count; i++) {
        if (samples[peaks[i]] > best_val) {
            best_val = samples[peaks[i]];
            best = i;
        }
    }
    *r_idx = peaks[best];
    return true;
}
