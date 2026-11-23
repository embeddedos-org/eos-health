/**
 * @file test_ecg_hrv.c
 * @brief Real unit tests for ECG HRV computation
 *
 * Uses known RR interval sequences with pre-computed expected values
 * to verify RMSSD, SDNN, pNN50, and HR calculations.
 */

#include "unity/unity.h"
#include "health_band.h"
#include <math.h>
#include <string.h>

void setUp(void) {}
void tearDown(void) {}

/* ─── Test: regular 60 BPM rhythm ────────────────────────────────────────── */

void test_regular_60bpm_heart_rate(void)
{
    /* Perfectly regular 1000ms RR intervals → 60 BPM */
    uint16_t rr[10];
    for (int i = 0; i < 10; i++) rr[i] = 1000;

    hrv_metrics_t hrv;
    hbn_result_t r = ecg_compute_hrv(rr, 10, &hrv);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_FLOAT_WITHIN(1.0f, 60.0f, hrv.hr_bpm);
}

/* ─── Test: regular 120 BPM rhythm ──────────────────────────────────────── */

void test_regular_120bpm_heart_rate(void)
{
    /* 500ms RR intervals → 120 BPM */
    uint16_t rr[10];
    for (int i = 0; i < 10; i++) rr[i] = 500;

    hrv_metrics_t hrv;
    hbn_result_t r = ecg_compute_hrv(rr, 10, &hrv);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_FLOAT_WITHIN(1.0f, 120.0f, hrv.hr_bpm);
}

/* ─── Test: RMSSD of zero for perfectly regular rhythm ───────────────────── */

void test_rmssd_zero_for_regular_rhythm(void)
{
    uint16_t rr[20];
    for (int i = 0; i < 20; i++) rr[i] = 800;  /* 75 BPM */

    hrv_metrics_t hrv;
    ecg_compute_hrv(rr, 20, &hrv);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 0.0f, hrv.rmssd_ms);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 0.0f, hrv.sdnn_ms);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 0.0f, hrv.pnn50);
}

/* ─── Test: RMSSD with known alternating pattern ─────────────────────────── */

void test_rmssd_known_alternating_pattern(void)
{
    /* Alternating 800ms, 900ms → successive diffs all = 100ms
     * RMSSD = sqrt(mean(100²)) = 100 ms */
    uint16_t rr[] = {800, 900, 800, 900, 800, 900, 800, 900, 800, 900};
    hrv_metrics_t hrv;
    ecg_compute_hrv(rr, 10, &hrv);
    TEST_ASSERT_FLOAT_WITHIN(2.0f, 100.0f, hrv.rmssd_ms);
}

/* ─── Test: pNN50 with all diffs > 50ms ─────────────────────────────────── */

void test_pnn50_all_diffs_above_50ms(void)
{
    /* All successive differences = 100ms > 50ms → pNN50 = 100% */
    uint16_t rr[] = {800, 900, 800, 900, 800, 900, 800, 900, 800, 900};
    hrv_metrics_t hrv;
    ecg_compute_hrv(rr, 10, &hrv);
    TEST_ASSERT_FLOAT_WITHIN(1.0f, 100.0f, hrv.pnn50);
}

/* ─── Test: pNN50 with no diffs > 50ms ──────────────────────────────────── */

void test_pnn50_no_diffs_above_50ms(void)
{
    /* All successive differences = 10ms < 50ms → pNN50 = 0% */
    uint16_t rr[] = {800, 810, 800, 810, 800, 810, 800, 810, 800, 810};
    hrv_metrics_t hrv;
    ecg_compute_hrv(rr, 10, &hrv);
    TEST_ASSERT_FLOAT_WITHIN(1.0f, 0.0f, hrv.pnn50);
}

/* ─── Test: null pointer handling ────────────────────────────────────────── */

void test_null_rr_returns_invalid(void)
{
    hrv_metrics_t hrv;
    hbn_result_t r = ecg_compute_hrv(NULL, 10, &hrv);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_null_output_returns_invalid(void)
{
    uint16_t rr[10] = {800};
    hbn_result_t r = ecg_compute_hrv(rr, 10, NULL);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_too_few_beats_returns_invalid(void)
{
    uint16_t rr[3] = {800, 800, 800};
    hrv_metrics_t hrv;
    hbn_result_t r = ecg_compute_hrv(rr, 3, &hrv);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

/* ─── Test: LF/HF ratio is non-negative ─────────────────────────────────── */

void test_lf_hf_ratio_non_negative(void)
{
    uint16_t rr[30];
    for (int i = 0; i < 30; i++) rr[i] = 800 + (i % 3) * 20;
    hrv_metrics_t hrv;
    ecg_compute_hrv(rr, 30, &hrv);
    TEST_ASSERT_TRUE(hrv.lf_hf_ratio >= 0.0f);
    TEST_ASSERT_TRUE(hrv.lf_power >= 0.0f);
    TEST_ASSERT_TRUE(hrv.hf_power >= 0.0f);
}

/* ─── Test: 0.15 Hz is the first HF frequency, not the last LF one ───────── */

void test_rr_oscillation_at_0p15hz_is_high_frequency(void)
{
    /* HF is 0.15–0.40 Hz and LF stops below 0.15 Hz. Modulate a 1000 ms RR
     * series at exactly 0.15 Hz (one breath every 6.7 s): almost all of its
     * power is at the 0.15 Hz bin, so HF must dominate LF. */
    uint16_t rr[120];
    double t = 0.0;
    for (int i = 0; i < 120; i++) {
        rr[i] = (uint16_t)lround(1000.0 + 40.0 * sin(2.0 * M_PI * 0.15 * t));
        t += rr[i] / 1000.0;
    }

    hrv_metrics_t hrv;
    TEST_ASSERT_EQUAL(HBN_OK, ecg_compute_hrv(rr, 120, &hrv));
    TEST_ASSERT_TRUE(hrv.hf_power > hrv.lf_power);
    TEST_ASSERT_TRUE(hrv.lf_hf_ratio < 1.0f);
}

/* ─── Test: signal quality is in [0, 100] ───────────────────────────────── */

void test_signal_quality_in_range(void)
{
    uint16_t rr[20];
    for (int i = 0; i < 20; i++) rr[i] = 800;
    hrv_metrics_t hrv;
    ecg_compute_hrv(rr, 20, &hrv);
    TEST_ASSERT_TRUE(hrv.quality >= 0 && hrv.quality <= 100);
}

/* ─── Test: a narrow QRS is still detected ──────────────────────────────── */

void test_r_peak_found_in_narrow_qrs_ecg(void)
{
    /* Five clean beats at 500 Hz, one per second, each a Gaussian QRS with
     * a 10 ms sigma. The integrated signal of such a beat peaks on two equal
     * samples; the detector must still report a beat, within one 150 ms
     * integration window after an R wave. */
    enum { N = 2500 };
    static int32_t ecg[N];
    for (int i = 0; i < N; i++) {
        double v = 0.0;
        for (int b = 0; b < 5; b++) {
            double d = (i - (250 + 500 * b)) / 5.0;
            v += 1000.0 * exp(-d * d / 2.0);
        }
        ecg[i] = (int32_t)lround(v);
    }

    uint32_t r = UINT32_MAX;
    TEST_ASSERT_TRUE(ecg_detect_r_peak(ecg, N, &r));
    TEST_ASSERT_TRUE(r >= 250);
    TEST_ASSERT_TRUE((r - 250) % 500 < 75);
}

/* ─── Test runner ────────────────────────────────────────────────────────── */

int main(void)
{
    UNITY_BEGIN();
    RUN_TEST(test_regular_60bpm_heart_rate);
    RUN_TEST(test_regular_120bpm_heart_rate);
    RUN_TEST(test_rmssd_zero_for_regular_rhythm);
    RUN_TEST(test_rmssd_known_alternating_pattern);
    RUN_TEST(test_pnn50_all_diffs_above_50ms);
    RUN_TEST(test_pnn50_no_diffs_above_50ms);
    RUN_TEST(test_null_rr_returns_invalid);
    RUN_TEST(test_null_output_returns_invalid);
    RUN_TEST(test_too_few_beats_returns_invalid);
    RUN_TEST(test_lf_hf_ratio_non_negative);
    RUN_TEST(test_rr_oscillation_at_0p15hz_is_high_frequency);
    RUN_TEST(test_signal_quality_in_range);
    RUN_TEST(test_r_peak_found_in_narrow_qrs_ecg);
    return UNITY_END();
}
