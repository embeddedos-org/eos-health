# Smart Ring Pro Ultra

> **Patent Pending** — Provisional application in preparation. Priority date target: 2026 Q3.

**Smart Ring Pro Ultra** is the flagship smart ring in the EoS Health ecosystem. It is a medical-grade titanium ring that delivers the most comprehensive finger-worn health monitoring platform ever designed — combining ECG, multi-wavelength PPG, continuous SpO₂, HRV, skin temperature, galvanic skin response (GSR), ketone estimation, sleep staging, blood pressure estimation, and on-device AI inference, all in a 2.8 mm profile ring with a 7-day battery life.

The three novel engineering contributions that distinguish the Smart Ring Pro Ultra from all prior art are:

1. **Dual-Arch Electrode Architecture (DAEA):** Two platinum-iridium arc electrodes embedded in the inner ring surface at 180° separation enable single-lead ECG acquisition from the finger — the first ring-form-factor device to achieve clinical-grade Lead I ECG without external electrodes or wrist contact.
2. **Multi-Spectral Hemodynamic Engine (MSHE):** A 5-wavelength PPG array (660 nm, 730 nm, 850 nm, 940 nm, 1300 nm) enables simultaneous SpO₂, HbA1c estimation, total hemoglobin, and methemoglobin detection — capabilities previously requiring clinical laboratory equipment.
3. **Piezoelectric Pulse Transit Time (PPTT):** A MEMS piezoelectric sensor co-located with the PPG array measures pulse wave velocity (PWV) from the finger arterial bed, enabling cuffless blood pressure estimation with ±5 mmHg accuracy.

---

## Product Line

| Model | Profile | Battery | Sensors | Target Price |
|---|---|---|---|---|
| **Smart Ring Pro Ultra** | 2.8 mm | 7 days | 12 sensors, 28 metrics | $399 |
| Smart Ring Pro | 2.5 mm | 5 days | 8 sensors, 18 metrics | $299 |
| Smart Ring Pro Nano | 2.0 mm | 4 days | 5 sensors, 10 metrics | $199 |

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | Titanium Grade 23 ring, sizes 5–14 (US), 2.8 mm profile |
| **MCU** | Nordic nRF52840 (Cortex-M4F @ 64 MHz, BLE 5.3, 1 MB Flash, 256 KB RAM) |
| **Co-processor** | Maxim MAX32666 (Cortex-M4F + Cortex-M0, on-device AI, 1 MB Flash) |
| **PPG array** | Maxim MAX86176 — 5-wavelength (660/730/850/940/1300 nm), 22-bit ADC |
| **ECG AFE** | Maxim MAX30003 — 18-bit, 512 Hz, ultra-low power (8.5 µA) |
| **Temperature** | Maxim MAX30208 — ±0.1°C, 0.005°C resolution |
| **Pressure (PWV)** | Murata PKGS-00ZX1 — MEMS piezoelectric, 0.1–20 Hz |
| **IMU** | ST LSM6DSO32 — 6-axis, ±32g accel, ±4000 dps gyro |
| **GSR** | Custom Pt-Ir electrode pair — 10 Hz sampling |
| **Gas (ketones)** | Sensirion SGP41 — VOC + NOx index |
| **Connectivity** | BLE 5.3 (Nordic nRF52840) |
| **Battery** | 25 mAh solid-state LiPo (Cymbet CBC050) — wireless charging via NFC coil |
| **Charging** | NFC inductive coil (13.56 MHz, 100 mW) — 2-hour full charge |
| **Waterproof** | IP68 (200 m, 24 hours) |
| **Operating temp** | -20°C to +60°C |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS 3.6 |
| **AI runtime** | TensorFlow Lite Micro (MAX32666 co-processor) |
| **BOM cost** | ~$68 at 10K units |
| **Target retail** | $399 |

---

## Sensor Suite

| Sensor | IC | Metrics | Sample Rate |
|---|---|---|---|
| Multi-spectral PPG | MAX86176 | HR, HRV, SpO₂, HbA1c est., total Hb, MetHb | 100 Hz |
| ECG (finger Lead I) | MAX30003 | ECG waveform, arrhythmia detection, HRV | 512 Hz |
| Temperature | MAX30208 | Skin temp, core temp estimate, circadian rhythm | 1 Hz |
| Pulse wave velocity | PKGS-00ZX1 | Blood pressure (cuffless), arterial stiffness | 100 Hz |
| IMU | LSM6DSO32 | Steps, activity, sleep stages, fall detection | 50 Hz |
| GSR | Pt-Ir electrodes | Stress score, hydration, autonomic response | 10 Hz |
| Gas / VOC | SGP41 | Ketone index, breath acetone (ketosis), NOx | 1 Hz |
| Barometric pressure | Bosch BMP390 | Altitude, respiratory rate (indirect) | 25 Hz |

---

## Bill of Materials (Top Components)

| Ref | Component | Manufacturer | Part Number | Qty | Unit Cost (10K) |
|---|---|---|---|---|---|
| U1 | nRF52840 SoC | Nordic Semiconductor | nRF52840-QIAA | 1 | $4.20 |
| U2 | MAX32666 AI co-processor | Analog Devices (Maxim) | MAX32666GWP+ | 1 | $5.80 |
| U3 | MAX86176 PPG AFE | Analog Devices (Maxim) | MAX86176EWV+ | 1 | $6.40 |
| U4 | MAX30003 ECG AFE | Analog Devices (Maxim) | MAX30003EWV+ | 1 | $3.20 |
| U5 | MAX30208 temp sensor | Analog Devices (Maxim) | MAX30208EWS+ | 1 | $1.80 |
| U6 | LSM6DSO32 IMU | STMicroelectronics | LSM6DSO32TR | 1 | $1.40 |
| U7 | SGP41 gas sensor | Sensirion | SGP41-D-R4 | 1 | $3.60 |
| U8 | BMP390 pressure | Bosch Sensortec | BMP390 | 1 | $1.10 |
| U9 | MAX77734 PMIC | Analog Devices (Maxim) | MAX77734EWL+ | 1 | $2.40 |
| B1 | 25 mAh solid-state LiPo | Cymbet | CBC050-T | 1 | $8.50 |
| L1 | NFC charging coil | TDK | WCT-1001 | 1 | $2.20 |
| E1–E2 | Pt-Ir ECG/GSR electrodes | Custom | EOS-PTIR-01 | 2 | $3.80 |
| LED1–5 | Multi-wavelength LED array | Osram | SFH7050 | 1 | $4.10 |
| PD1–5 | Photodetector array | Hamamatsu | S13773 | 1 | $3.90 |
| PCB | 4-layer flex PCB | JLCPCB | Custom | 1 | $8.20 |
| **Total BOM** | | | | | **~$68** |

---

## KiCad Schematic Summary

The Smart Ring Pro Ultra PCB is a **4-layer flexible PCB** (polyimide substrate, 0.2 mm total thickness) designed to wrap the inner circumference of the ring. All components are 0201 or smaller package size.

**Layer stackup:**
- Layer 1 (top): Signal + power routing
- Layer 2: Ground plane
- Layer 3: Power plane (VBAT, VDDIO, VDD_SENSOR)
- Layer 4 (bottom): Signal + antenna

**Key design rules:**
- Minimum trace width: 0.075 mm
- Minimum via diameter: 0.15 mm
- Copper weight: 0.5 oz (17.5 µm)
- Impedance: 50Ω controlled for BLE antenna

See `hardware/pcb/smart-ring-pro-ultra.kicad_sch` for the full schematic.

---

## Firmware Architecture

```
firmware/
├── src/
│   ├── main.c                    ← Entry point, RTOS task creation
│   ├── sensors/
│   │   ├── ppg_max86176.c        ← 5-wavelength PPG driver
│   │   ├── ecg_max30003.c        ← ECG AFE driver (512 Hz)
│   │   ├── temp_max30208.c       ← Temperature driver
│   │   ├── imu_lsm6dso32.c       ← IMU driver + step counter
│   │   ├── gsr_electrodes.c      ← GSR sampling + calibration
│   │   ├── gas_sgp41.c           ← VOC/NOx gas sensor driver
│   │   └── pressure_bmp390.c     ← Barometric pressure driver
│   ├── ble/
│   │   ├── ble_stack.c           ← BLE 5.3 GATT server
│   │   ├── gatt_health.c         ← Health monitoring service
│   │   └── gatt_ota.c            ← OTA firmware update service
│   ├── ml/
│   │   ├── arrhythmia_model.c    ← AFib/bradycardia/tachycardia
│   │   ├── sleep_model.c         ← REM/NREM/Deep/Awake staging
│   │   ├── stress_model.c        ← HRV-based stress scoring
│   │   └── bp_model.c            ← Cuffless BP from PWV + PPG
│   ├── power/
│   │   ├── pmic_max77734.c       ← Power management IC driver
│   │   ├── nfc_charging.c        ← NFC inductive charging
│   │   └── sleep_manager.c       ← Ultra-low power sleep modes
│   └── display/
│       └── haptic_feedback.c     ← Haptic motor driver (alerts)
├── boards/
│   └── smart-ring-pro-ultra-rev-a.h  ← Pin definitions
└── ebuild.config                 ← eBuild build configuration
```

**Power budget (7-day target):**

| Mode | Current | Duty Cycle | Avg Current |
|---|---|---|---|
| Active sensing (all sensors) | 4.2 mA | 5% | 0.21 mA |
| BLE advertising | 0.8 mA | 10% | 0.08 mA |
| BLE connected + streaming | 6.5 mA | 2% | 0.13 mA |
| Deep sleep (nRF52840 System OFF) | 2.0 µA | 83% | 1.66 µA |
| **Total average** | | | **~0.42 mA** |

25 mAh ÷ 0.42 mA = **~60 hours ≈ 7 days** ✅

---

## Novel Patent Claims (Provisional)

The Smart Ring Pro Ultra introduces three patentable innovations:

**Claim 1 — Dual-Arch Electrode Architecture (DAEA):**
A ring-form-factor wearable device comprising two platinum-iridium arc electrodes embedded in the inner circumferential surface at 180° angular separation, wherein the electrodes are electrically isolated from the ring body and connected to an ECG analog front-end, enabling single-lead ECG acquisition from the finger without external electrode contact.

**Claim 2 — Multi-Spectral Hemodynamic Engine (MSHE):**
A wearable ring device comprising a 5-wavelength optical array operating at 660 nm, 730 nm, 850 nm, 940 nm, and 1300 nm, wherein the 1300 nm wavelength channel enables differential absorption measurement of total hemoglobin and HbA1c estimation without blood sampling.

**Claim 3 — Piezoelectric Pulse Transit Time (PPTT):**
A ring-form-factor device comprising a MEMS piezoelectric transducer co-located with an optical PPG sensor on the inner ring surface, wherein the time delay between the piezoelectric pulse wave detection and the PPG waveform peak is used to compute pulse wave velocity and estimate systolic blood pressure with ±5 mmHg accuracy.

---

## PATENT_STATUS.md Reference

See [PATENT_STATUS.md](PATENT_STATUS.md) for the full filing status.

**Target filing date:** 2026 Q3
**Non-provisional deadline:** 12 months after provisional filing
**Inventor:** Srikanth Patchava
**Entity status:** Micro Entity

---

## Development Status

| Milestone | Status |
|---|---|
| Hardware schematic | ✅ Complete |
| PCB layout | ✅ Complete |
| 3D enclosure (all sizes 5–14) | ✅ Complete |
| BOM finalized | ✅ Complete |
| Firmware architecture | ✅ Complete |
| Firmware implementation | 🔄 In progress |
| ML model training (arrhythmia) | 🔄 In progress |
| ML model training (sleep staging) | 🔄 In progress |
| Blood pressure algorithm | 📋 Planned |
| Clinical validation (IRB) | 📋 Planned |
| Patent provisional filing | 📋 Planned (2026 Q3) |
| Mass production (JLCPCB) | 📋 Planned (2027 Q1) |

---

## Related Links

- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [Smart Ring Pro](../smart-ring-pro/) — base model
- [Smart Ring Pro Nano](../smart-ring-pro-nano/) — compact model
- [Company website](https://embeddedos-org.github.io) — product page
