# HEALTH-LAB
### EoS Health — Wearable Biochemistry Lab Patch

**Inventor:** Srikanth Patchava
**Organization:** Embedded Operating Systems Research Foundation (EoS Foundation), 501(c)(3), EIN: 41-4821627
**Patent Docket:** EOS-2026-004
**Status:** Design complete — Provisional patent target: 2026 Q3

---

## Overview

HEALTH-LAB is a flexible adhesive biosensor patch that functions as a wearable biochemistry laboratory — continuously monitoring blood glucose, lactate, cortisol, electrolytes, and pH from sweat and interstitial fluid without any needle or blood draw. It is offered in two tiers — **HEALTH-LAB** (base) and **HEALTH-LAB Ultra** (flagship) — sharing the same product identity, patent family, and mobile app integration.

> "A clinical lab on your skin, worn like a bandage."

| | HEALTH-LAB | HEALTH-LAB Ultra |
|---|---|---|
| **Size** | 30×20 mm | 35×25 mm |
| **Wear Duration** | 7 days | 14 days |
| **Analytes** | 4 | 7 |
| **Glucose** | ✅ Sweat only | ✅ Sweat + iontophoresis |
| **Lactate** | ✅ Sweat only | ✅ Sweat + iontophoresis |
| **Cortisol** | — | ✅ |
| **Electrolytes (Na⁺, K⁺)** | ✅ | ✅ |
| **Uric Acid** | — | ✅ |
| **pH** | ✅ | ✅ |
| **Self-Calibration** | 1 reference electrode | 3 reference electrodes + Kalman filter |
| **Accuracy** | ±15% over 7 days | ±5% over 14 days |
| **Battery** | 20 mAh, 7-day | 45 mAh, 14-day |
| **Target Price** | $49/patch | $89/patch |
| **BOM (100K units)** | ~$12 | ~$22 |

---

## Novel Patent Claims

Three core innovations distinguish HEALTH-LAB from all existing biosensor patches (Abbott FreeStyle Libre, Dexcom Stelo, academic sweat patches):

### 1. Nano-Electrode Biosensor Array (NEBA)
Working electrodes fabricated by **aerosol jet printing (AJP)** of platinum-black nanoparticle ink on a flexible polyimide substrate. AJP enables 50 µm line width (vs. 200–500 µm for screen printing), 100 µm electrode spacing, and high surface area for enzyme immobilization. Cross-analyte interference between any two adjacent electrodes is less than 2% — achieved through Nafion membrane barriers and electrode spacing optimization. No prior art has demonstrated 7-analyte simultaneous sensing on a single wearable patch without microfluidic separation.

### 2. Dual-Mode Sampling Architecture (DMSA) — Ultra
The **same electrode array** operates in two time-multiplexed modes: passive electrochemical sensing of sweat analytes, and active reverse iontophoresis for transdermal glucose and lactate extraction from interstitial fluid. A 200 µA current pulse (30 seconds every 5 minutes) drives analytes through the skin via electroosmosis. No prior art has demonstrated time-multiplexed sweat sensing and iontophoresis on the same electrode array.

### 3. Self-Calibrating Biosensor Network (SCBN) — Ultra
Three independent Ag/AgCl reference electrodes distributed at the vertices of a triangle across the patch surface, with a MAX30208 skin temperature sensor. A Kalman filter continuously estimates baseline drift using the reference electrode measurements as ground truth, with temperature compensation applied to all potentiometric measurements. Maintains ±5% accuracy over 14 days of continuous wear without user intervention.

---

## Hardware — HEALTH-LAB Ultra

### Key ICs

| IC | Function | Package |
|---|---|---|
| nRF52840 | Main MCU, BLE 5.3 | WLCSP 7×7 |
| LMP91000 (×3) | Potentiostat AFE | SOT-23-8 |
| MAX30101 | PPG (SpO₂ + HR) | OLGA 20 |
| MAX30208 | Skin temperature | WLP 1.5×1.5 |
| LIS2DH12 | 3-axis accelerometer | LGA 2×2 |
| INA213 | Iontophoresis current sense | SC-70 |
| MAX77734 | PMIC | WLP 1.6×1.6 |
| TDK WCT-1501 | NFC charging coil | Flex |

### Biosensor Array — Ultra (7 analytes)

| Electrode | Functionalization | Analyte | Detection | Range |
|---|---|---|---|---|
| W1 | Glucose oxidase (GOx) + Nafion | Glucose | Amperometric | 40–400 mg/dL |
| W2 | Lactate oxidase (LOx) + Nafion | Lactate | Amperometric | 0.5–20 mmol/L |
| W3 | Molecularly imprinted polymer (MIP) | Cortisol | Impedimetric | 1–200 ng/mL |
| W4 | Uricase (UOx) + Nafion | Uric acid | Amperometric | 2–12 mg/dL |
| W5 | Valinomycin ISE membrane | Sodium (Na⁺) | Potentiometric | 10–200 mmol/L |
| W6 | Nonactin ISE membrane | Potassium (K⁺) | Potentiometric | 1–20 mmol/L |
| W7 | Iridium oxide (IrOx) | pH | Potentiometric | pH 4–9 |
| R1, R2, R3 | Ag/AgCl | Reference | Potentiometric | — |
| IA, IC | Platinum | Iontophoresis | Current source | 0–300 µA |

### Biosensor Array — Base (4 analytes)

| Electrode | Functionalization | Analyte | Detection |
|---|---|---|---|
| W1 | Glucose oxidase (GOx) + Nafion | Glucose | Amperometric |
| W2 | Lactate oxidase (LOx) + Nafion | Lactate | Amperometric |
| W3 | Valinomycin ISE membrane | Sodium (Na⁺) | Potentiometric |
| W4 | IrOx | pH | Potentiometric |
| R1 | Ag/AgCl | Reference | Potentiometric |

### Bill of Materials — Ultra (Top Components, 100K units)

| Component | Part Number | Unit Cost | Supplier |
|---|---|---|---|
| nRF52840 MCU | nRF52840-QIAA | $2.80 | Nordic Semi |
| LMP91000 (×3) | LMP91000SDX/NOPB | $1.20 each | Texas Instruments |
| MAX30208 Temp | MAX30208EWS+ | $0.65 | Analog Devices |
| LIS2DH12 Accel | LIS2DH12TR | $0.45 | STMicroelectronics |
| INA213 Current sense | INA213AIDCK | $0.55 | Texas Instruments |
| MAX77734 PMIC | MAX77734EWA+ | $1.80 | Analog Devices |
| Flex LiPo 45mAh | Grepow GRP3040 | $1.20 | Grepow |
| NFC coil | TDK WCT-1501 | $0.95 | TDK |
| Kapton substrate | 50HN 35×25mm | $0.30 | DuPont |
| Pt-black ink (NEBA) | Sigma 685453 | $1.50 | Sigma-Aldrich |
| Enzyme functionalization | GOx/LOx/UOx/MIP | $2.80 | Custom |
| Ag/AgCl reference (×3) | Custom screen print | $0.60 | Custom |
| Medical adhesive | 3M 1524 | $0.45 | 3M |
| Flex PCB 2-layer | Custom | $1.80 | JLCPCB |
| Passives + misc | — | $2.15 | Various |
| **Total BOM** | | **~$22** | |

---

## Hardware — HEALTH-LAB Base

### Key ICs

| IC | Function | Package |
|---|---|---|
| nRF52833 | Main MCU, BLE 5.1 | WLCSP 7×7 |
| LMP91000 (×1) | Potentiostat AFE | SOT-23-8 |
| MAX30208 | Skin temperature | WLP 1.5×1.5 |
| MAX77734 | PMIC | WLP 1.6×1.6 |
| TDK WCT-1501 | NFC charging coil | Flex |

---

## Patch Construction (Layer Stack)

```
Layer 1 (bottom): Medical-grade adhesive (3M 1524, 0.05mm) — skin contact
Layer 2:          Biosensor substrate (Kapton 50HN, 0.05mm) — NEBA electrode array
Layer 3:          Electronics substrate (Kapton 100HN, 0.10mm) — 2-layer flex PCB
Layer 4:          Flexible LiPo battery (0.50mm)
Layer 5:          NFC charging coil (TDK WCT-1501, 0.10mm)
Layer 6 (top):    Medical-grade overmold (0.05mm) — waterproofing
─────────────────────────────────────────────────────
Total thickness:  ~1.0mm (Ultra) / ~0.85mm (Base)
```

---

## Dual-Mode Sampling Protocol (Ultra)

```
t=0s:    Begin iontophoresis (200µA, IA→IC, 30 seconds)
t=30s:   End iontophoresis; measure W1 (glucose), W2 (lactate) — interstitial fluid
t=60s:   Measure W3 (cortisol), W5 (Na⁺), W6 (K⁺), W7 (pH) — sweat
t=120s:  Measure W4 (uric acid) — sweat
t=270s:  End cycle; begin next iontophoresis pulse
─────────────────────────────────────────────────────
Cycle period:     5 minutes
Glucose updates:  Every 5 minutes (interstitial fluid)
Electrolyte updates: Every 5 minutes (sweat)
```

---

## Firmware Architecture

```
health-lab-firmware/
├── src/
│   ├── biosensors/
│   │   ├── potentiostat.c     # LMP91000 driver (×3 for Ultra)
│   │   ├── glucose.c          # GOx amperometric measurement
│   │   ├── lactate.c          # LOx amperometric measurement
│   │   ├── cortisol.c         # MIP impedimetric measurement (Ultra)
│   │   ├── uric_acid.c        # UOx amperometric measurement (Ultra)
│   │   ├── electrolytes.c     # Na⁺/K⁺ potentiometric measurement
│   │   ├── ph.c               # IrOx potentiometric measurement
│   │   └── calibration.c      # SCBN Kalman filter + temp compensation
│   ├── iontophoresis/
│   │   ├── h_bridge.c         # H-bridge MOSFET control (Ultra)
│   │   ├── current_control.c  # INA213 current sensing + PID
│   │   └── scheduler.c        # DMSA time-multiplexing scheduler
│   ├── sensors/
│   │   ├── ppg.c              # MAX30101 SpO₂ + HR
│   │   ├── temperature.c      # MAX30208 skin temp
│   │   └── accelerometer.c    # LIS2DH12 motion/activity
│   ├── ble/
│   │   ├── gatt_biochem.c     # Custom biochemical monitoring service
│   │   ├── gatt_health.c      # Health Monitoring Service (0x181D)
│   │   └── ota.c              # OTA firmware update
│   └── power/
│       ├── pmic.c             # MAX77734 power management
│       └── nfc_charge.c       # NFC inductive charging
├── boards/
│   ├── health-lab-base-rev-a.conf
│   └── health-lab-ultra-rev-a.conf
└── ebuild.config
```

---

## Mechanical Design

| Parameter | HEALTH-LAB | HEALTH-LAB Ultra |
|---|---|---|
| Dimensions | 30×20 mm | 35×25 mm |
| Total thickness | ~0.85 mm | ~1.0 mm |
| Weight | ~1.4 g | ~2.1 g |
| Substrate | Kapton 50HN | Kapton 50HN |
| Adhesive | 3M 1524 medical | 3M 1524 medical |
| Waterproofing | IPX4 (splash) | IPX7 (1m, 30min) |
| Wear location | Upper arm, abdomen, chest | Upper arm, abdomen, chest |
| Wear duration | 7 days | 14 days |
| Packaging | Sterile foil pouch | Sterile foil pouch |

---

## Patent Status

**Docket:** EOS-2026-004
**Type:** Provisional Patent Application (35 U.S.C. § 111(b))
**Target filing:** 2026 Q3
**Non-provisional deadline:** 2027 Q3 (12 months from provisional)

See [`patent/PROVISIONAL_PATENT_APPLICATION.md`](patent/PROVISIONAL_PATENT_APPLICATION.md) for full application text with 13 claims.

---

## Related Products

| Product | Repo Path | Status |
|---|---|---|
| HEALTH-KEY ULTRA | `devices/health-key-ultra/` | ✅ Patent filed (64/073,334) |
| HEALTH-BAND Neuro | `devices/health-band-neuro/` | ✅ Patent filed (64/076,078) |
| HEALTH-RING | `devices/health-ring/` | 📋 Design complete, provisional pending |
| **HEALTH-LAB** | `devices/health-lab/` | 📋 Design complete, provisional pending |

All four devices connect to the **Single Health Hub** mobile app via BLE 5.x.
