# Provisional Patent Application
## HEALTH-RING — Ring-Form-Factor ECG, Multi-Spectral HbA1c, Cuffless Blood Pressure, and Kinetic Energy Harvesting

**Application Type:** Provisional Patent Application (35 U.S.C. § 111(b))
**Filing Entity:** Micro Entity
**Inventor:** Srikanth Patchava
**Assignee:** Embedded Operating Systems Research Foundation (EoS Foundation), 501(c)(3), EIN: 41-4821627
**Filing Target:** 2026 Q3
**Docket No.:** EOS-2026-003

---

## TITLE OF THE INVENTION

**Ring-Form-Factor Wearable Health Monitor with Dual-Arch Platinum-Iridium Electrodes for Finger ECG, Five-Wavelength Optical Array for Non-Invasive HbA1c Estimation, Piezoelectric Pulse Wave Velocity for Cuffless Blood Pressure, and Photolithographic Flush-Surface Electrode System with Kinetic Energy Harvesting for Ultra-Thin Form Factor**

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to:
- EOS-2026-001: HEALTH-KEY ULTRA (provisional, filed May 23, 2026, U.S. App. No. 64/073,334)
- EOS-2026-002: HEALTH-BAND Neuro (provisional, filed May 27, 2026, U.S. App. No. 64/076,078)

---

## FIELD OF THE INVENTION

The present invention relates to wearable health monitoring devices in ring form factors, and more particularly to a ring-form-factor biosensor device that integrates electrocardiographic acquisition via platinum-iridium arc electrodes, multi-wavelength photoplethysmographic sensing for hemoglobin species quantification including HbA1c, piezoelectric pulse wave velocity measurement for cuffless blood pressure estimation, photolithographic flush-surface electrodes for ultra-thin form factors, and kinetic energy harvesting from finger motion.

---

## BACKGROUND OF THE INVENTION

Wearable health monitoring devices in ring form factors have gained significant commercial adoption, with products including the Oura Ring, Samsung Galaxy Ring, Ultrahuman Ring Air, RingConn Smart Ring, and Circular Ring Slim. However, all existing ring-form-factor devices share fundamental limitations that the present invention addresses:

**Limitation 1 — Absence of ECG.** No commercially available smart ring provides electrocardiographic (ECG) measurement. All existing rings rely exclusively on photoplethysmography (PPG) for cardiac monitoring, which cannot detect arrhythmias such as atrial fibrillation with clinical accuracy. The challenge is that ECG requires two electrode contacts separated by sufficient distance to measure cardiac electrical potential difference, and no prior art has demonstrated a ring-form-factor solution achieving clinical-grade ECG.

**Limitation 2 — Single-species optical sensing.** All existing smart rings use two-wavelength PPG (660 nm and 940 nm) to estimate SpO₂. This cannot distinguish between oxyhemoglobin, deoxyhemoglobin, total hemoglobin, or glycated hemoglobin (HbA1c). Continuous HbA1c monitoring without blood sampling would be transformative for diabetes management.

**Limitation 3 — Absence of cuffless blood pressure.** No ring-form-factor device has demonstrated cuffless blood pressure estimation. Wristband devices (Samsung Galaxy Watch 6, Withings ScanWatch 2) use photoplethysmographic pulse transit time (PTT), but no ring has achieved this.

**Limitation 4 — Electrode protrusion in ultra-thin rings.** Achieving ECG in a ring with a 2.0 mm or smaller profile is impossible with conventional pressed-metal electrode inserts, as the protrusion consumes a disproportionate fraction of the available cross-section.

**Limitation 5 — Battery life in ultra-thin rings.** A 2.0 mm profile constrains the battery to approximately 15 mAh. Energy harvesting from finger motion offers a path to extend battery life without increasing ring profile, but no existing smart ring implements kinetic energy harvesting.

---

## SUMMARY OF THE INVENTION

The present invention provides a ring-form-factor wearable health monitoring device family comprising two embodiment tiers sharing the same patent family:

**First Tier (Ultra):** A ring body with a cross-section profile of 2.8 mm or less comprising: (a) a Dual-Arch Electrode Architecture (DAEA) with two platinum-iridium arc electrodes at 180° separation for single-lead ECG; (b) a Multi-Spectral Hemodynamic Engine (MSHE) with a five-wavelength optical array (660/730/850/940/1300 nm) for SpO₂ and HbA1c estimation; and (c) a Piezoelectric Pulse Transit Time (PPTT) system for cuffless blood pressure.

**Second Tier (Base):** A ring body with a cross-section profile of 2.0 mm or less comprising: (a) a Zero-Profile Inductive Electrode System (ZPIES) with photolithographically deposited flush-surface ECG electrodes; (b) a three-wavelength optical array for SpO₂ and HRV; and (c) a Kinetic Energy Harvesting Supplement (KEHS) using a MEMS piezoelectric cantilever for battery life extension.

---

## DETAILED DESCRIPTION OF THE INVENTION

### 1. Ring Body and Mechanical Design

Both tiers use a ring body fabricated from titanium Grade 23 (Ti-6Al-4V ELI, ASTM F136) using CNC machining. The ring is available in US sizes 5 through 14 (inner diameters 14.1–22.2 mm). The outer surface is finished with Diamond-Like Carbon (DLC) coating (2–3 µm) for scratch resistance. The inner surface is polished to Ra ≤ 0.4 µm (Ultra) or Ra ≤ 0.2 µm (Base).

The ring body houses a flexible PCB (4-layer, 0.20 mm for Ultra; 2-layer, 0.15 mm for Base) fabricated on polyimide (Kapton) substrate. The PCB wraps the inner circumference and is potted with medical-grade epoxy (Loctite M-21HP) for waterproofing to IP68.

### 2. Dual-Arch Electrode Architecture (DAEA) — Ultra Tier

Two platinum-iridium (90% Pt, 10% Ir) arc electrodes are embedded in the inner circumferential surface at 180° angular separation. Each electrode has an arc length of 8 mm, width of 1.5 mm, and depth of 0.3 mm, recessed 0.1 mm below the inner surface. The electrodes are fabricated by EDM machining of arc-shaped recesses, pressing Pt-Ir inserts, applying medical-grade epoxy for electrical isolation, and polishing to a flush finish.

The electrodes connect via 50 µm gold bond wires to the MAX30003 ECG AFE (18-bit ADC, 512 Hz, input impedance >100 MΩ, CMRR >80 dB, noise 10 µV RMS). The 180° separation creates a Lead I-equivalent ECG configuration with sufficient cardiac potential difference for P-wave, QRS complex, and T-wave resolution. An on-device TFLite Micro model on the MAX32666 co-processor detects atrial fibrillation, bradycardia, and tachycardia in real time.

### 3. Multi-Spectral Hemodynamic Engine (MSHE) — Ultra Tier

A five-wavelength LED array and dual photodetector array are mounted on the inner ring surface. The five wavelengths and their physiological targets are:

| Wavelength | Target | Metric |
|---|---|---|
| 660 nm | Oxyhemoglobin (HbO₂) | SpO₂ (red channel) |
| 730 nm | Deoxyhemoglobin (HHb) | SpO₂ (IR channel 1), HRV |
| 850 nm | Oxyhemoglobin (HbO₂) | SpO₂ (IR channel 2), perfusion |
| 940 nm | Total hemoglobin (tHb) | Total Hb concentration |
| 1300 nm | Glycated hemoglobin (HbA1c) | HbA1c estimation (novel) |

The 1300 nm wavelength exploits differential absorption between HbA1c and non-glycated hemoglobin using the modified Beer-Lambert law. The HbA1c estimation algorithm uses the ratio of the 1300 nm and 940 nm channels to compute a glycation index, calibrated against laboratory HbA1c measurements. The MAX86176 AFE provides 5 independent LED driver channels (10–100 mA each) and a 22-bit ADC.

### 4. Piezoelectric Pulse Transit Time (PPTT) — Ultra Tier

A Murata PKGS-00ZX1 MEMS piezoelectric transducer is mounted on the inner ring surface co-located with the optical array. The piezoelectric sensor detects the mechanical pulse wave arriving at the finger. Pulse transit time (PTT) is computed as:

```
PTT = t_PPG_peak − t_piezo_peak
PWV = L / PTT
SBP = a × PWV + b
```

where L is the estimated arterial path length (from user height/arm length), and a, b are user-specific calibration coefficients from an initial cuff calibration session. Estimated accuracy: ±5 mmHg for SBP after calibration.

### 5. Zero-Profile Inductive Electrode System (ZPIES) — Base Tier

Rather than pressing metal electrode inserts, ZPIES deposits electrode traces directly onto the inner ring surface via photolithography:

1. Anodize inner titanium surface (Type II, 20V) → 5 µm Al₂O₃ insulation layer
2. Spin-coat positive photoresist (AZ 4210, 2 µm)
3. UV laser direct-write exposure of electrode pattern (two arc traces, 8 mm × 1.5 mm, 180° separation)
4. Develop photoresist; electroplate 3 µm copper
5. Electroplate 0.5 µm gold for biocompatibility
6. Strip photoresist; apply 1 µm parylene-C conformal coating (electrode areas masked)

The resulting electrodes are flush with the inner ring surface (zero protrusion), Ra ≤ 0.2 µm. The anodized Al₂O₃ provides electrical isolation with breakdown voltage >50V. Connected to MAX30001 ECG AFE via 25 µm gold bond wires.

### 6. Kinetic Energy Harvesting Supplement (KEHS) — Base Tier

A Mide V21BL MEMS piezoelectric cantilever beam is integrated within the ring body, oriented tangentially to the ring circumference. During finger motion, the cantilever vibrates and generates alternating voltage. A full-wave bridge rectifier (4× PMEG2010AEA Schottky diodes) and TI TPS61099 boost converter step up the rectified voltage (0.5–3.0V) to 3.7V for battery charging via the MAX77734 PMIC secondary input.

Energy harvesting performance: ~50 µW average during daily activity, extending battery life by up to +18% during high activity (typing, exercise).

### 7. System Integration

**Ultra:** nRF52840 main MCU + MAX32666 AI co-processor + MAX77734 PMIC + 25 mAh solid-state LiPo (Cymbet CBC050) + TDK WCT-1001 NFC charging coil. Target: 7-day battery life at 0.42 mA average current.

**Base:** nRF52833 main MCU + MAX77734 PMIC + 15 mAh solid-state LiPo (Cymbet CBC030) + TDK WCT-1001 NFC charging coil + KEHS supplement. Target: 4-day battery life.

---

## CLAIMS

**Claim 1.** A ring-form-factor wearable health monitoring device comprising: a ring body having an inner circumferential surface and a cross-section profile of 5 mm or less; a first electrode and a second electrode embedded in the inner circumferential surface at an angular separation of between 120° and 240°, wherein the electrodes comprise platinum-iridium alloy and are electrically isolated from the ring body; and an electrocardiographic analog front-end circuit electrically connected to the first and second electrodes and configured to acquire a single-lead electrocardiographic signal from the finger of a user wearing the ring.

**Claim 2.** The device of claim 1, wherein the angular separation is approximately 180°.

**Claim 3.** The device of claim 1, wherein each electrode has an arc length of between 5 mm and 15 mm and is recessed between 0.05 mm and 0.2 mm below the inner circumferential surface.

**Claim 4.** The device of claim 1, wherein the electrocardiographic analog front-end circuit has a sampling rate of at least 256 Hz and an input impedance of at least 10 MΩ.

**Claim 5.** The device of claim 1, further comprising a machine learning processor configured to analyze the electrocardiographic signal to detect at least one of atrial fibrillation, bradycardia, and tachycardia.

**Claim 6.** A ring-form-factor wearable health monitoring device comprising: a ring body having an inner circumferential surface; an optical array mounted on the inner circumferential surface, comprising at least five light-emitting elements operating at wavelengths of approximately 660 nm, 730 nm, 850 nm, 940 nm, and 1300 nm; and at least one photodetector configured to receive light from the optical array after interaction with finger tissue; wherein the device is configured to estimate glycated hemoglobin (HbA1c) concentration using a differential absorption measurement between the 1300 nm and 940 nm channels.

**Claim 7.** The device of claim 6, wherein the HbA1c estimation uses a modified Beer-Lambert law applied to the ratio of the 1300 nm and 940 nm channel signals.

**Claim 8.** The device of claim 6, further comprising a processor configured to simultaneously compute at least four of: SpO₂, heart rate, heart rate variability, total hemoglobin, deoxyhemoglobin, and HbA1c estimation from the five-wavelength optical signals.

**Claim 9.** A ring-form-factor wearable health monitoring device comprising: a ring body having an inner circumferential surface; a photoplethysmographic sensor mounted on the inner circumferential surface; a piezoelectric transducer mounted on the inner circumferential surface; and a processor configured to compute a pulse transit time as the time delay between the piezoelectric pulse wave detection and the photoplethysmographic waveform peak, and to estimate blood pressure from the pulse transit time.

**Claim 10.** The device of claim 9, wherein the blood pressure estimation uses a model of the form SBP = a × PWV + b, where PWV is pulse wave velocity computed from the pulse transit time and an estimated arterial path length, and a and b are user-specific calibration coefficients.

**Claim 11.** A ring-form-factor wearable health monitoring device comprising: a ring body having an inner circumferential surface and a cross-section profile of 2.5 mm or less; a first electrode trace and a second electrode trace formed on the inner circumferential surface by photolithographic deposition of a conductive material, wherein the electrode traces are flush with the inner circumferential surface with zero raised profile; and an electrocardiographic circuit electrically connected to the first and second electrode traces.

**Claim 12.** The device of claim 11, wherein the photolithographic deposition comprises electroplating of copper followed by gold plating on an anodized insulation layer formed on the inner circumferential surface.

**Claim 13.** A ring-form-factor wearable health monitoring device comprising: a ring body; a primary battery housed within the ring body; a MEMS piezoelectric transducer integrated within the ring body and oriented to vibrate in response to finger motion; and an energy harvesting circuit configured to rectify and boost the electrical output of the MEMS piezoelectric transducer and supply the boosted voltage to the primary battery charging circuit.

**Claim 14.** The device of claim 13, wherein the MEMS piezoelectric transducer is a cantilever beam oriented tangentially to the ring circumference.

**Claim 15.** A ring-form-factor wearable health monitoring device comprising all elements of claims 1, 6, and 9 in combination, further comprising a solid-state lithium polymer battery, an NFC inductive charging coil, a Bluetooth Low Energy transceiver, and a waterproof enclosure rated to at least IP68.

---

## ABSTRACT

A ring-form-factor wearable health monitoring device family integrates five novel sensing systems across two product tiers. The Ultra tier (2.8 mm profile) incorporates: a Dual-Arch Electrode Architecture (DAEA) with platinum-iridium arc electrodes at 180° separation for single-lead finger ECG; a Multi-Spectral Hemodynamic Engine (MSHE) with a five-wavelength optical array (660/730/850/940/1300 nm) for simultaneous SpO₂ and HbA1c estimation; and a Piezoelectric Pulse Transit Time (PPTT) system for cuffless blood pressure estimation. The Base tier (2.0 mm profile) incorporates: a Zero-Profile Inductive Electrode System (ZPIES) with photolithographically deposited flush-surface ECG electrodes; and a Kinetic Energy Harvesting Supplement (KEHS) using a MEMS piezoelectric cantilever to harvest energy from finger motion. Both tiers share the same patent family, mobile app integration, and BLE 5.x connectivity.

---

## INVENTOR DECLARATION

I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application. All statements made herein are true to the best of my knowledge and belief.

**Srikanth Patchava**
Embedded Operating Systems Research Foundation
EIN: 41-4821627
Date: 2026 Q3 (target)
