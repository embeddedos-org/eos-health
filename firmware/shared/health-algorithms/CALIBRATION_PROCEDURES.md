# EoS Health — Sensor Calibration Procedures

**Version:** 1.0 | **Applies to:** All 4 EoS Health devices

Calibration is performed at three stages: factory calibration (per unit), user-initiated calibration (personalized baseline), and ongoing drift correction (continuous). This document covers all three stages for every sensor.

---

## Stage 1 — Factory Calibration (Per Unit, Production Line)

Factory calibration establishes the per-unit offset and gain for every sensor. Values are stored in the provisioning partition (NVM) and loaded at boot.

### ECG Calibration (MAX30001)

The ECG front-end is calibrated using an internal precision voltage reference. The MAX30001 includes a built-in calibration voltage (CAL_EN_VCAL) that injects a known signal into the input path.

```
Procedure:
1. Enable internal calibration: write 0x01 to MAX30001 CNFCAL register
2. Set VCAL = 0.25 mV (known reference)
3. Measure 10 seconds of calibration signal at 512 Hz
4. Compute: gain = 0.25 mV / measured_amplitude
5. Compute: offset = mean(measured_signal) - 0
6. Store gain and offset in provisioning NVM
7. Disable calibration: write 0x00 to CNFCAL

Pass criteria: gain within ±5% of nominal, offset < ±10 µV
```

### PPG Calibration (MAX30102 / MAX86176)

PPG calibration sets the LED drive current to achieve a target DC level of 100,000 ADC counts (mid-scale), ensuring consistent signal amplitude across units.

```
Procedure:
1. Place device on calibration phantom (optical diffuser, 15mm thick)
2. Start with LED current = 10 mA
3. Measure DC level for 1 second
4. Binary search LED current until DC = 100,000 ± 5,000 counts
5. Store optimal LED current for red, IR, and 1300nm in NVM
6. Compute and store: ppg_gain = 100000 / measured_dc

Pass criteria: LED current 5–50 mA, DC level 95,000–105,000 counts
```

### Temperature Calibration (MAX30208)

```
Procedure:
1. Place device in temperature-controlled bath at 25.0°C ± 0.1°C
2. Wait 5 minutes for thermal equilibration
3. Measure 60 seconds of temperature data
4. Compute: offset = 25.0 - mean(measured_temp)
5. Store offset in NVM

Pass criteria: offset < ±0.5°C, post-calibration accuracy ±0.1°C
```

### IMU Calibration (LSM6DSO)

```
Procedure:
1. Place device flat on precision granite surface (±0.01°)
2. Run LSM6DSO built-in self-test (write 0x01 to CTRL5_C)
3. Verify accelerometer output: X=0g, Y=0g, Z=+1g ± 0.1g
4. Rotate to each of 6 faces, record offsets
5. Compute 6-point calibration matrix
6. Store calibration matrix in NVM

Pass criteria: All 6 faces within ±0.05g of expected
```

### Glucose Electrode Calibration (HEALTH-LAB only, LMP91000)

```
Procedure:
1. Prepare 3 reference solutions: 50, 100, 200 mg/dL glucose
2. Apply each solution to electrode for 5 minutes
3. Measure steady-state current for each concentration
4. Fit linear model: current_nA = slope × glucose_mgdL + intercept
5. Store slope and intercept in NVM

Pass criteria: R² > 0.995, slope 0.5–2.0 nA/(mg/dL)
```

---

## Stage 2 — User-Initiated Calibration (Personalized Baseline)

### Blood Pressure Calibration (HEALTH-RING Ultra)

PTT-based blood pressure requires a one-time calibration against a reference cuff measurement. This is performed during the app onboarding.

```
User procedure (guided by app):
1. Sit quietly for 5 minutes
2. Measure BP with validated cuff (app prompts user)
3. Enter cuff readings (SBP, DBP) in app
4. App sends calibration values to device via BLE
5. Device stores: SBP_offset = cuff_SBP - model_SBP
                  DBP_offset = cuff_DBP - model_DBP

Recalibration: recommended every 4 weeks or after significant
weight change (>5 kg)

Accuracy post-calibration: ±5 mmHg SBP, ±4 mmHg DBP (AAMI SP10)
```

### HbA1c Calibration (HEALTH-RING Ultra)

```
User procedure:
1. User provides one lab HbA1c result (from blood test)
2. Enter value in app within 7 days of lab test
3. App computes: offset = lab_value - model_estimate
4. Device applies offset to all future estimates

Recalibration: recommended every 3 months (aligned with lab test schedule)
Accuracy post-calibration: ±0.5% HbA1c
```

### VO2max Calibration

```
User procedure (guided by app):
1. Enter: age, sex, weight, height
2. Perform 5-minute brisk walk/run at steady pace
3. App records HR and speed from IMU
4. VO2max estimated from submaximal test
5. Optional: enter lab VO2max for higher accuracy

No hardware calibration required — purely algorithmic
```

---

## Stage 3 — Ongoing Drift Correction (Continuous)

### PPG Drift Correction

PPG signal amplitude drifts due to skin contact changes, sweat, and LED aging. The firmware applies continuous drift correction using a slow-moving baseline tracker.

```c
/* Drift correction: subtract 60-second moving average */
static float ppg_baseline_tracker = 0.0f;
ppg_baseline_tracker = 0.9998f * ppg_baseline_tracker + 0.0002f * ppg_raw;
float ppg_corrected = ppg_raw - ppg_baseline_tracker + 100000.0f;
```

### Temperature Drift Correction

Skin temperature drifts with ambient temperature and activity. The firmware applies a correction based on ambient temperature (BME688) and activity level (IMU).

```c
float temp_corrected = temp_raw + temp_ambient_correction(ambient_c, activity);
```

### Glucose Electrode Drift Correction (HEALTH-LAB)

Enzyme-based glucose electrodes drift over their 14-day lifetime due to enzyme denaturation and biofouling. The SCBN (Self-Calibrating Biosensor Network) Kalman filter corrects for this drift using the 3-reference electrode architecture.

```
Reference electrode 1: Glucose oxidase (measures glucose + background)
Reference electrode 2: No enzyme (measures background only)
Reference electrode 3: Known glucose standard (internal calibrant)

Drift correction: glucose_corrected = (electrode1 - electrode2) × gain_factor
gain_factor updated every 30 minutes using electrode3 reference
```

---

## Calibration Data Format (NVM)

All calibration data is stored in the provisioning partition at address `0x000F4000` in the following format:

```c
typedef struct {
    uint32_t magic;             /* 0xEOS12345 */
    uint8_t  version;           /* Calibration data version */
    char     serial[16];        /* Device serial number */
    
    /* ECG */
    float    ecg_gain;
    float    ecg_offset_uv;
    
    /* PPG */
    uint8_t  ppg_led_current_red_ma;
    uint8_t  ppg_led_current_ir_ma;
    uint8_t  ppg_led_current_1300nm_ma;
    float    ppg_gain;
    
    /* Temperature */
    float    temp_offset_c;
    
    /* IMU */
    float    imu_cal_matrix[3][3];
    float    imu_offset[3];
    
    /* Blood pressure (user-calibrated) */
    float    bp_sbp_offset_mmhg;
    float    bp_dbp_offset_mmhg;
    
    /* HbA1c (user-calibrated) */
    float    hba1c_offset_pct;
    
    /* Glucose (HEALTH-LAB only) */
    float    glucose_slope;
    float    glucose_intercept;
    
    /* Metadata */
    uint32_t factory_cal_timestamp;
    uint32_t user_cal_timestamp;
    uint32_t crc32;             /* CRC of all above fields */
} eos_calibration_t;
```
