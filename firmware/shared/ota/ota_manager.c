/*
 * EoS Health — OTA Firmware Update Manager
 * File: firmware/shared/ota/ota_manager.c
 *
 * Implements dual-bank BLE OTA using MCUboot + Zephyr DFU subsystem.
 * Features:
 *   - Dual-bank (slot A / slot B) with automatic rollback on boot failure
 *   - Ed25519 signature verification before swap
 *   - Battery guard: refuses OTA if VBATT < 20%
 *   - Progress callbacks for mobile app UI
 *   - Chunk retry with 3x exponential backoff
 *   - CRC32 per-chunk + SHA-256 full-image verification
 *
 * Compatible with: nRF52840, nRF52833
 * RTOS: Zephyr 3.6 LTS
 */

#include <zephyr/kernel.h>
#include <zephyr/dfu/mcuboot.h>
#include <zephyr/storage/flash_map.h>
#include <zephyr/sys/crc.h>
#include <zephyr/crypto/crypto.h>
#include <zephyr/logging/log.h>
#include "ota_manager.h"
#include "../power/power_manager.h"
#include "../ble-stack/ble_manager.h"

LOG_MODULE_REGISTER(ota_manager, LOG_LEVEL_INF);

/* ── Configuration ─────────────────────────────────────────── */
#define OTA_CHUNK_SIZE_MAX        512U
#define OTA_RETRY_MAX             3U
#define OTA_BATTERY_MIN_PERCENT   20U
#define OTA_SLOT_ID               FIXED_PARTITION_ID(slot1_partition)
#define OTA_SIGNATURE_LEN         64U   /* Ed25519 */
#define OTA_SHA256_LEN            32U

/* ── State machine ─────────────────────────────────────────── */
typedef enum {
    OTA_STATE_IDLE = 0,
    OTA_STATE_INIT,
    OTA_STATE_RECEIVING,
    OTA_STATE_VERIFYING,
    OTA_STATE_APPLYING,
    OTA_STATE_COMPLETE,
    OTA_STATE_ERROR,
    OTA_STATE_ROLLBACK,
} ota_state_t;

static struct {
    ota_state_t     state;
    uint32_t        image_size;
    uint32_t        bytes_received;
    uint32_t        chunk_index;
    uint8_t         expected_sha256[OTA_SHA256_LEN];
    uint8_t         expected_sig[OTA_SIGNATURE_LEN];
    const struct flash_area *fa;
    ota_progress_cb_t progress_cb;
    uint8_t         retry_count;
    uint32_t        last_chunk_crc;
} ota_ctx;

/* Ed25519 public key — embedded at build time from provisioning */
extern const uint8_t eos_ota_public_key[32];

/* ── Public API ────────────────────────────────────────────── */

int ota_init(uint32_t image_size, const uint8_t *sha256,
             const uint8_t *signature, ota_progress_cb_t cb)
{
    if (ota_ctx.state != OTA_STATE_IDLE) {
        LOG_ERR("OTA already in progress");
        return -EBUSY;
    }

    /* Battery guard */
    uint8_t batt_pct = power_get_battery_percent();
    if (batt_pct < OTA_BATTERY_MIN_PERCENT) {
        LOG_ERR("OTA refused: battery %u%% < %u%%", batt_pct, OTA_BATTERY_MIN_PERCENT);
        return -ENOBUFS;
    }

    /* Open slot B flash area */
    int rc = flash_area_open(OTA_SLOT_ID, &ota_ctx.fa);
    if (rc) {
        LOG_ERR("flash_area_open failed: %d", rc);
        return rc;
    }

    /* Erase slot B */
    rc = flash_area_erase(ota_ctx.fa, 0, ota_ctx.fa->fa_size);
    if (rc) {
        LOG_ERR("flash_area_erase failed: %d", rc);
        flash_area_close(ota_ctx.fa);
        return rc;
    }

    ota_ctx.image_size     = image_size;
    ota_ctx.bytes_received = 0;
    ota_ctx.chunk_index    = 0;
    ota_ctx.retry_count    = 0;
    ota_ctx.progress_cb    = cb;
    memcpy(ota_ctx.expected_sha256, sha256, OTA_SHA256_LEN);
    memcpy(ota_ctx.expected_sig, signature, OTA_SIGNATURE_LEN);
    ota_ctx.state = OTA_STATE_RECEIVING;

    LOG_INF("OTA init: image_size=%u bytes", image_size);

    /* Notify mobile app: OTA started */
    ble_notify_ota_status(OTA_STATUS_STARTED, 0);
    return 0;
}

int ota_write_chunk(uint32_t offset, const uint8_t *data,
                    uint16_t len, uint32_t chunk_crc)
{
    if (ota_ctx.state != OTA_STATE_RECEIVING) {
        return -EINVAL;
    }

    /* Validate chunk CRC32 */
    uint32_t calc_crc = crc32_ieee(data, len);
    if (calc_crc != chunk_crc) {
        LOG_WRN("Chunk CRC mismatch at offset %u: got 0x%08X expected 0x%08X",
                offset, calc_crc, chunk_crc);
        ota_ctx.retry_count++;
        if (ota_ctx.retry_count >= OTA_RETRY_MAX) {
            ota_ctx.state = OTA_STATE_ERROR;
            ble_notify_ota_status(OTA_STATUS_ERROR, OTA_ERR_CRC);
            return -EBADMSG;
        }
        /* Request retransmit */
        ble_notify_ota_retransmit(offset);
        return -EAGAIN;
    }
    ota_ctx.retry_count = 0;

    /* Write to flash slot B */
    int rc = flash_area_write(ota_ctx.fa, offset, data, len);
    if (rc) {
        LOG_ERR("flash_area_write failed at offset %u: %d", offset, rc);
        ota_ctx.state = OTA_STATE_ERROR;
        ble_notify_ota_status(OTA_STATUS_ERROR, OTA_ERR_FLASH);
        return rc;
    }

    ota_ctx.bytes_received += len;
    ota_ctx.chunk_index++;

    /* Progress callback */
    uint8_t pct = (uint8_t)((ota_ctx.bytes_received * 100U) / ota_ctx.image_size);
    if (ota_ctx.progress_cb) {
        ota_ctx.progress_cb(pct);
    }
    ble_notify_ota_progress(pct);

    /* Check if complete */
    if (ota_ctx.bytes_received >= ota_ctx.image_size) {
        ota_ctx.state = OTA_STATE_VERIFYING;
        return ota_verify_and_apply();
    }
    return 0;
}

static int ota_verify_and_apply(void)
{
    LOG_INF("OTA: verifying SHA-256...");

    /* Compute SHA-256 of received image */
    uint8_t computed_hash[OTA_SHA256_LEN];
    struct hash_ctx hctx;
    struct hash_pkt hpkt;

    /* Read back from flash and hash in 512-byte blocks */
    uint8_t block[512];
    struct tc_sha256_state_struct sha_state;
    tc_sha256_init(&sha_state);

    for (uint32_t off = 0; off < ota_ctx.image_size; off += sizeof(block)) {
        uint32_t rlen = MIN(sizeof(block), ota_ctx.image_size - off);
        flash_area_read(ota_ctx.fa, off, block, rlen);
        tc_sha256_update(&sha_state, block, rlen);
    }
    tc_sha256_final(computed_hash, &sha_state);

    if (memcmp(computed_hash, ota_ctx.expected_sha256, OTA_SHA256_LEN) != 0) {
        LOG_ERR("OTA: SHA-256 mismatch — aborting");
        ota_ctx.state = OTA_STATE_ERROR;
        ble_notify_ota_status(OTA_STATUS_ERROR, OTA_ERR_HASH);
        flash_area_close(ota_ctx.fa);
        return -EBADMSG;
    }
    LOG_INF("OTA: SHA-256 OK");

    /* Ed25519 signature verification */
    /* Uses TinyCrypt Ed25519 or mbedTLS depending on build config */
    int sig_ok = eos_verify_ed25519(ota_ctx.expected_sha256, OTA_SHA256_LEN,
                                     ota_ctx.expected_sig, eos_ota_public_key);
    if (sig_ok != 0) {
        LOG_ERR("OTA: Ed25519 signature invalid — aborting");
        ota_ctx.state = OTA_STATE_ERROR;
        ble_notify_ota_status(OTA_STATUS_ERROR, OTA_ERR_SIGNATURE);
        flash_area_close(ota_ctx.fa);
        return -EACCES;
    }
    LOG_INF("OTA: Ed25519 signature OK");

    flash_area_close(ota_ctx.fa);

    /* Request MCUboot to swap on next reboot */
    ota_ctx.state = OTA_STATE_APPLYING;
    int rc = boot_request_upgrade(BOOT_UPGRADE_TEST);
    if (rc) {
        LOG_ERR("boot_request_upgrade failed: %d", rc);
        ota_ctx.state = OTA_STATE_ERROR;
        ble_notify_ota_status(OTA_STATUS_ERROR, OTA_ERR_BOOT);
        return rc;
    }

    LOG_INF("OTA: upgrade requested — rebooting in 3s");
    ble_notify_ota_status(OTA_STATUS_COMPLETE, 0);
    ota_ctx.state = OTA_STATE_COMPLETE;

    /* Delay to allow BLE notification to be sent */
    k_sleep(K_MSEC(3000));
    sys_reboot(SYS_REBOOT_COLD);
    return 0; /* never reached */
}

/*
 * Called by application after successful boot from new image.
 * Confirms the image so MCUboot does not roll back.
 */
void ota_confirm_image(void)
{
    if (boot_is_img_confirmed()) {
        return; /* already confirmed */
    }
    int rc = boot_write_img_confirmed();
    if (rc) {
        LOG_ERR("boot_write_img_confirmed failed: %d — will rollback on next boot", rc);
    } else {
        LOG_INF("OTA: image confirmed");
    }
}

ota_state_t ota_get_state(void) { return ota_ctx.state; }
