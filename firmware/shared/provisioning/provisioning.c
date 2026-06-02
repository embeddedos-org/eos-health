/*
 * EoS Health — Device Provisioning Module
 * File: firmware/shared/provisioning/provisioning.c
 *
 * Handles factory provisioning of each device unit:
 *   1. Device identity: unique serial number, device type, hardware revision
 *   2. Cryptographic keys: Ed25519 OTA public key, device private key
 *   3. Sensor calibration: per-unit offset/gain for ECG, PPG, temperature
 *   4. BLE identity: static random address derived from serial number
 *   5. Production test results: pass/fail record
 *
 * Provisioning flow (factory):
 *   a. Flash bootloader + firmware via SWD (J-Link / nRF9160-DK)
 *   b. Run factory test suite (all sensors, BLE, charging)
 *   c. Write provisioning data via BLE (provisioning GATT characteristic)
 *      or via SWD direct NVM write
 *   d. Lock provisioning partition (write-once via APPROTECT)
 *   e. Generate QR code label with serial + BLE address
 *
 * Provisioning NVM layout (4 KB at 0x000F4000):
 *   [0x000] magic (4B)
 *   [0x004] device_type (1B)
 *   [0x005] hw_revision (1B)
 *   [0x006] serial_len (1B)
 *   [0x007] _pad (1B)
 *   [0x008] serial_number (16B)
 *   [0x018] ble_address (6B)
 *   [0x01E] _pad (2B)
 *   [0x020] ota_public_key (32B) — Ed25519
 *   [0x040] device_private_key (32B) — Ed25519 (for device attestation)
 *   [0x060] calibration (64B) — sensor-specific
 *   [0x0A0] production_test_result (4B)
 *   [0x0A4] provisioned_at_unix (4B)
 *   [0x0A8] provisioner_id (8B)
 *   [0x0B0] crc32 (4B) — over all above
 *   [0x0B4] _pad to 4KB
 */

#include <zephyr/kernel.h>
#include <zephyr/storage/flash_map.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/sys/crc.h>
#include <zephyr/logging/log.h>
#include "provisioning.h"

LOG_MODULE_REGISTER(provisioning, LOG_LEVEL_INF);

#define PROV_PARTITION_ID   FIXED_PARTITION_ID(provisioning_partition)
#define PROV_MAGIC          0xEA5P0001U
#define PROV_DATA_SIZE      0xB4U  /* 180 bytes of provisioning data */

static prov_data_t prov_cache;
static bool prov_loaded = false;

/* ── Load provisioning data from NVM ───────────────────────── */
int provisioning_load(void)
{
    const struct flash_area *fa;
    int rc = flash_area_open(PROV_PARTITION_ID, &fa);
    if (rc) {
        LOG_ERR("Cannot open provisioning partition: %d", rc);
        return rc;
    }

    rc = flash_area_read(fa, 0, &prov_cache, sizeof(prov_cache));
    flash_area_close(fa);
    if (rc) return rc;

    /* Verify magic */
    if (prov_cache.magic != PROV_MAGIC) {
        LOG_ERR("Provisioning data not found (magic=0x%08X)", prov_cache.magic);
        return -ENODATA;
    }

    /* Verify CRC32 */
    uint32_t calc_crc = crc32_ieee((const uint8_t *)&prov_cache,
                                    PROV_DATA_SIZE - 4); /* exclude CRC field */
    if (calc_crc != prov_cache.crc32) {
        LOG_ERR("Provisioning CRC mismatch: calc=0x%08X stored=0x%08X",
                calc_crc, prov_cache.crc32);
        return -EBADMSG;
    }

    prov_loaded = true;
    LOG_INF("Provisioning loaded: device=%s type=%u hw_rev=%u",
            prov_cache.serial_number, prov_cache.device_type,
            prov_cache.hw_revision);
    return 0;
}

/* ── Write provisioning data (factory only) ─────────────────── */
int provisioning_write(const prov_data_t *data)
{
    /* Compute CRC */
    prov_data_t d = *data;
    d.magic = PROV_MAGIC;
    d.crc32 = crc32_ieee((const uint8_t *)&d, PROV_DATA_SIZE - 4);

    const struct flash_area *fa;
    int rc = flash_area_open(PROV_PARTITION_ID, &fa);
    if (rc) return rc;

    rc = flash_area_erase(fa, 0, sizeof(prov_data_t));
    if (rc) { flash_area_close(fa); return rc; }

    rc = flash_area_write(fa, 0, &d, sizeof(d));
    flash_area_close(fa);
    if (rc) return rc;

    memcpy(&prov_cache, &d, sizeof(d));
    prov_loaded = true;

    LOG_INF("Provisioning written: serial=%s", d.serial_number);
    return 0;
}

/* ── Apply provisioning to system ───────────────────────────── */
int provisioning_apply(void)
{
    if (!prov_loaded) {
        int rc = provisioning_load();
        if (rc) return rc;
    }

    /* Set BLE static random address from provisioning data */
    bt_addr_le_t addr = {
        .type = BT_ADDR_LE_RANDOM,
    };
    memcpy(addr.a.val, prov_cache.ble_address, 6);
    /* Ensure top 2 bits are set for static random address */
    addr.a.val[5] |= 0xC0;
    bt_id_create(&addr, NULL);

    LOG_INF("BLE address set: %02X:%02X:%02X:%02X:%02X:%02X",
            addr.a.val[5], addr.a.val[4], addr.a.val[3],
            addr.a.val[2], addr.a.val[1], addr.a.val[0]);
    return 0;
}

/* ── Accessors ─────────────────────────────────────────────── */
bool provisioning_is_done(void)
{
    if (!prov_loaded) provisioning_load();
    return prov_loaded;
}

const char *provisioning_get_serial(void)
{
    return prov_loaded ? prov_cache.serial_number : "UNPROVISIONED";
}

device_type_t provisioning_get_device_type(void)
{
    return prov_loaded ? (device_type_t)prov_cache.device_type : DEVICE_TYPE_UNKNOWN;
}

const uint8_t *provisioning_get_ota_public_key(void)
{
    return prov_loaded ? prov_cache.ota_public_key : NULL;
}

const prov_calibration_t *provisioning_get_calibration(void)
{
    return prov_loaded ? &prov_cache.calibration : NULL;
}

/* ── BLE GATT write handler for provisioning characteristic ── */
ssize_t provisioning_gatt_write(struct bt_conn *conn,
                                 const struct bt_gatt_attr *attr,
                                 const void *buf, uint16_t len,
                                 uint16_t offset, uint8_t flags)
{
    /* Only allow provisioning write from bonded factory tool */
    if (bt_conn_get_security(conn) < BT_SECURITY_L3) {
        LOG_ERR("Provisioning write rejected: insufficient security");
        return BT_GATT_ERR(BT_ATT_ERR_AUTHENTICATION);
    }

    if (len != sizeof(prov_data_t)) {
        return BT_GATT_ERR(BT_ATT_ERR_INVALID_ATTRIBUTE_LEN);
    }

    int rc = provisioning_write((const prov_data_t *)buf);
    if (rc) {
        LOG_ERR("provisioning_write failed: %d", rc);
        return BT_GATT_ERR(BT_ATT_ERR_UNLIKELY_ERR);
    }

    provisioning_apply();
    return len;
}
