# IEC 62304 Software Traceability Matrix
## EoS Health Platform — All 4 Devices
**Document ID:** EOS-SW-TRACE-001 | **Version:** 1.0 | **Date:** 2026-06-02  
**Classification:** Safety Class B (HEALTH-KEY ULTRA, HEALTH-RING, HEALTH-LAB) | Class C (HEALTH-BAND Neuro — ECG/TENS)

---

## 1. Purpose

This traceability matrix satisfies IEC 62304:2015+AMD1:2015 §5.1.1 (software development planning) and §8 (software configuration management) by providing bidirectional traceability from:

**System Requirements → Software Requirements → Software Architecture → Software Units → Verification Tests → Risk Controls**

---

## 2. Traceability Matrix — HEALTH-KEY ULTRA (Class B)

| Req ID | System Requirement | SW Requirement | Architecture Component | Source File | Test ID | Risk Control |
|--------|-------------------|----------------|----------------------|-------------|---------|--------------|
| SYS-HKU-001 | Measure SpO₂ ±2% ARMS | SW-HKU-001: PPG acquisition at 100 Hz, 18-bit ADC | PPG Signal Chain | `firmware/health-key-ultra/src/ppg/ppg_driver.c` | TEST-HKU-001 | ISO14971-HKU-R03 |
| SYS-HKU-002 | Measure HR ±2 bpm | SW-HKU-002: HR algorithm from PPG, 5s window | HR Algorithm | `firmware/shared/health-algorithms/hr_algorithm.c` | TEST-HKU-002 | ISO14971-HKU-R04 |
| SYS-HKU-003 | Measure HRV (RMSSD) | SW-HKU-003: R-peak detection, inter-beat interval | HRV Algorithm | `firmware/shared/health-algorithms/hrv_algorithm.c` | TEST-HKU-003 | — |
| SYS-HKU-004 | Measure bioimpedance | SW-HKU-004: AD5940 control, 1kHz–100kHz sweep | Bioimpedance Driver | `firmware/health-key-ultra/src/bioimpedance/bia_driver.c` | TEST-HKU-004 | ISO14971-HKU-R05 |
| SYS-HKU-005 | Measure skin temperature ±0.2°C | SW-HKU-005: MAX30208 I²C read, calibration LUT | Temperature Driver | `firmware/health-key-ultra/src/temperature/temp_driver.c` | TEST-HKU-005 | — |
| SYS-HKU-006 | BLE 5.3 data transmission | SW-HKU-006: GATT profile, encrypted notifications | BLE Stack | `firmware/health-key-ultra/src/ble/ble_service.c` | TEST-HKU-006 | ISO14971-HKU-R01 |
| SYS-HKU-007 | OTA firmware update | SW-HKU-007: MCUboot SUIT manifest, ECDSA-P256 | OTA Module | `firmware/health-key-ultra/src/ota/ota_manager.c` | TEST-HKU-007 | ISO14971-HKU-R02 |
| SYS-HKU-008 | Cryptographic identity | SW-HKU-008: ATECC608B provisioning, TLS 1.3 | Security Module | `firmware/health-key-ultra/src/security/crypto_driver.c` | TEST-HKU-008 | ISO14971-HKU-R01 |
| SYS-HKU-009 | Motion artifact rejection | SW-HKU-009: IMU-gated PPG, adaptive filter | Motion Filter | `firmware/shared/health-algorithms/motion_artifact_rejection.c` | TEST-HKU-009 | ISO14971-HKU-R03 |
| SYS-HKU-010 | Battery life ≥3 days | SW-HKU-010: Power management, duty cycling | Power Manager | `firmware/health-key-ultra/src/power/power_manager.c` | TEST-HKU-010 | — |

---

## 3. Traceability Matrix — HEALTH-BAND Neuro (Class C)

| Req ID | System Requirement | SW Requirement | Architecture Component | Source File | Test ID | Risk Control |
|--------|-------------------|----------------|----------------------|-------------|---------|--------------|
| SYS-HBN-001 | ECG: 12-lead, ±0.5 mV accuracy | SW-HBN-001: ADS1293 SPI driver, 500 Hz, 24-bit | ECG Frontend | `firmware/health-band-neuro/src/ecg/ecg_driver.c` | TEST-HBN-001 | ISO14971-HBN-R01 |
| SYS-HBN-002 | AFib detection: AUC ≥0.97 | SW-HBN-002: TFLite Micro AFib model, 30s window | AFib Algorithm | `firmware/health-band-neuro/src/algorithms/afib_detector.c` | TEST-HBN-002 | ISO14971-HBN-R02 |
| SYS-HBN-003 | EEG: 8-channel, 250 Hz | SW-HBN-003: ADS1299 SPI driver, notch filter 50/60 Hz | EEG Frontend | `firmware/health-band-neuro/src/eeg/eeg_driver.c` | TEST-HBN-003 | ISO14971-HBN-R03 |
| SYS-HBN-004 | EEG artifact rejection | SW-HBN-004: ICA-based artifact filter | EEG Filter | `firmware/health-band-neuro/src/eeg/eeg_filter.c` | TEST-HBN-004 | ISO14971-HBN-R03 |
| SYS-HBN-005 | TENS: ≤50 µC charge/pulse | SW-HBN-005: Charge accumulator, hardware cutoff | TENS Safety | `firmware/health-band-neuro/src/tens/tens_safety.c` | TEST-HBN-005 | ISO14971-HBN-R05 |
| SYS-HBN-006 | TENS: ≤20 mA amplitude | SW-HBN-006: DAC current limit, ADC feedback | TENS Control | `firmware/health-band-neuro/src/tens/tens_driver.c` | TEST-HBN-006 | ISO14971-HBN-R05 |
| SYS-HBN-007 | sEMG: SNR >30 dB | SW-HBN-007: Differential amplifier, bandpass 20–500 Hz | sEMG Frontend | `firmware/health-band-neuro/src/semg/semg_driver.c` | TEST-HBN-007 | — |
| SYS-HBN-008 | GPS: ±5 m accuracy | SW-HBN-008: NMEA parser, HDOP filter | GPS Module | `firmware/health-band-neuro/src/gps/gps_nmea.c` | TEST-HBN-008 | — |
| SYS-HBN-009 | Fall detection: sensitivity ≥95% | SW-HBN-009: IMU threshold + posture model | Fall Detector | `firmware/health-band-neuro/src/algorithms/fall_detector.c` | TEST-HBN-009 | ISO14971-HBN-R04 |
| SYS-HBN-010 | Battery life ≥2 days | SW-HBN-010: STM32 STOP2 mode, peripheral gating | Power Manager | `firmware/health-band-neuro/src/power/power_manager.c` | TEST-HBN-010 | — |
| SYS-HBN-011 | Clinical alert <30s latency | SW-HBN-011: Priority queue, BLE notify, cloud push | Alert Pipeline | `firmware/health-band-neuro/src/alerts/alert_manager.c` | TEST-HBN-011 | ISO14971-HBN-R02 |

---

## 4. Traceability Matrix — HEALTH-RING (Class B)

| Req ID | System Requirement | SW Requirement | Architecture Component | Source File | Test ID | Risk Control |
|--------|-------------------|----------------|----------------------|-------------|---------|--------------|
| SYS-HR-001 | cNIBP: bias ≤5 mmHg, LoA ≤±8 mmHg | SW-HR-001: PTT algorithm, PPG dual-wavelength | BP Algorithm | `firmware/shared/health-algorithms/blood-pressure/bp_algorithm.c` | TEST-HR-001 | ISO14971-HR-R01 |
| SYS-HR-002 | HbA1c: bias ≤0.2%, LoA ≤±0.5% | SW-HR-002: NIR spectral model, temperature correction | HbA1c Algorithm | `firmware/health-ring/src/algorithms/hba1c_algorithm.c` | TEST-HR-002 | ISO14971-HR-R02 |
| SYS-HR-003 | Sleep staging: 4-stage | SW-HR-003: HRV + accelerometer fusion model | Sleep Algorithm | `firmware/shared/health-algorithms/sleep_algorithm.c` | TEST-HR-003 | — |
| SYS-HR-004 | AFib detection: AUC ≥0.97 | SW-HR-004: PPG morphology + RR interval model | AFib Algorithm | `firmware/health-ring/src/algorithms/afib_ppg.c` | TEST-HR-004 | ISO14971-HR-R03 |
| SYS-HR-005 | EDA: stress index | SW-HR-005: GSR measurement, 0.05–1 Hz | EDA Driver | `firmware/health-ring/src/eda/eda_driver.c` | TEST-HR-005 | — |
| SYS-HR-006 | Battery life ≥4 days | SW-HR-006: nRF5340 deep sleep, 30s PPG bursts | Power Manager | `firmware/health-ring/src/power/power_manager.c` | TEST-HR-006 | — |
| SYS-HR-007 | Wireless charging | SW-HR-007: WPC Qi 1.3 control, charge state | Charging Module | `firmware/health-ring/src/charging/qi_controller.c` | TEST-HR-007 | — |

---

## 5. Traceability Matrix — HEALTH-LAB (Class B)

| Req ID | System Requirement | SW Requirement | Architecture Component | Source File | Test ID | Risk Control |
|--------|-------------------|----------------|----------------------|-------------|---------|--------------|
| SYS-HL-001 | Glucose: Zone A+B ≥95% (ISO 15197) | SW-HL-001: Amperometric sensor, drift correction | Glucose Algorithm | `firmware/health-lab/src/algorithms/glucose_algorithm.c` | TEST-HL-001 | ISO14971-HL-R01 |
| SYS-HL-002 | Cortisol: r ≥0.90 vs ELISA | SW-HL-002: Electrochemical immunosensor model | Cortisol Algorithm | `firmware/health-lab/src/algorithms/cortisol_algorithm.c` | TEST-HL-002 | — |
| SYS-HL-003 | Lactate: r ≥0.90 vs YSI | SW-HL-003: Enzymatic amperometric sensor | Lactate Algorithm | `firmware/health-lab/src/algorithms/lactate_algorithm.c` | TEST-HL-003 | — |
| SYS-HL-004 | Electrolytes: Na⁺, K⁺, Cl⁻ | SW-HL-004: ISE potentiometric measurement | Electrolyte Algorithm | `firmware/health-lab/src/algorithms/electrolyte_algorithm.c` | TEST-HL-004 | — |
| SYS-HL-005 | pH: ±0.1 unit | SW-HL-005: pH-sensitive ISFET, temperature compensation | pH Algorithm | `firmware/health-lab/src/algorithms/ph_algorithm.c` | TEST-HL-005 | — |
| SYS-HL-006 | Sensor calibration | SW-HL-006: 2-point calibration, factory EEPROM | Calibration Module | `firmware/health-lab/src/calibration/sensor_cal.c` | TEST-HL-006 | ISO14971-HL-R02 |
| SYS-HL-007 | Battery life ≥7 days | SW-HL-007: 15-min sampling intervals, BLE advertising off | Power Manager | `firmware/health-lab/src/power/power_manager.c` | TEST-HL-007 | — |

---

## 6. Test ID Cross-Reference

All TEST-* IDs listed above correspond to test cases in:

| Test File | Coverage |
|-----------|----------|
| `verification/test_algorithms.py` | 51 algorithm unit tests (all devices) |
| `verification/test_corner_cases.py` | 92 corner/boundary tests (all devices) |
| `simulation/ebuild/eos_ebuild_full_sim.py` | 5 integration scenarios (all devices) |
| `clinical/analysis/clinical_analysis_pipeline.py` | 6 clinical accuracy analyses |
| `firmware/shared/factory-test/eos_factory_test.py` | Hardware-in-loop factory tests |

---

## 7. IEC 62304 Compliance Checklist

| IEC 62304 Clause | Requirement | Status | Evidence |
|-----------------|-------------|--------|----------|
| §5.1 | Software development planning | ✅ Complete | `IEC62304_SOFTWARE_LIFECYCLE.md` |
| §5.2 | Software requirements analysis | ✅ Complete | This document (Req IDs) |
| §5.3 | Software architectural design | ✅ Complete | `docs/SYSTEM_ARCHITECTURE.md` |
| §5.4 | Software detailed design | ✅ Complete | Source files listed above |
| §5.5 | Software unit implementation | ✅ Complete | `firmware/` directory |
| §5.6 | Software integration and testing | ✅ Complete | `verification/`, `simulation/` |
| §5.7 | Software system testing | ✅ Complete | `clinical/analysis/` |
| §5.8 | Software release | 🔄 Pending | Awaiting clinical study completion |
| §6 | Software maintenance | 🔄 Pending | PMS plan in `regulatory/capa/` |
| §7 | Software risk management | ✅ Complete | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` |
| §8 | Software configuration management | ✅ Complete | Git history + this SBOM |
| §9 | Software problem resolution | ✅ Complete | CAPA procedure in `regulatory/capa/` |

---

*Document Owner: EmbeddedOS Regulatory Affairs | Next Review: 2026-12-01*
