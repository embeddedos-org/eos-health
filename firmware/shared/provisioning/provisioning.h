/*
 * EoS Health — Provisioning Header
 */

#ifndef EOS_PROVISIONING_H
#define EOS_PROVISIONING_H

#include <stdint.h>
#include <stdbool.h>
#include <zephyr/bluetooth/gatt.h>

typedef enum {
    DEVICE_TYPE_UNKNOWN         = 0x00,
    DEVICE_TYPE_HEALTH_KEY_ULTRA = 0x01,
    DEVICE_TYPE_HEALTH_BAND_NEURO = 0x02,
    DEVICE_TYPE_HEALTH_RING     = 0x03,
    DEVICE_TYPE_HEALTH_LAB      = 0x04,
} device_type_t;

/* Sensor calibration data (device-specific offsets and gains) */
typedef struct __attribute__((packed)) {
    int16_t  ecg_offset;         /* ECG DC offset correction (µV) */
    uint16_t ecg_gain;           /* ECG gain correction (× 1000) */
    int16_t  ppg_red_offset;     /* PPG red LED offset */
    int16_t  ppg_ir_offset;      /* PPG IR LED offset */
    uint16_t ppg_red_gain;       /* PPG red gain (× 1000) */
    uint16_t ppg_ir_gain;        /* PPG IR gain (× 1000) */
    int8_t   temp_offset;        /* Temperature offset (°C × 10) */
    uint8_t  _pad[3];
    /* HEALTH-LAB only */
    uint16_t glucose_slope;      /* Glucose calibration slope */
    int16_t  glucose_intercept;  /* Glucose calibration intercept */
    uint16_t lactate_slope;
    int16_t  lactate_intercept;
    /* Reserved for future sensors */
    uint8_t  reserved[36];
} prov_calibration_t;

/* Full provisioning data structure (written once at factory) */
typedef struct __attribute__((packed)) {
    uint32_t          magic;
    uint8_t           device_type;       /* device_type_t */
    uint8_t           hw_revision;       /* PCB revision: 0=rev-A, 1=rev-B */
    uint8_t           serial_len;
    uint8_t           _pad1;
    char              serial_number[16]; /* e.g. "EHR-2026-000001" */
    uint8_t           ble_address[6];    /* Static random BLE address */
    uint8_t           _pad2[2];
    uint8_t           ota_public_key[32];    /* Ed25519 public key */
    uint8_t           device_private_key[32]; /* Ed25519 device key */
    prov_calibration_t calibration;
    uint32_t          production_test_result; /* bit-field: 0=pass */
    uint32_t          provisioned_at_unix;
    uint8_t           provisioner_id[8];  /* Factory station ID */
    uint32_t          crc32;
} prov_data_t;

int           provisioning_load(void);
int           provisioning_write(const prov_data_t *data);
int           provisioning_apply(void);
bool          provisioning_is_done(void);

const char           *provisioning_get_serial(void);
device_type_t         provisioning_get_device_type(void);
const uint8_t        *provisioning_get_ota_public_key(void);
const prov_calibration_t *provisioning_get_calibration(void);

ssize_t provisioning_gatt_write(struct bt_conn *conn,
                                 const struct bt_gatt_attr *attr,
                                 const void *buf, uint16_t len,
                                 uint16_t offset, uint8_t flags);

/* OTA public key — linked from provisioning NVM at runtime */
extern const uint8_t eos_ota_public_key[32];

#endif /* EOS_PROVISIONING_H */
