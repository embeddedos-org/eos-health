/*
 * EoS Health — HEALTH-KEY ULTRA Device Firmware
 * File: firmware/health-key-ultra/src/main/main.c
 *
 * USB-C pendrive form factor health monitor.
 * Hardware: nRF52840 + MAX30001 (ECG) + MAX30102 (PPG/SpO₂) +
 *           MQ-3B (BAC breath) + BME688 (temp/humidity/VOC) +
 *           LSM6DSO (IMU) + VEML6075 (UV) + USB-C PD
 *
 * Modes:
 *   1. USB-C connected to phone: USB HID device + BLE simultaneous
 *   2. Standalone: BLE only, sensor data buffered to NVM
 *   3. Charging: USB-C power input, sensors paused
 */

#include <zephyr/kernel.h>
#include <zephyr/usb/usb_device.h>
#include <zephyr/logging/log.h>
#include "../../shared/ota/ota_manager.h"
#include "../../shared/power/power_manager.h"
#include "../../shared/crash-recovery/crash_recovery.h"
#include "../../shared/data-buffer/data_buffer.h"
#include "../../shared/ble-stack/ble_manager.h"
#include "../../shared/provisioning/provisioning.h"
#include "../../shared/health-algorithms/ecg/ecg_algorithm.h"
#include "../../shared/health-algorithms/spo2/spo2_algorithm.h"
#include "../../shared/health-algorithms/sensor-fusion/sensor_fusion.h"
#include "../sensors/key_sensors.h"
#include "../ble/key_ble_services.h"

LOG_MODULE_REGISTER(main, LOG_LEVEL_INF);

static bool usb_connected = false;

/* ── USB connection detection ───────────────────────────────── */
static void usb_status_cb(enum usb_dc_status_code status, const uint8_t *param)
{
    switch (status) {
    case USB_DC_CONNECTED:
        usb_connected = true;
        LOG_INF("USB-C connected");
        power_activity_event();
        break;
    case USB_DC_DISCONNECTED:
        usb_connected = false;
        LOG_INF("USB-C disconnected");
        break;
    default:
        break;
    }
}

/* ── Sensor thread ──────────────────────────────────────────── */
static void sensor_thread_fn(void *a, void *b, void *c)
{
    key_sensors_init();

    while (1) {
        /* ECG: 512 Hz */
        int16_t ecg_sample;
        if (key_sensors_read_ecg(&ecg_sample) == 0) {
            ecg_process_sample(ecg_sample);
        }

        /* PPG: 100 Hz */
        static uint32_t ppg_tick = 0;
        if (++ppg_tick % 5 == 0) {
            ppg_sample_t ppg;
            if (key_sensors_read_ppg(&ppg) == 0) {
                spo2_process_sample(ppg.red, ppg.ir, ppg.accel_mag);
            }
        }

        /* BAC breath sensor: read every 30s (warm-up required) */
        static uint32_t bac_tick = 0;
        if (++bac_tick % (512 * 30) == 0) {
            float bac_permille = key_sensors_read_bac();
            if (bac_permille > 0.0f) {
                data_buffer_write(SENSOR_TYPE_BAC, DATA_FLAG_ALERT,
                                  (const uint8_t *)&bac_permille, sizeof(bac_permille));
            }
        }

        /* UV index: read every 60s */
        static uint32_t uv_tick = 0;
        if (++uv_tick % (512 * 60) == 0) {
            uint8_t uv_index = key_sensors_read_uv();
            if (uv_index > 6) {
                /* High UV alert */
                data_buffer_write(SENSOR_TYPE_SUMMARY, DATA_FLAG_ALERT,
                                  &uv_index, 1);
            }
        }

        crash_thread_kick(k_current_get());
        k_sleep(K_USEC(1953));
    }
}

/* ── Algorithm thread ───────────────────────────────────────── */
static void algorithm_thread_fn(void *a, void *b, void *c)
{
    ecg_algorithm_init();
    spo2_algorithm_init();
    sensor_fusion_init();

    while (1) {
        k_sleep(K_SECONDS(30));

        fusion_inputs_t fi = {0};
        fi.skin_temp_c = key_sensors_read_temp();
        fi.battery_pct = power_get_battery_percent();
        fi.time_of_day_h = key_sensors_get_time_of_day();

        sensor_fusion_update(&fi);

        eos_algo_result_t result = {
            .timestamp_ms = k_uptime_get_32(),
            .heart_rate   = ecg_get_result()->heart_rate * 10,
            .hrv_rmssd    = ecg_get_result()->hrv_rmssd * 10,
            .spo2         = spo2_get_result()->spo2,
            .afib_flag    = ecg_get_result()->afib_flag,
            .battery_pct  = power_get_battery_percent(),
        };
        ble_notify_algo_result(&result);

        crash_thread_kick(k_current_get());
    }
}

int main(void)
{
    LOG_INF("=== EoS HEALTH-KEY ULTRA Firmware v1.0.0 ===");

    crash_recovery_init();

    int rc = provisioning_load();
    if (rc) {
        LOG_ERR("Provisioning not found — factory mode");
        key_ble_start_factory_mode();
        return 0;
    }
    provisioning_apply();

    LOG_INF("Device: HEALTH-KEY ULTRA (serial=%s)", provisioning_get_serial());

    power_manager_init(NULL);
    data_buffer_init();

    /* Initialize USB */
    usb_enable(usb_status_cb);

    ble_manager_init(NULL);
    key_ble_services_init();
    ota_confirm_image();

    extern struct k_thread sensor_thread_data;
    extern struct k_thread algorithm_thread_data;
    crash_register_thread(&sensor_thread_data,    "sensor",    2000);
    crash_register_thread(&algorithm_thread_data, "algorithm", 60000);

    LOG_INF("HEALTH-KEY ULTRA boot complete");
    return 0;
}

K_THREAD_DEFINE(sensor_thread,    4096, sensor_thread_fn,    NULL, NULL, NULL, 7, 0, 0);
K_THREAD_DEFINE(algorithm_thread, 8192, algorithm_thread_fn, NULL, NULL, NULL, 8, 0, 0);
