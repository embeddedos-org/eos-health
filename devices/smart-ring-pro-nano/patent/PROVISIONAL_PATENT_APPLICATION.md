# Provisional Patent Application
## Smart Ring Pro Nano — Zero-Profile Inductive Electrode System, Single-Die Multi-Sensor Module, and Kinetic Energy Harvesting Supplement

**Application Type:** Provisional Patent Application (35 U.S.C. § 111(b))
**Filing Entity:** Micro Entity
**Inventor:** Srikanth Patchava
**Assignee:** Embedded Operating Systems Research Foundation (EoS Foundation), 501(c)(3), EIN: 41-4821627
**Filing Target:** 2026 Q3
**Docket No.:** EOS-2026-004

---

## TITLE OF THE INVENTION

**Ultra-Thin Ring-Form-Factor Wearable Health Monitor with Photolithographically Deposited Flush-Surface Electrodes, Integrated Multi-Sensor ASIC, and Piezoelectric Kinetic Energy Harvesting for Extended Battery Life**

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to:
- EOS-2026-001: HEALTH-KEY ULTRA (provisional, filed May 23, 2026)
- EOS-2026-002: HEALTH-BAND Neuro (provisional, filed May 27, 2026)
- EOS-2026-003: Smart Ring Pro Ultra (provisional, target 2026 Q3)

---

## FIELD OF THE INVENTION

The present invention relates to ultra-thin wearable health monitoring devices in ring form factors, and more particularly to a 2.0 mm profile ring incorporating photolithographically deposited flush-surface electrodes for ECG acquisition, an integrated multi-sensor ASIC for miniaturized health monitoring, and a MEMS piezoelectric energy harvester for kinetic energy recovery from finger motion.

---

## BACKGROUND OF THE INVENTION

The miniaturization of smart ring health monitors is constrained by three fundamental engineering challenges that the present invention addresses:

**Challenge 1 — Electrode protrusion in ultra-thin rings.** All existing smart rings with ECG capability use raised metal electrode contacts that protrude from the inner ring surface. In rings with a profile of 2.5 mm or greater, this protrusion is acceptable. However, achieving a 2.0 mm profile ring with ECG capability requires a zero-protrusion electrode solution, as any raised electrode would consume a disproportionate fraction of the available cross-section. No prior art has demonstrated a flush-surface electrode approach for ring-form-factor ECG acquisition.

**Challenge 2 — Component count in ultra-thin rings.** A 2.0 mm profile ring has approximately 30% less internal volume than a 2.8 mm profile ring. Achieving the same sensor suite in this reduced volume requires either component elimination or integration. No existing health monitoring IC integrates PPG AFE, temperature sensor, and IMU in a single die suitable for ring form factors.

**Challenge 3 — Battery life in ultra-thin rings.** The 2.0 mm profile constrains the battery to approximately 15 mAh, compared to 25 mAh in a 2.8 mm profile ring. This reduces battery life from 7 days to approximately 3.5 days with the same sensor duty cycle. Energy harvesting from finger motion offers a path to extend battery life without increasing ring profile, but no existing smart ring implements kinetic energy harvesting.

---

## SUMMARY OF THE INVENTION

The present invention provides an ultra-thin ring-form-factor wearable health monitoring device comprising:

(a) A ring body with a cross-section profile of 2.0 mm or less, fabricated from titanium Grade 23;

(b) A Zero-Profile Inductive Electrode System (ZPIES) wherein ECG electrodes are formed by photolithographic deposition of gold-plated copper traces directly onto the inner circumferential surface of the ring body, achieving a surface-flush electrode configuration with zero raised profile;

(c) A Single-Die Multi-Sensor Module (SDMSM) comprising a custom ASIC that integrates a photoplethysmographic analog front-end, a digital temperature sensor, and a 6-axis inertial measurement unit within a die area of 2 mm² or less;

(d) A Kinetic Energy Harvesting Supplement (KEHS) comprising a MEMS piezoelectric cantilever beam integrated within the ring body, configured to convert kinetic energy from finger motion to electrical energy to supplement the primary battery.

---

## DETAILED DESCRIPTION OF THE INVENTION

### 1. Ring Body and Mechanical Design

The ring body is fabricated from titanium Grade 23 with a cross-section profile of 2.0 mm. This is achieved by reducing the PCB thickness to 0.15 mm (vs. 0.20 mm in the Smart Ring Pro Ultra) and using 01005 package components (0.4×0.2 mm) in addition to 0201 components.

### 2. Zero-Profile Inductive Electrode System (ZPIES)

The ZPIES is the first embodiment of the present invention. Rather than pressing metal electrode inserts into the ring body (as in the DAEA of the Smart Ring Pro Ultra), the ZPIES deposits electrode traces directly onto the inner ring surface using a photolithographic process:

1. **Surface preparation:** The inner titanium surface is anodized (Type II, sulfuric acid, 20V) to create a 5 µm aluminum oxide insulation layer;
2. **Photoresist application:** A 2 µm layer of positive photoresist (AZ 4210) is spin-coated onto the inner surface;
3. **Exposure and development:** The electrode pattern (two arc traces, 8 mm × 1.5 mm each, at 180° separation) is exposed using a UV laser direct-write system and developed;
4. **Copper deposition:** 3 µm of copper is electroplated onto the exposed areas;
5. **Gold plating:** 0.5 µm of gold is electroplated over the copper for biocompatibility and corrosion resistance;
6. **Photoresist removal:** The remaining photoresist is stripped, leaving only the gold-plated copper electrode traces on the anodized titanium surface;
7. **Passivation:** A 1 µm parylene-C conformal coating is applied over the entire inner surface, with the electrode areas masked to maintain electrical contact.

The resulting electrodes are flush with the inner ring surface (zero protrusion), with a surface roughness of Ra ≤ 0.2 µm. The anodized aluminum oxide layer provides electrical isolation between the electrode traces and the titanium ring body, with a breakdown voltage of >50V.

The ZPIES electrodes are connected to the MAX30001 ECG AFE via 25 µm gold bond wires routed through micro-channels in the ring body.

### 3. Single-Die Multi-Sensor Module (SDMSM)

The SDMSM is the second embodiment of the present invention. The EOS-NANO-01 ASIC integrates three sensor functions in a single 1.2×1.2 mm die:

**PPG AFE block:** A 3-wavelength (660/880/940 nm) photoplethysmographic analog front-end with 18-bit ADC, 100 Hz sampling rate, and 3 LED driver channels (up to 50 mA each). Functionally equivalent to the Maxim MAX30101 but in 1/4 the die area through custom layout optimization.

**Temperature sensor block:** A bandgap-referenced temperature sensor with ±0.1°C accuracy and 0.005°C resolution, functionally equivalent to the Maxim MAX30208.

**IMU block:** A 6-axis MEMS inertial measurement unit with ±16g accelerometer and ±2000 dps gyroscope, functionally equivalent to the ST LSM6DSO. The MEMS structures are fabricated in a separate MEMS process and bonded to the CMOS die using wafer-level packaging.

The SDMSM communicates with the nRF52833 MCU via a shared SPI bus (PPG AFE) and I2C bus (temperature + IMU), using chip-select lines for bus arbitration.

In an alternative embodiment, the SDMSM is implemented as a multi-chip module (MCM) using known-good-die (KGD) assembly of three separate dies in a single 1.5×1.5 mm package, achieving the same functional integration without requiring a custom ASIC process.

### 4. Kinetic Energy Harvesting Supplement (KEHS)

The KEHS is the third embodiment of the present invention. A MEMS piezoelectric cantilever beam (Mide V21BL or equivalent) is integrated within the ring body, oriented tangentially to the ring circumference. During normal finger motion (typing, walking, gesturing), the cantilever beam vibrates and generates an alternating voltage.

The harvested energy is processed by:
1. A full-wave bridge rectifier (4× PMEG2010AEA Schottky diodes) to convert AC to DC;
2. A TI TPS61099 boost converter to step up the rectified voltage (0.5–3.0V) to the battery charging voltage (3.7V);
3. The MAX77734 PMIC's secondary charging input (CHGIN2) to supplement the NFC charging path.

**Energy harvesting performance:**
- Typical power output: 30–80 µW during active finger motion
- Average power during daily activity: ~50 µW
- Battery supplement: 50 µW / 3.7V = 13.5 µA average
- Battery life extension: 13.5 µA / 280 µA total = **+4.8%** (conservative estimate)
- With high activity (typing, exercise): up to **+18%** battery life extension

The KEHS does not replace the NFC charging system; it supplements the battery during active use to extend the time between charging sessions.

---

## CLAIMS

**Claim 1.** A ring-form-factor wearable health monitoring device comprising:
a ring body having an inner circumferential surface and a cross-section profile of 2.5 mm or less;
a first electrode trace and a second electrode trace formed on the inner circumferential surface by photolithographic deposition of a conductive material, wherein the electrode traces are flush with the inner circumferential surface and have zero raised profile above the surface; and
an electrocardiographic circuit electrically connected to the first and second electrode traces.

**Claim 2.** The device of claim 1, wherein the photolithographic deposition comprises electroplating of copper followed by gold plating, on an anodized insulation layer formed on the inner circumferential surface.

**Claim 3.** The device of claim 1, wherein the inner circumferential surface is coated with a conformal parylene-C layer, with the electrode traces uncoated to maintain electrical contact.

**Claim 4.** The device of claim 1, wherein the first and second electrode traces are separated by an angular distance of between 120° and 240° along the inner circumference.

**Claim 5.** A ring-form-factor wearable health monitoring device comprising:
a ring body having a cross-section profile of 2.5 mm or less;
an integrated circuit comprising, on a single semiconductor die or in a single multi-chip module package of 2.25 mm² or less: a photoplethysmographic analog front-end, a temperature sensor, and a multi-axis inertial measurement unit; and
a microcontroller configured to receive sensor data from the integrated circuit.

**Claim 6.** The device of claim 5, wherein the integrated circuit die area is 1.44 mm² or less.

**Claim 7.** The device of claim 5, wherein the photoplethysmographic analog front-end supports at least three wavelengths, the temperature sensor has an accuracy of ±0.2°C or better, and the inertial measurement unit comprises at least a 3-axis accelerometer.

**Claim 8.** A ring-form-factor wearable health monitoring device comprising:
a ring body;
a primary battery housed within the ring body;
a MEMS piezoelectric transducer integrated within the ring body and oriented to vibrate in response to finger motion of a user wearing the ring; and
an energy harvesting circuit configured to rectify and boost the electrical output of the MEMS piezoelectric transducer and supply the boosted voltage to the primary battery charging circuit.

**Claim 9.** The device of claim 8, wherein the MEMS piezoelectric transducer is a cantilever beam oriented tangentially to the ring circumference.

**Claim 10.** The device of claim 8, wherein the energy harvesting circuit comprises a full-wave bridge rectifier and a boost converter configured to step up the rectified voltage to the battery charging voltage.

**Claim 11.** The device of claim 8, wherein the energy harvesting circuit supplements a primary NFC inductive charging circuit.

**Claim 12.** A ring-form-factor wearable health monitoring device comprising all elements of claims 1, 5, and 8 in combination, wherein the ring body cross-section profile is 2.0 mm or less.

---

## ABSTRACT

An ultra-thin ring-form-factor wearable health monitoring device with a 2.0 mm cross-section profile incorporates three novel technologies: (1) a Zero-Profile Inductive Electrode System (ZPIES) wherein ECG electrodes are formed by photolithographic deposition of gold-plated copper traces on the anodized inner ring surface, achieving zero raised profile; (2) a Single-Die Multi-Sensor Module (SDMSM) integrating PPG AFE, temperature sensor, and 6-axis IMU in a 1.44 mm² die; and (3) a Kinetic Energy Harvesting Supplement (KEHS) using a MEMS piezoelectric cantilever to harvest energy from finger motion, extending battery life by up to 18%. The device achieves 4-day battery life from a 15 mAh solid-state battery.

---

## INVENTOR DECLARATION

I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application.

**Srikanth Patchava**
Embedded Operating Systems Research Foundation
EIN: 41-4821627
Date: 2026 Q3 (target)
