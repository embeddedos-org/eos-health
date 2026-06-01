# Smart Patch Pro

> **Status: Research Phase** — Pre-patent, active hardware design

**Smart Patch Pro** is a flexible adhesive patch worn on the upper arm that provides continuous glucose monitoring (CGM), electrolyte tracking, hydration analysis, skin pH, lactate sensing, and monthly blood panel analysis via a replaceable micro-blood cartridge.

---

## Key Specifications

| Parameter | Value |
|---|---|
| **Form factor** | Flexible adhesive patch (≈ 40 × 30 × 3 mm) |
| **MCU** | Nordic nRF52840 (Cortex-M4F @ 64 MHz, BLE 5.3) |
| **CGM sensor** | Electrochemical glucose biosensor (interstitial fluid) |
| **Electrolytes** | Ion-selective electrode array (Na⁺, K⁺, Mg²⁺, Zn²⁺) |
| **BioZ** | Bioimpedance spectroscopy (hydration, body composition) |
| **pH sensor** | Potentiometric skin pH electrode |
| **Lactate** | Enzymatic sweat lactate sensor |
| **Blood cartridge** | Micro-fluidic cartridge (monthly replacement) |
| **Connectivity** | BLE 5.3 |
| **Battery** | 30 mAh flexible LiPo (7-day patch life) |
| **Waterproof** | IP67 |
| **Build system** | eBuild (EmbeddedOS) + Zephyr RTOS |

---

## Sensing Capabilities

| Metric | Sensor | Frequency |
|---|---|---|
| Blood glucose (CGM) | Electrochemical biosensor | Every 15 min |
| Sodium (Na⁺) | Ion-selective electrode | Every 4 hours |
| Potassium (K⁺) | Ion-selective electrode | Every 4 hours |
| Magnesium (Mg²⁺) | Ion-selective electrode | Every 4 hours |
| Zinc (Zn²⁺) | Ion-selective electrode | Every 4 hours |
| Hydration level | Bioimpedance | 3× daily |
| Skin pH | Potentiometric electrode | Every 4 hours |
| Lactate | Enzymatic sweat sensor | During exercise |
| Vitamins A, C, D, E, K, B1–B12 | Monthly blood cartridge | Monthly |
| Iron, calcium, magnesium, zinc | Monthly mineral cartridge | Monthly |

---

## Cartridge System

The Smart Patch Pro uses a **replaceable cartridge** system:

| Cartridge | Replacement Interval | Metrics |
|---|---|---|
| Sensor patch | Weekly | CGM, electrolytes, pH, lactate |
| Blood panel cartridge | Monthly | Full vitamin + mineral panel |

The cartridge interface is documented in `hardware/cartridge_interface.md`.

---

## Folder Structure

```
devices/smart-patch-pro/
├── hardware/
│   ├── pcb/                ← Flexible PCB design (KiCad)
│   ├── cad/                ← Patch enclosure + cartridge housing
│   ├── 3d-models/          ← 3D models for patch + cartridge
│   └── datasheets/         ← Biosensor datasheets
├── firmware/               ← Patch MCU firmware
└── docs/
    ├── cgm-strategy.md     ← Continuous glucose monitoring algorithm
    ├── electrolyte-sensing.md ← Ion-selective electrode design
    ├── cartridge-interface.md ← Micro-fluidic cartridge specification
    └── 24hr-pattern.md     ← Daily sensing schedule
```

---

## Development Status

| Milestone | Status |
|---|---|
| Hardware schematic | ✅ Complete |
| PCB layout | ✅ Complete |
| Cartridge interface spec | ✅ Complete |
| Firmware (basic BLE) | 🔄 In progress |
| CGM algorithm | 🔄 In progress |
| Electrolyte calibration | 📋 Planned |
| Patent provisional | 📋 Planned |
| Clinical validation | 📋 Planned |
| FDA 510(k) pathway | 📋 Planned |
| Mass production | 📋 Planned |

---

## Estimated Pricing

| Item | Price |
|---|---|
| Smart Patch Pro starter kit | $199 |
| Weekly patch refills | $15/week |
| Monthly blood cartridge | $25/month |
| App subscription | $9.99/month |
| **Total first year** | **~$700** |

---

## Related Links

- [EoS Health mono-repo](https://github.com/embeddedos-org/eos-health) — this repo
- [eCAD-Hardware-Products](https://github.com/embeddedos-org/eCAD-Hardware-Products) — original CAD source
- [Company website](https://embeddedos-org.github.io) — product page
