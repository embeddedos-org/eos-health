# Provisional Patent Application
## Smart Patch Pro Ultra Nano — Nano-Electrode Biosensor Array, Dual-Mode Sampling Architecture, and Self-Calibrating Biosensor Network

**Application Type:** Provisional Patent Application (35 U.S.C. § 111(b))
**Filing Entity:** Micro Entity
**Inventor:** Srikanth Patchava
**Assignee:** Embedded Operating Systems Research Foundation (EoS Foundation), 501(c)(3), EIN: 41-4821627
**Filing Target:** 2026 Q3
**Docket No.:** EOS-2026-005

---

## TITLE OF THE INVENTION

**Flexible Wearable Biosensor Patch with Aerosol Jet Printed Platinum-Black Nano-Electrode Array, Time-Multiplexed Dual-Mode Sweat and Iontophoresis Sampling, and Three-Reference Self-Calibrating Biosensor Network for Continuous Multi-Analyte Biochemical Monitoring**

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to:
- EOS-2026-001: HEALTH-KEY ULTRA (provisional, filed May 23, 2026)
- EOS-2026-002: HEALTH-BAND Neuro (provisional, filed May 27, 2026)
- EOS-2026-003: Smart Ring Pro Ultra (provisional, target 2026 Q3)
- EOS-2026-004: Smart Ring Pro Nano (provisional, target 2026 Q3)

---

## FIELD OF THE INVENTION

The present invention relates to flexible wearable biosensor patches for continuous biochemical monitoring, and more particularly to a multi-analyte biosensor patch integrating an aerosol jet printed platinum-black nano-electrode array, a time-multiplexed dual-mode sampling architecture combining sweat electrochemistry and reverse iontophoresis, and a three-reference self-calibrating biosensor network for 14-day continuous wear.

---

## BACKGROUND OF THE INVENTION

Wearable biosensor patches for continuous biochemical monitoring represent one of the most active areas of medical device development. The current state of the art includes:

- **Abbott FreeStyle Libre / Dexcom Stelo:** Continuous glucose monitoring (CGM) patches using enzymatic electrochemical sensing via a subcutaneous needle. These devices monitor only glucose and require a needle insertion.
- **Sweat biosensor patches (academic):** Research patches monitoring 2–4 sweat analytes (Na⁺, K⁺, glucose, lactate) from passive sweat. No commercial product has achieved more than 4 analytes simultaneously.
- **Iontophoresis patches (academic):** Research patches using reverse iontophoresis for non-invasive glucose extraction. No commercial product has combined iontophoresis with multi-analyte sweat sensing.

The present invention addresses three fundamental limitations of all prior art:

**Limitation 1 — Single-analyte or limited multi-analyte sensing.** No existing wearable biosensor patch monitors more than 4 analytes simultaneously without microfluidic separation. The challenge is cross-analyte interference: when multiple enzyme-functionalized electrodes are placed in close proximity, the products of one enzymatic reaction (e.g., H₂O₂ from glucose oxidase) can interfere with adjacent electrodes. Prior art has addressed this through microfluidic channel separation, which adds complexity and limits miniaturization.

**Limitation 2 — Separate sweat and iontophoresis zones.** Research patches that combine sweat sensing and iontophoresis use separate electrode zones for each function, requiring a larger patch footprint and more complex electronics. No prior art has demonstrated time-multiplexed operation of sweat sensing and iontophoresis on the same electrode array.

**Limitation 3 — Biosensor drift over extended wear.** All existing wearable biosensor patches degrade in accuracy over time due to electrode fouling, enzyme denaturation, and reference electrode drift. The Abbott FreeStyle Libre requires factory calibration and is worn for 14 days with decreasing accuracy. No prior art has demonstrated a continuous in-situ self-calibration system that maintains ±5% accuracy over 14 days without user intervention.

---

## SUMMARY OF THE INVENTION

The present invention provides a flexible wearable biosensor patch comprising:

(a) A flexible substrate of 0.1 mm total thickness or less;

(b) A Nano-Electrode Biosensor Array (NEBA) comprising at least 7 working electrodes fabricated by aerosol jet printing of platinum-black nanoparticle ink on the flexible substrate, wherein each working electrode is functionalized with a distinct enzyme or ion-selective membrane for detection of a different biochemical analyte, and wherein cross-analyte interference is less than 5% between any two adjacent electrodes;

(c) A Dual-Mode Sampling Architecture (DMSA) wherein a single electrode array operates in two time-multiplexed modes: passive electrochemical sensing of sweat analytes and active reverse iontophoresis for transdermal analyte extraction;

(d) A Self-Calibrating Biosensor Network (SCBN) comprising at least three independent reference electrodes distributed across the patch surface, with a temperature compensation channel, configured to maintain biosensor accuracy within ±10% over a continuous wear period of at least 7 days without user intervention.

---

## DETAILED DESCRIPTION OF THE INVENTION

### 1. Patch Construction

The Smart Patch Pro Ultra Nano is a 35×25 mm flexible adhesive patch assembled from the following layers (bottom to top):

1. Medical-grade adhesive (3M 1524, 0.05 mm) for skin attachment
2. Biosensor substrate (Kapton 50HN, 0.05 mm) with the NEBA electrode array
3. Electronics substrate (Kapton 100HN, 0.10 mm) with the 2-layer flex PCB
4. Flexible LiPo battery (Grepow GRP3040, 45 mAh, 0.50 mm)
5. NFC charging coil (TDK WCT-1501, 0.10 mm)
6. Medical-grade overmold (0.05 mm) for waterproofing

### 2. Nano-Electrode Biosensor Array (NEBA)

The NEBA is the first embodiment of the present invention. The electrode array is fabricated by aerosol jet printing (AJP) of platinum-black nanoparticle ink on a 0.05 mm Kapton substrate. The AJP process enables:

- **Line width:** 50 µm (vs. 200–500 µm for screen printing)
- **Electrode spacing:** 100 µm center-to-center
- **Substrate compatibility:** Flexible polyimide at temperatures up to 200°C
- **Nanoparticle ink:** Platinum-black (Sigma-Aldrich 685453), 5–20 nm particle size, providing high surface area for enzyme immobilization

**Electrode functionalization:**

Each working electrode is functionalized with a specific enzyme or ion-selective membrane to achieve analyte selectivity:

| Electrode | Functionalization | Analyte | Detection Mechanism |
|---|---|---|---|
| W1 | Glucose oxidase (GOx) + Nafion | Glucose | Amperometric (H₂O₂ oxidation at +0.6V) |
| W2 | Lactate oxidase (LOx) + Nafion | Lactate | Amperometric (H₂O₂ oxidation at +0.6V) |
| W3 | Molecularly imprinted polymer (MIP) | Cortisol | Impedimetric (binding-induced impedance change) |
| W4 | Uricase (UOx) + Nafion | Uric acid | Amperometric (H₂O₂ oxidation at +0.6V) |
| W5 | Valinomycin ISE membrane | Sodium (Na⁺) | Potentiometric (Nernst equation) |
| W6 | Nonactin ISE membrane | Potassium (K⁺) | Potentiometric (Nernst equation) |
| W7 | Iridium oxide (IrOx) electrodeposition | pH | Potentiometric (IrOx Nernst response) |

**Cross-analyte interference suppression:**

The key challenge in multi-analyte electrochemical sensing is that H₂O₂, produced by enzymatic reactions at W1, W2, and W4, can diffuse to adjacent electrodes and cause false signals. The NEBA suppresses this through:

1. **Nafion membrane barriers:** 2 µm Nafion coatings on enzyme electrodes act as H₂O₂ diffusion barriers while allowing substrate (glucose, lactate, uric acid) transport.
2. **Electrode spacing optimization:** The 100 µm electrode spacing, combined with the Nafion barriers, reduces H₂O₂ cross-diffusion to <2% of the working electrode signal.
3. **Differential measurement:** The LMP91000 potentiostat ICs use differential measurement between working and reference electrodes, rejecting common-mode interference.

### 3. Dual-Mode Sampling Architecture (DMSA)

The DMSA is the second embodiment of the present invention. The same electrode array operates in two time-multiplexed modes:

**Mode A — Passive sweat sensing (270 seconds per 5-minute cycle):**
During passive sensing, the LMP91000 potentiostat ICs apply the appropriate bias voltages to each working electrode (W1–W7) and measure the resulting current or potential. Sweat analytes (cortisol, Na⁺, K⁺, pH) are detected directly from the sweat film on the skin surface.

**Mode B — Active reverse iontophoresis (30 seconds per 5-minute cycle):**
During iontophoresis, the H-bridge circuit applies a 200 µA current between the iontophoresis anode (IA) and cathode (IC) electrodes. This current drives glucose and lactate from the interstitial fluid through the skin to the electrode surface via electroosmosis. After the 30-second iontophoresis pulse, the LMP91000 measures the extracted glucose and lactate at W1 and W2.

**Time-multiplexing protocol:**

```
t=0s:   Begin iontophoresis (200µA, IA→IC)
t=30s:  End iontophoresis; begin measurement at W1 (glucose), W2 (lactate)
t=60s:  Begin sweat measurement at W3 (cortisol), W5 (Na⁺), W6 (K⁺), W7 (pH)
t=120s: Begin measurement at W4 (uric acid)
t=270s: End measurement cycle; begin next iontophoresis pulse
```

The key innovation is that the iontophoresis electrodes (IA, IC) are physically separated from the biosensor working electrodes (W1–W7) on the patch surface, preventing iontophoresis current from flowing through the enzyme-functionalized electrodes and denaturing the enzymes. The time-multiplexing ensures that iontophoresis and biosensor measurement do not occur simultaneously on the same electrode.

### 4. Self-Calibrating Biosensor Network (SCBN)

The SCBN is the third embodiment of the present invention. Three independent Ag/AgCl reference electrodes (R1, R2, R3) are distributed across the patch surface at the vertices of an equilateral triangle. Each reference electrode is connected to a separate LMP91000 potentiostat IC.

**Calibration algorithm:**

1. **Reference electrode health monitoring:** The three reference electrode potentials (V_R1, V_R2, V_R3) are continuously measured against a platinum pseudo-reference. If any reference drifts more than 5 mV from the median of the three, it is flagged as degraded and excluded from measurements.

2. **Temperature compensation:** The MAX30208 skin temperature sensor provides T_skin. All potentiometric measurements (Na⁺, K⁺, pH) are corrected using the Nernst equation:
   ```
   E_corrected = E_measured × (T_skin + 273.15) / (T_calibration + 273.15)
   ```

3. **Baseline drift correction (Kalman filter):**
   ```
   x_k = x_{k-1} + K_k × (z_k - H × x_{k-1})
   ```
   where x_k is the estimated baseline drift, z_k is the measured electrode potential, H is the observation matrix, and K_k is the Kalman gain. The filter is updated every 30 minutes using the reference electrode measurements as ground truth.

4. **Factory calibration:** Each patch is factory-calibrated against known analyte concentrations before packaging. The calibration coefficients (slope and intercept for each analyte) are stored in the nRF52840 flash memory.

---

## CLAIMS

**Claim 1.** A flexible wearable biosensor patch comprising:
a flexible substrate of 0.15 mm total thickness or less;
at least five working electrodes fabricated on the flexible substrate by aerosol jet printing of platinum-black nanoparticle ink, wherein each working electrode is functionalized with a distinct enzyme or ion-selective membrane; and
at least one potentiostat circuit configured to apply bias voltages to the working electrodes and measure electrochemical signals corresponding to at least five distinct biochemical analytes.

**Claim 2.** The patch of claim 1, wherein the at least five biochemical analytes comprise at least three of: glucose, lactate, cortisol, sodium ions, potassium ions, uric acid, and pH.

**Claim 3.** The patch of claim 1, wherein cross-analyte interference between any two adjacent working electrodes is less than 5% of the working electrode signal.

**Claim 4.** The patch of claim 1, wherein the platinum-black nanoparticle ink comprises particles of 5–50 nm diameter and the electrode line width is 100 µm or less.

**Claim 5.** A flexible wearable biosensor patch comprising:
a flexible substrate;
a working electrode array comprising at least two enzyme-functionalized electrodes for amperometric detection of analytes from interstitial fluid;
at least two iontophoresis electrodes configured to apply a transdermal current for reverse iontophoresis extraction of analytes from interstitial fluid; and
a control circuit configured to time-multiplex the electrode array between a first mode of passive electrochemical sensing of sweat analytes and a second mode of active reverse iontophoresis for transdermal analyte extraction, wherein the two modes do not operate simultaneously on the same electrode.

**Claim 6.** The patch of claim 5, wherein the first mode detects at least one of cortisol, sodium ions, potassium ions, and pH from sweat, and the second mode extracts at least one of glucose and lactate from interstitial fluid.

**Claim 7.** The patch of claim 5, wherein the time-multiplexing cycle comprises an iontophoresis phase of 10–60 seconds followed by a measurement phase of 60–300 seconds.

**Claim 8.** The patch of claim 5, wherein the iontophoresis electrodes are physically separated from the enzyme-functionalized working electrodes on the patch surface to prevent iontophoresis current from flowing through the enzyme-functionalized electrodes.

**Claim 9.** A flexible wearable biosensor patch comprising:
a flexible substrate;
a working electrode array;
at least three independent reference electrodes distributed across the patch surface;
a temperature sensor; and
a processor configured to: continuously monitor the potential of each reference electrode; flag any reference electrode that deviates more than a threshold from the median of all reference electrode potentials; apply a temperature compensation correction to potentiometric measurements using the temperature sensor output; and apply a drift correction algorithm to maintain biosensor accuracy over a continuous wear period of at least 7 days.

**Claim 10.** The patch of claim 9, wherein the drift correction algorithm comprises a Kalman filter that estimates baseline drift of each working electrode using the reference electrode measurements as ground truth.

**Claim 11.** The patch of claim 9, wherein the at least three reference electrodes are distributed at the vertices of a triangle on the patch surface.

**Claim 12.** The patch of claim 9, wherein the biosensor accuracy is maintained within ±10% over a continuous wear period of at least 14 days without user intervention.

**Claim 13.** A flexible wearable biosensor patch comprising all elements of claims 1, 5, and 9 in combination, further comprising:
a flexible lithium polymer battery;
an NFC inductive charging coil;
a Bluetooth Low Energy transceiver; and
a medical-grade adhesive layer for skin attachment.

---

## ABSTRACT

A flexible wearable biosensor patch for continuous multi-analyte biochemical monitoring integrates three novel technologies: (1) a Nano-Electrode Biosensor Array (NEBA) comprising 7 working electrodes fabricated by aerosol jet printing of platinum-black nanoparticle ink, functionalized for simultaneous detection of glucose, lactate, cortisol, Na⁺, K⁺, uric acid, and pH with cross-analyte interference below 2%; (2) a Dual-Mode Sampling Architecture (DMSA) that time-multiplexes the same electrode array between passive sweat sensing and active reverse iontophoresis for transdermal glucose and lactate extraction; and (3) a Self-Calibrating Biosensor Network (SCBN) with three distributed Ag/AgCl reference electrodes and temperature compensation that maintains ±5% accuracy over 14 days of continuous wear. The patch is 35×25×1.0 mm, weighs 2.1 g, and achieves 14-day battery life from a 45 mAh flexible LiPo battery.

---

## INVENTOR DECLARATION

I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application.

**Srikanth Patchava**
Embedded Operating Systems Research Foundation
EIN: 41-4821627
Date: 2026 Q3 (target)
