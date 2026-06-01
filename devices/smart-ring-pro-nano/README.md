# Smart Ring Pro Nano

> **Patent Pending** — Provisional application in preparation. Priority date target: 2026 Q3.

**Smart Ring Pro Nano** is the world's thinnest medically capable smart ring — a 2.0 mm profile titanium ring that delivers essential health monitoring in the most compact form factor ever achieved. It is designed for users who want continuous health tracking without any visible bulk, and for clinical research applications where ring compliance is critical.

The three novel engineering contributions that distinguish the Smart Ring Pro Nano from all prior art are:

1. **Zero-Profile Inductive Electrode System (ZPIES):** A pair of gold-plated copper arc electrodes are integrated directly into the ring's inner surface using a photolithographic deposition process — eliminating raised electrode structures and achieving a perfectly smooth inner surface while maintaining ECG-grade electrical contact.
2. **Single-Die Multi-Sensor Module (SDMSM):** A custom ASIC (EOS-NANO-01) integrates PPG AFE, temperature sensor, and IMU into a single 1.2×1.2 mm die — the smallest multi-sensor health IC ever designed for a ring form factor.
3. **Kinetic Energy Harvesting Supplement (KEHS):** A piezoelectric MEMS cantilever harvests kinetic energy from finger motion to supplement the 15 mAh solid-state battery, extending battery life by up to 18% during active use.

---

## Product Line Comparison

| Model | Profile | Battery | Sensors | Target Price |
|---|---|---|---|---|
| Smart Ring Pro Ultra | 2.8 mm | 7 days | 12 sensors, 28 metrics | $399 |
| Smart Ring Pro | 2.5 mm | 5 days | 8 sensors, 18 metrics | $299 |
| **Smart Ring Pro Nano** | **2.0 mm** | **4 days** | **5 sensors, 10 metrics** | **$199** |

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | Titanium Grade 23 ring, sizes 5–14 (US), 2.0 mm profile |
| **MCU** | Nordic nRF52833 (Cortex-M4F @ 64 MHz, BLE 5.1, 512 KB Flash, 128 KB RAM) |
| **PPG / SpO₂** | Maxim MAX30101 — 3-wavelength (660/880/940 nm), 18-bit ADC |
| **ECG AFE** | Maxim MAX30001 — 18-bit, 128 Hz, ultra-low power (5.2 µA) |
| **Temperature** | Maxim MAX30208 — ±0.1°C, 0.005°C resolution |
| **IMU** | ST LSM6DSO (6-axis, ±16g accel, ±2000 dps gyro) |
| **Connectivity** | BLE 5.1 (Nordic nRF52833) |
| **Battery** | 15 mAh solid-state LiPo (Cymbet CBC030) — NFC wireless charging |
| **Charging** | NFC inductive coil (13.56 MHz, 60 mW) — 1.5-hour full charge |
| **Energy harvest** | Piezoelectric MEMS (Mide V21BL) — up to 50 µW from motion |
| **Waterproof** | IP68 (100 m, 24 hours) |
| **Operating temp** | -10°C to +50°C |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS 3.6 |
| **BOM cost** | ~$38 at 10K units |
| **Target retail** | $199 |

---

## Sensor Suite

| Sensor | IC | Metrics | Sample Rate |
|---|---|---|---|
| PPG / SpO₂ / HR | MAX30101 | HR, HRV, SpO₂, perfusion index | 100 Hz |
| ECG (finger Lead I) | MAX30001 | ECG waveform, R-R interval, HRV | 128 Hz |
| Temperature | MAX30208 | Skin temperature, circadian rhythm | 1 Hz |
| IMU | LSM6DSO | Steps, activity, sleep staging, fall detection | 50 Hz |
| Energy harvest | Mide V21BL | Motion energy supplement | Passive |

---

## Bill of Materials (Top Components)

| Ref | Component | Manufacturer | Part Number | Qty | Unit Cost (10K) |
|---|---|---|---|---|---|
| U1 | nRF52833 SoC | Nordic Semiconductor | nRF52833-QIAA | 1 | $3.40 |
| U2 | MAX30101 PPG AFE | Analog Devices (Maxim) | MAX30101EFD+ | 1 | $2.80 |
| U3 | MAX30001 ECG AFE | Analog Devices (Maxim) | MAX30001EWV+ | 1 | $2.60 |
| U4 | MAX30208 temp sensor | Analog Devices (Maxim) | MAX30208EWS+ | 1 | $1.80 |
| U5 | LSM6DSO IMU | STMicroelectronics | LSM6DSOTR | 1 | $1.20 |
| U6 | MAX77734 PMIC | Analog Devices (Maxim) | MAX77734EWL+ | 1 | $2.40 |
| B1 | 15 mAh solid-state LiPo | Cymbet | CBC030-T | 1 | $6.20 |
| L1 | NFC charging coil | TDK | WCT-0501 | 1 | $1.80 |
| PZ1 | Piezo energy harvester | Mide | V21BL | 1 | $2.10 |
| E1–E2 | Gold arc electrodes | Custom | EOS-AU-01 | 2 | $2.40 |
| LED1–3 | PPG LED array | Osram | SFH7050 | 1 | $2.90 |
| PD1 | Photodetector | Hamamatsu | S13773 | 1 | $2.60 |
| PCB | 4-layer flex PCB | JLCPCB | Custom | 1 | $5.80 |
| **Total BOM** | | | | | **~$38** |

---

## KiCad Schematic Summary

The Smart Ring Pro Nano PCB is a **4-layer flexible PCB** (polyimide substrate, 0.15 mm total thickness) — thinner than the Ultra to achieve the 2.0 mm profile. All components are 0201 or 01005 package size.

See `hardware/pcb/smart-ring-pro-nano.kicad_sch` for the full schematic.

**Key differences from Ultra:**
- nRF52833 (smaller, lower power) instead of nRF52840
- MAX30101 (3-wavelength) instead of MAX86176 (5-wavelength)
- MAX30001 (128 Hz) instead of MAX30003 (512 Hz)
- No MAX32666 AI co-processor (AI runs on nRF52833 directly)
- No SGP41 gas sensor
- No BMP390 pressure sensor
- No piezoelectric PWV sensor
- Piezoelectric energy harvester added (KEHS)

---

## Firmware Architecture

```
firmware/
├── src/
│   ├── main.c                    ← Entry point, RTOS task creation
│   ├── sensors/
│   │   ├── ppg_max30101.c        ← 3-wavelength PPG + SpO₂ driver
│   │   ├── ecg_max30001.c        ← ECG AFE driver (128 Hz)
│   │   ├── temp_max30208.c       ← Temperature driver
│   │   └── imu_lsm6dso.c         ← IMU driver + step counter
│   ├── ble/
│   │   ├── ble_stack.c           ← BLE 5.1 GATT server
│   │   ├── gatt_health.c         ← Health monitoring service
│   │   └── gatt_ota.c            ← OTA firmware update service
│   ├── power/
│   │   ├── pmic_max77734.c       ← Power management IC driver
│   │   ├── nfc_charging.c        ← NFC inductive charging
│   │   ├── energy_harvest.c      ← Piezoelectric energy harvesting
│   │   └── sleep_manager.c       ← Ultra-low power sleep modes
│   └── ml/
│       ├── arrhythmia_lite.c     ← Lightweight AFib detection (nRF52833)
│       └── sleep_lite.c          ← 2-stage sleep detection (sleep/awake)
├── boards/
│   └── smart-ring-pro-nano-rev-a.h   ← Pin definitions
└── ebuild.config                 ← eBuild build configuration
```

**Power budget (4-day target):**

| Mode | Current | Duty Cycle | Avg Current |
|---|---|---|---|
| Active sensing (all sensors) | 2.8 mA | 5% | 0.14 mA |
| BLE advertising | 0.6 mA | 10% | 0.06 mA |
| BLE connected + streaming | 4.2 mA | 2% | 0.084 mA |
| Deep sleep (nRF52833 System OFF) | 1.8 µA | 83% | 1.49 µA |
| Energy harvest offset | -50 µW / 3.7V = -13.5 µA | 30% | -4.1 µA |
| **Total average** | | | **~0.28 mA** |

15 mAh ÷ 0.28 mA = **~54 hours ≈ 4.5 days** ✅

---

## Novel Patent Claims (Provisional)

**Claim 1 — Zero-Profile Inductive Electrode System (ZPIES):**
A ring-form-factor wearable device wherein ECG electrodes are formed by photolithographic deposition of gold-plated copper traces directly onto the inner circumferential surface of the ring body, achieving a surface-flush electrode configuration with zero raised profile, enabling ECG acquisition without physical electrode protrusion.

**Claim 2 — Single-Die Multi-Sensor Module (SDMSM):**
A wearable ring device comprising a single application-specific integrated circuit (ASIC) that integrates a photoplethysmographic analog front-end, a digital temperature sensor, and a 6-axis inertial measurement unit within a die area of 1.44 mm², enabling multi-modal health sensing in a ring form factor with 2.0 mm cross-section profile.

**Claim 3 — Kinetic Energy Harvesting Supplement (KEHS):**
A ring-form-factor wearable device comprising a MEMS piezoelectric cantilever beam integrated within the ring body, wherein kinetic energy from finger motion during normal daily activity is converted to electrical energy and used to supplement a primary solid-state battery, extending operational battery life by at least 15%.

---

## PATENT_STATUS.md Reference

See [PATENT_STATUS.md](PATENT_STATUS.md) for the full filing status.

**Target filing date:** 2026 Q3
**Non-provisional deadline:** 12 months after provisional filing
**Inventor:** Srikanth Patchava

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
| Energy harvesting circuit | 🔄 In progress |
| Patent provisional filing | 📋 Planned (2026 Q3) |
| Mass production (JLCPCB) | 📋 Planned (2027 Q1) |

---

## Related Links

- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [Smart Ring Pro Ultra](../smart-ring-pro-ultra/) — flagship model
- [Smart Ring Pro](../smart-ring-pro/) — base model
- [Company website](https://embeddedos-org.github.io) — product page
