# HEALTH-RING
### EoS Health — Wearable Health Ring

**Inventor:** Srikanth Patchava
**Organization:** Embedded Operating Systems Research Foundation (EoS Foundation), 501(c)(3), EIN: 41-4821627
**Patent Docket:** EOS-2026-003
**Status:** Design complete — Provisional patent target: 2026 Q3

---

## Overview

HEALTH-RING is a titanium wearable health ring that brings clinical-grade ECG, continuous SpO₂, HbA1c estimation, cuffless blood pressure, and sleep intelligence to a ring form factor. It is offered in two tiers — **HEALTH-RING** (base) and **HEALTH-RING Ultra** (flagship) — both sharing the same product identity, patent family, and mobile app integration.

| | HEALTH-RING | HEALTH-RING Ultra |
|---|---|---|
| **Profile** | 2.0 mm | 2.8 mm |
| **Battery** | 4 days | 7 days |
| **ECG** | ✅ Single-lead | ✅ Single-lead + AFib AI |
| **SpO₂** | ✅ 3-wavelength | ✅ 5-wavelength + HbA1c |
| **Blood Pressure** | — | ✅ Cuffless (PPTT) |
| **AI Co-processor** | — | ✅ MAX32666 |
| **Sensors** | 5 | 12 |
| **Metrics** | 10 | 28 |
| **Target Price** | $199 | $399 |
| **BOM (10K units)** | ~$38 | ~$68 |

---

## Novel Patent Claims

Three core innovations distinguish HEALTH-RING from all existing smart rings (Oura, Samsung Galaxy Ring, Ultrahuman, RingConn, Circular):

### 1. Dual-Arch Electrode Architecture (DAEA) — Ultra
Two platinum-iridium arc electrodes embedded in the inner ring surface at 180° angular separation, enabling single-lead ECG acquisition from the finger. No existing smart ring provides ECG. The 180° separation creates a Lead I-equivalent configuration with sufficient cardiac potential difference for P-wave, QRS, and T-wave resolution.

### 2. Multi-Spectral Hemodynamic Engine (MSHE) — Ultra
Five-wavelength optical array (660 / 730 / 850 / 940 / **1300 nm**) for simultaneous SpO₂, deoxyhemoglobin, total hemoglobin, and glycated hemoglobin (HbA1c) estimation. The 1300 nm channel exploits differential absorption between HbA1c and non-glycated hemoglobin — a non-invasive HbA1c signal from a ring, with no blood draw.

### 3. Zero-Profile Inductive Electrode System (ZPIES) — Base
ECG electrodes formed by photolithographic deposition of gold-plated copper traces on the anodized inner ring surface — flush with the surface, zero raised profile. Enables ECG in a 2.0 mm profile ring where traditional pressed-metal electrodes cannot fit.

### 4. Piezoelectric Pulse Transit Time (PPTT) — Ultra
MEMS piezoelectric transducer co-located with the optical array. Time delay between piezo pulse detection and PPG peak → pulse wave velocity → cuffless blood pressure estimation ±5 mmHg after calibration.

### 5. Kinetic Energy Harvesting Supplement (KEHS) — Base
MEMS piezoelectric cantilever beam oriented tangentially in the ring body harvests kinetic energy from finger motion, supplementing the battery by up to +18% during active use.

---

## Hardware — HEALTH-RING Ultra

### Key ICs

| IC | Function | Package |
|---|---|---|
| nRF52840 | Main MCU, BLE 5.3 | WLCSP 7×7 |
| MAX32666 | AI co-processor (TFLite Micro) | WLP 2.5×2.5 |
| MAX30003 | ECG AFE (DAEA electrodes) | OLGA 20 |
| MAX86176 | 5λ PPG AFE (MSHE) | OLGA 20 |
| MAX30208 | Skin temperature | WLP 1.5×1.5 |
| LSM6DSO32 | 6-axis IMU | LGA 2.5×3.0 |
| SGP41 | VOC/NOx gas sensor | DFN 2.44×2.44 |
| BMP390 | Barometric pressure | LGA 2.0×2.0 |
| MAX77734 | PMIC | WLP 1.6×1.6 |
| TDK WCT-1001 | NFC charging coil | Flex |
| PKGS-00ZX1 | MEMS piezo (PPTT) | SMD |

### Sensor Suite (Ultra — 12 sensors, 28 metrics)

| Sensor | Metrics |
|---|---|
| ECG (DAEA) | Single-lead ECG, AFib detection, bradycardia, tachycardia, HRV |
| PPG 5λ (MSHE) | SpO₂, deoxyhemoglobin, total Hb, HbA1c estimation, perfusion index |
| PPTT | Cuffless systolic BP, diastolic BP, pulse wave velocity |
| Temperature | Skin temp, core body temp estimation, circadian rhythm |
| IMU | Steps, distance, calories, active minutes, fall detection |
| Gas (VOC/NOx) | Air quality index, environmental exposure |
| Barometric | Altitude, floor count |
| AI models | Sleep stages (REM/light/deep), stress score, recovery score, readiness |

### Bill of Materials — Ultra (Top Components)

| Component | Part Number | Unit Cost (10K) | Supplier |
|---|---|---|---|
| nRF52840 MCU | nRF52840-QIAA | $4.20 | Nordic Semi |
| MAX32666 AI co-proc | MAX32666GWE+ | $6.80 | Analog Devices |
| MAX30003 ECG AFE | MAX30003EWV+ | $3.10 | Analog Devices |
| MAX86176 PPG AFE | MAX86176EWV+ | $4.50 | Analog Devices |
| LSM6DSO32 IMU | LSM6DSO32TR | $1.20 | STMicroelectronics |
| MAX77734 PMIC | MAX77734EWA+ | $2.80 | Analog Devices |
| Pt-Ir arc electrodes | Custom (EDM) | $8.00 | Custom fab |
| Solid-state LiPo 25mAh | Cymbet CBC050 | $6.50 | Cymbet |
| NFC coil | TDK WCT-1001 | $1.80 | TDK |
| Ti Grade 23 ring body | Custom CNC | $9.50 | Custom fab |
| Flex PCB 4-layer | Custom | $4.20 | JLCPCB |
| Passives + misc | — | $5.40 | Various |
| **Total BOM** | | **~$58** | |

### Bill of Materials — Base (Top Components)

| Component | Part Number | Unit Cost (10K) | Supplier |
|---|---|---|---|
| nRF52833 MCU | nRF52833-QIAA | $3.10 | Nordic Semi |
| MAX30001 ECG AFE | MAX30001EWV+ | $2.40 | Analog Devices |
| MAX30101 PPG AFE | MAX30101EFD+ | $2.80 | Analog Devices |
| MAX30208 Temp | MAX30208EWS+ | $0.90 | Analog Devices |
| LSM6DSO IMU | LSM6DSOTR | $0.95 | STMicroelectronics |
| MAX77734 PMIC | MAX77734EWA+ | $2.80 | Analog Devices |
| ZPIES electrodes | Photolithographic | $3.50 | Custom fab |
| KEHS piezo | Mide V21BL | $2.20 | Mide |
| Solid-state LiPo 15mAh | Cymbet CBC030 | $4.20 | Cymbet |
| NFC coil | TDK WCT-1001 | $1.80 | TDK |
| Ti Grade 23 ring body | Custom CNC | $7.80 | Custom fab |
| Flex PCB 2-layer | Custom | $2.80 | JLCPCB |
| Passives + misc | — | $3.75 | Various |
| **Total BOM** | | **~$37** | |

---

## Hardware — HEALTH-RING Base

### Key ICs

| IC | Function | Package |
|---|---|---|
| nRF52833 | Main MCU, BLE 5.1 | WLCSP 7×7 |
| MAX30001 | ECG AFE (ZPIES electrodes) | OLGA 20 |
| MAX30101 | 3λ PPG AFE | OLGA 20 |
| MAX30208 | Skin temperature | WLP 1.5×1.5 |
| LSM6DSO | 6-axis IMU | LGA 2.5×3.0 |
| MAX77734 | PMIC | WLP 1.6×1.6 |
| TDK WCT-1001 | NFC charging coil | Flex |
| Mide V21BL | MEMS piezo (KEHS) | SMD |

---

## Firmware Architecture

```
health-ring-firmware/
├── src/
│   ├── sensors/
│   │   ├── ecg.c          # MAX30003/MAX30001 driver + DAEA/ZPIES
│   │   ├── ppg.c          # MAX86176/MAX30101 driver + MSHE
│   │   ├── temperature.c  # MAX30208 driver
│   │   ├── imu.c          # LSM6DSO driver + step counting
│   │   ├── pptt.c         # Piezo PWV + BP estimation (Ultra)
│   │   └── kehs.c         # Kinetic energy harvesting (Base)
│   ├── ble/
│   │   ├── gatt_health.c  # Health Monitoring Service (0x181D)
│   │   ├── gatt_activity.c # Activity Service (0x1814)
│   │   └── ota.c          # OTA firmware update
│   ├── power/
│   │   ├── pmic.c         # MAX77734 power management
│   │   ├── nfc_charge.c   # NFC inductive charging
│   │   └── sleep.c        # Low-power sleep modes
│   └── ml/                # Ultra only
│       ├── arrhythmia.c   # AFib/bradycardia/tachycardia detection
│       ├── sleep.c        # Sleep staging (REM/light/deep/wake)
│       ├── stress.c       # HRV-based stress scoring
│       └── bp_model.c     # Personalized BP calibration model
├── boards/
│   ├── health-ring-base-rev-a.conf
│   └── health-ring-ultra-rev-a.conf
└── ebuild.config
```

---

## Mechanical Design

| Parameter | HEALTH-RING | HEALTH-RING Ultra |
|---|---|---|
| Material | Titanium Grade 23 (Ti-6Al-4V ELI) | Titanium Grade 23 |
| Profile | 2.0 mm | 2.8 mm |
| Sizes | US 5–14 (ID: 14.1–22.2 mm) | US 5–14 |
| Outer finish | DLC coating (2–3 µm) | DLC coating |
| Inner finish | Ra ≤ 0.2 µm polished | Ra ≤ 0.4 µm polished |
| Waterproofing | IP68 (100 m, 24 hr) | IP68 (200 m, 24 hr) |
| Weight | ~3.5 g | ~5.2 g |
| PCB layers | 2-layer flex (0.15 mm) | 4-layer flex (0.20 mm) |
| Potting | Loctite M-21HP medical epoxy | Loctite M-21HP |

---

## Patent Status

**Docket:** EOS-2026-003
**Type:** Provisional Patent Application (35 U.S.C. § 111(b))
**Target filing:** 2026 Q3
**Non-provisional deadline:** 2027 Q3 (12 months from provisional)

See [`patent/PROVISIONAL_PATENT_APPLICATION.md`](patent/PROVISIONAL_PATENT_APPLICATION.md) for full application text with 15 claims.

---

## Related Products

| Product | Repo Path | Status |
|---|---|---|
| HEALTH-KEY ULTRA | `devices/health-key-ultra/` | ✅ Patent filed (64/073,334) |
| HEALTH-BAND Neuro | `devices/health-band-neuro/` | ✅ Patent filed (64/076,078) |
| **HEALTH-RING** | `devices/health-ring/` | 📋 Design complete, provisional pending |
| HEALTH-LAB | `devices/health-lab/` | 📋 Design complete, provisional pending |

All four devices connect to the **Single Health Hub** mobile app via BLE 5.x.
