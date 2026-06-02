# EoS Health — PCB Ordering Specifications (Prototype Run)

**Quantity:** 10 boards per device (minimum for prototype validation)  
**Supplier:** JLCPCB (primary) / Seeed Fusion PCB (flex boards)  
**Lead time:** 5–7 days standard, 2–3 days expedited  
**Total estimated cost:** ~$2,800 for all 4 devices (10 units each)

---

## 1. HEALTH-KEY ULTRA

| Parameter | Specification |
|---|---|
| Board size | 62 mm × 18 mm |
| Layers | 4-layer (signal / GND / PWR / signal) |
| Substrate | FR4, Tg 150°C |
| Thickness | 1.0 mm |
| Copper weight | 1 oz outer, 0.5 oz inner |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Green (prototype), Black (production) |
| Min trace/space | 0.1 mm / 0.1 mm |
| Min via drill | 0.2 mm |
| Impedance control | 50Ω ±10% (RF traces, layer 1) |
| Stencil | Laser-cut stainless steel, 0.12 mm |
| Quantity | 10 |
| **Estimated cost** | **~$85 for 10 boards** |

**Critical notes:**
- RF keepout zone: 5 mm around chip antenna (Johanson 2450AT18A100E)
- ECG electrode pads: gold-plated, 8 mm × 3 mm, 0.5 mm edge chamfer
- USB-C connector: USB4125-GF-A (GCT), 0.4 mm pitch — requires fine-pitch stencil
- Conformal coating: Humiseal 1B31 after assembly (not on connectors/electrodes)

---

## 2. HEALTH-BAND Neuro

| Parameter | Specification |
|---|---|
| Board size | 45 mm × 35 mm (main PCB) |
| Layers | 4-layer |
| Substrate | FR4, Tg 150°C |
| Thickness | 0.8 mm |
| Copper weight | 1 oz outer, 0.5 oz inner |
| Surface finish | ENIG |
| Min trace/space | 0.1 mm / 0.1 mm |
| Impedance control | 50Ω ±10% (RF), 100Ω ±10% (sEMG differential) |
| Stencil | 0.12 mm laser-cut |
| Quantity | 10 |
| **Estimated cost** | **~$120 for 10 boards** |

**Flex strap PCB (FPCB):**

| Parameter | Specification |
|---|---|
| Board size | 280 mm × 22 mm (wristband strap) |
| Layers | 2-layer flex |
| Substrate | Polyimide (Kapton), 0.1 mm |
| Copper weight | 0.5 oz |
| Surface finish | ENIG |
| Min trace/space | 0.1 mm / 0.1 mm |
| Coverlay | Polyimide, yellow |
| Stiffener | FR4 0.4 mm at connector ends |
| Supplier | **Seeed Fusion PCB** (flex specialist) |
| Quantity | 10 |
| **Estimated cost** | **~$180 for 10 flex boards** |

**Critical notes:**
- sEMG electrode array: 8× Ag/AgCl dry electrodes, 10 mm diameter, 20 mm spacing
- OLED display connector: 24-pin FFC, 0.5 mm pitch
- TENS output traces: 2 oz copper, 0.5 mm wide (high current 45 mA)
- Flex bend radius: minimum 5 mm (do not bend at component areas)

---

## 3. HEALTH-RING

| Parameter | Specification |
|---|---|
| Board shape | Annular ring, OD 22 mm, ID 18 mm |
| Layers | 4-layer flex-rigid |
| Substrate | Polyimide core + FR4 stiffener zones |
| Thickness | 0.4 mm (flex zones), 0.8 mm (stiffener zones) |
| Copper weight | 0.5 oz |
| Surface finish | ENIG |
| Min trace/space | 0.075 mm / 0.075 mm (laser-drilled) |
| Via type | Laser microvias, 0.1 mm drill |
| Stencil | 0.1 mm electroformed nickel |
| Supplier | **Würth Elektronik** or **Rigid-Flex specialist** |
| Quantity | 10 |
| **Estimated cost** | **~$650 for 10 boards** |

**Critical notes:**
- This is the most complex PCB in the lineup — rigid-flex annular ring
- NFC charging coil: printed on flex layer, 3 turns, 0.15 mm trace, 0.1 mm space
- PPG LED/PD array: 5× LED + 4× PD, 0.8 mm pitch, bottom-facing
- ECG electrodes: Pt-Ir arc pads, 180° separation, exposed through ring body cutouts
- Titanium ring body machined separately (CNC), PCB inserted and potted with biocompatible epoxy (Loctite M-21HP)
- **Order ring bodies separately:** Grade 23 Ti-6Al-4V ELI, CNC machined, mirror-polished, anodized

---

## 4. HEALTH-LAB

| Parameter | Specification |
|---|---|
| Board type | Flexible biosensor patch |
| Board size | 55 mm × 35 mm |
| Layers | 2-layer flex |
| Substrate | Polyimide, 0.05 mm (ultra-thin) |
| Copper weight | 0.5 oz |
| Surface finish | ENIG on contact pads, bare Cu on electrode areas |
| Electrode material | Aerosol jet printed carbon/Ag-AgCl on top of Cu |
| Min trace/space | 0.1 mm / 0.1 mm |
| Coverlay | Medical-grade polyimide, skin-contact tested |
| Adhesive | 3M 1524 medical-grade acrylic, 0.05 mm |
| Supplier | **Seeed Fusion PCB** + **Printed Electronics specialist** |
| Quantity | 10 |
| **Estimated cost** | **~$420 for 10 patches** |

**Critical notes:**
- Electrode printing: aerosol jet printing of carbon ink (glucose/lactate working electrodes), Ag/AgCl reference electrode, Pt counter electrode — requires specialized printer (Optomec AJ-300)
- Enzyme immobilization: GOx (glucose oxidase) + LOx (lactate oxidase) crosslinked with BSA/glutaraldehyde — done in lab after PCB fabrication
- Sweat collection: laser-cut microfluidic channel in 3M 1524 adhesive layer
- Battery: Enfucell SoftBattery 65 mAh, 3.0V, flexible, adhesive-backed — order separately
- Biocompatibility: ISO 10993-5 cytotoxicity test required before human use

---

## Assembly Notes (All Devices)

**Recommended assembly house:** MacroFab (US), PCBWay Assembly, or JLCPCB SMT

| Step | Details |
|---|---|
| Solder paste | SAC305 (Sn96.5/Ag3/Cu0.5), no-clean |
| Reflow profile | Peak 245°C, 60s above liquidus |
| Inspection | AOI after reflow, X-ray for BGA/QFN |
| Rework | Hot air station for QFN packages |
| Cleaning | IPA ultrasonic (if no-clean flux residue) |
| Conformal coat | Humiseal 1B31, spray, 25–50 µm |

**Components to order separately (not on PCB):**
- nRF52840 SoC: Mouser #949-NRF52840-QIAA-R7
- MAX30101 PPG: Mouser #700-MAX30101EFD+T
- ADS1299 sEMG: Mouser #595-ADS1299IPAGR
- LMP91000 potentiostat: Mouser #926-LMP91000SDX/NOPB
- BQ25125 PMIC: Mouser #595-BQ25125YFPR
- Johanson 2450AT18A100E antenna: Mouser #891-2450AT18A100E

---

## Total Prototype Budget

| Device | PCB | Components | Assembly | Total |
|---|---|---|---|---|
| HEALTH-KEY ULTRA | $85 | $280 | $150 | **$515** |
| HEALTH-BAND Neuro | $300 | $420 | $200 | **$920** |
| HEALTH-RING | $650 | $380 | $350 | **$1,380** |
| HEALTH-LAB | $420 | $180 | $120 | **$720** |
| **TOTAL (10 units each)** | | | | **~$3,535** |
