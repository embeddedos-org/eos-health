/*
 * EoS Health — HEALTH-RING Device Firmware
 * File: firmware/health-ring/src/main/main.c
 *
 * Main application entry point for HEALTH-RING (base + Ultra tiers).
 * Tier is determined at runtime from provisioning data.
 *
 * Hardware:
 *   Base:  nRF52833 + MAX30101 (3λ PPG) + MAX30003 (ECG) + LSM6DSO (IMU)
 *   Ultra: nRF52840 + MAX86176 (5λ PPG) + MAX30001 (ECG) + LSM6DSO + MAX32666 (AI)
 *
 * Charging: NFC inductive (TDK WCT-1001 coil, MAX77734 PMIC)
 * Form factor: 2.0mm (base) / 2.8mm (ultra) titanium ring
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include "../../shared/ota/ota_manager.h"
#include "../../shared/power/power_manager.h"
#include "../../shared/crash-recovery/crash_recovery.h"
#include "../../shared/data-buffer/data_buffer.h"
#include "../../shared/ble-stack/ble_manager.h"
#include "../../shared/provisioning/provisioning.h"
#include "../../shared/health-algorithms/ecg/ecg_algorithm.h"
#include "../../shared/health-algorithms/spo2/spo2_algorithm.h"
#include "../../shared/health-algorithms/blood-pressure/bp_algorithm.h"
#include "../../shared/health-algorithms/sensor-fusion/sensor_fusion.h"
#include "../sensors/ring_sensors.h"
#include "../ble/ring_ble_services.h"

LOG_MODULE_REGISTER(main, LOG_LEVEL_INF);

/* ── Device tier (set from provisioning) ────────────────────── */
static bool is_ultra = false;

/* ── Sensor thread ──────────────────────────────────────────── */
static void sensor_thread_fn(void *a, void *b, void *c)
{
    ring_sensors_init(is_ultra);

    while (1) {
        /* ECG: 512 Hz — process each sample immediately */
        int16_t ecg_sample;
        if (ring_sensors_read_ecg(&ecg_sample) == 0) {
            ecg_process_sample(ecg_sample);

            /* Notify BLE every 16 samples (32ms burst at 512Hz) */
            static int16_t ecg_burst[16];
            static uint8_t ecg_burst_idx = 0;
            ecg_burst[ecg_burst_idx++] = ecg_sample;
            if (ecg_burst_idx >= 16) {
                ble_notify_ecg(ecg_burst, 16);
                ecg_burst_idx = 0;
            }
        }

        /* PPG: 100 Hz */
        static uint32_t ppg_tick = 0;
        if (++ppg_tick % 5 == 0) {  /* Every 5 ECG samples = 100 Hz */
            ppg_sample_t ppg;
            if (ring_sensors_read_ppg(&ppg) == 0) {
                spo2_process_sample(ppg.red, ppg.ir, ppg.accel_mag);
                if (is_ultra) {
                    /* Ultra: also process 1300nm for HbA1c */
                    ring_sensors_process_hba1c(&ppg);
                }
                bp_on_ppg_sample(ppg.ir, ppg_tick / 5);
            }
        }

        /* IMU: 104 Hz */
        static uint32_t imu_tick = 0;
        if (++imu_tick % 5 == 0) {
            imu_sample_t imu;
            if (ring_sensors_read_imu(&imu) == 0) {
                /* Detect wrist raise → wake from sleep */
                if (imu.accel_mag > 1.5f) {
                    power_activity_event();
                }
            }
        }

        /* Kick watchdog health check */
        crash_thread_kick(k_current_get());

        k_sleep(K_USEC(1953)); /* 512 Hz = 1953 µs per sample */
    }
}

/* ── Algorithm thread ───────────────────────────────────────── */
static void algorithm_thread_fn(void *a, void *b, void *c)
{
    ecg_algorithm_init();
    spo2_algorithm_init();

    const prov_calibration_t *cal = provisioning_get_calibration();
    if (cal && is_ultra) {
        bp_calibration_t bp_cal = {
            .valid = true,
            .a_s = 1.2e6f, .b_s = -100.0f, .c_s = 0.5f,
            .a_d = 8.0e5f, .b_d = -60.0f,  .c_d = 0.3f,
        };
        bp_algorithm_init(&bp_cal);
    } else {
        bp_algorithm_init(NULL);
    }

    sensor_fusion_init();

    while (1) {
        k_sleep(K_SECONDS(30));

        /* Build fusion inputs */
        fusion_inputs_t fi = {0};
        imu_sample_t imu;
        ring_sensors_read_imu(&imu);
        fi.accel_x     = imu.accel_x;
        fi.accel_y     = imu.accel_y;
        fi.accel_z     = imu.accel_z;
        fi.accel_mag   = imu.accel_mag;
        fi.gyro_mag    = imu.gyro_mag;
        fi.skin_temp_c = ring_sensors_read_temp();
        fi.battery_pct = power_get_battery_percent();
        fi.time_of_day_h = ring_sensors_get_time_of_day();

        /* Run fusion */
        sensor_fusion_update(&fi);

        /* Send result to mobile app */
        const eos_fusion_result_t *fr = sensor_fusion_get_result();
        eos_algo_result_t algo_result = {
            .timestamp_ms  = k_uptime_get_32(),
            .heart_rate    = ecg_get_result()->heart_rate * 10,
            .hrv_rmssd     = ecg_get_result()->hrv_rmssd * 10,
            .spo2          = spo2_get_result()->spo2,
            .stress_score  = fr->stress_score,
            .sleep_stage   = fr->sleep_stage,
            .afib_flag     = ecg_get_result()->afib_flag,
            .systolic_bp   = bp_get_result()->systolic,
            .diastolic_bp  = bp_get_result()->diastolic,
            .battery_pct   = power_get_battery_percent(),
        };
        ble_notify_algo_result(&algo_result);

        crash_thread_kick(k_current_get());
    }
}

/* ── Power event handler ────────────────────────────────────── */
static void power_event_handler(power_event_t event)
{
    switch (event) {
    case POWER_EVENT_BATTERY_CRITICAL:
        LOG_WRN("Battery critical — entering deep sleep");
        power_set_state(POWER_STATE_DEEP_SLEEP);
        break;
    case POWER_EVENT_CHARGING_START:
        LOG_INF("Charging started");
        power_set_state(POWER_STATE_CHARGING);
        ring_sensors_pause();
        break;
    case POWER_EVENT_CHARGING_COMPLETE:
        LOG_INF("Charging complete");
        power_set_state(POWER_STATE_ACTIVE);
        ring_sensors_resume();
        break;
    default:
        break;
    }
}

/* ── BLE event handler ──────────────────────────────────────── */
static void ble_event_handler(ble_event_t event)
{
    switch (event) {
    case BLE_EVENT_CONNECTED:
        LOG_INF("BLE connected — syncing buffered data");
        power_activity_event();
        break;
    case BLE_EVENT_DISCONNECTED:
        LOG_INF("BLE disconnected — buffering to NVM");
        break;
    default:
        break;
    }
}

/* ── Main ───────────────────────────────────────────────────── */
int main(void)
{
    LOG_INF("=== EoS HEALTH-RING Firmware v1.0.0 ===");

    /* 1. Crash recovery (must be first) */
    crash_recovery_init();

    /* 2. Load provisioning */
    int rc = provisioning_load();
    if (rc) {
        LOG_ERR("Provisioning not found — entering factory mode");
        ring_ble_start_factory_mode();
        return 0;
    }
    provisioning_apply();

    /* Determine tier from provisioning */
    is_ultra = (provisioning_get_device_type() == DEVICE_TYPE_HEALTH_RING &&
                provisioning_get_calibration()->ecg_gain > 1000);

    LOG_INF("Device: HEALTH-RING %s (serial=%s)",
            is_ultra ? "Ultra" : "Base",
            provisioning_get_serial());

    /* 3. Power management */
    power_manager_init(power_event_handler);

    /* 4. Data buffer */
    data_buffer_init();

    /* 5. BLE */
    ble_manager_init(ble_event_handler);
    ring_ble_services_init(is_ultra);

    /* 6. Confirm OTA image (prevents rollback) */
    ota_confirm_image();

    /* 7. Register threads for watchdog monitoring */
    extern struct k_thread sensor_thread_data;
    extern struct k_thread algorithm_thread_data;
    crash_register_thread(&sensor_thread_data,    "sensor",    2000);
    crash_register_thread(&algorithm_thread_data, "algorithm", 60000);

    LOG_INF("HEALTH-RING boot complete — all systems nominal");
    return 0;
}

/* ── Thread definitions ─────────────────────────────────────── */
K_THREAD_DEFINE(sensor_thread,    4096, sensor_thread_fn,    NULL, NULL, NULL, 7, 0, 0);
K_THREAD_DEFINE(algorithm_thread, 8192, algorithm_thread_fn, NULL, NULL, NULL, 8, 0, 0);
