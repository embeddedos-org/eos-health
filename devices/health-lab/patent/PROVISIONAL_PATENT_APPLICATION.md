# Provisional Patent Application
## HEALTH-LAB — Nano-Electrode Biosensor Array, Dual-Mode Sweat/Iontophoresis Sampling, and Self-Calibrating Biosensor Network

**Application Type:** Provisional Patent Application (35 U.S.C. § 111(b))
**Filing Entity:** Micro Entity
**Inventor:** Srikanth Patchava
**Assignee:** Embedded Operating Systems Research Foundation (EoS Foundation), 501(c)(3), EIN: 41-4821627
**Filing Target:** 2026 Q3
**Docket No.:** EOS-2026-004

---

## TITLE OF THE INVENTION

**Flexible Wearable Biosensor Patch with Aerosol Jet Printed Platinum-Black Nano-Electrode Array, Time-Multiplexed Dual-Mode Sweat and Iontophoresis Sampling, and Three-Reference Self-Calibrating Biosensor Network for Continuous Multi-Analyte Biochemical Monitoring**

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to:
- EOS-2026-001: HEALTH-KEY ULTRA (provisional, filed May 23, 2026, U.S. App. No. 64/073,334)
- EOS-2026-002: HEALTH-BAND Neuro (provisional, filed May 27, 2026, U.S. App. No. 64/076,078)
- EOS-2026-003: HEALTH-RING (provisional, target 2026 Q3)

---

## FIELD OF THE INVENTION

The present invention relates to flexible wearable biosensor patches for continuous biochemical monitoring, and more particularly to a multi-analyte biosensor patch integrating an aerosol jet printed platinum-black nano-electrode array, a time-multiplexed dual-mode sampling architecture combining sweat electrochemistry and reverse iontophoresis, and a three-reference self-calibrating biosensor network for continuous wear up to 14 days.

---

## BACKGROUND OF THE INVENTION

Wearable biosensor patches for continuous biochemical monitoring represent one of the most active areas of medical device development. The current state of the art includes:

**Abbott FreeStyle Libre / Dexcom Stelo:** Continuous glucose monitoring (CGM) patches using enzymatic electrochemical sensing via a subcutaneous needle. These devices monitor only glucose and require needle insertion, creating a barrier to adoption and a risk of infection.

**Sweat biosensor patches (academic):** Research patches monitoring 2–4 sweat analytes (Na⁺, K⁺, glucose, lactate) from passive sweat. No commercial product has achieved more than 4 analytes simultaneously without microfluidic separation.

**Iontophoresis patches (academic):** Research patches using reverse iontophoresis for non-invasive glucose extraction. No commercial product has combined iontophoresis with multi-analyte sweat sensing on the same electrode array.

The present invention addresses three fundamental limitations:

**Limitation 1 — Single-analyte or limited multi-analyte sensing.** No existing wearable biosensor patch monitors more than 4 analytes simultaneously without microfluidic separation. Cross-analyte interference between enzyme-functionalized electrodes in close proximity has been the primary barrier.

**Limitation 2 — Separate sweat and iontophoresis zones.** Research patches that combine sweat sensing and iontophoresis use separate electrode zones for each function, requiring a larger patch footprint and more complex electronics. No prior art has demonstrated time-multiplexed operation of sweat sensing and iontophoresis on the same electrode array.

**Limitation 3 — Biosensor drift over extended wear.** All existing wearable biosensor patches degrade in accuracy over time due to electrode fouling, enzyme denaturation, and reference electrode drift. No prior art has demonstrated continuous in-situ self-calibration maintaining ±5% accuracy over 14 days without user intervention.

---

## SUMMARY OF THE INVENTION

The present invention provides a flexible wearable biosensor patch family comprising two embodiment tiers:

**Base Tier:** A flexible patch comprising a Nano-Electrode Biosensor Array (NEBA) with at least four working electrodes fabricated by aerosol jet printing of platinum-black nanoparticle ink, functionalized for glucose, lactate, sodium, and pH detection from sweat, with a single Ag/AgCl reference electrode.

**Ultra Tier:** A flexible patch comprising: (a) a NEBA with seven working electrodes for simultaneous detection of glucose, lactate, cortisol, uric acid, Na⁺, K⁺, and pH; (b) a Dual-Mode Sampling Architecture (DMSA) that time-multiplexes the electrode array between passive sweat sensing and active reverse iontophoresis; and (c) a Self-Calibrating Biosensor Network (SCBN) with three distributed Ag/AgCl reference electrodes and a Kalman filter maintaining ±5% accuracy over 14 days.

---

## DETAILED DESCRIPTION OF THE INVENTION

### 1. Patch Construction

The HEALTH-LAB patch is a flexible adhesive patch assembled from the following layers:
1. Medical-grade adhesive (3M 1524, 0.05 mm) for skin attachment
2. Biosensor substrate (Kapton 50HN, 0.05 mm) with the NEBA electrode array
3. Electronics substrate (Kapton 100HN, 0.10 mm) with the 2-layer flex PCB
4. Flexible LiPo battery (Grepow GRP3040, 45 mAh Ultra / 20 mAh Base, 0.50 mm)
5. NFC charging coil (TDK WCT-1501, 0.10 mm)
6. Medical-grade overmold (0.05 mm) for waterproofing

Total dimensions: 35×25×1.0 mm (Ultra), 30×20×0.85 mm (Base). Weight: 2.1 g (Ultra), 1.4 g (Base).

### 2. Nano-Electrode Biosensor Array (NEBA)

The NEBA is fabricated by aerosol jet printing (AJP) of platinum-black nanoparticle ink (Sigma-Aldrich 685453, 5–20 nm particles) on the Kapton biosensor substrate. AJP enables:
- Line width: 50 µm (vs. 200–500 µm for screen printing)
- Electrode spacing: 100 µm center-to-center
- High surface area for enzyme immobilization (roughness factor >50 vs. smooth Pt)

**Electrode functionalization (Ultra — 7 analytes):**

| Electrode | Functionalization | Analyte | Mechanism |
|---|---|---|---|
| W1 | Glucose oxidase (GOx) + Nafion | Glucose | Amperometric (+0.6V vs. Ag/AgCl) |
| W2 | Lactate oxidase (LOx) + Nafion | Lactate | Amperometric (+0.6V vs. Ag/AgCl) |
| W3 | Molecularly imprinted polymer (MIP) | Cortisol | Impedimetric |
| W4 | Uricase (UOx) + Nafion | Uric acid | Amperometric (+0.6V vs. Ag/AgCl) |
| W5 | Valinomycin ISE membrane | Sodium (Na⁺) | Potentiometric (Nernst) |
| W6 | Nonactin ISE membrane | Potassium (K⁺) | Potentiometric (Nernst) |
| W7 | Iridium oxide (IrOx) electrodeposition | pH | Potentiometric (IrOx Nernst) |

**Cross-analyte interference suppression:** Nafion membrane barriers (2 µm) on enzyme electrodes act as H₂O₂ diffusion barriers. Combined with 100 µm electrode spacing, cross-analyte interference is reduced to <2% of the working electrode signal.

### 3. Dual-Mode Sampling Architecture (DMSA) — Ultra Tier

The DMSA time-multiplexes the electrode array between two modes:

**Mode A — Passive sweat sensing (270 seconds per 5-minute cycle):** LMP91000 potentiostat ICs apply bias voltages to W1–W7 and measure current or potential from sweat analytes on the skin surface.

**Mode B — Active reverse iontophoresis (30 seconds per 5-minute cycle):** An H-bridge circuit applies 200 µA between the iontophoresis anode (IA) and cathode (IC). This drives glucose and lactate from interstitial fluid through the skin via electroosmosis. After the 30-second pulse, the LMP91000 measures extracted glucose and lactate at W1 and W2.

The iontophoresis electrodes (IA, IC) are physically separated from the biosensor working electrodes (W1–W7) on the patch surface, preventing iontophoresis current from flowing through enzyme-functionalized electrodes and denaturing the enzymes.

### 4. Self-Calibrating Biosensor Network (SCBN) — Ultra Tier

Three independent Ag/AgCl reference electrodes (R1, R2, R3) are distributed at the vertices of an equilateral triangle across the patch surface. Each is connected to a separate LMP91000 potentiostat IC.

**Calibration algorithm:**

1. **Reference health monitoring:** Potentials V_R1, V_R2, V_R3 are continuously measured. Any reference drifting more than 5 mV from the median is flagged and excluded.

2. **Temperature compensation:** MAX30208 skin temperature T_skin corrects potentiometric measurements:
   ```
   E_corrected = E_measured × (T_skin + 273.15) / (T_calibration + 273.15)
   ```

3. **Kalman filter drift correction:**
   ```
   x_k = x_{k-1} + K_k × (z_k − H × x_{k-1})
   ```
   where x_k is estimated baseline drift, z_k is measured electrode potential, and K_k is Kalman gain. Updated every 30 minutes using reference electrode measurements as ground truth.

4. **Factory calibration:** Calibration coefficients (slope and intercept per analyte) stored in nRF52840 flash memory.

---

## CLAIMS

**Claim 1.** A flexible wearable biosensor patch comprising: a flexible substrate of 0.15 mm total thickness or less; at least four working electrodes fabricated on the flexible substrate by aerosol jet printing of platinum-black nanoparticle ink, wherein each working electrode is functionalized with a distinct enzyme or ion-selective membrane; and at least one potentiostat circuit configured to apply bias voltages to the working electrodes and measure electrochemical signals corresponding to at least four distinct biochemical analytes.

**Claim 2.** The patch of claim 1, wherein at least five working electrodes are present and the at least five biochemical analytes comprise at least three of: glucose, lactate, cortisol, sodium ions, potassium ions, uric acid, and pH.

**Claim 3.** The patch of claim 1, wherein cross-analyte interference between any two adjacent working electrodes is less than 5% of the working electrode signal.

**Claim 4.** The patch of claim 1, wherein the platinum-black nanoparticle ink comprises particles of 5–50 nm diameter and the electrode line width is 100 µm or less.

**Claim 5.** A flexible wearable biosensor patch comprising: a flexible substrate; a working electrode array comprising at least two enzyme-functionalized electrodes; at least two iontophoresis electrodes configured to apply a transdermal current for reverse iontophoresis extraction of analytes from interstitial fluid; and a control circuit configured to time-multiplex the electrode array between a first mode of passive electrochemical sensing of sweat analytes and a second mode of active reverse iontophoresis for transdermal analyte extraction, wherein the two modes do not operate simultaneously on the same electrode.

**Claim 6.** The patch of claim 5, wherein the first mode detects at least one of cortisol, sodium ions, potassium ions, and pH from sweat, and the second mode extracts at least one of glucose and lactate from interstitial fluid.

**Claim 7.** The patch of claim 5, wherein the time-multiplexing cycle comprises an iontophoresis phase of 10–60 seconds followed by a measurement phase of 60–300 seconds.

**Claim 8.** The patch of claim 5, wherein the iontophoresis electrodes are physically separated from the enzyme-functionalized working electrodes on the patch surface to prevent iontophoresis current from flowing through the enzyme-functionalized electrodes.

**Claim 9.** A flexible wearable biosensor patch comprising: a flexible substrate; a working electrode array; at least three independent reference electrodes distributed across the patch surface; a temperature sensor; and a processor configured to: continuously monitor the potential of each reference electrode; flag any reference electrode that deviates more than a threshold from the median of all reference electrode potentials; apply a temperature compensation correction to potentiometric measurements; and apply a Kalman filter drift correction algorithm to maintain biosensor accuracy within ±10% over a continuous wear period of at least 7 days.

**Claim 10.** The patch of claim 9, wherein the Kalman filter estimates baseline drift of each working electrode using the reference electrode measurements as ground truth, updated at intervals of 60 minutes or less.

**Claim 11.** The patch of claim 9, wherein the at least three reference electrodes are distributed at the vertices of a triangle on the patch surface.

**Claim 12.** The patch of claim 9, wherein the biosensor accuracy is maintained within ±10% over a continuous wear period of at least 14 days without user intervention.

**Claim 13.** A flexible wearable biosensor patch comprising all elements of claims 1, 5, and 9 in combination, further comprising: a flexible lithium polymer battery; an NFC inductive charging coil; a Bluetooth Low Energy transceiver; and a medical-grade adhesive layer for skin attachment; wherein the patch has a total thickness of 1.5 mm or less and a wear duration of at least 7 days.

---

## ABSTRACT

A flexible wearable biosensor patch for continuous multi-analyte biochemical monitoring integrates three novel technologies: (1) a Nano-Electrode Biosensor Array (NEBA) comprising working electrodes fabricated by aerosol jet printing of platinum-black nanoparticle ink, functionalized for simultaneous detection of up to 7 analytes (glucose, lactate, cortisol, Na⁺, K⁺, uric acid, pH) with cross-analyte interference below 2%; (2) a Dual-Mode Sampling Architecture (DMSA) that time-multiplexes the same electrode array between passive sweat sensing and active reverse iontophoresis for transdermal glucose and lactate extraction; and (3) a Self-Calibrating Biosensor Network (SCBN) with three distributed Ag/AgCl reference electrodes and a Kalman filter drift correction algorithm that maintains ±5% accuracy over 14 days of continuous wear. The patch is offered in two tiers: HEALTH-LAB (30×20 mm, 4 analytes, 7-day) and HEALTH-LAB Ultra (35×25 mm, 7 analytes, 14-day).

---

## INVENTOR DECLARATION

I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application. All statements made herein are true to the best of my knowledge and belief.

**Srikanth Patchava**
Embedded Operating Systems Research Foundation
EIN: 41-4821627
Date: 2026 Q3 (target)
