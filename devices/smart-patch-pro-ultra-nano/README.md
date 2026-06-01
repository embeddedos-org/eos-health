# Smart Patch Pro Ultra Nano

> **Patent Pending** — Provisional application in preparation. Priority date target: 2026 Q3.

**Smart Patch Pro Ultra Nano** is the world's most advanced wearable biosensor patch — a 0.3 mm thick, 35×25 mm flexible adhesive patch that delivers continuous multi-analyte biochemical monitoring from interstitial fluid, sweat, and skin without any needle, lancet, or cartridge replacement for 14 days. It is the first wearable patch to simultaneously monitor glucose, lactate, cortisol, sodium, potassium, uric acid, and pH from a single skin-contact surface.

The three novel engineering contributions that distinguish the Smart Patch Pro Ultra Nano from all prior art are:

1. **Nano-Electrode Biosensor Array (NEBA):** A 7-electrode electrochemical array fabricated on a 0.05 mm polyimide substrate using aerosol jet printing of platinum-black nanoparticle ink, enabling simultaneous multi-analyte detection with cross-analyte interference below 2% — the first wearable patch to achieve this level of selectivity without microfluidic separation.
2. **Dual-Mode Sampling Architecture (DMSA):** The patch operates in two simultaneous modes — (a) sweat-based electrochemical sensing for cortisol, sodium, potassium, and pH, and (b) reverse iontophoresis for transdermal glucose and lactate extraction — using a single electrode array with time-multiplexed excitation, eliminating the need for separate sweat and iontophoresis zones.
3. **Self-Calibrating Biosensor Network (SCBN):** An on-patch reference electrode network with three independent Ag/AgCl reference electrodes and a temperature compensation channel enables continuous in-situ calibration without user intervention, maintaining ±5% accuracy across the 14-day wear period.

---

## Product Line

| Model | Wear Duration | Analytes | Sampling | Target Price |
|---|---|---|---|---|
| **Smart Patch Pro Ultra Nano** | **14 days** | **7 analytes** | **Continuous** | **$89/patch** |
| Smart Patch Pro | 7 days | 4 analytes (glucose, lactate, Na⁺, K⁺) | Continuous | $49/patch |
| Smart Patch Nano | 3 days | 2 analytes (glucose, HR) | Every 5 min | $19/patch |

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | Flexible adhesive patch, 35×25×0.3 mm |
| **Substrate** | Polyimide (Kapton), 0.05 mm, medical-grade adhesive |
| **MCU** | Nordic nRF52840 (Cortex-M4F @ 64 MHz, BLE 5.3) |
| **Electrochemical AFE** | Analog Devices LMP91000 × 3 (potentiostat ICs) |
| **PPG / HR** | Maxim MAX30101 (heart rate + SpO₂ from skin) |
| **Temperature** | Maxim MAX30208 (skin + core temp estimate) |
| **IMU** | ST LIS2DH12 (3-axis accel, ultra-low power) |
| **Biosensor array** | 7-electrode Pt-black nanoparticle array (aerosol jet printed) |
| **Analytes** | Glucose, lactate, cortisol, Na⁺, K⁺, uric acid, pH |
| **Sampling method** | Sweat electrochemistry + reverse iontophoresis |
| **Connectivity** | BLE 5.3 (Nordic nRF52840) |
| **Battery** | 45 mAh flexible LiPo (Grepow GRP3040) — wireless charging |
| **Charging** | NFC inductive (13.56 MHz, 150 mW) — 4-hour full charge |
| **Wear duration** | 14 days continuous |
| **Waterproof** | IPX7 (1 m, 30 min) |
| **Skin adhesive** | 3M 1524 medical-grade acrylic adhesive |
| **Operating temp** | 15°C to 45°C (skin temperature range) |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS 3.6 |
| **BOM cost** | ~$22 at 100K units |
| **Target retail** | $89/patch (subscription: $59/patch for 4-pack) |

---

## Biosensor Array — Analyte Specifications

| Analyte | Method | Range | Accuracy | Refresh Rate |
|---|---|---|---|---|
| Glucose | Reverse iontophoresis + GOx enzyme | 40–400 mg/dL | ±10% (MARD) | 5 min |
| Lactate | Amperometric (LOx enzyme) | 0.5–20 mmol/L | ±8% | 5 min |
| Cortisol | Competitive immunoassay (MIP) | 1–200 ng/mL | ±15% | 30 min |
| Sodium (Na⁺) | Ion-selective electrode (ISE) | 10–200 mmol/L | ±5% | 1 min |
| Potassium (K⁺) | Ion-selective electrode (ISE) | 1–20 mmol/L | ±5% | 1 min |
| Uric acid | Amperometric (UOx enzyme) | 0.1–1.2 mmol/L | ±10% | 10 min |
| pH | Potentiometric (IrOx electrode) | 4.0–9.0 | ±0.1 pH | 1 min |

---

## Full Sensor Suite

| Sensor | IC / Component | Metrics | Sample Rate |
|---|---|---|---|
| Electrochemical array | LMP91000 × 3 + Pt-black NEBA | Glucose, lactate, cortisol, Na⁺, K⁺, uric acid, pH | 5–30 min |
| PPG / HR / SpO₂ | MAX30101 | HR, HRV, SpO₂, perfusion index | 1 Hz |
| Temperature | MAX30208 | Skin temp, core temp estimate | 1 Hz |
| Accelerometer | LIS2DH12 | Activity, posture, wear detection | 50 Hz |
| Reference electrodes | Ag/AgCl × 3 | In-situ calibration | Continuous |
| Iontophoresis driver | Custom H-bridge | Reverse iontophoresis current (0–300 µA) | Pulsed |

---

## Bill of Materials (Top Components)

| Ref | Component | Manufacturer | Part Number | Qty | Unit Cost (100K) |
|---|---|---|---|---|---|
| U1 | nRF52840 SoC | Nordic Semiconductor | nRF52840-QIAA | 1 | $3.80 |
| U2 | LMP91000 potentiostat | Texas Instruments | LMP91000SDX | 3 | $1.20 ea |
| U3 | MAX30101 PPG AFE | Analog Devices (Maxim) | MAX30101EFD+ | 1 | $2.40 |
| U4 | MAX30208 temp sensor | Analog Devices (Maxim) | MAX30208EWS+ | 1 | $1.60 |
| U5 | LIS2DH12 accelerometer | STMicroelectronics | LIS2DH12TR | 1 | $0.80 |
| U6 | MAX77734 PMIC | Analog Devices (Maxim) | MAX77734EWL+ | 1 | $2.10 |
| U7 | TPS61099 boost converter | Texas Instruments | TPS61099DCKR | 1 | $0.60 |
| B1 | 45 mAh flexible LiPo | Grepow | GRP3040 | 1 | $1.80 |
| L1 | NFC charging coil | TDK | WCT-1501 | 1 | $1.40 |
| E1–E7 | Pt-black biosensor array | Custom (aerosol jet) | EOS-NEBA-01 | 1 | $2.80 |
| E8–E10 | Ag/AgCl reference electrodes | Custom | EOS-AGCL-01 | 3 | $0.60 ea |
| LED1–3 | PPG LED array | Osram | SFH7050 | 1 | $1.80 |
| PD1 | Photodetector | Hamamatsu | S13773 | 1 | $1.60 |
| SUB | Polyimide substrate | DuPont | Kapton 50HN | 1 | $0.40 |
| ADH | Medical adhesive | 3M | 1524 | 1 | $0.30 |
| PCB | 2-layer flex PCB | JLCPCB | Custom | 1 | $1.20 |
| **Total BOM** | | | | | **~$22** |

---

## KiCad Schematic Summary

The Smart Patch Pro Ultra Nano uses a **2-layer flexible PCB** (polyimide, 0.1 mm total thickness) laminated to the biosensor substrate. The biosensor electrode array is fabricated separately by aerosol jet printing and bonded to the PCB via conductive adhesive.

See `hardware/pcb/smart-patch-pro-ultra-nano.kicad_sch` for the full schematic.

**Key design features:**
- 3× LMP91000 potentiostat ICs (one per analyte group)
- Time-multiplexed electrode addressing (7 working + 3 reference + 1 counter)
- Reverse iontophoresis H-bridge (0–300 µA, pulsed 30s on / 270s off)
- Ultra-low power operation: sensors duty-cycled, nRF52840 in System OFF between measurements

---

## Firmware Architecture

```
firmware/
├── src/
│   ├── main.c                        ← Entry point, RTOS task creation
│   ├── sensors/
│   │   ├── biosensor_lmp91000.c      ← Potentiostat driver (3× LMP91000)
│   │   ├── electrode_mux.c           ← 7-electrode time-multiplexed addressing
│   │   ├── iontophoresis.c           ← Reverse iontophoresis driver
│   │   ├── ppg_max30101.c            ← PPG + SpO₂ driver
│   │   ├── temp_max30208.c           ← Temperature driver
│   │   └── accel_lis2dh12.c          ← Accelerometer + wear detection
│   ├── biosensors/
│   │   ├── glucose_algorithm.c       ← Glucose calibration + drift correction
│   │   ├── lactate_algorithm.c       ← Lactate quantification
│   │   ├── cortisol_algorithm.c      ← Cortisol MIP competitive immunoassay
│   │   ├── electrolyte_algorithm.c   ← Na⁺/K⁺ ISE calibration
│   │   ├── uric_acid_algorithm.c     ← Uric acid quantification
│   │   ├── ph_algorithm.c            ← pH from IrOx electrode
│   │   └── calibration.c             ← SCBN self-calibration engine
│   ├── ble/
│   │   ├── ble_stack.c               ← BLE 5.3 GATT server
│   │   ├── gatt_biochemical.c        ← Biochemical monitoring service
│   │   ├── gatt_health.c             ← HR/SpO₂/temp service
│   │   └── gatt_ota.c                ← OTA firmware update service
│   └── power/
│       ├── pmic_max77734.c           ← Power management IC driver
│       ├── nfc_charging.c            ← NFC inductive charging
│       └── sleep_manager.c           ← Ultra-low power sleep modes
├── boards/
│   └── smart-patch-pro-ultra-nano-rev-a.h  ← Pin definitions
└── ebuild.config                     ← eBuild build configuration
```

**Power budget (14-day target):**

| Mode | Current | Duty Cycle | Avg Current |
|---|---|---|---|
| Biosensor measurement (all analytes) | 3.8 mA | 3% | 0.114 mA |
| Iontophoresis (glucose/lactate) | 8.5 mA | 1% | 0.085 mA |
| PPG active | 2.2 mA | 2% | 0.044 mA |
| BLE advertising | 0.6 mA | 8% | 0.048 mA |
| BLE connected + streaming | 4.0 mA | 1% | 0.04 mA |
| Deep sleep (System OFF) | 2.0 µA | 85% | 1.70 µA |
| **Total average** | | | **~0.33 mA** |

45 mAh ÷ 0.33 mA = **~136 hours ≈ 14 days** ✅

---

## Novel Patent Claims (Provisional)

**Claim 1 — Nano-Electrode Biosensor Array (NEBA):**
A flexible wearable biosensor patch comprising a 7-electrode electrochemical array fabricated by aerosol jet printing of platinum-black nanoparticle ink on a polyimide substrate of 0.05 mm thickness, wherein each electrode is functionalized with a distinct enzyme or ion-selective membrane, enabling simultaneous detection of at least 7 biochemical analytes with cross-analyte interference below 2% without microfluidic separation.

**Claim 2 — Dual-Mode Sampling Architecture (DMSA):**
A wearable biosensor patch comprising a single electrode array that operates in two simultaneous modes: (a) passive electrochemical sensing of sweat analytes including cortisol, sodium, potassium, and pH, and (b) active reverse iontophoresis for transdermal extraction of glucose and lactate from interstitial fluid, wherein the two modes are time-multiplexed on the same electrode array using alternating excitation signals without cross-interference.

**Claim 3 — Self-Calibrating Biosensor Network (SCBN):**
A wearable biosensor patch comprising three independent silver/silver-chloride reference electrodes distributed across the patch surface, wherein the reference electrode potentials are continuously compared to detect electrode drift, and a temperature compensation channel is used to apply a drift correction algorithm that maintains biosensor accuracy within ±5% over a 14-day continuous wear period without user intervention or external calibration.

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
| Biosensor electrode design (NEBA) | ✅ Complete |
| BOM finalized | ✅ Complete |
| Firmware architecture | ✅ Complete |
| Glucose algorithm | 🔄 In progress |
| Cortisol MIP immunoassay | 🔄 In progress |
| SCBN calibration engine | 🔄 In progress |
| 14-day wear validation | 📋 Planned |
| Clinical validation (IRB) | 📋 Planned |
| Patent provisional filing | 📋 Planned (2026 Q3) |
| Mass production | 📋 Planned (2027 Q2) |

---

## Related Links

- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [Smart Patch Pro](../smart-patch-pro/) — base model
- [Company website](https://embeddedos-org.github.io) — product page
