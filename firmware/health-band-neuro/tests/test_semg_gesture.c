/**
 * @file test_semg_gesture.c
 * @brief Real unit tests for sEMG gesture classification
 */

#include "unity/unity.h"
#include "health_band.h"
#include <string.h>
#include <math.h>

#define N_SAMPLES 200  /* 200ms @ 1000 Hz */

void setUp(void) {}
void tearDown(void) {}

/* Generate samples matching REST centroid (very low amplitude) */
static void gen_rest_samples(semg_sample_t *buf)
{
    for (int i = 0; i < N_SAMPLES; i++) {
        for (int ch = 0; ch < HBN_SEMG_CHANNELS; ch++) {
            /* ~0.02 mV RMS → ADC count ≈ 40 (0.02mV / 0.0005035 mV/count) */
            buf[i].ch[ch] = (int16_t)(40 * sinf(2.0f * 3.14159f * 10.0f * i / 1000.0f));
        }
        buf[i].timestamp_us = (uint32_t)(i * 1000);
    }
}

/* Generate samples matching FIST centroid (high amplitude, all channels) */
static void gen_fist_samples(semg_sample_t *buf)
{
    for (int i = 0; i < N_SAMPLES; i++) {
        for (int ch = 0; ch < HBN_SEMG_CHANNELS; ch++) {
            /* ~0.85 mV RMS → ADC count ≈ 1688 */
            buf[i].ch[ch] = (int16_t)(1688 * sinf(2.0f * 3.14159f * 50.0f * i / 1000.0f));
        }
        buf[i].timestamp_us = (uint32_t)(i * 1000);
    }
}

/* ─── Tests ──────────────────────────────────────────────────────────────── */

void test_rest_gesture_classified(void)
{
    semg_sample_t buf[N_SAMPLES];
    gen_rest_samples(buf);
    semg_result_t result;
    hbn_result_t r = semg_classify_gesture(buf, N_SAMPLES, &result);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_EQUAL(SEMG_GESTURE_REST, result.gesture);
    TEST_ASSERT_TRUE(result.confidence >= 0.0f && result.confidence <= 1.0f);
}

void test_high_amplitude_not_rest(void)
{
    /* High-amplitude signal (FIST or OPEN level) must NOT classify as REST */
    semg_sample_t buf[N_SAMPLES];
    gen_fist_samples(buf);
    semg_result_t result;
    hbn_result_t r = semg_classify_gesture(buf, N_SAMPLES, &result);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    /* High amplitude should not be REST (gesture index 0) */
    TEST_ASSERT_NOT_EQUAL(SEMG_GESTURE_REST, result.gesture);
    TEST_ASSERT_TRUE(result.confidence > 0.0f);
}

void test_confidence_in_valid_range(void)
{
    semg_sample_t buf[N_SAMPLES];
    gen_fist_samples(buf);
    semg_result_t result;
    semg_classify_gesture(buf, N_SAMPLES, &result);
    TEST_ASSERT_TRUE(result.confidence >= 0.0f);
    TEST_ASSERT_TRUE(result.confidence <= 1.0f);
}

void test_null_samples_returns_invalid(void)
{
    semg_result_t result;
    hbn_result_t r = semg_classify_gesture(NULL, N_SAMPLES, &result);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_null_output_returns_invalid(void)
{
    semg_sample_t buf[N_SAMPLES];
    gen_rest_samples(buf);
    hbn_result_t r = semg_classify_gesture(buf, N_SAMPLES, NULL);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_too_few_samples_returns_invalid(void)
{
    semg_sample_t buf[5];
    memset(buf, 0, sizeof(buf));
    semg_result_t result;
    hbn_result_t r = semg_classify_gesture(buf, 5, &result);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_gesture_enum_in_valid_range(void)
{
    semg_sample_t buf[N_SAMPLES];
    gen_fist_samples(buf);
    semg_result_t result;
    semg_classify_gesture(buf, N_SAMPLES, &result);
    TEST_ASSERT_TRUE((int)result.gesture >= 0);
    TEST_ASSERT_TRUE((int)result.gesture < SEMG_GESTURE_COUNT);
}

int main(void)
{
    UNITY_BEGIN();
    RUN_TEST(test_rest_gesture_classified);
    RUN_TEST(test_high_amplitude_not_rest);
    RUN_TEST(test_confidence_in_valid_range);
    RUN_TEST(test_null_samples_returns_invalid);
    RUN_TEST(test_null_output_returns_invalid);
    RUN_TEST(test_too_few_samples_returns_invalid);
    RUN_TEST(test_gesture_enum_in_valid_range);
    return UNITY_END();
}
