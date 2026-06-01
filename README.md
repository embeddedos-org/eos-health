# EoS Health — Unified Health Monitoring Ecosystem

> **Patent Pending** — HEALTH-KEY ULTRA: U.S. App. No. 64/073,334 (May 23, 2026) · HEALTH-BAND Neuro: U.S. App. No. 64/076,078 (May 27, 2026)

**EoS Health** is an open-hardware, open-firmware wearable health monitoring ecosystem developed by [Srikanth Patchava](https://github.com/srikanth-patchava) under the [Embedded Operating Systems Research Foundation](https://embeddedos-org.github.io). This mono-repo consolidates all four health devices, the Single Health Hub mobile app, shared firmware, academic publications, patent filings, and the EB-1A evidence portfolio.

---

## The Four-Device Ecosystem

Together, these four devices cover **~95% of all clinically relevant health metrics** using just hardware you wear or carry.

| Device | Form Factor | Key Capabilities | Patent Status |
|---|---|---|---|
| [**HEALTH-KEY ULTRA**](devices/health-key-ultra/) | USB-C pendrive | ECG, SpO₂, BAC breath, HR, temp, UV, IMU, USB-C pass-through | ✅ Patent Pending — 64/073,334 |
| [**HEALTH-BAND Neuro**](devices/health-band-neuro/) | Wristband | sEMG gesture control, TENS therapy, BAC breath, ECG, SpO₂, HR | ✅ Patent Pending — 64/076,078 |
| [**HEALTH-RING**](devices/health-ring/) | Titanium finger ring | ECG (AFib), SpO₂, HbA1c, cuffless BP, HRV, sleep stages, stress | 📋 Provisional target: 2026 Q3 — EOS-2026-003 |
| [**HEALTH-LAB**](devices/health-lab/) | Flexible biosensor patch | Glucose, lactate, cortisol, Na⁺, K⁺, uric acid, pH — 14-day wear | 📋 Provisional target: 2026 Q3 — EOS-2026-004 |

```
HEALTH-KEY ULTRA ──┐
HEALTH-BAND Neuro ──┤── BLE 5.3 / USB-C ──► Single Health Hub App
HEALTH-RING ───────┤                              │
HEALTH-LAB ────────┘                    ┌─────────┴──────────┐
                                        │  Digital Twin       │
                                        │  AI Food Camera     │
                                        │  Doctor Dashboard   │
                                        │  Deficiency Alerts  │
                                        └────────────────────┘
```

---

## Repository Structure

```
eos-health/
├── devices/
│   ├── health-key-ultra/          ← HEALTH-KEY ULTRA hardware, firmware, patent, docs
│   │   ├── hardware/              ← PCB (KiCad), CAD, EE schematics, BOM, datasheets
│   │   ├── firmware/              ← nRF52840 firmware source
│   │   ├── patent/                ← USPTO filings, CIP strategy, figures
│   │   ├── academic/              ← journal, white paper, conference paper, thesis
│   │   ├── roadmap/               ← 5-phase product roadmap
│   │   ├── eb1a/                  ← EB-1A evidence (cross-reference)
│   │   └── PATENT_STATUS.md       ← Official filing status
│   │
│   ├── health-band-neuro/         ← HEALTH-BAND Neuro hardware, firmware, patent, docs
│   │   ├── hardware/              ← Core PCB + Strap FPCB (KiCad), CAD, BOM
│   │   ├── firmware/              ← nRF52840 firmware + TFLite gesture model
│   │   ├── patent/                ← USPTO filings, figures, filing package ZIP
│   │   ├── academic/              ← journal, white paper, conference paper, thesis
│   │   ├── roadmap/               ← 5-phase product roadmap
│   │   ├── eb1a/                  ← EB-1A evidence master documents
│   │   └── PATENT_STATUS.md       ← Official filing status
│   │
│   ├── health-ring/               ← HEALTH-RING (base + Ultra tiers)
│   │   ├── hardware/              ← Flex PCB (KiCad), BOM, architecture docs
│   │   ├── firmware/              ← nRF52833/nRF52840 ring firmware (eBuild)
│   │   ├── patent/                ← Provisional patent EOS-2026-003
│   │   └── PATENT_STATUS.md       ← Filing status + prior art differentiation
│   │
│   └── health-lab/                ← HEALTH-LAB wearable biosensor patch (base + Ultra)
│       ├── hardware/              ← Flex PCB (KiCad), NEBA electrode array, BOM
│       ├── firmware/              ← nRF52833/nRF52840 patch firmware (eBuild)
│       ├── patent/                ← Provisional patent EOS-2026-004
│       └── PATENT_STATUS.md       ← Filing status + prior art differentiation
│
├── apps/
│   ├── mobile/                    ← Single Health Hub — React Native (iOS + Android)
│   │   ├── src/                   ← App source code
│   │   ├── android/               ← Android-specific config
│   │   ├── ios/                   ← iOS-specific config
│   │   └── docs/                  ← Architecture, BLE GATT profiles, UI design
│   │
│   ├── web/                       ← EoS Health web companion app (React + tRPC)
│   └── desktop/                   ← Desktop app (future)
│
├── firmware/
│   ├── shared/                    ← Shared across all devices
│   │   ├── ble-stack/             ← BLE 5.3 GATT service definitions
│   │   ├── sensor-drivers/        ← MAX30001, MAX30205, LSM6DSO, BME688 drivers
│   │   ├── tflite-runtime/        ← TensorFlow Lite Micro runtime + gesture models
│   │   └── ebuild/                ← eBuild toolchain configuration
│   ├── health-key-ultra/          ← Device-specific firmware config
│   ├── health-band-neuro/         ← Device-specific firmware config
│   ├── health-ring/               ← Device-specific firmware config
│   └── health-lab/                ← Device-specific firmware config
│
├── academic/                      ← Shared academic publications
│   ├── journal/                   ← IEEE JBHI journal papers
│   ├── white-paper/               ← Technical white papers (Zenodo)
│   ├── conference-paper/          ← IEEE EMBC conference papers
│   ├── thesis/                    ← PhD/MS thesis chapters
│   ├── preprint/                  ← TechRxiv, arXiv submission guides
│   └── citations/                 ← BibTeX, APA, IEEE citation formats
│
├── patent/
│   ├── health-key-ultra/          ← All HEALTH-KEY ULTRA patent documents + receipts
│   └── health-band-neuro/         ← All HEALTH-BAND Neuro patent documents + receipts
│
├── eb1a/                          ← EB-1A Extraordinary Ability visa evidence portfolio
│   ├── README.md                  ← Criteria status table + action plan
│   ├── EB1A_Evidence_Portfolio_Master.md
│   ├── Personal_Statement.md
│   ├── Recommendation_Letter_Templates.md
│   ├── Media_Coverage_and_Press_Release.md
│   └── Peer_Review_and_Judging_Evidence.md
│
├── branding/                      ← EoS Health logos, design system, media
├── docs/                          ← API docs, developer guide, architecture
└── roadmap/                       ← Unified ecosystem roadmap
```

---

## Patent Portfolio

| Device | Application No. | Filed | Priority Date | Non-Provisional Deadline |
|---|---|---|---|---|
| **HEALTH-KEY ULTRA** | 64/073,334 | May 23, 2026 | May 23, 2026 | **May 23, 2027** |
| **HEALTH-BAND Neuro** | 64/076,078 | May 27, 2026 | May 27, 2026 | **May 27, 2027** |
| **HEALTH-RING** | EOS-2026-003 | 2026 Q3 (target) | 2026 Q3 | 2027 Q3 |
| **HEALTH-LAB** | EOS-2026-004 | 2026 Q3 (target) | 2026 Q3 | 2027 Q3 |

All applications filed by **Srikanth Patchava** (individual inventor) with affiliation to the **Embedded Operating Systems Research Foundation**. Entity status: Micro Entity.

---

## Shared Hardware Platform

Both HEALTH-KEY ULTRA and HEALTH-BAND Neuro are built on the same core silicon:

| Component | Part | Role |
|---|---|---|
| **MCU + BLE** | Nordic nRF52840 | Cortex-M4F @ 64 MHz, BLE 5.3, 1 MB Flash, 256 KB RAM |
| **Biometric AFE** | Maxim MAX30001 | ECG + BioZ, 18-bit ADC, 512 Hz |
| **Optical sensor** | Maxim MAX30102 | PPG, SpO₂, HR |
| **Temperature** | Maxim MAX30205 | ±0.1°C accuracy |
| **IMU** | ST LSM6DSO | 6-axis, 6.5 µA ODR |
| **Gas sensor** | Bosch BME688 | VOC, BAC, humidity, pressure |
| **Build system** | eBuild | EmbeddedOS unified build toolchain |

---

## Single Health Hub Mobile App

The mobile app (`apps/mobile/`) is a **single React Native application** that connects to all four devices simultaneously over BLE 5.3. It auto-detects which devices are paired and activates the corresponding feature modules.

| Feature | Source Device |
|---|---|
| ECG + arrhythmia detection | HEALTH-KEY ULTRA or HEALTH-BAND Neuro |
| SpO₂ continuous monitoring | Any device |
| BAC breath analysis | HEALTH-KEY ULTRA or HEALTH-BAND Neuro |
| Gesture control (TV, phone, smart home) | HEALTH-BAND Neuro |
| TENS therapy sessions | HEALTH-BAND Neuro |
| Sleep stages + HRV | HEALTH-RING |
| Blood glucose (CGM) | HEALTH-LAB |
| Electrolytes + hydration | HEALTH-LAB |
| AI food camera + nutrition | App (camera) |
| Digital twin health score | All devices combined |
| Doctor dashboard sharing | All devices combined |

---

## Quick Start

```bash
# Clone this repo
git clone https://github.com/embeddedos-org/eos-health.git
cd eos-health

# Mobile app
cd apps/mobile && npm install && npx expo start

# Web companion app
cd apps/web && pnpm install && pnpm dev

# Firmware (HEALTH-BAND Neuro)
cd devices/health-band-neuro/firmware
# See firmware/FLASHING_GUIDE.md for J-Link SWD / USB DFU / BLE OTA instructions
```

---

## Academic Publications

All papers are ready to submit. See `academic/` for full documents.

| Platform | Document | Status |
|---|---|---|
| **Zenodo (CERN)** | White paper + patent spec | ⚡ Submit now |
| **TechRxiv (IEEE)** | Journal paper | ⚡ Submit now |
| **ResearchGate** | White paper | ⚡ Submit now |
| **Academia.edu** | White paper | ⚡ Submit now |
| **LinkedIn Article** | Press release | ⚡ Publish now |
| **Rock Health** | Press release | ⚡ Submit now |

---

## EB-1A Extraordinary Ability Visa

The `eb1a/` folder contains a complete evidence portfolio for the EB-1A self-petition (Form I-140). See [eb1a/README.md](eb1a/README.md) for the criteria status table and action plan.

**Current status: 4 of 10 criteria met (minimum 3 required)**

---

## Related Repositories

| Repository | Purpose |
|---|---|
| [HealthKey-Ulta](https://github.com/embeddedos-org/HealthKey-Ulta) | HEALTH-KEY ULTRA — original device repo (patent history preserved) |
| [HEALTH-BAND-Neuro](https://github.com/embeddedos-org/HEALTH-BAND-Neuro) | HEALTH-BAND Neuro — original device repo (patent history preserved) |
| [eCAD-Hardware-Products](https://github.com/embeddedos-org/eCAD-Hardware-Products) | Legacy CAD designs (superseded by health-ring/ and health-lab/ in this repo) |
| [embeddedos-org.github.io](https://github.com/embeddedos-org/embeddedos-org.github.io) | Company website |

---

## License

Hardware designs: [CERN Open Hardware Licence v2](https://ohwr.org/cern_ohl_s_v2.txt)
Firmware and software: [Apache 2.0](LICENSE)
Documentation: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

## Author

**Srikanth Patchava**
Founder, Embedded Operating Systems Research Foundation
📧 srikanth.patchava@outlook.com
🌐 [embeddedos-org.github.io](https://embeddedos-org.github.io)
🔬 [Academia.edu](https://independent.academia.edu/SrikanthPatchava)
