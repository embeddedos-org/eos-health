# HEALTH-BAND Neuro — PCB Rev-A (Engineering/Development Version)

**Revision:** Rev-A (Initial Engineering Prototype)
**Status:** Design Phase — Ready for Fabrication
**Target Fabricator:** JLCPCB (prototype) / PCBWay (production)
**Patent Pending:** U.S. App. No. 64/076,078

---

## Overview

The HEALTH-BAND Neuro PCB consists of two boards:

| Board | Type | Dimensions | Layer Count |
|---|---|---|---|
| **Core Module** | Rigid FR4 | 38 × 18 mm | 4-layer |
| **Strap Module** | Flexible Polyimide (FPCB) | 280 × 22 mm | 2-layer |

The Core Module and Strap Module are connected by a ZIF (Zero Insertion Force) connector (Molex 503480-1000, 10-pin, 0.5 mm pitch).

---

## Core Module — Component List

### Primary SoC
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| U1 | Nordic nRF52840 | SoC | QFN73 | Mouser | 768-NRF52840-QIAA-R |

### Power Management
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| U2 | TI BQ25895 | USB-PD Charger | WQFN24 | Mouser | 595-BQ25895RTWR |
| U3 | TI TPS63020 | Buck-Boost Converter | VSON10 | Mouser | 595-TPS63020DSJR |
| C1–C8 | Capacitor | 100nF/10μF | 0402/0805 | Mouser | Various |
| L1 | Inductor | 2.2μH | 0402 | Mouser | 81-LQM2HPN2R2MG0L |

### Sensors
| Ref | Component | Measurement | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| U4 | Maxim MAX30102 | PPG / SpO₂ / HR | OLGA14 | Mouser | 700-MAX30102EFD+ |
| U5 | TI ADS1293 | ECG (24-bit) | TQFP32 | Mouser | 595-ADS1293IPAP |
| U6 | Melexis MLX90614 | Skin Temperature | TO-39 | Mouser | 951-MLX90614ESF-BAA |
| U7 | InvenSense ICM-42688-P | 9-axis IMU | LGA14 | Mouser | 602-ICM-42688-P |
| U8 | Vishay VEML6075 | UV Index | OPLGA4 | Mouser | 782-VEML6075WB-EL |

### Memory
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| U9 | Samsung KLMAG1JETD | 64 GB eMMC | FBGA153 | Mouser | 949-KLMAG1JETD-B041 |

### Display
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| DISP1 | Solomon SSD1306 | 0.96" OLED 128×64 | Module | Adafruit | 326 |

### USB-C Connectors (Clasp)
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| J1 | USB-C Male Plug | Hook end clasp | Through-hole | Mouser | 538-105450-0101 |
| J2 | USB-C Female Receptacle | Latch end clasp | SMD | Mouser | 538-105444-0001 |

### Passive Components
| Ref | Component | Value | Package | Qty |
|---|---|---|---|---|
| R1–R20 | Resistor | Various | 0402 | 20 |
| C9–C30 | Capacitor | Various | 0402/0805 | 22 |
| L2–L4 | Inductor | Various | 0402 | 3 |
| D1–D4 | Schottky Diode | BAT54S | SOT23 | 4 |

**Total Core Module BOM: ~47 unique components**

---

## Strap Module — Component List

### Neuromuscular Array
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| E1–E6 | Platinum Electrode | 3mm dia, 99.99% | Custom | Custom | Electrodeposited |
| U10 | TI INA333 | 6-ch Diff Amp | SOT23-5 × 6 | Mouser | 595-INA333AIDCKR |
| U11 | Maxim MAX14521E | TENS Stimulator | TQFN28 | Mouser | 700-MAX14521EETJ+ |
| U12 | ADI ADG1414 | Analog Switch | TSSOP16 | Mouser | 584-ADG1414BRUZ |

### Breath Analysis
| Ref | Component | Value | Package | Supplier | Part No. |
|---|---|---|---|---|---|
| S1 | MQ-303A | BAC Fuel Cell | Module | AliExpress | MQ-303A |
| S2 | ScioSense CCS811 | VOC MOx Sensor | LGA10 | Mouser | 771-CCS811B-JOPB |
| MEM1 | PTFE Membrane | 0.2μm pore, 25μm | Sheet | Sterlitech | PTFE02500 |
| GR1 | Titanium Grille | 0.5mm mesh | Custom | Custom | Ti-Grade2 |

**Total Strap Module BOM: ~18 unique components**

---

## Fabrication Specifications

### Core Module (Rigid PCB)
```
Material:        FR4, Tg 150°C
Layers:          4 (Signal / Ground / Power / Signal)
Dimensions:      38 × 18 mm
Thickness:       1.0 mm
Copper weight:   1 oz outer, 0.5 oz inner
Min trace/space: 0.1/0.1 mm
Min via:         0.2 mm drill, 0.4 mm pad
Surface finish:  ENIG (Electroless Nickel Immersion Gold)
Solder mask:     Green (both sides)
Silkscreen:      White (top side)
IPC class:       Class 2
```

### Strap Module (Flexible PCB)
```
Material:        Polyimide (Kapton), 25 μm
Layers:          2 (Signal / Ground)
Dimensions:      280 × 22 mm
Copper weight:   0.5 oz
Min trace/space: 0.15/0.15 mm
Surface finish:  ENIG
Coverlay:        Polyimide, 25 μm
Stiffener:       FR4, 0.4 mm (at connector areas)
```

---

## Directory Structure

```
pcb/rev-A-engineering/
├── README.md                    ← This file
├── schematics/
│   ├── HEALTH_BAND_Core_Module_Schematic.pdf    ← Core module schematic
│   ├── HEALTH_BAND_Strap_Module_Schematic.pdf   ← Strap module schematic
│   └── HEALTH_BAND_System_Block_Diagram.pdf     ← System block diagram
├── gerbers/
│   ├── core-module/             ← Gerber files for Core PCB
│   │   ├── HEALTH_BAND_Core_Top_Copper.gbr
│   │   ├── HEALTH_BAND_Core_Bottom_Copper.gbr
│   │   ├── HEALTH_BAND_Core_Inner1_GND.gbr
│   │   ├── HEALTH_BAND_Core_Inner2_PWR.gbr
│   │   ├── HEALTH_BAND_Core_Top_Mask.gbr
│   │   ├── HEALTH_BAND_Core_Bottom_Mask.gbr
│   │   ├── HEALTH_BAND_Core_Top_Silk.gbr
│   │   ├── HEALTH_BAND_Core_Drill.drl
│   │   └── HEALTH_BAND_Core_Board_Outline.gbr
│   └── strap-module/            ← Gerber files for Strap FPCB
│       ├── HEALTH_BAND_Strap_Top_Copper.gbr
│       ├── HEALTH_BAND_Strap_Bottom_Copper.gbr
│       ├── HEALTH_BAND_Strap_Coverlay.gbr
│       └── HEALTH_BAND_Strap_Drill.drl
├── bom/
│   ├── HEALTH_BAND_Core_BOM.csv             ← Core module BOM (CSV for JLCPCB)
│   ├── HEALTH_BAND_Strap_BOM.csv            ← Strap module BOM
│   └── HEALTH_BAND_Full_BOM.xlsx            ← Complete BOM with pricing
├── cad/
│   ├── HEALTH_BAND_Enclosure_Core.step      ← Core module enclosure (STEP)
│   ├── HEALTH_BAND_Strap_Assembly.step      ← Full strap assembly (STEP)
│   ├── HEALTH_BAND_Clasp_Hook.step          ← USB-C male clasp (STEP)
│   ├── HEALTH_BAND_Clasp_Latch.step         ← USB-C female clasp + BAC channel (STEP)
│   └── HEALTH_BAND_Full_Assembly.step       ← Complete device assembly (STEP)
└── fabrication/
    ├── JLCPCB_Order_Instructions.md         ← How to order from JLCPCB
    ├── PCBWay_Order_Instructions.md         ← How to order from PCBWay
    └── Assembly_Notes.md                    ← Hand assembly notes for prototype
```

> **Note:** Gerber files, schematic PDFs, and STEP files will be added as the PCB design is completed in KiCad. The directory structure is established here to guide the design workflow.

---

## CAD Software

The HEALTH-BAND Neuro PCB is designed in **KiCad 7.0** (open-source EDA). The mechanical enclosure is designed in **FreeCAD 0.21** (open-source CAD). Both tools are free and cross-platform.

**KiCad project files** will be committed to `pcb/rev-A-engineering/schematics/` and `pcb/rev-A-engineering/gerbers/` as the design progresses.

---

## Ordering Prototype PCBs

### From JLCPCB (Recommended for Prototype)
1. Zip the `gerbers/core-module/` folder
2. Go to https://jlcpcb.com → Upload Gerbers
3. Set: 4 layers, 38×18mm, 1.0mm, ENIG, 5 pcs
4. Enable **SMT Assembly** and upload `bom/HEALTH_BAND_Core_BOM.csv`
5. Estimated cost: ~$80 for 5 assembled boards (prototype pricing)

### From PCBWay (Alternative)
1. Go to https://pcbway.com → PCB Instant Quote
2. Upload Gerber zip, set specifications as above
3. Request PCBA service with BOM and pick-and-place files

---

*Patent Pending: U.S. App. No. 64/076,078 — Srikanth Patchava, EoS Foundation.*
