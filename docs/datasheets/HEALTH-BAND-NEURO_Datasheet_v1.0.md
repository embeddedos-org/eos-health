# HEALTH-BAND Neuro — Production Datasheet
## EoS Health · Model EOS-HBN-001 · Revision 1.0

**Document:** EOS-DS-002-HBN · **Date:** June 1, 2026 · **Status:** Production Release

---

## 1. Product Overview

HEALTH-BAND Neuro is a wristband combining 8-channel surface electromyography (sEMG), electrodermal activity (EDA/GSR), 3-lead ECG, PPG, and therapeutic TENS neurostimulation in a single device. It is the only wearable that simultaneously monitors muscle activation patterns and delivers targeted pain relief and recovery stimulation.

---

## 2. Electrical Specifications

| Parameter | Min | Typ | Max | Unit |
|---|---|---|---|---|
| Battery voltage (Li-Po) | 3.0 | 3.7 | 4.2 | V |
| Battery capacity | — | 300 | — | mAh |
| Active current (sEMG + ECG + BLE) | — | 38.5 | 48 | mA |
| TENS stimulation current (max) | — | — | 20 | mA |
| TENS pulse charge (max) | — | — | 3.0 | µC |
| Deep sleep current | — | 8.1 | 12 | µA |
| Wireless charging (Qi) | — | 5W | — | — |
| Charging time (0→100%) | — | 50 | 70 | min |

---

## 3. Sensor Suite

| Sensor | IC | Measurement | Accuracy | Sampling Rate |
|---|---|---|---|---|
| sEMG (8-channel) | ADS1299 | Muscle activation, fatigue index | SNR ≥72 dB, noise <0.5 µV_rms | 1000 Hz |
| ECG (3-lead) | ADS1292R | Lead I/II/III, HR, HRV, AFib | SNR ≥63 dB | 500 Hz |
| EDA/GSR | AFE4490 | Skin conductance, stress index | 0.01–100 µS | 64 Hz |
| PPG | MAX30102 | SpO₂, HR, HRV | ARMS ≤0.44% | 100 Hz |
| Accelerometer/Gyro | LSM6DSO | 6-DOF motion, gesture | ±0.1 g | 104 Hz |
| Temperature | MCP9808 | Skin temperature | ±0.25°C | 1 Hz |
| TENS output | MAX14521E | Biphasic stimulation, 4 channels | ±20 mA, 1–150 Hz | Configurable |

---

## 4. Wireless Specifications

| Parameter | Value |
|---|---|
| BLE version | 5.2 |
| PHY | 1M / 2M |
| Typical range | 100 m |
| Charging | Qi wireless (5W), WPC 1.3 compliant |
| Antenna | PCB trace antenna (integrated in flex PCB strap) |

---

## 5. Mechanical Specifications

| Parameter | Value |
|---|---|
| Core module dimensions | 45 × 35 × 11 mm |
| Strap type | Flexible PCB silicone strap (8 sEMG electrodes embedded) |
| Strap sizes | S (140–170 mm), M (170–200 mm), L (200–230 mm) |
| Weight | 42 g (medium strap) |
| Housing material | Polycarbonate + TPU overmold |
| IP rating | IP68 (1 m, 30 min) |
| Operating temperature | −10°C to +50°C |
| Flex strap fatigue life | ≥500,000 flex cycles (IEC 60068-2-21) |

---

## 6. Processor and Memory

| Component | Part | Specification |
|---|---|---|
| MCU | Nordic nRF52840 | Cortex-M4F, 64 MHz, 1 MB Flash, 256 KB RAM |
| AI co-processor | MAX32666 | Dual Cortex-M4F, TFLite Micro, 1 MB Flash |
| NVM | W25Q64JV | 8 MB SPI Flash |
| Secure element | ATECC608B | Key storage, OTA verification |

---

## 7. Power Budget

| Mode | Current | Duration | Energy |
|---|---|---|---|
| Active (sEMG + ECG + BLE) | 38.5 mA | 5 min/hr | 3.208 mAh/hr |
| TENS therapy | 52.0 mA | 20 min/hr | 17.333 mAh/hr |
| Idle (BLE + IMU) | 5.1 mA | 30 min/hr | 2.550 mAh/hr |
| Deep sleep | 8.1 µA | 5 min/hr | 0.001 mAh/hr |
| **Weighted average** | **~56.5 mA** | — | — |
| **Battery life** | — | **~5.3 days** | — |

---

## 8. TENS Safety Specifications

HEALTH-BAND Neuro TENS output complies with IEC 60601-2-10 (nerve and muscle stimulators):

| Parameter | Specification |
|---|---|
| Waveform | Symmetric biphasic rectangular |
| Pulse width | 50–400 µs (user configurable) |
| Frequency | 1–150 Hz (user configurable) |
| Peak current | 0–20 mA (user configurable) |
| Max charge per pulse | 3.0 µC (IEC 60601-2-10 limit: 50 µC) |
| Optical isolation | Yes (ISO7241C between MCU and output stage) |
| Overcurrent protection | Hardware comparator, <1 µs response |
| Contraindications | Pacemaker, pregnancy, epilepsy, open wounds |

---

## 9. BOM Summary (Production, 1k units)

| Category | Key Components | Unit Cost |
|---|---|---|
| MCU + AI | nRF52840, MAX32666, ATECC608B | $9.40 |
| Sensors | ADS1299, ADS1292R, AFE4490, MAX30102, LSM6DSO | $14.20 |
| TENS | MAX14521E, optical isolators, output capacitors | $5.80 |
| Power | BQ25185 PMIC, Qi receiver, 300 mAh Li-Po | $6.20 |
| Flex PCB strap | 8-electrode FPCB, silicone overmold | $11.50 |
| Housing + assembly | PC/TPU housing, packaging | $9.80 |
| **Total BOM** | | **$56.90** |
| **Target retail** | | **$349** |

---

*EoS Health · EOS-DS-002-HBN Rev 1.0 · Confidential until commercial launch*
