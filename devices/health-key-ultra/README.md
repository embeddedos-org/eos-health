# HEALTH-KEY ULTRA

> **Patent Pending** — U.S. Provisional Application No. **64/073,334** (Filed May 23, 2026)

**HEALTH-KEY ULTRA** is a USB-C pendrive-form-factor health monitoring device that plugs directly into any smartphone, laptop, or tablet. It delivers clinical-grade ECG, SpO₂, blood alcohol content (BAC), heart rate, body temperature, UV index, and motion sensing — all in a device the size of a USB drive.

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | USB-C pendrive (≈ 8 × 2.5 × 1.2 cm) |
| **MCU** | Nordic nRF52840 (Cortex-M4F @ 64 MHz, BLE 5.3) |
| **ECG / BioZ** | Maxim MAX30001 — 18-bit ADC, 512 Hz, single-lead |
| **PPG / SpO₂** | Maxim MAX30102 — IR + Red dual-wavelength |
| **Temperature** | Maxim MAX30205 — ±0.1°C accuracy |
| **IMU** | ST LSM6DSO — 6-axis, 6.5 µA |
| **Gas / BAC** | Bosch BME688 — VOC, humidity, pressure |
| **UV sensor** | VEML6075 — UVA + UVB |
| **Connectivity** | BLE 5.3 + USB-C (data + pass-through charging) |
| **Storage** | 64 GB onboard flash (health data vault) |
| **Battery** | 50 mAh LiPo (charged via USB-C) |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS |

---

## Patent Status

| Field | Value |
|---|---|
| **Application No.** | 64/073,334 |
| **Filing Date** | May 23, 2026 |
| **Priority Date** | May 23, 2026 |
| **Inventor** | Srikanth Patchava |
| **Entity Status** | Micro Entity |
| **Non-Provisional Deadline** | **May 23, 2027** |
| **Zenodo Record** | [zenodo.org/records/20361196](https://zenodo.org/records/20361196) |

See [PATENT_STATUS.md](PATENT_STATUS.md) for the full filing history and CIP strategy.

---

## Folder Structure

```
devices/health-key-ultra/
├── hardware/
│   ├── pcb/                ← KiCad PCB project (schematic + layout)
│   ├── cad/                ← Mechanical enclosure (STEP, STL)
│   ├── ee/                 ← EE schematics (PDF export)
│   ├── assembly/           ← Assembly guide, pick-and-place
│   └── datasheets/         ← Component datasheets
├── firmware/               ← nRF52840 firmware (eBuild + Zephyr)
├── patent/
│   ├── provisional/        ← USPTO provisional application documents
│   ├── cip/                ← CIP strategy + i.MX RT700 upgrade plan
│   ├── figures/            ← Patent drawings (PDF, SVG)
│   └── filing-package/     ← Complete USPTO filing package
├── academic/
│   ├── journal/            ← IEEE JBHI journal paper
│   ├── white-paper/        ← Technical white paper (Zenodo)
│   ├── conference-paper/   ← IEEE EMBC conference paper
│   └── thesis/             ← PhD thesis chapter
├── roadmap/                ← 5-phase product roadmap
├── eb1a/                   ← EB-1A evidence cross-reference
└── PATENT_STATUS.md        ← Official filing status
```

---

## Getting Started

### Firmware Development

```bash
cd devices/health-key-ultra/firmware

# Install eBuild toolchain (EmbeddedOS)
# See firmware/FLASHING_GUIDE.md for full setup

# Build
ebuild build health-key-ultra

# Flash via J-Link SWD
ebuild flash health-key-ultra --interface jlink

# Flash via USB DFU
ebuild flash health-key-ultra --interface dfu

# OTA update via BLE
# Use the Single Health Hub mobile app → Device Settings → Firmware Update
```

### Hardware Review

Open `hardware/pcb/health-key-ultra.kicad_pro` in KiCad 8.0 or later.

---

## Sensing Capabilities

| Metric | Sensor | Accuracy | Sample Rate |
|---|---|---|---|
| ECG (single-lead) | MAX30001 | ±1% | 512 Hz |
| Heart rate | MAX30001 + MAX30102 | ±2 bpm | 1 Hz |
| SpO₂ | MAX30102 | ±2% | 1 Hz |
| Body temperature | MAX30205 | ±0.1°C | 0.1 Hz |
| BAC (breath) | BME688 | Semi-quantitative | On-demand |
| VOC / air quality | BME688 | IAQ index | 1 Hz |
| UV index | VEML6075 | ±0.5 UVI | 0.1 Hz |
| Steps / activity | LSM6DSO | ±5% | 50 Hz |
| Orientation | LSM6DSO | ±2° | 50 Hz |

---

## V2 CIP Strategy

The Continuation-in-Part (CIP) application will add:

- **i.MX RT700** MCU (Cortex-M33 @ 300 MHz) for on-device AI inference
- **Passive cooling** via graphene thermal pad
- **USB 3.2 Gen 1** for 64 GB data vault access at 5 Gbps
- **Wireless charging** via USB-C PD 3.1

CIP deadline: May 23, 2027 (same as non-provisional).

---

## Related Links

- [HEALTH-KEY ULTRA original repo](https://github.com/embeddedos-org/HealthKey-Ulta) — patent history preserved
- [Zenodo record](https://zenodo.org/records/20361196) — public academic record
- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [Company website](https://embeddedos-org.github.io) — product page
