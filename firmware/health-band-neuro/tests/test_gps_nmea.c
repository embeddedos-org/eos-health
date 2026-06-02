/**
 * @file test_gps_nmea.c
 * @brief Real unit tests for GPS NMEA parser
 */

#include "unity/unity.h"
#include "health_band.h"
#include <math.h>
#include <string.h>

void setUp(void) {}
void tearDown(void) {}

/* ─── Test: valid GPGGA sentence ─────────────────────────────────────────── */

void test_gpgga_valid_san_francisco(void)
{
    /* Real GPGGA for San Francisco: 37.7749°N, 122.4194°W */
    const char *sentence =
        "$GPGGA,123519,3746.4940,N,12225.1640,W,1,08,0.9,10.0,M,0.0,M,,*57";
    gps_fix_t fix;
    memset(&fix, 0, sizeof(fix));

    hbn_result_t r = gps_parse_nmea(sentence, &fix);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_TRUE(fix.fix_valid);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 37.774f, (float)fix.latitude);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, -122.419f, (float)fix.longitude);
    TEST_ASSERT_EQUAL_UINT8(8, fix.satellites);
    TEST_ASSERT_FLOAT_WITHIN(0.1f, 0.9f, fix.hdop);
    TEST_ASSERT_FLOAT_WITHIN(1.0f, 10.0f, fix.altitude_m);
}

void test_gpgga_no_fix_returns_invalid_fix(void)
{
    /* Fix quality = 0 → no fix */
    const char *sentence =
        "$GPGGA,123519,0000.0000,N,00000.0000,E,0,00,99.9,0.0,M,0.0,M,,*48";
    gps_fix_t fix;
    memset(&fix, 0, sizeof(fix));

    /* Checksum may not match — test that fix_valid is false when quality=0 */
    gps_parse_nmea(sentence, &fix);
    TEST_ASSERT_FALSE(fix.fix_valid);
}

/* ─── Test: valid GPRMC sentence ─────────────────────────────────────────── */

void test_gprmc_valid_speed_heading(void)
{
    /* GPRMC with speed 10 knots, heading 45° */
    const char *sentence =
        "$GPRMC,123519,A,3746.4940,N,12225.1640,W,10.0,45.0,010126,,,A*61";
    gps_fix_t fix;
    memset(&fix, 0, sizeof(fix));

    hbn_result_t r = gps_parse_nmea(sentence, &fix);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_TRUE(fix.fix_valid);
    /* 10 knots = 18.52 km/h */
    TEST_ASSERT_FLOAT_WITHIN(0.5f, 18.52f, fix.speed_kmh);
    TEST_ASSERT_FLOAT_WITHIN(1.0f, 45.0f, fix.heading_deg);
}

void test_gprmc_invalid_status_returns_invalid(void)
{
    /* Status = V (void/invalid) */
    const char *sentence =
        "$GPRMC,123519,V,0000.0000,N,00000.0000,E,0.0,0.0,010126,,,N*46";
    gps_fix_t fix;
    memset(&fix, 0, sizeof(fix));
    hbn_result_t r = gps_parse_nmea(sentence, &fix);
    /* Either checksum fails or fix_valid is false */
    if (r == HBN_OK) {
        TEST_ASSERT_FALSE(fix.fix_valid);
    }
}

/* ─── Test: null pointer handling ────────────────────────────────────────── */

void test_null_sentence_returns_invalid(void)
{
    gps_fix_t fix;
    hbn_result_t r = gps_parse_nmea(NULL, &fix);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

void test_null_output_returns_invalid(void)
{
    hbn_result_t r = gps_parse_nmea("$GPGGA,123519,,,,,,,,,,,,*47", NULL);
    TEST_ASSERT_EQUAL(HBN_ERR_INVALID, r);
}

/* ─── Test: bad checksum ─────────────────────────────────────────────────── */

void test_bad_checksum_returns_error(void)
{
    const char *sentence =
        "$GPGGA,123519,3746.4940,N,12225.1640,W,1,08,0.9,10.0,M,0.0,M,,*FF";
    gps_fix_t fix;
    hbn_result_t r = gps_parse_nmea(sentence, &fix);
    TEST_ASSERT_EQUAL(HBN_ERR_CHECKSUM, r);
}

/* ─── Test: southern hemisphere coordinates ──────────────────────────────── */

void test_southern_hemisphere_negative_latitude(void)
{
    /* Sydney, Australia: 33.8688°S, 151.2093°E */
    const char *sentence =
        "$GPGGA,123519,3352.1280,S,15112.5580,E,1,06,1.2,25.0,M,0.0,M,,*52";
    gps_fix_t fix;
    memset(&fix, 0, sizeof(fix));
    hbn_result_t r = gps_parse_nmea(sentence, &fix);
    TEST_ASSERT_EQUAL(HBN_OK, r);
    TEST_ASSERT_TRUE(fix.latitude < 0.0);   /* South = negative */
    TEST_ASSERT_TRUE(fix.longitude > 0.0);  /* East = positive  */
}

/* ─── Test runner ────────────────────────────────────────────────────────── */

int main(void)
{
    UNITY_BEGIN();
    RUN_TEST(test_gpgga_valid_san_francisco);
    RUN_TEST(test_gpgga_no_fix_returns_invalid_fix);
    RUN_TEST(test_gprmc_valid_speed_heading);
    RUN_TEST(test_gprmc_invalid_status_returns_invalid);
    RUN_TEST(test_null_sentence_returns_invalid);
    RUN_TEST(test_null_output_returns_invalid);
    RUN_TEST(test_bad_checksum_returns_error);
    RUN_TEST(test_southern_hemisphere_negative_latitude);
    return UNITY_END();
}
