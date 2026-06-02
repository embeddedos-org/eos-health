/*
 * EoS Health — HEALTH-LAB Device Firmware
 * File: firmware/health-lab/src/main/main.c
 *
 * Main application entry point for HEALTH-LAB biosensor patch.
 * Tier determined at runtime from provisioning data.
 *
 * Hardware:
 *   Base:  nRF52833 + LMP91000 (4-channel amperometric) + MAX30101 (PPG/temp)
 *   Ultra: nRF52840 + LMP91002 (7-channel) + MAX30101 + iontophoresis driver
 *
 * Patch lifetime: 7 days (base) / 14 days (ultra)
 * Adhesive: Medical-grade silicone adhesive (ISO 10993 biocompatible)
 * Water resistance: IPX7 (1m, 30min)
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include "../../shared/ota/ota_manager.h"
#include "../../shared/power/power_manager.h"
#include "../../shared/crash-recovery/crash_recovery.h"
#include "../../shared/data-buffer/data_buffer.h"
#include "../../shared/ble-stack/ble_manager.h"
#include "../../shared/provisioning/provisioning.h"
#include "../../shared/health-algorithms/glucose/glucose_algorithm.h"
#include "../../shared/health-algorithms/sensor-fusion/sensor_fusion.h"
#include "../sensors/lab_sensors.h"
#include "../ble/lab_ble_services.h"

LOG_MODULE_REGISTER(main, LOG_LEVEL_INF);

static bool is_ultra = false;

/* ── Biosensor sampling thread (every 5 minutes) ────────────── */
static void biosensor_thread_fn(void *a, void *b, void *c)
{
    glucose_cal_t glu_cal;
    const prov_calibration_t *prov_cal = provisioning_get_calibration();
    if (prov_cal) {
        glu_cal.glucose_sensitivity  = (float)prov_cal->glucose_slope / 100.0f;
        glu_cal.lactate_sensitivity  = 45.0f;
        glu_cal.cortisol_sensitivity = 0.8f;
        glu_cal.sodium_e0            = 0.197f;
        glu_cal.potassium_e0         = 0.197f;
        glucose_algorithm_init(&glu_cal);
    } else {
        glucose_algorithm_init(NULL);
    }

    /* Iontophoresis warm-up: 10 min at 0.3 mA to enhance sweat extraction */
    if (is_ultra) {
        LOG_INF("Iontophoresis warm-up starting (10 min)");
        lab_sensors_iontophoresis_start(300, 10 * 60);
    }

    while (1) {
        k_sleep(K_SECONDS(300)); /* 5-minute sampling interval */

        /* Read all biosensor channels */
        glucose_raw_t raw;
        lab_sensors_read_all(&raw, is_ultra);

        /* Process through algorithm */
        glucose_process_reading(&raw);

        const eos_glucose_result_t *result = glucose_get_result();

        /* Buffer to NVM (critical for glucose alerts) */
        uint8_t flags = DATA_FLAG_CRITICAL;
        if (result->alert != GLUCOSE_ALERT_NONE) flags |= DATA_FLAG_ALERT;
        data_buffer_write(SENSOR_TYPE_GLUCOSE, flags,
                          (const uint8_t *)result, sizeof(*result));

        /* Send via BLE if connected */
        if (ble_is_connected()) {
            lab_ble_notify_glucose(result);
        }

        /* Trigger iontophoresis pulse every 30 min (ultra only) */
        static uint32_t ionto_tick = 0;
        if (is_ultra && ++ionto_tick % 6 == 0) {
            lab_sensors_iontophoresis_pulse(300, 60); /* 0.3mA for 60s */
        }

        crash_thread_kick(k_current_get());
    }
}

/* ── PPG + temperature thread (every 10 seconds) ────────────── */
static void ppg_thread_fn(void *a, void *b, void *c)
{
    while (1) {
        k_sleep(K_SECONDS(10));

        /* Read skin temperature */
        float temp_c = lab_sensors_read_temp();

        /* Read PPG for HR (patch on upper arm) */
        ppg_sample_t ppg;
        lab_sensors_read_ppg(&ppg);
        spo2_process_sample(ppg.red, ppg.ir, 0.0f);

        /* Update power state based on activity */
        if (ppg.accel_mag > 0.5f) power_activity_event();

        crash_thread_kick(k_current_get());
    }
}

/* ── Patch lifetime management ──────────────────────────────── */
static void patch_lifetime_check(void)
{
    /* Read patch activation timestamp from NVM */
    uint32_t activated_at = lab_sensors_get_activation_time();
    uint32_t now_s = k_uptime_get_32() / 1000;
    uint32_t age_days = (now_s - activated_at) / 86400;

    uint8_t max_days = is_ultra ? 14 : 7;

    if (age_days >= max_days) {
        LOG_WRN("Patch expired (%u days) — alerting user", age_days);
        /* Send BLE notification */
        lab_ble_notify_patch_expired(age_days);
        /* Enter low-power mode */
        power_set_state(POWER_STATE_SLEEP);
    } else if (age_days >= max_days - 1) {
        LOG_INF("Patch expiring in < 24h");
        lab_ble_notify_patch_expiring(max_days - age_days);
    }
}

/* ── Main ───────────────────────────────────────────────────── */
int main(void)
{
    LOG_INF("=== EoS HEALTH-LAB Firmware v1.0.0 ===");

    crash_recovery_init();

    int rc = provisioning_load();
    if (rc) {
        LOG_ERR("Provisioning not found — entering factory mode");
        lab_ble_start_factory_mode();
        return 0;
    }
    provisioning_apply();

    is_ultra = (provisioning_get_device_type() == DEVICE_TYPE_HEALTH_LAB &&
                provisioning_get_calibration()->glucose_slope > 0);

    LOG_INF("Device: HEALTH-LAB %s (serial=%s)",
            is_ultra ? "Ultra" : "Base",
            provisioning_get_serial());

    power_manager_init(NULL);
    data_buffer_init();
    ble_manager_init(NULL);
    lab_ble_services_init(is_ultra);
    spo2_algorithm_init();
    sensor_fusion_init();

    ota_confirm_image();

    /* Check patch lifetime */
    patch_lifetime_check();

    /* Register threads */
    extern struct k_thread biosensor_thread_data;
    extern struct k_thread ppg_thread_data;
    crash_register_thread(&biosensor_thread_data, "biosensor", 600000); /* 10 min */
    crash_register_thread(&ppg_thread_data,       "ppg",       30000);

    LOG_INF("HEALTH-LAB boot complete");
    return 0;
}

K_THREAD_DEFINE(biosensor_thread, 4096, biosensor_thread_fn, NULL, NULL, NULL, 8, 0, 0);
K_THREAD_DEFINE(ppg_thread,       2048, ppg_thread_fn,       NULL, NULL, NULL, 9, 0, 0);
