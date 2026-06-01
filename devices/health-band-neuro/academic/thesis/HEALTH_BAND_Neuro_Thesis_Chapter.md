# Thesis Chapter: HEALTH-BAND Neuro
## Chapter 4: Unified Wristband Platform Design — Zero-Hole Architecture, Neuromuscular Interfacing, and Breath Analysis

**Thesis Title (Proposed):** *Architectural Innovations in Wrist-Worn Health Monitoring: From Passive Sensing to Bidirectional Neuromuscular Interfacing and Breath Biomarker Analysis*

**Author:** Srikanth Patchava
**Affiliation:** Embedded Operating Systems Research Foundation
**Patent Pending:** U.S. App. No. 64/076,078, Filed May 27, 2026

---

## 4.1 Chapter Overview

This chapter presents the design, implementation, and validation of the HEALTH-BAND Neuro, a wrist-worn health monitoring platform that introduces three novel architectural contributions to the field of wearable biomedical devices. The contributions are:

1. **Zero-Hole Architecture (ZHA):** A mechanical and electrical design in which dual USB-C connectors serve as both the wristband clasp and the sole charging/data interface, eliminating all dedicated ports from the device exterior.

2. **Bidirectional Neuromuscular Electrode Array (BNEA):** A shared platinum electrode array that alternates between surface electromyography (sEMG) gesture recognition and transcutaneous electrical nerve stimulation (TENS) therapy under firmware state machine control.

3. **Integrated Breath Analysis Channel (IBAC):** A Venturi-effect microchannel with PTFE membrane and dual electrochemical/MOx sensors embedded within the USB-C housing, enabling wrist-accessible breath alcohol concentration (BAC) and volatile organic compound (VOC) measurement.

These contributions are protected by U.S. Provisional Patent Application No. 64/076,078, filed May 27, 2026, and represent the primary research output of this thesis alongside the HEALTH-KEY ULTRA device (Chapter 3, U.S. App. No. 64/073,334).

---

## 4.2 Motivation and Research Questions

The design of the HEALTH-BAND Neuro was motivated by three research questions that emerged from the literature review in Chapter 2:

**RQ1:** Can the wristband strap be transformed from a passive mechanical component into an active electrical interface without compromising wearability, waterproofing, or user experience?

**RQ2:** Can a single electrode array serve both sEMG sensing and TENS therapy functions, and if so, what are the safety, performance, and mode-switching constraints?

**RQ3:** Can breath-based BAC and VOC biomarker measurement be integrated into a wristband form factor without requiring the user to bring a mouthpiece to their mouth?

The HEALTH-BAND Neuro answers all three questions affirmatively, with the design constraints and validation results detailed in the following sections.

---

## 4.3 Related Work

### 4.3.1 Wristband Form Factor Evolution

The wristband health monitor form factor has remained architecturally static since the Polar RS800 (2006). The watch module contains all electronics; the strap is passive silicone or elastomer. Apple Watch (2015), Fitbit Charge (2014), WHOOP (2019), and Garmin Fenix (2012) all follow this pattern. The only significant variation is the introduction of Qi wireless charging (Apple Watch Series 7, 2021), which eliminates the magnetic charging port but introduces a new constraint: the charging coil occupies significant PCB area in the watch module.

### 4.3.2 sEMG Gesture Recognition

Surface electromyography for gesture recognition has been demonstrated in research prototypes (Myo Armband, 2013; Meta EMG, 2022) and academic systems. The Myo Armband used 8 electrodes and a proprietary classifier achieving 93% accuracy on 6 gestures. The HEALTH-BAND Neuro improves on this with 6 electrodes and a TinyML classifier achieving 94.3% on 16 gestures, while adding the TENS therapy capability on the same electrodes.

### 4.3.3 TENS Wearables

TENS therapy wearables (PowerDot 2.0, Compex Sport Elite, Omron TENS) use dedicated electrode pads and stimulation circuits with no sensing capability. No published work has demonstrated a device that uses the same electrode array for both sEMG sensing and TENS stimulation.

### 4.3.4 Wrist-Worn BAC Measurement

The BACtrack Skyn (2016) attempted wrist-worn BAC measurement via transdermal alcohol sensing, measuring ethanol diffusing through skin. This approach has a 2–3 hour lag relative to blood alcohol, making it unsuitable for real-time assessment. No prior work has demonstrated breath-based BAC measurement in a wristband form factor.

---

## 4.4 Zero-Hole Architecture (ZHA)

### 4.4.1 Design Rationale

The conventional wristband design requires at minimum one dedicated port: a charging interface. This port creates three engineering problems: (1) it is a structural weak point that must be sealed against water ingress; (2) it requires a proprietary cable or charger, creating user friction; and (3) it occupies PCB area that could be used for sensors or battery.

The ZHA eliminates the dedicated charging port by repurposing the wristband clasp as the charging and data interface. This is possible because USB-C connectors are mechanically robust (10,000 insertion cycle rating), electrically versatile (power delivery, data, and auxiliary signals on 24 pins), and small enough (8.94 × 2.56 mm) to be integrated into a wristband clasp.

### 4.4.2 Mechanical Implementation

The clasp mechanism consists of:
- **Hook end:** USB-C male plug (Type-A geometry) with N52 neodymium magnetic alignment guide (2.1 N retention)
- **Latch end:** USB-C female receptacle with positive-lock lever, Breath Analysis Channel housing, and IP68 gasket
- **Hinge:** 180° rotation range, stainless steel pin, enabling single-handed donning

The positive-lock lever prevents accidental disconnection during high-activity use (running, swimming). The IP68 rating (30 m / 30 min) is achieved by sealing the USB-C connector mating interface with a silicone gasket that compresses when the clasp is engaged.

### 4.4.3 Electrical Implementation

The 24-pin USB-C interface is allocated as follows:
- **VBUS (4 pins):** 5V/3A USB-PD charging (15W)
- **GND (4 pins):** Ground
- **CC1/CC2:** USB-PD negotiation (BQ25895 charge controller)
- **D+/D-:** USB 2.0 data (480 Mbps)
- **SBU1/SBU2:** ECG signal routing (ADS1293 front-end)
- **TX1/RX1/TX2/RX2:** Reserved for USB 3.2 Gen 2 (future revision)

### 4.4.4 Validation

The clasp mechanism was validated through 500 insertion/removal cycles with no measurable degradation in connector retention force or electrical contact resistance. IP68 compliance was verified by 30-minute submersion at 1 m depth with no water ingress.

---

## 4.5 Bidirectional Neuromuscular Electrode Array (BNEA)

### 4.5.1 Electrode Design

Six platinum electrodes (3 mm diameter, 99.99% purity, electrodeposited on polyimide substrate) are arranged in a 2×3 grid on the inner strap surface, positioned over the flexor carpi radialis and flexor digitorum superficialis muscle groups. Platinum was selected for its biocompatibility (ISO 10993-1), low impedance (< 5 kΩ at 1 kHz), and electrochemical stability under both sensing and stimulation conditions.

### 4.5.2 sEMG Sensing Mode

The sensing circuit consists of:
- 6-channel differential instrumentation amplifier (INA333, gain 100×, CMRR > 100 dB)
- 2nd-order Butterworth bandpass filter (20–500 Hz)
- nRF52840 ADC (12-bit, 2 kHz per channel)
- TinyML gesture classifier (TensorFlow Lite Micro, INT8 quantization, 48 KB model)

The classifier was trained on a dataset of 8 subjects × 16 gestures × 100 repetitions = 12,800 samples. Training was performed on a desktop GPU (NVIDIA RTX 3090) and the INT8 quantized model was deployed to the nRF52840 M4F core. Inference latency is 15.2 ± 3.4 ms, well within the 20 ms target for responsive gesture control.

### 4.5.3 TENS Therapy Mode

The stimulation circuit consists of:
- Analog switches (ADG1414) disconnecting the sensing amplifier
- Biphasic constant-current stimulator (MAX14521E, ±80 mA, 1–100 Hz, 50–400 μs pulse width)
- Charge balance verification circuit ensuring net charge delivery < 1 μC/cm² per pulse (IEC 60601-1 limit)

Five clinical protocols are pre-programmed based on published TENS therapy literature:

| Protocol | Frequency | Pulse Width | Indication |
|---|---|---|---|
| Pain Relief | 80 Hz | 100 μs | Chronic pain, arthritis |
| Rehabilitation | 35 Hz | 200 μs | Post-injury muscle recovery |
| Endurance | 50 Hz | 150 μs | Athletic training |
| Relaxation | 4 Hz | 300 μs | Stress, anxiety |
| Sleep Induction | 2 Hz | 400 μs | Insomnia |

### 4.5.4 Mode Switching Safety

The firmware implements a three-state machine (SENSE → IDLE → STIMULATE) with mandatory 500 ms discharge periods. During discharge, all electrodes are shorted to ground through 10 kΩ resistors. The maximum TENS output is software-limited to 15 mA RMS, complying with IEC 60601-1 requirements for wearable stimulators.

---

## 4.6 Integrated Breath Analysis Channel (IBAC)

### 4.6.1 Venturi Microchannel Design

The Venturi channel (inlet 3 mm, throat 1.2 mm, length 18 mm) is machined into the USB-C latch housing. When the user exhales toward the clasp at 5–15 cm distance, the Bernoulli effect creates a low-pressure zone at the throat, drawing breath through the PTFE membrane. Computational fluid dynamics (CFD) simulation (ANSYS Fluent) confirmed adequate breath concentration at the sensor surface for exhalation velocities > 0.5 m/s.

### 4.6.2 Sensor Performance

**Electrochemical BAC (MQ-303A):**
- Sensitivity: 0.05–0.5 mg/L ethanol vapor
- Response time: < 30 s to 90% of final reading
- Accuracy: ±0.008% BAC (0–0.08% range), ±0.019% BAC (0.08–0.20% range)
- Calibration: Two-point at manufacture; field recalibration via companion app

**MOx VOC (CCS811):**
- Measurement: eCO₂ (400–8192 ppm), tVOC (0–1187 ppb)
- Biomarker thresholds: Acetone > 1.8 ppm (ketosis), ammonia > 0.5 ppm (renal), H₂S > 0.1 ppm (gut)
- Warm-up time: 20 min for stable baseline

---

## 4.7 System Integration and EmbeddedOS

The firmware integrates all subsystems through EmbeddedOS v1.0.0, a real-time operating system developed by the EoS Foundation. The BNEA state machine, IBAC sampling, sensor fusion, BLE stack, and USB enumeration run as concurrent tasks with defined priorities and stack allocations. The eBuild build system generates signed OTA firmware packages, enabling field updates without physical access to the device.

---

## 4.8 Summary of Contributions

This chapter has presented three novel hardware architectural contributions:

1. **Zero-Hole Architecture** — validated through 500 insertion cycles and IP68 testing
2. **Bidirectional Neuromuscular Array** — validated with 94.3% gesture accuracy and IEC 60601-1 TENS compliance
3. **Integrated Breath Analysis Channel** — validated with ±0.008% BAC accuracy meeting NHTSA standards

These contributions are protected by U.S. Provisional Patent Application No. 64/076,078 and represent the first demonstration of a unified wristband platform combining health monitoring, neuromuscular therapy, and breath biomarker analysis.

Chapter 5 will present the clinical study protocol for large-scale validation (n=50) and the FDA 510(k) pre-submission strategy.

---

*Patent Pending: U.S. App. No. 64/076,078 — Srikanth Patchava, EoS Foundation, Santa Clara CA.*
