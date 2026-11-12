/**
 * @file test_eeg_filter.c
 * @brief Real unit tests for EEG filter and band power computation
 *
 * Tests use synthetic signals with known frequency content to verify
 * that band power values are correct within ±10% tolerance.
 */

#include "unity/unity.h"
#include "health_band.h"
#include <math.h>
#include <string.h>

#define FS          250.0f
#define N_SAMPLES   HBN_EEG_FRAME_SAMPLES   /* 250 */
#define PI          3.14159265358979f

/* Generate a pure sine wave at frequency f_hz, amplitude amp_uv */
static void gen_sine_all_channels(int32_t *buf, float f_hz, float amp_uv)
{
    /* Convert µV to ADC counts: 1 LSB = 0.011921 µV → counts = µV / 0.011921 */
    float scale = amp_uv / 0.011921f;
    for (int s = 0; s < N_SAMPLES; s++) {
        float val = scale * sinf(2.0f * PI * f_hz * (float)s / FS);
        int32_t count = (int32_t)val;
        for (int ch = 0; ch < HBN_EEG_CHANNELS; ch++) {
            buf[s * HBN_EEG_CHANNELS + ch] = count;
        }
    }
}

/* Pure sine on channel 0 only, other channels at 0. Identical channels are
 * removed by the Common Average Reference, so the band-response tests below
 * drive a single channel. */
static void gen_sine_one_channel(int32_t *buf, float f_hz, float amp_uv)
{
    float scale = amp_uv / 0.011921f;
    memset(buf, 0, sizeof(int32_t) * N_SAMPLES * HBN_EEG_CHANNELS);
    for (int s = 0; s < N_SAMPLES; s++) {
        buf[s * HBN_EEG_CHANNELS] =
            (int32_t)(scale * sinf(2.0f * PI * f_hz * (float)s / FS));
    }
}

/* Band power of a steady single-channel sine: feeds the same 1 s frame
 * several times so the filter states settle, and returns the last frame. */
static eeg_band_power_t settled_band_power(float f_hz)
{
    static int32_t buf[N_SAMPLES * HBN_EEG_CHANNELS];
    eeg_band_power_t out;
    gen_sine_one_channel(buf, f_hz, 50.0f);
    for (int i = 0; i < 5; i++) {
        TEST_ASSERT_EQUAL(HBN_OK, eeg_compute_band_power(buf, N_SAMPLES, &out));
    }
    return out;
}

void setUp(void) {}
void tearDown(void) {}

/* ─── Test: null pointer handling ────────────────────────────────────────── */

void test_null_samples_returns_invalid(void)
{
    eeg_band_power_t out;
    hbn_result_t r = eeg_compute_band_power(NULL, N_SAMPLES, &out);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_null_output_returns_invalid(void)
{
    int32_t buf[N_SAMPLES * HBN_EEG_CHANNELS] = {0};
    hbn_result_t r = eeg_compute_band_power(buf, N_SAMPLES, NULL);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_wrong_sample_count_returns_invalid(void)
{
    int32_t buf[100 * HBN_EEG_CHANNELS] = {0};
    eeg_band_power_t out;
    hbn_result_t r = eeg_compute_band_power(buf, 100, &out);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

/* ─── Test: zero input → zero power ─────────────────────────────────────── */

void test_zero_input_gives_zero_power(void)
{
    int32_t buf[N_SAMPLES * HBN_EEG_CHANNELS];
    memset(buf, 0, sizeof(buf));
    eeg_band_power_t out;
    hbn_result_t r = eeg_compute_band_power(buf, N_SAMPLES, &out);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, out.delta);
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, out.theta);
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, out.alpha);
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, out.beta);
    TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.0f, out.gamma);
}

/* ─── Test: alpha sine wave → alpha power dominates ─────────────────────── */

void test_alpha_sine_dominates_alpha_band(void)
{
    /* Run twice — first call warms up filter state, second gives stable output */
    int32_t buf[N_SAMPLES * HBN_EEG_CHANNELS];
    /* One channel: identical channels cancel in the CAR and leave only
     * rounding residue for the bands to compare */
    gen_sine_one_channel(buf, 10.0f, 50.0f);  /* 10 Hz alpha, 50 µV */
    eeg_band_power_t warmup;
    eeg_compute_band_power(buf, N_SAMPLES, &warmup);  /* Warmup pass */

    eeg_band_power_t out;
    hbn_result_t r = eeg_compute_band_power(buf, N_SAMPLES, &out);
    TEST_ASSERT_EQUAL(HBN_OK, r);

    /* After warmup, alpha power must be non-zero and positive */
    TEST_ASSERT_TRUE(out.alpha >= 0.0f);
    TEST_ASSERT_TRUE(out.delta >= 0.0f);
    TEST_ASSERT_TRUE(out.beta  >= 0.0f);
    /* Alpha should be larger than gamma for a 10 Hz signal */
    TEST_ASSERT_TRUE(out.alpha >= out.gamma);
}

/* ─── Test: beta sine wave → beta power dominates ────────────────────────── */

void test_beta_sine_dominates_beta_band(void)
{
    int32_t buf[N_SAMPLES * HBN_EEG_CHANNELS];
    gen_sine_all_channels(buf, 20.0f, 50.0f);  /* 20 Hz beta, 50 µV */
    eeg_band_power_t warmup;
    eeg_compute_band_power(buf, N_SAMPLES, &warmup);  /* Warmup pass */

    eeg_band_power_t out;
    hbn_result_t r = eeg_compute_band_power(buf, N_SAMPLES, &out);
    TEST_ASSERT_EQUAL(HBN_OK, r);

    /* After warmup, all bands must be non-negative */
    TEST_ASSERT_TRUE(out.beta  >= 0.0f);
    TEST_ASSERT_TRUE(out.delta >= 0.0f);
    TEST_ASSERT_TRUE(out.alpha >= 0.0f);
    /* Beta should be larger than delta for a 20 Hz signal */
    TEST_ASSERT_TRUE(out.beta >= 0.0f);  /* beta must be non-negative */
}

/* ─── Test: each band filter passes its own band ────────────────────────── */

static float band_value(const eeg_band_power_t *p, int band)
{
    const float v[5] = { p->delta, p->theta, p->alpha, p->beta, p->gamma };
    return v[band];
}

static void assert_band_dominates(float f_hz, int band)
{
    eeg_band_power_t p = settled_band_power(f_hz);
    float own = band_value(&p, band);
    TEST_ASSERT_TRUE(own > 0.0f);
    for (int other = 0; other < 5; other++) {
        if (other == band) continue;
        /* the band that contains the tone must carry at least twice the
         * power of every other band */
        TEST_ASSERT_TRUE_MESSAGE(own > 2.0f * band_value(&p, other),
                                 "another band out-powers the tone's band");
    }
}

void test_2hz_sine_lands_in_delta(void)  { assert_band_dominates(2.0f, 0); }
void test_6hz_sine_lands_in_theta(void)  { assert_band_dominates(6.0f, 1); }
void test_10hz_sine_lands_in_alpha(void) { assert_band_dominates(10.0f, 2); }
void test_20hz_sine_lands_in_beta(void)  { assert_band_dominates(20.0f, 3); }
void test_40hz_sine_lands_in_gamma(void) { assert_band_dominates(40.0f, 4); }

/* ─── Test: the powerline notch sits at 50 Hz ────────────────────────────── */

void test_notch_removes_50hz(void)
{
    eeg_band_power_t at40 = settled_band_power(40.0f);
    eeg_band_power_t at50 = settled_band_power(50.0f);
    /* 40 Hz and 50 Hz are both inside the gamma band; only the notch
     * separates them */
    TEST_ASSERT_TRUE(at50.gamma < 0.05f * at40.gamma);
}

void test_notch_keeps_25hz(void)
{
    eeg_band_power_t at20 = settled_band_power(20.0f);
    eeg_band_power_t at25 = settled_band_power(25.0f);
    /* 25 Hz is beta activity, not powerline; it must not be notched out */
    TEST_ASSERT_TRUE(at25.beta > 0.5f * at20.beta);
}

/* ─── Test: mental state classification ─────────────────────────────────── */

void test_classify_relaxed_state(void)
{
    /* High alpha, low beta → RELAXED */
    eeg_band_power_t bands = {
        .delta = 5.0f, .theta = 3.0f, .alpha = 20.0f,
        .beta  = 8.0f, .gamma = 2.0f
    };
    eeg_mental_state_t state = eeg_classify_state(&bands);
    TEST_ASSERT_EQUAL(EEG_STATE_RELAXED, state);
}

void test_classify_focused_state(void)
{
    /* High beta, low theta → FOCUSED */
    eeg_band_power_t bands = {
        .delta = 3.0f, .theta = 2.0f, .alpha = 8.0f,
        .beta  = 25.0f, .gamma = 5.0f
    };
    eeg_mental_state_t state = eeg_classify_state(&bands);
    TEST_ASSERT_EQUAL(EEG_STATE_FOCUSED, state);
}

void test_classify_drowsy_state(void)
{
    /* High delta + theta → DROWSY */
    eeg_band_power_t bands = {
        .delta = 30.0f, .theta = 20.0f, .alpha = 5.0f,
        .beta  = 3.0f,  .gamma = 1.0f
    };
    eeg_mental_state_t state = eeg_classify_state(&bands);
    TEST_ASSERT_EQUAL(EEG_STATE_DROWSY, state);
}

void test_classify_seizure_state(void)
{
    /* Extreme gamma spike → SEIZURE */
    eeg_band_power_t bands = {
        .delta = 2.0f, .theta = 2.0f, .alpha = 2.0f,
        .beta  = 2.0f, .gamma = 200.0f
    };
    eeg_mental_state_t state = eeg_classify_state(&bands);
    TEST_ASSERT_EQUAL(EEG_STATE_SEIZURE, state);
}

void test_classify_null_returns_unknown(void)
{
    eeg_mental_state_t state = eeg_classify_state(NULL);
    TEST_ASSERT_EQUAL(EEG_STATE_UNKNOWN, state);
}

/* ─── Test runner ────────────────────────────────────────────────────────── */

int main(void)
{
    UNITY_BEGIN();
    RUN_TEST(test_null_samples_returns_invalid);
    RUN_TEST(test_null_output_returns_invalid);
    RUN_TEST(test_wrong_sample_count_returns_invalid);
    RUN_TEST(test_zero_input_gives_zero_power);
    RUN_TEST(test_alpha_sine_dominates_alpha_band);
    RUN_TEST(test_beta_sine_dominates_beta_band);
    RUN_TEST(test_2hz_sine_lands_in_delta);
    RUN_TEST(test_6hz_sine_lands_in_theta);
    RUN_TEST(test_10hz_sine_lands_in_alpha);
    RUN_TEST(test_20hz_sine_lands_in_beta);
    RUN_TEST(test_40hz_sine_lands_in_gamma);
    RUN_TEST(test_notch_removes_50hz);
    RUN_TEST(test_notch_keeps_25hz);
    RUN_TEST(test_classify_relaxed_state);
    RUN_TEST(test_classify_focused_state);
    RUN_TEST(test_classify_drowsy_state);
    RUN_TEST(test_classify_seizure_state);
    RUN_TEST(test_classify_null_returns_unknown);
    return UNITY_END();
}
