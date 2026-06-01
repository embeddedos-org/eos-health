# Smart Ring Pro

> **Status: Research Phase** — Pre-patent, active hardware design

**Smart Ring Pro** is a titanium smart ring that delivers 24/7 passive health monitoring including heart rate variability (HRV), SpO₂, sleep stage analysis, ketone estimation, continuous stress scoring, and step counting — all from a device worn on the finger.

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | Titanium ring (sizes 6–13, ≈ 2.5 mm profile) |
| **MCU** | Nordic nRF52840 (Cortex-M4F @ 64 MHz, BLE 5.3) |
| **PPG / SpO₂** | Maxim MAX30102 — IR + Red + Green tri-wavelength |
| **Temperature** | Maxim MAX30205 — ±0.1°C |
| **IMU** | ST LSM6DSO — 6-axis accelerometer + gyroscope |
| **Connectivity** | BLE 5.3 |
| **Battery** | 15 mAh LiPo (wireless charging via NFC coil) |
| **Waterproof** | IP68 (100 m) |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS |

---

## Sensing Capabilities

| Metric | Method | Notes |
|---|---|---|
| Heart rate | PPG (MAX30102) | Continuous |
| HRV (RMSSD) | PPG-derived | 5-minute windows |
| SpO₂ | Dual-wavelength PPG | Spot + continuous |
| Sleep stages | HRV + movement | REM / NREM / Deep / Awake |
| Stress score | HRV coherence | 0–100 scale |
| Ketone estimation | Skin temperature + HRV | Research algorithm |
| Steps | LSM6DSO | ±5% accuracy |
| Skin temperature | MAX30205 | Circadian trend tracking |

---

## Folder Structure

```
devices/smart-ring-pro/
├── hardware/
│   ├── pcb/                ← Flex PCB design (KiCad)
│   ├── cad/                ← Ring enclosure (STEP, STL)
│   ├── 3d-models/          ← 3D models for all ring sizes
│   └── datasheets/         ← Component datasheets
├── firmware/               ← nRF52840 ring firmware
└── docs/
    ├── sensing-strategy.md ← PPG + HRV algorithm design
    ├── battery-design.md   ← 15 mAh LiPo + NFC charging
    └── data-architecture.md ← BLE GATT + local storage
```

---

## Development Status

| Milestone | Status |
|---|---|
| Hardware schematic | ✅ Complete |
| PCB layout | ✅ Complete |
| 3D enclosure | ✅ Complete |
| Firmware (basic BLE) | 🔄 In progress |
| Sleep stage algorithm | 🔄 In progress |
| Patent provisional | 📋 Planned |
| Clinical validation | 📋 Planned |
| Mass production | 📋 Planned |

---

## Related Links

- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [eCAD-Hardware-Products](https://github.com/embeddedos-org/eCAD-Hardware-Products) — original CAD source
- [Company website](https://embeddedos-org.github.io) — product page
