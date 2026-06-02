/*
 * EoS Health — Power Management Module
 * File: firmware/shared/power/power_manager.c
 *
 * Manages all power states, PMIC (MAX77734), battery fuel gauge,
 * dynamic sensor duty cycling, and thermal protection.
 *
 * Power states:
 *   ACTIVE    — All sensors running, BLE connected, full CPU
 *   IDLE      — BLE connected, sensors at reduced rate, CPU at 16 MHz
 *   SLEEP     — BLE advertising only, sensors paused, CPU in WFI
 *   DEEP_SLEEP — BLE off, RTC only, sensors off, CPU in System OFF
 *   CHARGING  — NFC/USB charging active, sensors paused
 *
 * Target average currents (HEALTH-RING Ultra):
 *   ACTIVE:     3.5 mA  (ECG 512Hz + PPG 100Hz + BLE connected)
 *   IDLE:       1.2 mA  (ECG 128Hz + PPG 25Hz + BLE connected)
 *   SLEEP:      180 µA  (BLE advertising 1s interval)
 *   DEEP_SLEEP: 8 µA    (RTC wake every 30s)
 */

#include <zephyr/kernel.h>
#include <zephyr/pm/pm.h>
#include <zephyr/pm/device.h>
#include <zephyr/drivers/i2c.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/logging/log.h>
#include "power_manager.h"

LOG_MODULE_REGISTER(power_manager, LOG_LEVEL_INF);

/* ── MAX77734 PMIC Register Map ────────────────────────────── */
#define MAX77734_I2C_ADDR       0x48
#define MAX77734_REG_STAT_CHG_A 0x01
#define MAX77734_REG_STAT_CHG_B 0x02
#define MAX77734_REG_INT_CHG    0x03
#define MAX77734_REG_INT_M_CHG  0x07
#define MAX77734_REG_CHG_CNFG_00 0x18
#define MAX77734_REG_CHG_CNFG_01 0x19
#define MAX77734_REG_CHG_CNFG_02 0x1A
#define MAX77734_REG_CHG_CNFG_06 0x1E
#define MAX77734_REG_CHG_CNFG_09 0x21
#define MAX77734_REG_CHG_CNFG_10 0x22
#define MAX77734_REG_CNFG_LDO1  0x48
#define MAX77734_REG_CNFG_LDO2  0x49
#define MAX77734_REG_CNFG_BUCK  0x4A

/* Charge current: 0x04 = 20mA (solid-state LiPo safe rate) */
#define MAX77734_CHG_CC_20MA    0x04
/* Charge voltage: 0x1C = 4.20V */
#define MAX77734_CHG_CV_4V20    0x1C

/* ── Battery voltage → SOC lookup table (solid-state LiPo) ── */
static const struct {
    uint16_t mv;
    uint8_t  pct;
} batt_lut[] = {
    {4200, 100}, {4150, 95}, {4100, 90}, {4050, 85},
    {4000, 80},  {3950, 73}, {3900, 65}, {3850, 57},
    {3800, 48},  {3750, 39}, {3700, 30}, {3650, 21},
    {3600, 13},  {3550, 7},  {3500, 3},  {3400, 0},
};

/* ── State ─────────────────────────────────────────────────── */
static struct {
    power_state_t   state;
    uint8_t         battery_pct;
    uint16_t        battery_mv;
    bool            charging;
    bool            charge_complete;
    int8_t          temp_celsius;
    uint32_t        active_since_ms;
    uint32_t        idle_timeout_ms;
    uint32_t        sleep_timeout_ms;
    power_event_cb_t event_cb;
} pwr;

static const struct device *i2c_dev;

/* ── PMIC I2C helpers ───────────────────────────────────────── */
static int pmic_write(uint8_t reg, uint8_t val)
{
    uint8_t buf[2] = {reg, val};
    return i2c_write(i2c_dev, buf, sizeof(buf), MAX77734_I2C_ADDR);
}

static int pmic_read(uint8_t reg, uint8_t *val)
{
    return i2c_write_read(i2c_dev, MAX77734_I2C_ADDR, &reg, 1, val, 1);
}

/* ── Initialization ─────────────────────────────────────────── */
int power_manager_init(power_event_cb_t cb)
{
    i2c_dev = DEVICE_DT_GET(DT_NODELABEL(i2c1));
    if (!device_is_ready(i2c_dev)) {
        LOG_ERR("I2C1 not ready");
        return -ENODEV;
    }

    /* Configure MAX77734:
     * - Charge current: 20 mA (safe for 15–45 mAh solid-state LiPo)
     * - Charge voltage: 4.20 V
     * - LDO1: 1.8 V (MCU + sensors)
     * - LDO2: 3.3 V (LED drivers)
     * - Enable NFC charging input (CHGIN2 = secondary input)
     */
    pmic_write(MAX77734_REG_CHG_CNFG_02, MAX77734_CHG_CC_20MA);
    pmic_write(MAX77734_REG_CHG_CNFG_06, MAX77734_CHG_CV_4V20);
    pmic_write(MAX77734_REG_CNFG_LDO1, 0x1C); /* 1.8V, enabled */
    pmic_write(MAX77734_REG_CNFG_LDO2, 0x24); /* 3.3V, enabled */
    pmic_write(MAX77734_REG_CHG_CNFG_00, 0x05); /* Enable charger + NFC input */

    pwr.event_cb        = cb;
    pwr.state           = POWER_STATE_ACTIVE;
    pwr.idle_timeout_ms = 30000;   /* 30s no activity → IDLE */
    pwr.sleep_timeout_ms = 120000; /* 2min idle → SLEEP */

    power_update_battery();

    LOG_INF("Power manager init: batt=%u%% (%umV) charging=%d",
            pwr.battery_pct, pwr.battery_mv, pwr.charging);
    return 0;
}

/* ── Battery measurement ────────────────────────────────────── */
void power_update_battery(void)
{
    /* Read VBATT via nRF52840 SAADC (AIN configured in DTS) */
    /* 12-bit ADC, 3.6V reference, 1/6 gain → 1 LSB = 0.879 mV */
    uint16_t adc_raw = nrf_adc_read_vbatt(); /* device-specific HAL */
    pwr.battery_mv = (uint16_t)((adc_raw * 3600UL * 6UL) / 4096UL);

    /* Look up SOC from voltage table */
    pwr.battery_pct = 0;
    for (int i = 0; i < ARRAY_SIZE(batt_lut) - 1; i++) {
        if (pwr.battery_mv >= batt_lut[i + 1].mv) {
            /* Linear interpolation between table entries */
            uint32_t range_mv  = batt_lut[i].mv - batt_lut[i + 1].mv;
            uint32_t range_pct = batt_lut[i].pct - batt_lut[i + 1].pct;
            uint32_t delta_mv  = pwr.battery_mv - batt_lut[i + 1].mv;
            pwr.battery_pct = batt_lut[i + 1].pct +
                              (uint8_t)((delta_mv * range_pct) / range_mv);
            break;
        }
    }

    /* Read charging status from PMIC */
    uint8_t stat;
    pmic_read(MAX77734_REG_STAT_CHG_B, &stat);
    pwr.charging        = (stat & 0x08) != 0; /* CHG bit */
    pwr.charge_complete = (stat & 0x20) != 0; /* CHGDONE bit */

    /* Critical battery warning */
    if (pwr.battery_pct <= 5 && !pwr.charging) {
        LOG_WRN("Critical battery: %u%%", pwr.battery_pct);
        if (pwr.event_cb) pwr.event_cb(POWER_EVENT_BATTERY_CRITICAL);
    }
}

/* ── Power state transitions ────────────────────────────────── */
int power_set_state(power_state_t new_state)
{
    if (pwr.state == new_state) return 0;

    LOG_INF("Power state: %d → %d", pwr.state, new_state);
    power_state_t old_state = pwr.state;
    pwr.state = new_state;

    switch (new_state) {
    case POWER_STATE_ACTIVE:
        /* Restore full sensor rates */
        sensor_set_rate(SENSOR_RATE_FULL);
        ble_set_conn_interval(BLE_INTERVAL_15MS);
        pm_device_action_run(DEVICE_DT_GET(DT_NODELABEL(cpu)), PM_DEVICE_ACTION_RESUME);
        break;

    case POWER_STATE_IDLE:
        /* Reduce sensor rates to save power */
        sensor_set_rate(SENSOR_RATE_LOW);
        ble_set_conn_interval(BLE_INTERVAL_100MS);
        break;

    case POWER_STATE_SLEEP:
        /* Pause sensors, BLE advertising only */
        sensor_set_rate(SENSOR_RATE_OFF);
        ble_enter_advertising_only();
        /* Set nRF52840 to WFI (Zephyr PM state: SUSPEND_TO_IDLE) */
        pm_state_force(0, &(struct pm_state_info){PM_STATE_SUSPEND_TO_IDLE, 0, 0});
        break;

    case POWER_STATE_DEEP_SLEEP:
        /* BLE off, RTC wake only */
        sensor_set_rate(SENSOR_RATE_OFF);
        ble_disable();
        /* Configure RTC wake in 30s */
        rtc_set_wakeup(30);
        /* nRF52840 System OFF — only RTC or GPIO can wake */
        pm_state_force(0, &(struct pm_state_info){PM_STATE_SOFT_OFF, 0, 0});
        break;

    case POWER_STATE_CHARGING:
        sensor_set_rate(SENSOR_RATE_OFF);
        break;

    default:
        break;
    }

    if (pwr.event_cb) pwr.event_cb(POWER_EVENT_STATE_CHANGE);
    return 0;
}

/* ── Periodic power management thread ──────────────────────── */
static void power_thread_fn(void *a, void *b, void *c)
{
    while (1) {
        k_sleep(K_SECONDS(30));

        power_update_battery();

        /* Auto-transition based on activity timeout */
        uint32_t now = k_uptime_get_32();
        uint32_t idle_ms = now - pwr.active_since_ms;

        if (pwr.state == POWER_STATE_ACTIVE && idle_ms > pwr.idle_timeout_ms) {
            power_set_state(POWER_STATE_IDLE);
        } else if (pwr.state == POWER_STATE_IDLE && idle_ms > pwr.sleep_timeout_ms) {
            power_set_state(POWER_STATE_SLEEP);
        }

        /* Thermal protection: if temp > 45°C, throttle sensors */
        if (pwr.temp_celsius > 45) {
            LOG_WRN("Thermal throttle: %d°C", pwr.temp_celsius);
            sensor_set_rate(SENSOR_RATE_LOW);
        }
    }
}

K_THREAD_DEFINE(power_thread, 1024, power_thread_fn, NULL, NULL, NULL, 3, 0, 0);

/* ── Accessors ─────────────────────────────────────────────── */
uint8_t       power_get_battery_percent(void) { return pwr.battery_pct; }
uint16_t      power_get_battery_mv(void)      { return pwr.battery_mv; }
bool          power_is_charging(void)          { return pwr.charging; }
power_state_t power_get_state(void)            { return pwr.state; }

void power_activity_event(void)
{
    pwr.active_since_ms = k_uptime_get_32();
    if (pwr.state != POWER_STATE_ACTIVE && pwr.state != POWER_STATE_CHARGING) {
        power_set_state(POWER_STATE_ACTIVE);
    }
}
