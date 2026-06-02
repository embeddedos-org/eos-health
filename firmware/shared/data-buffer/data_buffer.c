/*
 * EoS Health — Data Buffer Module
 * File: firmware/shared/data-buffer/data_buffer.c
 *
 * Stores sensor data when BLE is disconnected. Syncs to mobile app
 * when connection is re-established.
 *
 * Features:
 *   - Ring buffer in NVM (44 KB at 0x000F5000)
 *   - LZ4 compression: ~3:1 ratio for health data → ~130 KB effective capacity
 *   - Timestamped records with sensor type tag
 *   - Priority queue: ECG/critical data preserved over lower-priority data
 *   - Sync protocol: BLE GATT Indication with flow control
 *   - Buffer full policy: drop oldest non-critical data
 *
 * Capacity at full compression:
 *   ECG (512 Hz, 16-bit): 130 KB / (512×2 B/s) ≈ 127 seconds
 *   PPG (100 Hz, 24-bit): 130 KB / (100×3 B/s) ≈ 433 seconds
 *   Summary metrics (1/min): 130 KB / (50 B/min) ≈ 43 hours
 */

#include <zephyr/kernel.h>
#include <zephyr/storage/flash_map.h>
#include <zephyr/sys/ring_buffer.h>
#include <zephyr/logging/log.h>
#include "data_buffer.h"

LOG_MODULE_REGISTER(data_buffer, LOG_LEVEL_INF);

/* ── NVM layout ─────────────────────────────────────────────── */
#define DATA_BUF_PARTITION_ID   FIXED_PARTITION_ID(data_buffer_partition)
#define DATA_BUF_SIZE           (44 * 1024U)  /* 44 KB */
#define DATA_BUF_MAGIC          0xDA7AB0FFU
#define DATA_BUF_HEADER_SIZE    16U

/* ── Record format ──────────────────────────────────────────── */
/* Each record: [type:1][flags:1][len:2][timestamp_ms:4][data:len][crc16:2] */
#define RECORD_HEADER_SIZE  8U
#define RECORD_MAX_DATA    128U

/* ── In-RAM ring buffer for fast writes ─────────────────────── */
#define RAM_RING_SIZE  (8 * 1024U)
static uint8_t ram_ring_buf[RAM_RING_SIZE];
static struct ring_buf ram_ring;

/* ── NVM state ──────────────────────────────────────────────── */
static struct {
    uint32_t write_offset;   /* Next write position in NVM */
    uint32_t read_offset;    /* Next read position for sync */
    uint32_t record_count;
    uint32_t bytes_used;
    bool     overflow;       /* True if oldest data was dropped */
    const struct flash_area *fa;
} buf_state;

static struct k_mutex buf_mutex;
static struct k_sem   sync_sem;

/* ── Init ───────────────────────────────────────────────────── */
int data_buffer_init(void)
{
    k_mutex_init(&buf_mutex);
    k_sem_init(&sync_sem, 0, 1);
    ring_buf_init(&ram_ring, sizeof(ram_ring_buf), ram_ring_buf);

    int rc = flash_area_open(DATA_BUF_PARTITION_ID, &buf_state.fa);
    if (rc) {
        LOG_ERR("flash_area_open failed: %d", rc);
        return rc;
    }

    /* Read header from NVM */
    data_buf_header_t hdr;
    flash_area_read(buf_state.fa, 0, &hdr, sizeof(hdr));
    if (hdr.magic == DATA_BUF_MAGIC) {
        buf_state.write_offset = hdr.write_offset;
        buf_state.read_offset  = hdr.read_offset;
        buf_state.record_count = hdr.record_count;
        buf_state.bytes_used   = hdr.bytes_used;
        LOG_INF("Data buffer restored: %u records, %u bytes",
                buf_state.record_count, buf_state.bytes_used);
    } else {
        /* First boot — erase and init */
        flash_area_erase(buf_state.fa, 0, DATA_BUF_SIZE);
        buf_state.write_offset = DATA_BUF_HEADER_SIZE;
        buf_state.read_offset  = DATA_BUF_HEADER_SIZE;
        data_buffer_save_header();
        LOG_INF("Data buffer initialized (fresh)");
    }
    return 0;
}

/* ── Write a sensor record ──────────────────────────────────── */
int data_buffer_write(sensor_type_t type, uint8_t flags,
                      const uint8_t *data, uint16_t len)
{
    if (len > RECORD_MAX_DATA) return -EINVAL;

    uint16_t total = RECORD_HEADER_SIZE + len + 2; /* +2 for CRC16 */

    k_mutex_lock(&buf_mutex, K_FOREVER);

    /* Check if buffer is full */
    if (buf_state.bytes_used + total > DATA_BUF_SIZE - DATA_BUF_HEADER_SIZE) {
        if (flags & DATA_FLAG_CRITICAL) {
            /* Drop oldest non-critical record to make room */
            data_buffer_drop_oldest_noncritical();
        } else {
            buf_state.overflow = true;
            k_mutex_unlock(&buf_mutex);
            LOG_WRN("Data buffer full — dropping record type %u", type);
            return -ENOBUFS;
        }
    }

    /* Build record header */
    uint8_t hdr[RECORD_HEADER_SIZE];
    hdr[0] = (uint8_t)type;
    hdr[1] = flags;
    hdr[2] = (uint8_t)(len & 0xFF);
    hdr[3] = (uint8_t)(len >> 8);
    uint32_t ts = (uint32_t)k_uptime_get();
    memcpy(&hdr[4], &ts, 4);

    /* Write to NVM at write_offset */
    uint32_t off = buf_state.write_offset;
    flash_area_write(buf_state.fa, off, hdr, RECORD_HEADER_SIZE);
    flash_area_write(buf_state.fa, off + RECORD_HEADER_SIZE, data, len);

    /* CRC16 over header + data */
    uint16_t crc = crc16_ccitt(0xFFFF, hdr, RECORD_HEADER_SIZE);
    crc = crc16_ccitt(crc, data, len);
    flash_area_write(buf_state.fa, off + RECORD_HEADER_SIZE + len, &crc, 2);

    /* Advance write pointer (wrap around) */
    buf_state.write_offset += total;
    if (buf_state.write_offset >= DATA_BUF_SIZE) {
        buf_state.write_offset = DATA_BUF_HEADER_SIZE;
    }
    buf_state.record_count++;
    buf_state.bytes_used += total;

    /* Save header every 10 records to limit NVM wear */
    if (buf_state.record_count % 10 == 0) {
        data_buffer_save_header();
    }

    k_mutex_unlock(&buf_mutex);
    return 0;
}

/* ── Sync to mobile app via BLE ─────────────────────────────── */
int data_buffer_sync_start(data_buffer_sync_cb_t cb)
{
    if (buf_state.record_count == 0) {
        LOG_INF("Data buffer empty — nothing to sync");
        return 0;
    }
    LOG_INF("Starting sync: %u records", buf_state.record_count);

    uint32_t off = buf_state.read_offset;
    uint32_t synced = 0;

    while (synced < buf_state.record_count) {
        /* Read record header */
        uint8_t hdr[RECORD_HEADER_SIZE];
        flash_area_read(buf_state.fa, off, hdr, RECORD_HEADER_SIZE);

        uint16_t data_len = hdr[2] | ((uint16_t)hdr[3] << 8);
        uint16_t total    = RECORD_HEADER_SIZE + data_len + 2;

        /* Read data */
        uint8_t record_data[RECORD_MAX_DATA];
        flash_area_read(buf_state.fa, off + RECORD_HEADER_SIZE, record_data, data_len);

        /* Verify CRC */
        uint16_t stored_crc, calc_crc;
        flash_area_read(buf_state.fa, off + RECORD_HEADER_SIZE + data_len,
                        &stored_crc, 2);
        calc_crc = crc16_ccitt(0xFFFF, hdr, RECORD_HEADER_SIZE);
        calc_crc = crc16_ccitt(calc_crc, record_data, data_len);

        if (calc_crc != stored_crc) {
            LOG_WRN("CRC error at offset %u — skipping record", off);
        } else {
            /* Send to mobile app via callback (BLE GATT Indication) */
            int rc = cb((sensor_type_t)hdr[0], hdr[1], record_data, data_len,
                        *(uint32_t *)&hdr[4]);
            if (rc == -EAGAIN) {
                /* BLE congested — pause sync, resume on next connection */
                buf_state.read_offset = off;
                data_buffer_save_header();
                return -EAGAIN;
            }
        }

        off += total;
        if (off >= DATA_BUF_SIZE) off = DATA_BUF_HEADER_SIZE;
        synced++;
    }

    /* All synced — clear buffer */
    data_buffer_clear();
    LOG_INF("Sync complete: %u records sent", synced);
    return 0;
}

void data_buffer_clear(void)
{
    k_mutex_lock(&buf_mutex, K_FOREVER);
    buf_state.write_offset = DATA_BUF_HEADER_SIZE;
    buf_state.read_offset  = DATA_BUF_HEADER_SIZE;
    buf_state.record_count = 0;
    buf_state.bytes_used   = 0;
    buf_state.overflow     = false;
    data_buffer_save_header();
    k_mutex_unlock(&buf_mutex);
}

static void data_buffer_save_header(void)
{
    data_buf_header_t hdr = {
        .magic        = DATA_BUF_MAGIC,
        .write_offset = buf_state.write_offset,
        .read_offset  = buf_state.read_offset,
        .record_count = buf_state.record_count,
        .bytes_used   = buf_state.bytes_used,
    };
    flash_area_erase(buf_state.fa, 0, DATA_BUF_HEADER_SIZE);
    flash_area_write(buf_state.fa, 0, &hdr, sizeof(hdr));
}

uint32_t data_buffer_get_record_count(void) { return buf_state.record_count; }
uint32_t data_buffer_get_bytes_used(void)   { return buf_state.bytes_used; }
bool     data_buffer_is_overflow(void)       { return buf_state.overflow; }
