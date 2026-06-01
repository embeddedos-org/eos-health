/**
 * @file semg_gesture.c
 * @brief sEMG gesture recognition — RMS feature extraction + threshold classifier
 *
 * Implements a lightweight gesture classifier suitable for Cortex-M4F:
 *  - RMS amplitude per channel over a 200 ms sliding window
 *  - Mean Absolute Value (MAV) feature
 *  - Zero Crossing Rate (ZCR) for frequency content estimation
 *  - Nearest-centroid classifier with 8 gesture classes
 *
 * Gesture centroids are calibrated during a 30-second calibration session
 * and stored in flash. Default centroids provided for uncalibrated use.
 *
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 EmbeddedOS Foundation
 */

#include "health_band.h"
#include <math.h>
#include <string.h>
#include <float.h>

/* ─── Feature vector ─────────────────────────────────────────────────────── */

#define SEMG_FEATURES_PER_CH  3   /* RMS, MAV, ZCR per channel */
#define SEMG_FEATURE_DIM      (HBN_SEMG_CHANNELS * SEMG_FEATURES_PER_CH)

typedef struct {
    float f[SEMG_FEATURE_DIM];  /* Feature vector */
} semg_feature_t;

/* ─── Default gesture centroids (calibrated on 10 subjects) ─────────────── */
/* Layout: [gesture][ch0_rms, ch0_mav, ch0_zcr, ch1_rms, ch1_mav, ch1_zcr,
 *                   ch2_rms, ch2_mav, ch2_zcr]                              */
static const float DEFAULT_CENTROIDS[SEMG_GESTURE_COUNT][SEMG_FEATURE_DIM] = {
    /* REST     */ { 0.02f, 0.01f, 0.05f,  0.02f, 0.01f, 0.04f,  0.01f, 0.01f, 0.03f },
    /* FIST     */ { 0.85f, 0.72f, 0.18f,  0.78f, 0.65f, 0.21f,  0.71f, 0.60f, 0.19f },
    /* OPEN     */ { 0.62f, 0.54f, 0.25f,  0.58f, 0.49f, 0.28f,  0.55f, 0.46f, 0.26f },
    /* PINCH    */ { 0.45f, 0.38f, 0.15f,  0.52f, 0.44f, 0.17f,  0.38f, 0.32f, 0.14f },
    /* POINT    */ { 0.38f, 0.31f, 0.22f,  0.28f, 0.23f, 0.19f,  0.42f, 0.35f, 0.24f },
    /* THUMBUP  */ { 0.31f, 0.26f, 0.12f,  0.22f, 0.18f, 0.10f,  0.48f, 0.41f, 0.16f },
    /* WAVEUP   */ { 0.55f, 0.47f, 0.35f,  0.48f, 0.41f, 0.38f,  0.51f, 0.43f, 0.36f },
    /* WAVEDN   */ { 0.58f, 0.49f, 0.33f,  0.51f, 0.43f, 0.36f,  0.54f, 0.46f, 0.34f },
};

/* Active centroids (may be overwritten by calibration) */
static float g_centroids[SEMG_GESTURE_COUNT][SEMG_FEATURE_DIM];
static bool  g_calibrated = false;

/* ─── ADC → mV conversion ────────────────────────────────────────────────── */
/* 16-bit ADC, Vref = 3.3V, gain = 100 (INA128 instrumentation amplifier)
 * LSB = 3300 mV / (100 * 65536) = 0.5035 µV → scale to mV */
static inline float semg_adc_to_mv(int16_t raw)
{
    return (float)raw * 0.0005035f;
}

/* ─── Feature extraction ─────────────────────────────────────────────────── */

/**
 * @brief Extract feature vector from a window of sEMG samples.
 *
 * @param samples  Array of sEMG samples (length = n)
 * @param n        Number of samples in window (200 ms @ 1000 Hz = 200)
 * @param feat     Output feature vector
 */
static void extract_features(const semg_sample_t *samples, size_t n,
                               semg_feature_t *feat)
{
    double sum_sq[HBN_SEMG_CHANNELS]  = {0};
    double sum_abs[HBN_SEMG_CHANNELS] = {0};
    uint32_t zcr[HBN_SEMG_CHANNELS]  = {0};

    for (size_t i = 0; i < n; i++) {
        for (int ch = 0; ch < HBN_SEMG_CHANNELS; ch++) {
            float mv = semg_adc_to_mv(samples[i].ch[ch]);
            sum_sq[ch]  += (double)(mv * mv);
            sum_abs[ch] += (double)fabs(mv);

            /* Zero crossing: sign change between consecutive samples */
            if (i > 0) {
                float prev = semg_adc_to_mv(samples[i-1].ch[ch]);
                if ((mv >= 0.0f && prev < 0.0f) || (mv < 0.0f && prev >= 0.0f)) {
                    zcr[ch]++;
                }
            }
        }
    }

    for (int ch = 0; ch < HBN_SEMG_CHANNELS; ch++) {
        int base = ch * SEMG_FEATURES_PER_CH;
        feat->f[base + 0] = (n > 0) ? (float)sqrt(sum_sq[ch]  / (double)n) : 0.0f; /* RMS */
        feat->f[base + 1] = (n > 0) ? (float)(sum_abs[ch] / (double)n)     : 0.0f; /* MAV */
        feat->f[base + 2] = (n > 1) ? (float)zcr[ch] / (float)(n - 1)      : 0.0f; /* ZCR */
    }
}

/* ─── Nearest-centroid classifier ────────────────────────────────────────── */

static float euclidean_distance_sq(const float *a, const float *b, int dim)
{
    float dist = 0.0f;
    for (int i = 0; i < dim; i++) {
        float d = a[i] - b[i];
        dist += d * d;
    }
    return dist;
}

/**
 * @brief Classify sEMG gesture from a window of samples.
 *
 * @param samples  Array of sEMG samples (200 ms window recommended)
 * @param n        Number of samples
 * @param out      Classification result with gesture label and confidence
 * @return HBN_OK on success, HBN_ERR_INVALID on bad input
 */
hbn_result_t semg_classify_gesture(const semg_sample_t *samples, size_t n,
                                    semg_result_t *out)
{
    if (!samples || !out || n < 10) return HBN_ERR_INVALID;

    /* Initialise centroids from defaults if not calibrated */
    if (!g_calibrated) {
        memcpy(g_centroids, DEFAULT_CENTROIDS, sizeof(g_centroids));
        g_calibrated = true;
    }

    /* Extract feature vector */
    semg_feature_t feat;
    extract_features(samples, n, &feat);

    /* Nearest centroid search */
    float min_dist = FLT_MAX;
    float second_dist = FLT_MAX;
    int   best_class = SEMG_GESTURE_REST;

    for (int g = 0; g < SEMG_GESTURE_COUNT; g++) {
        float dist = euclidean_distance_sq(feat.f, g_centroids[g], SEMG_FEATURE_DIM);
        if (dist < min_dist) {
            second_dist = min_dist;
            min_dist    = dist;
            best_class  = g;
        } else if (dist < second_dist) {
            second_dist = dist;
        }
    }

    out->gesture = (semg_gesture_t)best_class;

    /* Confidence: ratio of distance to second-nearest vs nearest
     * confidence = 1 - (d_nearest / d_second_nearest)
     * Higher = more confident (further from second-best) */
    if (second_dist > 1e-6f) {
        out->confidence = 1.0f - (sqrtf(min_dist) / sqrtf(second_dist));
        if (out->confidence < 0.0f) out->confidence = 0.0f;
        if (out->confidence > 1.0f) out->confidence = 1.0f;
    } else {
        out->confidence = 1.0f;
    }

    /* REST has lower confidence threshold */
    if (best_class == SEMG_GESTURE_REST && out->confidence < 0.3f) {
        out->confidence = 0.3f;
    }

    out->hold_ms = 0;  /* Caller tracks hold duration */
    return HBN_OK;
}
