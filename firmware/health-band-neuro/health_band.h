/**
 * @file health_band.h
 * @brief HEALTH-BAND-Neuro — top-level firmware header
 *
 * Defines all shared data structures, constants, and public APIs for the
 * HEALTH-BAND-Neuro wearable platform.
 *
 * Hardware: Nordic nRF52840 (Cortex-M4F, 64 MHz)
 * Sensors : ADS1299 (14-ch EEG), ADS1292R (ECG), EMG-array (3-ch sEMG),
 *           TENS H-bridge, MAX32664 (SpO2/HR), BMI270 (IMU), u-blox M10 (GPS),
 *           MQ-3 (BAC fuel cell), BMP390 (pressure/temp)
 *
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 EmbeddedOS Foundation
 */

#ifndef HEALTH_BAND_H
#define HEALTH_BAND_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ─── Version ────────────────────────────────────────────────────────────── */
#define HBN_VERSION_MAJOR  1
#define HBN_VERSION_MINOR  4
#define HBN_VERSION_PATCH  0
#define HBN_VERSION_STR    "1.4.0"

/* ─── Hardware constants ─────────────────────────────────────────────────── */
#define HBN_EEG_CHANNELS       14    /**< ADS1299 channels (10-20 system)     */
#define HBN_SEMG_CHANNELS       3    /**< sEMG electrode pairs                */
#define HBN_ECG_LEADS           1    /**< Single-lead ECG (Lead II equivalent)*/
#define HBN_TENS_CHANNELS       2    /**< TENS output channels                */
#define HBN_SAMPLE_RATE_EEG   250    /**< Hz — EEG sample rate                */
#define HBN_SAMPLE_RATE_SEMG 1000    /**< Hz — sEMG sample rate               */
#define HBN_SAMPLE_RATE_ECG   500    /**< Hz — ECG sample rate                */
#define HBN_EEG_RESOLUTION     24    /**< bits — ADS1299 ADC resolution       */
#define HBN_SEMG_RESOLUTION    16    /**< bits — sEMG ADC resolution          */
#define HBN_ECG_RESOLUTION     24    /**< bits — ADS1292R ADC resolution      */
#define HBN_VREF_MV          2400    /**< mV — ADS1299 internal reference     */

/* ─── Buffer sizes ───────────────────────────────────────────────────────── */
#define HBN_EEG_FRAME_SAMPLES   250  /**< 1-second EEG frame at 250 Hz       */
#define HBN_SEMG_FRAME_SAMPLES  200  /**< 200ms sEMG frame at 1000 Hz        */
#define HBN_ECG_FRAME_SAMPLES   500  /**< 1-second ECG frame at 500 Hz       */
#define HBN_BLE_MTU             247  /**< BLE 5.0 DLE MTU bytes              */

/* ─── Return codes ───────────────────────────────────────────────────────── */
typedef enum {
    HBN_OK              =  0,
    HBN_ERR_INIT        = -1,
    HBN_ERR_TIMEOUT     = -2,
    HBN_ERR_OVERFLOW    = -3,
    HBN_ERR_UNDERFLOW   = -4,
    HBN_ERR_CHECKSUM    = -5,
    HBN_ERR_INVALID     = -6,
    HBN_ERR_BUSY        = -7,
    HBN_ERR_NOT_READY   = -8,
    HBN_ERR_CALIBRATION = -9,
} hbn_result_t;

/* ─── EEG ────────────────────────────────────────────────────────────────── */

/** EEG channel labels (10-20 international system) */
typedef enum {
    EEG_CH_FP1 = 0, EEG_CH_FP2, EEG_CH_F3, EEG_CH_F4,
    EEG_CH_C3,      EEG_CH_C4,  EEG_CH_P3, EEG_CH_P4,
    EEG_CH_O1,      EEG_CH_O2,  EEG_CH_F7, EEG_CH_F8,
    EEG_CH_T3,      EEG_CH_T4,
    EEG_CH_COUNT = HBN_EEG_CHANNELS
} eeg_channel_t;

/** Raw EEG sample — 14 channels, 24-bit signed */
typedef struct {
    int32_t  ch[HBN_EEG_CHANNELS];  /**< Raw ADC counts (24-bit, sign-extended) */
    uint32_t timestamp_us;           /**< Microsecond timestamp                  */
    uint8_t  status;                 /**< ADS1299 status byte                    */
} eeg_sample_t;

/** EEG frequency band power (µV²) */
typedef struct {
    float delta;   /**< 0.5–4 Hz   */
    float theta;   /**< 4–8 Hz     */
    float alpha;   /**< 8–13 Hz    */
    float beta;    /**< 13–30 Hz   */
    float gamma;   /**< 30–100 Hz  */
} eeg_band_power_t;

/** EEG mental state classification */
typedef enum {
    EEG_STATE_UNKNOWN   = 0,
    EEG_STATE_RELAXED   = 1,
    EEG_STATE_FOCUSED   = 2,
    EEG_STATE_STRESSED  = 3,
    EEG_STATE_DROWSY    = 4,
    EEG_STATE_SEIZURE   = 5,   /**< Emergency: triggers SOS alert */
} eeg_mental_state_t;

/* ─── sEMG ───────────────────────────────────────────────────────────────── */

/** sEMG gesture classification */
typedef enum {
    SEMG_GESTURE_REST    = 0,
    SEMG_GESTURE_FIST    = 1,
    SEMG_GESTURE_OPEN    = 2,
    SEMG_GESTURE_PINCH   = 3,
    SEMG_GESTURE_POINT   = 4,
    SEMG_GESTURE_THUMBUP = 5,
    SEMG_GESTURE_WAVEUP  = 6,
    SEMG_GESTURE_WAVEDN  = 7,
    SEMG_GESTURE_COUNT   = 8,
} semg_gesture_t;

/** sEMG sample — 3 channels, 16-bit */
typedef struct {
    int16_t  ch[HBN_SEMG_CHANNELS];  /**< Raw ADC counts                     */
    uint32_t timestamp_us;            /**< Microsecond timestamp              */
    float    rms[HBN_SEMG_CHANNELS]; /**< RMS amplitude per channel (mV)     */
} semg_sample_t;

/** sEMG classification result */
typedef struct {
    semg_gesture_t gesture;    /**< Detected gesture                         */
    float          confidence; /**< Classification confidence [0.0, 1.0]     */
    uint32_t       hold_ms;    /**< Duration gesture has been held (ms)       */
} semg_result_t;

/* ─── ECG / HRV ──────────────────────────────────────────────────────────── */

/** ECG sample — single lead, 24-bit */
typedef struct {
    int32_t  sample;          /**< Raw ADC count (24-bit, sign-extended)     */
    uint32_t timestamp_us;    /**< Microsecond timestamp                     */
    bool     lead_off;        /**< True if lead-off detected                 */
} ecg_sample_t;

/** HRV metrics computed from R-R intervals */
typedef struct {
    float    hr_bpm;          /**< Instantaneous heart rate (BPM)            */
    float    rmssd_ms;        /**< Root mean square of successive differences*/
    float    sdnn_ms;         /**< Standard deviation of NN intervals        */
    float    pnn50;           /**< Percentage of NN50 intervals              */
    float    lf_power;        /**< Low-frequency HRV power (0.04–0.15 Hz)   */
    float    hf_power;        /**< High-frequency HRV power (0.15–0.40 Hz)  */
    float    lf_hf_ratio;     /**< LF/HF ratio (sympathovagal balance)      */
    uint16_t rr_interval_ms;  /**< Last R-R interval (ms)                   */
    uint8_t  quality;         /**< Signal quality [0–100]                   */
} hrv_metrics_t;

/* ─── TENS ───────────────────────────────────────────────────────────────── */

/** TENS therapy mode */
typedef enum {
    TENS_MODE_OFF          = 0,
    TENS_MODE_PAIN_RELIEF  = 1,  /**< 80–150 Hz, 50–100 µs pulse width      */
    TENS_MODE_MUSCLE_STIM  = 2,  /**< 35–50 Hz, 200–300 µs pulse width      */
    TENS_MODE_TDCS         = 3,  /**< DC offset, 1–2 mA constant current    */
    TENS_MODE_RECOVERY     = 4,  /**< 2–4 Hz, burst mode                    */
    TENS_MODE_CUSTOM       = 5,  /**< User-defined parameters               */
} tens_mode_t;

/** TENS waveform parameters */
typedef struct {
    tens_mode_t mode;
    uint16_t    frequency_hz;    /**< Pulse frequency (1–200 Hz)            */
    uint16_t    pulse_width_us;  /**< Pulse width (50–500 µs)               */
    uint16_t    amplitude_ma;    /**< Peak current amplitude (0–80 mA)      */
    uint16_t    duration_s;      /**< Session duration (0 = continuous)     */
    bool        biphasic;        /**< True = biphasic symmetric waveform    */
} tens_params_t;

/* ─── BAC (Breathalyzer) ─────────────────────────────────────────────────── */

/** BAC measurement result */
typedef struct {
    float    bac_percent;     /**< Blood alcohol content (%BAC)             */
    float    raw_voltage_mv;  /**< Raw fuel cell voltage (mV)               */
    float    temperature_c;   /**< Sensor temperature for compensation (°C) */
    bool     valid;           /**< True if measurement is valid             */
    uint32_t timestamp_us;    /**< Measurement timestamp                    */
} bac_result_t;

/* ─── GPS ────────────────────────────────────────────────────────────────── */

/** GPS fix data */
typedef struct {
    double   latitude;        /**< Decimal degrees (positive = North)       */
    double   longitude;       /**< Decimal degrees (positive = East)        */
    float    altitude_m;      /**< Altitude above MSL (meters)              */
    float    speed_kmh;       /**< Ground speed (km/h)                      */
    float    heading_deg;     /**< True heading (degrees)                   */
    float    hdop;            /**< Horizontal dilution of precision         */
    uint8_t  satellites;      /**< Number of satellites in use              */
    bool     fix_valid;       /**< True if GPS fix is valid                 */
    uint32_t timestamp_us;    /**< Fix timestamp                            */
} gps_fix_t;

/* ─── IMU / Fall Detection ───────────────────────────────────────────────── */

/** IMU sample (BMI270) */
typedef struct {
    int16_t  accel_x;         /**< Accelerometer X (raw, ±16g range)        */
    int16_t  accel_y;         /**< Accelerometer Y                          */
    int16_t  accel_z;         /**< Accelerometer Z                          */
    int16_t  gyro_x;          /**< Gyroscope X (raw, ±2000 dps range)       */
    int16_t  gyro_y;          /**< Gyroscope Y                              */
    int16_t  gyro_z;          /**< Gyroscope Z                              */
    uint32_t timestamp_us;    /**< Sample timestamp                         */
} imu_sample_t;

/** Fall detection event */
typedef struct {
    bool     fall_detected;   /**< True if fall event detected              */
    float    impact_g;        /**< Peak impact acceleration (g)             */
    uint32_t timestamp_us;    /**< Event timestamp                          */
    gps_fix_t location;       /**< GPS location at time of fall             */
} fall_event_t;

/* ─── System health ──────────────────────────────────────────────────────── */

/** Device health status */
typedef struct {
    uint8_t  battery_percent;  /**< Battery level [0–100]                  */
    float    battery_voltage;  /**< Battery voltage (V)                    */
    float    temperature_c;    /**< MCU die temperature (°C)               */
    uint32_t uptime_s;         /**< Seconds since last reset               */
    bool     charging;         /**< True if USB charging                   */
    bool     ble_connected;    /**< True if BLE central connected          */
} device_health_t;

/* ─── Public API ─────────────────────────────────────────────────────────── */

hbn_result_t hbn_init(void);
hbn_result_t hbn_start(void);
hbn_result_t hbn_stop(void);
void         hbn_process(void);

/* EEG */
hbn_result_t eeg_init(void);
hbn_result_t eeg_start_acquisition(void);
hbn_result_t eeg_stop_acquisition(void);
hbn_result_t eeg_read_sample(eeg_sample_t *out);
hbn_result_t eeg_compute_band_power(const int32_t *samples, size_t n,
                                     eeg_band_power_t *out);
eeg_mental_state_t eeg_classify_state(const eeg_band_power_t *bands);

/* sEMG */
hbn_result_t semg_init(void);
hbn_result_t semg_read_sample(semg_sample_t *out);
hbn_result_t semg_classify_gesture(const semg_sample_t *samples, size_t n,
                                    semg_result_t *out);

/* ECG / HRV */
hbn_result_t ecg_init(void);
hbn_result_t ecg_read_sample(ecg_sample_t *out);
hbn_result_t ecg_compute_hrv(const uint16_t *rr_ms, size_t n,
                               hrv_metrics_t *out);
bool         ecg_detect_r_peak(const int32_t *samples, size_t n,
                                uint32_t *r_idx);

/* TENS */
hbn_result_t tens_init(void);
hbn_result_t tens_start(const tens_params_t *params);
hbn_result_t tens_stop(void);
hbn_result_t tens_set_amplitude(uint16_t amplitude_ma);

/* BAC */
hbn_result_t bac_init(void);
hbn_result_t bac_measure(bac_result_t *out);

/* GPS */
hbn_result_t gps_init(void);
hbn_result_t gps_get_fix(gps_fix_t *out);
hbn_result_t gps_parse_nmea(const char *sentence, gps_fix_t *out);

/* IMU */
hbn_result_t imu_init(void);
hbn_result_t imu_read_sample(imu_sample_t *out);
bool         imu_detect_fall(const imu_sample_t *samples, size_t n,
                              fall_event_t *out);

/* BLE */
hbn_result_t ble_stack_init(void);
hbn_result_t ble_advertise_start(void);
hbn_result_t ble_notify_eeg(const eeg_sample_t *sample);
hbn_result_t ble_notify_hrv(const hrv_metrics_t *hrv);
hbn_result_t ble_notify_gesture(const semg_result_t *gesture);

/* Power */
hbn_result_t power_manager_init(void);
device_health_t power_get_health(void);
void         power_enter_sleep(uint32_t duration_ms);

#ifdef __cplusplus
}
#endif

#endif /* HEALTH_BAND_H */
