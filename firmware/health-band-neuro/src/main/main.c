/*
 * EoS Health — HEALTH-BAND Neuro Device Firmware
 * File: firmware/health-band-neuro/src/main/main.c
 *
 * Neural wristband with sEMG, TENS therapy, ECG, PPG, EDA.
 * Hardware: nRF52840 + MAX30001 (ECG) + MAX30102 (PPG) +
 *           ADS1299 (8-channel sEMG, 24-bit) + LSM6DSO (IMU) +
 *           BME688 (temp/humidity/VOC) + AD5940 (EDA/bioimpedance) +
 *           TENS driver (H-bridge, 1–100 Hz, 0–80 mA)
 *
 * Key differentiators vs competitors:
 *   - sEMG: 8-channel 24-bit muscle activity (no competitor has this)
 *   - TENS: therapeutic electrical stimulation (unique in wearables)
 *   - EDA: electrodermal activity for stress/autonomic nervous system
 *   - Neural: real-time muscle fatigue, tremor detection, nerve conduction
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
#include "../../shared/health-algorithms/sensor-fusion/sensor_fusion.h"
#include "../sensors/band_sensors.h"
#include "../algorithms/semg_algorithm.h"
#include "../algorithms/eda_algorithm.h"
#include "../algorithms/tens_controller.h"
#include "../ble/band_ble_services.h"

LOG_MODULE_REGISTER(main, LOG_LEVEL_INF);

/* ── sEMG sampling thread (2000 Hz, 8 channels) ─────────────── */
static void semg_thread_fn(void *a, void *b, void *c)
{
    semg_algorithm_init();
    band_sensors_semg_init();

    while (1) {
        /* ADS1299: 8-channel 24-bit sEMG at 2000 Hz */
        int32_t semg_samples[8];
        if (band_sensors_read_semg(semg_samples) == 0) {
            semg_process_sample(semg_samples);

            /* Stream to BLE every 50 samples (25ms burst) */
            static int32_t semg_burst[8][50];
            static uint8_t semg_burst_idx = 0;
            for (int ch = 0; ch < 8; ch++) {
                semg_burst[ch][semg_burst_idx] = semg_samples[ch];
            }
            if (++semg_burst_idx >= 50) {
                ble_notify_semg((const int32_t *)semg_burst, 8, 50);
                semg_burst_idx = 0;
            }
        }

        crash_thread_kick(k_current_get());
        k_sleep(K_USEC(500)); /* 2000 Hz = 500 µs */
    }
}

/* ── ECG + PPG thread (512 Hz ECG, 100 Hz PPG) ──────────────── */
static void ecg_ppg_thread_fn(void *a, void *b, void *c)
{
    ecg_algorithm_init();
    spo2_algorithm_init();

    while (1) {
        int16_t ecg_sample;
        if (band_sensors_read_ecg(&ecg_sample) == 0) {
            ecg_process_sample(ecg_sample);
        }

        static uint32_t ppg_tick = 0;
        if (++ppg_tick % 5 == 0) {
            ppg_sample_t ppg;
            if (band_sensors_read_ppg(&ppg) == 0) {
                spo2_process_sample(ppg.red, ppg.ir, ppg.accel_mag);
            }
        }

        crash_thread_kick(k_current_get());
        k_sleep(K_USEC(1953)); /* 512 Hz */
    }
}

/* ── EDA thread (8 Hz — slow autonomic response) ────────────── */
static void eda_thread_fn(void *a, void *b, void *c)
{
    eda_algorithm_init();

    while (1) {
        k_sleep(K_MSEC(125)); /* 8 Hz */

        eda_sample_t eda;
        if (band_sensors_read_eda(&eda) == 0) {
            eda_process_sample(&eda);

            /* Notify BLE every 8 samples (1 second) */
            static uint8_t eda_tick = 0;
            if (++eda_tick >= 8) {
                const eos_eda_result_t *result = eda_get_result();
                ble_notify_eda(result);
                eda_tick = 0;
            }
        }

        crash_thread_kick(k_current_get());
    }
}

/* ── TENS therapy thread (on-demand, user-initiated) ─────────── */
static void tens_thread_fn(void *a, void *b, void *c)
{
    tens_controller_init();

    while (1) {
        /* Wait for TENS command from BLE */
        tens_command_t cmd;
        if (k_msgq_get(&tens_msgq, &cmd, K_FOREVER) == 0) {
            LOG_INF("TENS: freq=%u Hz, intensity=%u mA, duration=%u s",
                    cmd.frequency_hz, cmd.intensity_ma, cmd.duration_s);

            /* Safety checks */
            if (cmd.intensity_ma > 80) {
                LOG_ERR("TENS: intensity too high (%u mA > 80 mA limit)", cmd.intensity_ma);
                continue;
            }
            if (cmd.duration_s > 1800) {
                LOG_ERR("TENS: duration too long (%u s > 30 min limit)", cmd.duration_s);
                continue;
            }

            /* Run TENS session */
            tens_run_session(&cmd);
        }
    }
}

/* ── Algorithm fusion thread (every 30s) ────────────────────── */
static void algorithm_thread_fn(void *a, void *b, void *c)
{
    sensor_fusion_init();

    while (1) {
        k_sleep(K_SECONDS(30));

        fusion_inputs_t fi = {0};
        imu_sample_t imu;
        band_sensors_read_imu(&imu);
        fi.accel_x     = imu.accel_x;
        fi.accel_y     = imu.accel_y;
        fi.accel_z     = imu.accel_z;
        fi.accel_mag   = imu.accel_mag;
        fi.gyro_mag    = imu.gyro_mag;
        fi.skin_temp_c = band_sensors_read_temp();
        fi.battery_pct = power_get_battery_percent();
        fi.time_of_day_h = band_sensors_get_time_of_day();

        /* Add EDA stress input to fusion */
        const eos_eda_result_t *eda = eda_get_result();
        fi.eda_scl     = eda->scl_uS;
        fi.eda_scr_rate = eda->scr_rate;

        /* Add sEMG fatigue to fusion */
        const eos_semg_result_t *semg = semg_get_result();
        fi.muscle_fatigue = semg->fatigue_score;

        sensor_fusion_update(&fi);

        /* Send comprehensive result to mobile app */
        eos_band_result_t result = {
            .timestamp_ms    = k_uptime_get_32(),
            .heart_rate      = ecg_get_result()->heart_rate * 10,
            .hrv_rmssd       = ecg_get_result()->hrv_rmssd * 10,
            .spo2            = spo2_get_result()->spo2,
            .afib_flag       = ecg_get_result()->afib_flag,
            .stress_score    = sensor_fusion_get_result()->stress_score,
            .sleep_stage     = sensor_fusion_get_result()->sleep_stage,
            .health_score    = sensor_fusion_get_result()->health_score,
            .eda_scl         = eda->scl_uS,
            .muscle_fatigue  = semg->fatigue_score,
            .nerve_velocity  = semg->nerve_conduction_ms,
            .battery_pct     = power_get_battery_percent(),
        };
        ble_notify_band_result(&result);

        crash_thread_kick(k_current_get());
    }
}

/* ── Main ───────────────────────────────────────────────────── */
int main(void)
{
    LOG_INF("=== EoS HEALTH-BAND Neuro Firmware v1.0.0 ===");

    crash_recovery_init();

    int rc = provisioning_load();
    if (rc) {
        LOG_ERR("Provisioning not found — factory mode");
        band_ble_start_factory_mode();
        return 0;
    }
    provisioning_apply();

    LOG_INF("Device: HEALTH-BAND Neuro (serial=%s)", provisioning_get_serial());

    power_manager_init(NULL);
    data_buffer_init();
    ble_manager_init(NULL);
    band_ble_services_init();
    ota_confirm_image();

    extern struct k_thread semg_thread_data;
    extern struct k_thread ecg_ppg_thread_data;
    extern struct k_thread eda_thread_data;
    extern struct k_thread tens_thread_data;
    extern struct k_thread algorithm_thread_data;

    crash_register_thread(&semg_thread_data,      "semg",      1000);
    crash_register_thread(&ecg_ppg_thread_data,   "ecg_ppg",   2000);
    crash_register_thread(&eda_thread_data,        "eda",       500);
    crash_register_thread(&algorithm_thread_data, "algorithm", 60000);

    LOG_INF("HEALTH-BAND Neuro boot complete");
    return 0;
}

K_THREAD_DEFINE(semg_thread,      8192, semg_thread_fn,      NULL, NULL, NULL, 6, 0, 0);
K_THREAD_DEFINE(ecg_ppg_thread,   4096, ecg_ppg_thread_fn,   NULL, NULL, NULL, 7, 0, 0);
K_THREAD_DEFINE(eda_thread,       2048, eda_thread_fn,        NULL, NULL, NULL, 8, 0, 0);
K_THREAD_DEFINE(tens_thread,      2048, tens_thread_fn,       NULL, NULL, NULL, 9, 0, 0);
K_THREAD_DEFINE(algorithm_thread, 8192, algorithm_thread_fn, NULL, NULL, NULL, 10, 0, 0);
