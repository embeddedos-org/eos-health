/*
 * EoS Health — OTA Firmware Update Manager Header
 * File: firmware/shared/ota/ota_manager.h
 */

#ifndef EOS_OTA_MANAGER_H
#define EOS_OTA_MANAGER_H

#include <stdint.h>
#include <stdbool.h>

/* OTA status codes (sent to mobile app via BLE notification) */
#define OTA_STATUS_STARTED   0x01
#define OTA_STATUS_PROGRESS  0x02
#define OTA_STATUS_COMPLETE  0x03
#define OTA_STATUS_ERROR     0xFF

/* OTA error codes */
#define OTA_ERR_CRC          0x01
#define OTA_ERR_HASH         0x02
#define OTA_ERR_SIGNATURE    0x03
#define OTA_ERR_FLASH        0x04
#define OTA_ERR_BOOT         0x05
#define OTA_ERR_BATTERY      0x06

typedef void (*ota_progress_cb_t)(uint8_t percent);

/**
 * @brief Initialize OTA session.
 * @param image_size  Total image size in bytes
 * @param sha256      Expected SHA-256 hash of image (32 bytes)
 * @param signature   Ed25519 signature over SHA-256 hash (64 bytes)
 * @param cb          Progress callback (0–100%)
 * @return 0 on success, negative errno on failure
 */
int ota_init(uint32_t image_size, const uint8_t *sha256,
             const uint8_t *signature, ota_progress_cb_t cb);

/**
 * @brief Write a firmware chunk to slot B.
 * @param offset     Byte offset within image
 * @param data       Chunk data
 * @param len        Chunk length (max OTA_CHUNK_SIZE_MAX)
 * @param chunk_crc  CRC32 of chunk data
 * @return 0 on success, -EAGAIN to request retransmit, negative errno on error
 */
int ota_write_chunk(uint32_t offset, const uint8_t *data,
                    uint16_t len, uint32_t chunk_crc);

/**
 * @brief Confirm current image after successful boot.
 *        Must be called within 60 seconds of boot to prevent MCUboot rollback.
 */
void ota_confirm_image(void);

/** @brief Get current OTA state machine state */
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

ota_state_t ota_get_state(void);

/* Internal — called from ota_write_chunk when image complete */
static int ota_verify_and_apply(void);

/* Ed25519 verification — implemented in provisioning/crypto.c */
int eos_verify_ed25519(const uint8_t *msg, size_t msg_len,
                       const uint8_t *sig, const uint8_t *pub_key);

#endif /* EOS_OTA_MANAGER_H */
