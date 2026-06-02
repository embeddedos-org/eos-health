/*
 * EoS Health — Power Management Header
 * File: firmware/shared/power/power_manager.h
 */

#ifndef EOS_POWER_MANAGER_H
#define EOS_POWER_MANAGER_H

#include <stdint.h>
#include <stdbool.h>

typedef enum {
    POWER_STATE_ACTIVE = 0,
    POWER_STATE_IDLE,
    POWER_STATE_SLEEP,
    POWER_STATE_DEEP_SLEEP,
    POWER_STATE_CHARGING,
} power_state_t;

typedef enum {
    POWER_EVENT_STATE_CHANGE = 0,
    POWER_EVENT_BATTERY_LOW,       /* < 20% */
    POWER_EVENT_BATTERY_CRITICAL,  /* < 5% */
    POWER_EVENT_CHARGING_START,
    POWER_EVENT_CHARGING_COMPLETE,
    POWER_EVENT_THERMAL_THROTTLE,
} power_event_t;

typedef void (*power_event_cb_t)(power_event_t event);

/* Sensor rate levels (used by power manager to duty-cycle sensors) */
typedef enum {
    SENSOR_RATE_OFF  = 0,
    SENSOR_RATE_LOW  = 1,  /* ECG 128Hz, PPG 25Hz, IMU 26Hz */
    SENSOR_RATE_FULL = 2,  /* ECG 512Hz, PPG 100Hz, IMU 104Hz */
} sensor_rate_t;

/* BLE connection intervals */
#define BLE_INTERVAL_15MS   12   /* 12 × 1.25ms = 15ms */
#define BLE_INTERVAL_100MS  80   /* 80 × 1.25ms = 100ms */

int           power_manager_init(power_event_cb_t cb);
void          power_update_battery(void);
int           power_set_state(power_state_t new_state);
void          power_activity_event(void);

uint8_t       power_get_battery_percent(void);
uint16_t      power_get_battery_mv(void);
bool          power_is_charging(void);
power_state_t power_get_state(void);

/* HAL — device-specific implementation */
uint16_t nrf_adc_read_vbatt(void);
void     sensor_set_rate(sensor_rate_t rate);
void     rtc_set_wakeup(uint32_t seconds);

#endif /* EOS_POWER_MANAGER_H */
