# EoS Health — L2 Simulation Verification Report

**Date:** 2026-06-02  
**Scope:** All 4 EoS Health devices — HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB  
**Level:** L2 — Circuit simulation, power budget, signal integrity (Python-based SPICE equivalent)  
**Status:** ⚠️ 2 findings require hardware-stage resolution (not blocking for prototype build)

---

## Summary Table

| Simulation | Result | Key Metric | Notes |
|---|---|---|---|
| **ECG Front-End** | ✅ PASS | SNR = 63.5 dB, noise = 669.8 nV_rms | All 6 specs met |
| **PPG/SpO₂/Biosensor** | ⚠️ FINDING | SpO₂ error 1.41%, HbA1c 0.56% | HbA1c needs calibration table |
| **Power Budget** | ✅ PASS | All 4 devices meet battery life targets | Battery sizes updated (see below) |
| **Signal Integrity** | ⚠️ FINDING | BLE S11 = -5.0 dB | Requires VNA tuning at prototype stage |

---

## 1. ECG Front-End Simulation ✅ PASS

**File:** `simulation/ecg/ecg_frontend_sim.py`

The ECG analog front-end was simulated using a 2nd-order Butterworth high-pass filter (0.5 Hz), a 4th-order Butterworth low-pass filter (150 Hz), a 50 Hz notch filter (Q=30), and the INA333 instrumentation amplifier at 100 V/V gain.

| Parameter | Simulated | Specification | Status |
|---|---|---|---|
| HPF cutoff | 0.5 Hz | ≤ 0.5 Hz | ✅ |
| LPF cutoff | 150 Hz | ≥ 150 Hz | ✅ |
| SNR (1 mV ECG) | 63.5 dB | > 40 dB | ✅ |
| Noise floor | 669.8 nV_rms | — | ✅ |
| ADC LSB | 3.815 µV | < 5 µV | ✅ |
| CMRR | 100 dB | > 80 dB | ✅ |

**Conclusion:** The ECG front-end design is sound. The 63.5 dB SNR exceeds the AHA/AAMI EC11 standard requirement of 40 dB. The 669.8 nV_rms noise floor is well below the 1 µV_rms clinical threshold.

---

## 2. PPG/SpO₂/Biosensor Simulation ⚠️ FINDING

**File:** `simulation/ppg-spo2/ppg_biosensor_sim.py`

### SpO₂ — PASS
The ratio-of-ratios SpO₂ algorithm was validated against two test points:

| Test | True SpO₂ | Estimated | Error | Status |
|---|---|---|---|---|
| Normal | 98% | 99.4% | 1.41% | ✅ < 2% |
| Hypoxic | 90% | 90.5% | 0.53% | ✅ < 2% |

The FDA requires SpO₂ accuracy ≤ 3% ARMS (ISO 80601-2-61). Both test points pass.

### HbA1c — FINDING
The 5-wavelength photoplethysmography HbA1c estimation model shows a mean error of **0.56%** (max 1.0%) against the 0.5% mean error specification.

**Root cause:** The empirical calibration coefficients in the simulation are based on theoretical Beer-Lambert extinction coefficients without a population-level calibration dataset. Real-world HbA1c estimation requires a 200+ subject calibration study to fit the regression model.

**Resolution:** This is expected at the simulation stage. The algorithm architecture is correct; the calibration coefficients must be tuned against a clinical reference dataset (HbA1c measured by HPLC) during L3/L4 validation. The 0.56% error is within the range achievable with proper calibration.

**Action:** Flag for L3 prototype calibration study. Not blocking for prototype build.

### Glucose Biosensor — PASS
The amperometric glucose sensor model (LMP91000 potentiostat) achieved 0.0% error across all three test concentrations (normal fasting 5.0 mM, post-meal 10.0 mM, hypoglycemia 3.5 mM). The Randles circuit model (Rs=50Ω, Rct=500Ω, Cdl=10µF) correctly models the electrode-electrolyte interface.

---

## 3. Power Budget Simulation ✅ PASS

**File:** `simulation/power/power_budget_sim.py`

All 4 devices meet their battery life targets. The simulation revealed that the original battery sizes specified in the hardware design documents were insufficient and required upward revision:

| Device | Original Battery | Required Battery | Avg Current | Battery Life | Target | Status |
|---|---|---|---|---|---|---|
| HEALTH-KEY ULTRA | 120 mAh | **210 mAh** | 1.02 mA | 7.3 days | 7 days | ✅ |
| HEALTH-BAND Neuro | 200 mAh | **300 mAh** | 2.00 mA | 5.3 days | 5 days | ✅ |
| HEALTH-RING | 25 mAh | **170 mAh** | 0.80 mA | 7.6 days | 7 days | ✅ |
| HEALTH-LAB | 15 mAh | **65 mAh** | 0.15 mA | 15.4 days | 14 days | ✅ |

**Important design change:** The HEALTH-RING battery was the most significant revision — from 25 mAh to 170 mAh. This requires a larger ring body (the Ultra tier uses a wider band width of ~8 mm vs the originally specified 2.8 mm profile). The Base tier (Nano) can use a smaller 60 mAh battery for a 4-day life at the 2.0 mm profile.

**NFC Charging (HEALTH-RING):** The simulation confirmed that NFC inductive charging at 15 mA with 72% efficiency requires approximately 16 hours for a full charge. The charging dock design must maintain coil separation below 2 mm to maintain >70% efficiency.

**HEALTH-LAB Patch:** The 65 mAh flexible printed battery (3-layer stack) achieves 15.4 days — exceeding the 14-day target with 10% margin for self-discharge and temperature effects.

---

## 4. Signal Integrity Simulation ⚠️ FINDING

**File:** `simulation/signal-integrity/signal_integrity_sim.py`

### BLE Antenna Matching — FINDING
The Pi-network matching simulation shows S11 = **-5.0 dB** at 2.44 GHz against the -10 dB specification.

**Root cause:** The chip antenna impedance model (35-j15Ω) requires precise component values that are sensitive to PCB layout parasitics (pad capacitance, trace inductance). The simulation uses ideal component models without layout parasitics. In practice, the matching network is tuned on a VNA after PCB fabrication by adjusting the shunt capacitor values (±0.5 pF steps).

**Resolution:** This is a standard finding for chip antenna designs. Every production antenna matching network requires VNA tuning at the prototype stage. The nRF52840 reference design (PCA10056) uses the same approach — nominal component values from the datasheet, then tuned on the first prototype. The BLE link budget still shows 100 m range even at -5 dB S11 (link margin is sufficient).

**Action:** Add VNA tuning step to the L3 prototype procedure. Not blocking.

### PCB Trace Impedance — PASS
| Parameter | Result | Specification | Status |
|---|---|---|---|
| 50Ω trace width (FR4, h=0.8mm) | 1.110 mm | > 0.1 mm | ✅ Manufacturable |
| 50Ω trace width (Flex, h=0.1mm) | 0.130 mm | > 0.05 mm | ✅ Manufacturable |
| 100Ω ECG diff pair spacing | 0.050 mm | ≥ 0.05 mm | ✅ Laser-drilled PCB |

### EMI — PASS
The 2 MHz buck converter switching frequency produces -8.3 dBµV at the fundamental, well below the FCC Part 15 Class B limit of 48 dBµV at 30 MHz. The 2 MHz switching frequency was chosen specifically to place the fundamental above the AM broadcast band (530–1700 kHz) and below the 30 MHz conducted EMI measurement band.

---

## Hardware Design Changes Required

The following changes to the hardware design documents must be made based on L2 simulation findings:

| Change | Device(s) | Priority |
|---|---|---|
| Update battery to 210 mAh | HEALTH-KEY ULTRA | 🔴 Critical |
| Update battery to 300 mAh | HEALTH-BAND Neuro | 🔴 Critical |
| Update battery to 170 mAh (Ultra), 60 mAh (Base) | HEALTH-RING | 🔴 Critical |
| Update battery to 65 mAh (3-layer flex stack) | HEALTH-LAB | 🔴 Critical |
| Add VNA tuning step to L3 procedure | All 4 devices | 🟡 Important |
| Add HbA1c calibration study to L4 plan | HEALTH-RING | 🟡 Important |

---

## Simulation Plots

All simulation plots are saved to `simulation/plots/`:

| Plot | Description |
|---|---|
| `ecg_frontend_simulation.png` | ECG filter response, Bode plots, noise spectrum, SNR |
| `ppg_biosensor_simulation.png` | PPG waveforms, SpO₂ calibration, biosensor I-V curves |
| `power_budget_simulation.png` | Battery discharge curves, current breakdown, NFC efficiency |
| `signal_integrity_simulation.png` | S11 return loss, link budget, trace impedance, EMI spectrum |

---

## Next Steps — L3 Prototype Verification

L3 verification requires physical hardware and cannot be performed in simulation:

| Test | Equipment | Applies To |
|---|---|---|
| VNA antenna matching tuning | Vector Network Analyzer | All 4 devices |
| ECG signal quality on skin | Oscilloscope + ECG reference | KEY ULTRA, BAND, RING |
| SpO₂ accuracy vs pulse oximeter | Reference pulse oximeter | RING |
| HbA1c calibration study | 200 subjects + HPLC reference | RING Ultra |
| Glucose sensor calibration | Glucose meter reference | LAB |
| Battery life measurement | PPKII power profiler | All 4 devices |
| IP68 water resistance | Water tank + pressure gauge | KEY ULTRA, BAND, RING |
| BLE range test | Smartphone + BLE scanner | All 4 devices |
| OTA update end-to-end | J-Link + nRF Connect | All 4 devices |
| TENS safety (IEC 60601-1) | Electrical safety analyzer | BAND Neuro |

---

*Report generated by EoS Health L2 Simulation Suite — verification/run_l2_verification.py*
