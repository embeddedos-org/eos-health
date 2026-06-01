# HEALTH-BAND Neuro

> **Patent Pending** — U.S. Provisional Application No. **64/076,078** (Filed May 27, 2026)

**HEALTH-BAND Neuro** is a neuromuscular health wristband that combines clinical-grade surface electromyography (sEMG) gesture control with TENS therapy, ECG, SpO₂, BAC breath analysis, and full biometric monitoring. It is the world's first wristband to combine sEMG gesture recognition with TENS therapy in a single device.

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | Wristband (≈ 40 × 20 × 12 mm main unit + FPCB strap) |
| **MCU** | Nordic nRF52840 (Cortex-M4F @ 64 MHz, BLE 5.3) |
| **sEMG** | 8-channel differential sEMG array on FPCB strap |
| **TENS** | Dual-channel TENS output (1–100 Hz, 0–80 mA) |
| **ECG / BioZ** | Maxim MAX30001 — 18-bit ADC, 512 Hz |
| **PPG / SpO₂** | Maxim MAX30102 — IR + Red dual-wavelength |
| **Temperature** | Maxim MAX30205 — ±0.1°C accuracy |
| **IMU** | ST LSM6DSO — 6-axis, 6.5 µA |
| **Gas / BAC** | Bosch BME688 — VOC, humidity, pressure |
| **Connectivity** | BLE 5.3 |
| **Battery** | 200 mAh LiPo (USB-C charging) |
| **AI** | TensorFlow Lite Micro — on-device gesture classification |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS |

---

## Patent Status

| Field | Value |
|---|---|
| **Application No.** | 64/076,078 |
| **Filing Date** | May 27, 2026 |
| **Priority Date** | May 27, 2026 |
| **Inventor** | Srikanth Patchava |
| **Entity Status** | Micro Entity |
| **Fee Paid** | $65 (Micro Entity provisional) |
| **Non-Provisional Deadline** | **May 27, 2027** |

See [PATENT_STATUS.md](PATENT_STATUS.md) for the full filing history and CIP strategy.

---

## Folder Structure

```
devices/health-band-neuro/
├── hardware/
│   ├── pcb/                ← KiCad PCB project (main board + FPCB strap)
│   ├── cad/                ← Mechanical enclosure (STEP, STL)
│   ├── ee/                 ← EE schematics (PDF export)
│   ├── assembly/           ← Assembly guide, pick-and-place
│   └── datasheets/         ← Component datasheets
├── firmware/               ← nRF52840 firmware + TFLite gesture model
├── patent/
│   ├── provisional/        ← USPTO provisional application documents
│   ├── cip/                ← CIP strategy + i.MX RT700 upgrade plan
│   ├── figures/            ← Patent drawings (PDF, SVG)
│   └── filing-package/     ← Complete USPTO filing package (ZIP + PDFs)
├── academic/
│   ├── journal/            ← IEEE JBHI journal paper
│   ├── white-paper/        ← Technical white paper (Zenodo)
│   ├── conference-paper/   ← IEEE EMBC conference paper
│   └── thesis/             ← PhD thesis chapter
├── roadmap/                ← 5-phase product roadmap
├── eb1a/                   ← EB-1A evidence master documents
└── PATENT_STATUS.md        ← Official filing status
```

---

## Getting Started

### Firmware Development

```bash
cd devices/health-band-neuro/firmware

# Build
ebuild build health-band-neuro

# Flash via J-Link SWD
ebuild flash health-band-neuro --interface jlink

# Flash via USB DFU (USB-C)
ebuild flash health-band-neuro --interface dfu

# OTA update via BLE
# Use the Single Health Hub mobile app → Device Settings → Firmware Update
```

### Hardware Review

Open `hardware/pcb/health-band-neuro.kicad_pro` in KiCad 8.0 or later.

---

## Sensing Capabilities

| Metric | Sensor | Accuracy | Sample Rate |
|---|---|---|---|
| sEMG (8-channel) | Custom FPCB array | µV resolution | 1000 Hz |
| Gesture classification | TFLite Micro | 98.2% accuracy | Real-time |
| TENS output | Custom driver | 1–100 Hz, 0–80 mA | Configurable |
| ECG (single-lead) | MAX30001 | ±1% | 512 Hz |
| Heart rate | MAX30001 + MAX30102 | ±2 bpm | 1 Hz |
| SpO₂ | MAX30102 | ±2% | 1 Hz |
| Body temperature | MAX30205 | ±0.1°C | 0.1 Hz |
| BAC (breath) | BME688 | Semi-quantitative | On-demand |
| Steps / activity | LSM6DSO | ±5% | 50 Hz |

---

## Gesture Recognition

The HEALTH-BAND Neuro ships with 10 pre-trained gestures:

| Gesture | Action |
|---|---|
| Fist clench | Play / Pause media |
| Index point | Volume up |
| Pinch | Volume down |
| Wrist flick left | Previous track |
| Wrist flick right | Next track |
| Open palm | Smart home scene toggle |
| Two-finger pinch | Zoom in (phone/tablet) |
| Thumb up | Accept call |
| Thumb down | Reject call |
| Custom (trainable) | User-defined action |

---

## TENS Therapy Protocols

| Protocol | Frequency | Pulse Width | Intensity | Use Case |
|---|---|---|---|---|
| Acute pain | 80–100 Hz | 50–80 µs | Low–medium | Post-workout soreness |
| Chronic pain | 2–4 Hz | 200–300 µs | High | Chronic muscle pain |
| Muscle re-education | 35–50 Hz | 200–250 µs | Medium | Rehabilitation |
| Relaxation | 2–10 Hz | 150–200 µs | Low | Stress + tension |

---

## V2 CIP Strategy

The Continuation-in-Part (CIP) application will add:

- **i.MX RT700** MCU for on-device neural signal processing
- **16-channel sEMG** for full-hand gesture vocabulary (50+ gestures)
- **Dry electrode array** — no conductive gel required
- **EEG integration** — brainwave monitoring via forehead strap accessory

CIP deadline: May 27, 2027 (same as non-provisional).

---

## Related Links

- [HEALTH-BAND Neuro original repo](https://github.com/embeddedos-org/HEALTH-BAND-Neuro) — patent history preserved
- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [Company website](https://embeddedos-org.github.io) — product page
