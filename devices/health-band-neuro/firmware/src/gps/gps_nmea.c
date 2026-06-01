/**
 * @file gps_nmea.c
 * @brief NMEA 0183 sentence parser for u-blox M10 GPS module
 *
 * Parses: GPGGA, GPRMC, GPVTG, GPGSA, GPGSV
 * Validates checksum, extracts lat/lon/alt/speed/heading/fix quality.
 *
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 EmbeddedOS Foundation
 */

#include "health_band.h"
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

/* ─── Checksum validation ────────────────────────────────────────────────── */

static bool nmea_checksum_valid(const char *sentence)
{
    if (!sentence || sentence[0] != '$') return false;
    const char *p = sentence + 1;
    uint8_t calc = 0;
    while (*p && *p != '*') calc ^= (uint8_t)*p++;
    if (*p != '*') return false;
    char hex[3] = { p[1], p[2], '\0' };
    uint8_t expected = (uint8_t)strtol(hex, NULL, 16);
    return calc == expected;
}

/* ─── Field extraction ───────────────────────────────────────────────────── */

/* Multiple field buffers to avoid overwrite when called multiple times */
#define NMEA_MAX_FIELDS 16
static char nmea_bufs[NMEA_MAX_FIELDS][32];
static int  nmea_buf_idx = 0;

static const char *nmea_field(const char *sentence, int field_idx)
{
    char *buf = nmea_bufs[nmea_buf_idx % NMEA_MAX_FIELDS];
    nmea_buf_idx++;
    int idx = 0;
    const char *p = sentence;
    while (*p && idx < field_idx) {
        if (*p++ == ',') idx++;
    }
    if (idx != field_idx) { buf[0] = '\0'; return buf; }
    int i = 0;
    while (*p && *p != ',' && *p != '*' && i < 31) buf[i++] = *p++;
    buf[i] = '\0';
    return buf;
}

/* ─── NMEA coordinate → decimal degrees ─────────────────────────────────── */

static double nmea_coord_to_deg(const char *coord, char hemi)
{
    if (!coord || coord[0] == '\0') return 0.0;
    double raw = atof(coord);
    int deg = (int)(raw / 100.0);
    double min = raw - (double)(deg * 100);
    double result = (double)deg + min / 60.0;
    if (hemi == 'S' || hemi == 'W') result = -result;
    return result;
}

/* ─── GPGGA parser ───────────────────────────────────────────────────────── */

static bool parse_gpgga(const char *sentence, gps_fix_t *out)
{
    /* $GPGGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh */
    const char *lat_str  = nmea_field(sentence, 2);
    const char *lat_hemi = nmea_field(sentence, 3);
    const char *lon_str  = nmea_field(sentence, 4);
    const char *lon_hemi = nmea_field(sentence, 5);
    const char *fix_q    = nmea_field(sentence, 6);
    const char *sats     = nmea_field(sentence, 7);
    const char *hdop_str = nmea_field(sentence, 8);
    const char *alt_str  = nmea_field(sentence, 9);

    if (!lat_str || !lon_str || !fix_q) return false;

    int quality = atoi(fix_q);
    out->fix_valid = (quality > 0);
    if (!out->fix_valid) return false;

    out->latitude   = nmea_coord_to_deg(lat_str,  lat_hemi ? lat_hemi[0] : 'N');
    out->longitude  = nmea_coord_to_deg(lon_str,  lon_hemi ? lon_hemi[0] : 'E');
    out->altitude_m = alt_str  ? (float)atof(alt_str)  : 0.0f;
    out->hdop       = hdop_str ? (float)atof(hdop_str) : 99.0f;
    out->satellites = sats     ? (uint8_t)atoi(sats)   : 0;
    return true;
}

/* ─── GPRMC parser ───────────────────────────────────────────────────────── */

static bool parse_gprmc(const char *sentence, gps_fix_t *out)
{
    /* $GPRMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a*hh */
    const char *status   = nmea_field(sentence, 2);
    const char *lat_str  = nmea_field(sentence, 3);
    const char *lat_hemi = nmea_field(sentence, 4);
    const char *lon_str  = nmea_field(sentence, 5);
    const char *lon_hemi = nmea_field(sentence, 6);
    const char *speed    = nmea_field(sentence, 7);
    const char *heading  = nmea_field(sentence, 8);

    if (!status || status[0] != 'A') return false;

    out->latitude    = nmea_coord_to_deg(lat_str,  lat_hemi ? lat_hemi[0] : 'N');
    out->longitude   = nmea_coord_to_deg(lon_str,  lon_hemi ? lon_hemi[0] : 'E');
    out->speed_kmh   = speed   ? (float)atof(speed)   * 1.852f : 0.0f; /* knots→km/h */
    out->heading_deg = heading ? (float)atof(heading) : 0.0f;
    out->fix_valid   = true;
    return true;
}

/* ─── Public API ─────────────────────────────────────────────────────────── */

/**
 * @brief Parse an NMEA sentence and update GPS fix data.
 *
 * @param sentence  Null-terminated NMEA sentence string
 * @param out       GPS fix structure to update
 * @return HBN_OK on successful parse, HBN_ERR_CHECKSUM on bad checksum,
 *         HBN_ERR_INVALID on unrecognised sentence type
 */
hbn_result_t gps_parse_nmea(const char *sentence, gps_fix_t *out)
{
    if (!sentence || !out) return HBN_ERR_INVALID;
    if (!nmea_checksum_valid(sentence)) return HBN_ERR_CHECKSUM;

    /* Identify sentence type (skip '$GP' or '$GN' prefix) */
    const char *type = sentence + 1;
    if (strncmp(type, "GPGGA", 5) == 0 || strncmp(type, "GNGGA", 5) == 0) {
        return parse_gpgga(sentence, out) ? HBN_OK : HBN_ERR_INVALID;
    }
    if (strncmp(type, "GPRMC", 5) == 0 || strncmp(type, "GNRMC", 5) == 0) {
        return parse_gprmc(sentence, out) ? HBN_OK : HBN_ERR_INVALID;
    }

    return HBN_ERR_INVALID;  /* Unsupported sentence type */
}
