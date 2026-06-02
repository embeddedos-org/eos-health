/*
 * EoS Health — BLE Manager Header
 * File: firmware/shared/ble-stack/ble_manager.h
 */

#ifndef EOS_BLE_MANAGER_H
#define EOS_BLE_MANAGER_H

#include <stdint.h>
#include <stdbool.h>
#include <zephyr/bluetooth/conn.h>

typedef enum {
    BLE_STATE_OFF = 0,
    BLE_STATE_ADVERTISING,
    BLE_STATE_CONNECTING,
    BLE_STATE_CONNECTED,
    BLE_STATE_BONDING,
    BLE_STATE_SAFE_BOOT,
} ble_state_t;

typedef enum {
    BLE_EVENT_CONNECTED = 0,
    BLE_EVENT_DISCONNECTED,
    BLE_EVENT_BONDED,
    BLE_EVENT_OTA_START,
    BLE_EVENT_SYNC_START,
    BLE_EVENT_SYNC_COMPLETE,
} ble_event_t;

typedef enum {
    BLE_ADV_FAST = 0,
    BLE_ADV_SLOW,
} ble_adv_mode_t;

/* Algorithm result packet sent to mobile app */
typedef struct __attribute__((packed)) {
    uint32_t timestamp_ms;
    uint16_t heart_rate;        /* BPM × 10 */
    uint16_t hrv_rmssd;         /* ms × 10 */
    uint8_t  spo2;              /* % */
    uint8_t  stress_score;      /* 0–100 */
    uint8_t  sleep_stage;       /* 0=wake,1=light,2=deep,3=REM */
    uint8_t  afib_flag;         /* 0=normal,1=AFib detected */
    uint16_t systolic_bp;       /* mmHg × 10 */
    uint16_t diastolic_bp;      /* mmHg × 10 */
    uint16_t hba1c_est;         /* % × 100 (e.g. 5.7% = 570) */
    uint8_t  battery_pct;
    uint8_t  flags;             /* bit0=alert, bit1=critical */
} eos_algo_result_t;

typedef void (*ble_event_cb_t)(ble_event_t event);

int  ble_manager_init(ble_event_cb_t cb);
int  ble_start_advertising(ble_adv_mode_t mode);
void ble_set_conn_interval(uint16_t interval_units);
void ble_enter_advertising_only(void);
void ble_disable(void);
void ble_start_safe_boot_advertising(void);

int  ble_notify_ecg(const int16_t *samples, uint8_t count);
int  ble_notify_ppg(const uint32_t *samples, uint8_t count);
int  ble_notify_algo_result(const eos_algo_result_t *result);
void ble_notify_ota_status(uint8_t status, uint8_t error_code);
void ble_notify_ota_progress(uint8_t percent);
void ble_notify_ota_retransmit(uint32_t offset);

ble_state_t ble_get_state(void);
bool        ble_is_connected(void);

/* GATT attribute references (defined in ble_gatt.c) */
extern const struct bt_gatt_attr eos_ecg_attr;
extern const struct bt_gatt_attr eos_ppg_attr;
extern const struct bt_gatt_attr eos_algo_attr;
extern const struct bt_gatt_attr eos_ota_attr;
extern const struct bt_gatt_attr eos_prov_attr;
extern const struct bt_gatt_attr eos_sync_attr;
extern const struct bt_gatt_attr eos_crash_attr;

/* Sync work item */
extern struct k_work sync_work;

#endif /* EOS_BLE_MANAGER_H */
