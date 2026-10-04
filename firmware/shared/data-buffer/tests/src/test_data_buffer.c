/*
 * Ztest suite for the data-buffer module (firmware/shared/data-buffer/).
 *
 * Covers the eOS-Health #8 acceptance cases against the real implementation
 * on the flash_simulator (see app.overlay): initialization (fresh and
 * restore), normal read/write via the sync path, input validation, buffer
 * overflow policy, and clear.
 *
 * NOTE: data_buffer_drop_oldest_noncritical() is declared and called for the
 * critical-write path but never defined, so the suite deliberately does not
 * exercise DATA_FLAG_CRITICAL writes — that path cannot link until the
 * function is implemented (filed separately).
 *
 * Build: west build -b native_sim firmware/shared/data-buffer/tests
 * Run:   west build -t run
 */
#include <zephyr/ztest.h>
#include <zephyr/storage/flash_map.h>
#include <string.h>

#include "data_buffer.h"

/* Fresh init + clear before every test: the flash simulator persists across
 * tests in one run, so each test starts from a known-empty buffer. */
static void data_buffer_setup(void *fixture)
{
	ARG_UNUSED(fixture);

	zassert_equal(data_buffer_init(), 0, "setup init failed");
	data_buffer_clear();
}

ZTEST_SUITE(data_buffer, NULL, data_buffer_setup, NULL, NULL, NULL);

/* ── init ─────────────────────────────────────────────────────────── */

ZTEST(data_buffer, test_init_fresh_starts_empty)
{
	int rc = data_buffer_init();

	zassert_equal(rc, 0, "init failed: %d", rc);
	zassert_equal(data_buffer_get_record_count(), 0U);
	zassert_equal(data_buffer_get_bytes_used(), 0U);
	zassert_false(data_buffer_is_overflow());
}

ZTEST(data_buffer, test_init_restores_existing_header)
{
	uint8_t payload[] = {0xAA, 0xBB};

	zassert_equal(data_buffer_init(), 0);
	zassert_equal(data_buffer_write(SENSOR_TYPE_HR, 0, payload,
					sizeof(payload)), 0);

	/* Re-init must restore, not wipe, the persisted header. */
	zassert_equal(data_buffer_init(), 0);
	zassert_equal(data_buffer_get_record_count(), 1U);
	zassert_true(data_buffer_get_bytes_used() > 0U);

	data_buffer_clear();
}

/* ── write / read (via the sync path) ─────────────────────────────── */

static uint8_t  captured_data[128];
static uint16_t captured_len;
static sensor_type_t captured_type;
static uint8_t  captured_flags;
static int      capture_calls;

static int capture_cb(sensor_type_t type, uint8_t flags, const uint8_t *data,
		      uint16_t len, uint32_t timestamp_ms)
{
	ARG_UNUSED(timestamp_ms);

	captured_type = type;
	captured_flags = flags;
	captured_len = len;
	memcpy(captured_data, data, len);
	capture_calls++;
	return 0;
}

ZTEST(data_buffer, test_write_then_sync_delivers_record)
{
	uint8_t payload[] = {1, 2, 3, 4, 5};

	zassert_equal(data_buffer_init(), 0);
	zassert_equal(data_buffer_write(SENSOR_TYPE_PPG, DATA_FLAG_ALERT,
					payload, sizeof(payload)), 0);
	zassert_equal(data_buffer_get_record_count(), 1U);

	capture_calls = 0;
	zassert_equal(data_buffer_sync_start(capture_cb), 0);
	zassert_equal(capture_calls, 1);
	zassert_equal(captured_type, SENSOR_TYPE_PPG);
	zassert_equal(captured_flags, DATA_FLAG_ALERT);
	zassert_equal(captured_len, sizeof(payload));
	zassert_mem_equal(captured_data, payload, sizeof(payload));

	/* Successful sync drains the buffer. */
	zassert_equal(data_buffer_get_record_count(), 0U);
}

ZTEST(data_buffer, test_write_rejects_oversize_record)
{
	uint8_t big[129];

	zassert_equal(data_buffer_init(), 0);
	zassert_equal(data_buffer_write(SENSOR_TYPE_ECG, 0, big, sizeof(big)),
		      -EINVAL);
	zassert_equal(data_buffer_get_record_count(), 0U);
}

static int congested_cb(sensor_type_t type, uint8_t flags,
			const uint8_t *data, uint16_t len,
			uint32_t timestamp_ms)
{
	ARG_UNUSED(type);
	ARG_UNUSED(flags);
	ARG_UNUSED(data);
	ARG_UNUSED(len);
	ARG_UNUSED(timestamp_ms);

	/* Simulate BLE congestion on the first record. */
	return -EAGAIN;
}

ZTEST(data_buffer, test_sync_paused_on_eagain_keeps_unacked_records)
{
	uint8_t payload[] = {0x11};

	zassert_equal(data_buffer_init(), 0);
	zassert_equal(data_buffer_write(SENSOR_TYPE_HR, 0, payload,
					sizeof(payload)), 0);

	/* BLE congested: sync pauses and the record stays buffered. */
	zassert_equal(data_buffer_sync_start(congested_cb), -EAGAIN);
	zassert_equal(data_buffer_get_record_count(), 1U);

	/* Next connection: the record is still there and syncs fine. */
	capture_calls = 0;
	zassert_equal(data_buffer_sync_start(capture_cb), 0);
	zassert_equal(capture_calls, 1);
	zassert_equal(captured_type, SENSOR_TYPE_HR);
}

/* ── overflow ─────────────────────────────────────────────────────── */

ZTEST(data_buffer, test_overflow_noncritical_sets_flag_and_enobufs)
{
	uint8_t payload[64];
	int rc;
	int writes = 0;

	memset(payload, 0x5A, sizeof(payload));
	zassert_equal(data_buffer_init(), 0);

	/* Fill the 44 KB partition: (8 hdr + 64 data + 2 crc) = 74 B/record. */
	do {
		rc = data_buffer_write(SENSOR_TYPE_ECG, 0, payload,
				       sizeof(payload));
		if (rc == 0) {
			writes++;
		}
		zassert_true(writes < 10000, "buffer never filled");
	} while (rc == 0);

	zassert_equal(rc, -ENOBUFS, "expected -ENOBUFS when full, got %d", rc);
	zassert_true(data_buffer_is_overflow(),
		     "overflow flag not set after ENOBUFS");
	zassert_true(writes > 400, "suspiciously few writes: %d", writes);

	data_buffer_clear();
	zassert_false(data_buffer_is_overflow());
	zassert_equal(data_buffer_get_record_count(), 0U);
}

/* ── clear ────────────────────────────────────────────────────────── */

ZTEST(data_buffer, test_clear_resets_state)
{
	uint8_t payload[] = {9, 9, 9};

	zassert_equal(data_buffer_init(), 0);
	zassert_equal(data_buffer_write(SENSOR_TYPE_SPO2, 0, payload,
					sizeof(payload)), 0);
	zassert_equal(data_buffer_get_record_count(), 1U);

	data_buffer_clear();
	zassert_equal(data_buffer_get_record_count(), 0U);
	zassert_equal(data_buffer_get_bytes_used(), 0U);
	zassert_false(data_buffer_is_overflow());
}
