# UNITED STATES PATENT APPLICATION

**Application Type:** Non-Provisional Utility Patent Application  
**Title of Invention:** MODULAR WRISTBAND HEALTH MONITORING APPARATUS WITH ZERO-HOLE ARCHITECTURE, BIDIRECTIONAL NEUROMUSCULAR INTERFACE, AND INTEGRATED BREATH ANALYSIS CHANNEL  
**Inventor:** Srikanth Patchava  
**Assignee:** Embedded Operating Systems Research Foundation (EoS)  
**Priority Claim:** This application claims priority to U.S. Provisional Patent Application No. 64/073,334, filed May 23, 2026, the entire contents of which are incorporated herein by reference.  
**Filing Date (Target):** November 2026 – March 2027  

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is a non-provisional of, and claims the benefit of priority under 35 U.S.C. § 119(e) to, U.S. Provisional Application No. 64/073,334, filed May 23, 2026, entitled "Modular Wristband Health Monitoring Apparatus with Zero-Hole Architecture and Bidirectional Neuromuscular Interface," the entire disclosure of which is incorporated herein by reference.

This application is related to U.S. Patent Application No. [HEALTH-KEY ULTRA Application Number], entitled "Multi-Sensor Health Monitoring Apparatus in USB-C Dongle Form Factor," filed concurrently or previously by the same inventor and assignee, the entire disclosure of which is incorporated herein by reference.

---

## STATEMENT REGARDING FEDERALLY SPONSORED RESEARCH

Not applicable.

---

## FIELD OF THE INVENTION

The present invention relates to wearable health monitoring devices, and more particularly to a modular wristband apparatus employing a dual-function USB-C clasp mechanism that eliminates dedicated charging ports and sensor windows, integrates a bidirectional neuromuscular electrode array for simultaneous surface electromyography (sEMG) gesture recognition and transcutaneous electrical nerve stimulation (TENS) therapy, and incorporates a breath analysis channel for blood alcohol content (BAC) and volatile organic compound (VOC) measurement, all within a single continuous wristband enclosure.

---

## BACKGROUND OF THE INVENTION

Wearable health monitoring devices have proliferated in recent years, yet existing designs suffer from several fundamental architectural limitations that the present invention addresses.

**Port Proliferation and Structural Weakness.** Conventional smartwatches and fitness bands require at least one dedicated charging port (typically magnetic pogo pins or a proprietary connector), one or more optical sensor windows on the inner surface, and often a separate port for data connectivity. Each port or window represents a structural discontinuity in the enclosure, requiring additional sealing, increasing manufacturing complexity, and creating potential failure points for water ingress. The present invention eliminates all dedicated ports and windows through a unified dual-function clasp mechanism.

**Separation of Sensing and Therapy.** Existing wearable devices that incorporate electrical stimulation (e.g., TENS units) and electromyography sensors are distinct, single-purpose devices. No prior art device integrates both sEMG sensing and TENS therapy through a shared electrode array on a continuous wristband, nor does any prior art device combine these neuromuscular functions with photoplethysmography (PPG), electrocardiography (ECG), blood alcohol content (BAC) measurement, and volatile organic compound (VOC) detection in a single wrist-worn form factor.

**Breath Analysis Ergonomics.** Existing breath analysis devices (breathalyzers, ketone meters) are standalone instruments that require the user to remove the device from their wrist, bring it to their mouth, and exhale into a separate mouthpiece. No prior art wristband device integrates a breath analysis channel that allows the user to exhale directly into the wrist-worn device without removing it from the wrist.

**Pass-Through Charging Architecture.** Existing wristband devices with USB-C connectivity do not support simultaneous pass-through charging, wherein the device acts as an intermediary between a host device (e.g., a smartphone) and a power source, delivering power to the host while simultaneously charging its own internal battery and operating all onboard sensors.

The present invention addresses all of the foregoing limitations in a single integrated apparatus.

---

## SUMMARY OF THE INVENTION

The present invention provides a modular wristband health monitoring apparatus comprising a rigid Core module and a flexible wristband Strap that together form a continuous wrist-worn enclosure. The Core module houses a male USB-C connector on a first end and a female USB-C receptacle on a second end, enabling pass-through power and data connectivity. The Strap incorporates a circumferential array of platinum electrodes on its inner surface, configurable in a first mode for sEMG signal acquisition and in a second mode for TENS therapeutic stimulation. A breath analysis channel is integrated into the Core module adjacent to the female USB-C receptacle, comprising a Venturi-shaped flow path, an electrochemical fuel cell for BAC measurement, and a metal oxide (MOx) gas sensor for VOC detection, all accessible from the superior surface of the Core module while the apparatus remains on the wrist.

In a first aspect, the invention provides a wristband health monitoring apparatus comprising: a Core module having a first end with a male USB-C connector and a second end with a female USB-C receptacle; a flexible wristband Strap having a first end mechanically and electrically coupled to the first end of the Core module and a second end mechanically and electrically coupled to the second end of the Core module, forming a continuous loop; and a pass-through power circuit within the Core module configured to route power from the female USB-C receptacle to both the male USB-C connector and an internal battery charger simultaneously.

In a second aspect, the invention provides a bidirectional neuromuscular interface comprising a plurality of electrodes disposed on an inner surface of the flexible wristband Strap, wherein the electrodes are switchable between a first configuration for detecting surface electromyography (sEMG) signals and a second configuration for delivering transcutaneous electrical nerve stimulation (TENS) pulses.

In a third aspect, the invention provides a breath analysis channel integrated into a wrist-worn apparatus, the channel comprising a Venturi-shaped constriction, a hydrophobic membrane, an electrochemical fuel cell, and a metal oxide gas sensor, wherein the channel is accessible from the superior surface of the apparatus while the apparatus is worn on the wrist.

---

## BRIEF DESCRIPTION OF THE DRAWINGS

The accompanying drawings, which are incorporated in and constitute a part of this specification, illustrate embodiments of the invention and together with the description serve to explain the principles of the invention.

**FIG. 1** is a system block diagram of the HEALTH-BAND Neuro apparatus, showing the Core module, the Strap, and the electrical interconnections between all subsystems.

**FIG. 2** is an exploded perspective view of the Core module, showing the Zero-Hole clasp mechanism with the male USB-C connector on the first end and the female USB-C receptacle on the second end, and the breath analysis channel integrated into the left port housing.

**FIG. 3** is a cross-sectional view of the Strap showing the six platinum electrode dots on the inner surface, the flexible printed circuit board (FPCB), and the sEMG/TENS analog front-end circuitry.

**FIG. 4** is a perspective view of the breath analysis channel, showing the Venturi-shaped flow path, the hexagonal titanium grille, the PTFE hydrophobic membrane, the electrochemical fuel cell (Dart EC4-10-100), and the MOx sensor (Sensirion SGP40).

**FIG. 5** is a schematic diagram of the pass-through power architecture, showing the power path from the female USB-C receptacle through the internal battery management IC and to the male USB-C connector.

**FIG. 6** is a perspective view of the complete assembled apparatus worn on a wrist, showing the superior surface with the breath analysis channel accessible for exhalation without removing the device.

**FIG. 7** is a circuit diagram of the bidirectional neuromuscular interface, showing the switching network that configures the platinum electrodes in either sEMG sensing mode or TENS stimulation mode.

---

## DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS

The following detailed description sets forth specific embodiments of the invention in sufficient detail to enable those skilled in the art to practice the invention. It will be apparent to those skilled in the art that other embodiments may be utilized and that logical, mechanical, electrical, and other changes may be made without departing from the scope of the present invention.

### I. Overview of the Apparatus

Referring to FIG. 1, the HEALTH-BAND Neuro apparatus 100 comprises two primary physical components: a Core module 110 and a flexible wristband Strap 120. Together, these components form a continuous loop that encircles the user's wrist. The Core module 110 is a rigid enclosure, preferably constructed from a carbon fiber composite shell with a titanium hardware insert, measuring approximately 45mm × 30mm × 12mm. The Strap 120 is a flexible silicone band with an embedded flexible printed circuit board (FPCB), measuring approximately 250mm in length and 22mm in width.

The apparatus 100 is designed around a "Zero-Hole Architecture" in which no dedicated charging port, sensor window, or data port is present on the outer surface of either the Core module 110 or the Strap 120. All power delivery, data connectivity, and sensor access is achieved through the dual-function USB-C clasp mechanism described herein.

### II. The Zero-Hole Clasp Mechanism

Referring to FIGS. 1 and 2, the Core module 110 comprises a first end 111 and a second end 112 disposed on opposing sides of the Core module 110. The first end 111 carries a male USB-C connector 130 that protrudes outward from the Core module 110 and is configured to mate with a USB-C receptacle on a host device (e.g., a smartphone, laptop, or USB-C power adapter). The second end 112 carries a female USB-C receptacle 140 that is recessed into the Core module 110 and is configured to receive a male USB-C plug from a power source (e.g., a USB-C power adapter or power bank).

The first end 111 of the Core module 110 is mechanically coupled to a first end 121 of the Strap 120 via a hinge mechanism 150 that allows the Strap 120 to rotate approximately 180 degrees relative to the Core module 110, enabling the apparatus 100 to be donned and doffed. The second end 112 of the Core module 110 is mechanically coupled to a second end 122 of the Strap 120 via a magnetic latch mechanism 160 that provides a secure, tool-free connection. When the magnetic latch 160 is engaged, the apparatus 100 forms a continuous loop, and the male USB-C connector 130 on the first end 111 of the Core module 110 is aligned with the female USB-C receptacle 140 on the second end 112, such that when the apparatus 100 is docked into a host device, the male connector 130 engages the host, and the female receptacle 140 is accessible from the superior surface for connection to a power source.

This architecture eliminates the need for any dedicated charging port on the outer surface of the apparatus 100, as the female USB-C receptacle 140 serves simultaneously as the charging input and the structural clasp mechanism.

### III. Pass-Through Power Architecture

Referring to FIG. 5, the Core module 110 contains a pass-through power circuit 170 that enables simultaneous power delivery to the host device and charging of the internal battery 180. The pass-through power circuit 170 comprises a USB Power Delivery (USB-PD) controller 171 (e.g., Texas Instruments TUSB422), a battery management IC 172 (e.g., Texas Instruments BQ25895), and a power multiplexer 173.

When a power source is connected to the female USB-C receptacle 140, the USB-PD controller 171 negotiates the maximum available power profile (up to 100W in USB-PD 3.0). The power multiplexer 173 routes a first portion of the available power to the male USB-C connector 130 for delivery to the host device, and a second portion to the battery management IC 172 for charging the internal LiPo battery 180. The allocation between host delivery and battery charging is dynamically managed by the USB-PD controller 171 based on the host device's power demand and the battery's state of charge.

When no power source is connected to the female USB-C receptacle 140, the battery management IC 172 draws power from the internal LiPo battery 180 to power the microcontroller 190 (e.g., Nordic Semiconductor nRF5340) and all onboard sensors. The internal battery 180 has a capacity of approximately 80mAh, providing approximately 8–12 hours of continuous sensor operation in wireless mode.

### IV. The Microcontroller and Communication Subsystem

The Core module 110 contains a dual-core ARM Cortex-M33 microcontroller 190 (e.g., Nordic Semiconductor nRF5340) that serves as the central processing unit for all sensor data acquisition, signal processing, and communication functions. The microcontroller 190 comprises a first core (application core) operating at up to 128 MHz for sensor fusion and AI inference, and a second core (network core) dedicated to Bluetooth Low Energy (BLE 5.3) wireless communication.

When the male USB-C connector 130 is mated with a host device, the microcontroller 190 enumerates as a composite USB device comprising: (a) a USB Mass Storage Class (MSC) interface providing the host with read/write access to a 64GB eMMC flash memory 191; and (b) a USB Human Interface Device (HID) interface streaming real-time sensor data to a companion application on the host at a rate of up to 100 Hz.

When the male USB-C connector 130 is not mated with a host device, the microcontroller 190 operates the BLE 5.3 transceiver to stream sensor data wirelessly to a paired smartphone or computer, powered by the internal battery 180.

### V. Biometric Sensor Subsystem

The Core module 110 integrates the following biometric sensors on its inner surface (the surface facing the user's wrist when worn):

**A. Photoplethysmography (PPG) and Pulse Oximetry.** A MAX30101 integrated circuit 201 is mounted on the inner surface of the Core module 110 beneath a sapphire optical window. The MAX30101 201 emits red (660nm), infrared (880nm), and green (537nm) light into the user's skin and measures the reflected light intensity to compute heart rate (HR), blood oxygen saturation (SpO2), and heart rate variability (HRV). The MAX30101 201 also serves as a multi-color status LED visible through the inner surface of the Core module 110 when the apparatus 100 is unclasped.

**B. Electrocardiography (ECG).** A high-precision operational amplifier 202 (e.g., Texas Instruments OPA391) forms the analog front-end for single-lead ECG measurement. The first ECG electrode is the metallic outer shield of the male USB-C connector 130, which contacts the user's finger when the user touches the connector tip. The second ECG electrode is a stainless steel contact pad 203 on the outer surface of the Core module 110 accessible to a second finger. The differential voltage between the two electrodes is amplified by the OPA391 202 and digitized by the microcontroller 190 at 500 Hz to produce a clinical-quality single-lead ECG waveform.

**C. Skin Temperature.** A high-accuracy digital skin temperature sensor 204 (e.g., Texas Instruments AS6221) is mounted on the inner surface of the Core module 110 in direct contact with the user's wrist skin. The AS6221 204 measures skin temperature with an accuracy of ±0.09°C and a resolution of 0.0078°C, enabling detection of fever, circadian rhythm patterns, and ovulation tracking.

**D. Inertial Measurement Unit (IMU).** A 6-axis IMU 205 (e.g., Bosch BMI270) is mounted within the Core module 110 and measures 3-axis acceleration and 3-axis angular velocity at up to 1600 Hz. The IMU 205 serves two functions: (1) motion artifact detection and cancellation during PPG and ECG measurements; and (2) step counting, sleep staging, and tremor analysis for neurological screening.

**E. UV Sensor.** A UV sensor 206 (e.g., Vishay VEML6075) is mounted on the outer surface of the Core module 110 and measures UVA (315–400nm) and UVB (280–315nm) irradiance to compute the real-time UV Index and estimate cumulative vitamin D synthesis exposure.

### VI. The Bidirectional Neuromuscular Interface

Referring to FIGS. 3 and 7, the Strap 120 incorporates a bidirectional neuromuscular interface 210 comprising six platinum electrode dots 211a–211f disposed on the inner surface of the Strap 120 in a 2×3 matrix arrangement. The platinum electrodes 211 are flush with the inner surface of the Strap 120 and are in direct contact with the user's wrist skin when the apparatus 100 is worn.

The bidirectional neuromuscular interface 210 is configurable in two modes under the control of the microcontroller 190:

**A. sEMG Sensing Mode.** In the first mode, the switching network 212 configures the platinum electrodes 211 as differential sensing electrodes for surface electromyography (sEMG) signal acquisition. The sEMG analog front-end 213 (e.g., Analog Devices AD8232 or equivalent) amplifies the differential voltage between selected electrode pairs with a gain of approximately 1000 V/V and a bandwidth of 20–500 Hz. The amplified sEMG signals are digitized by the microcontroller 190 at 1000 Hz and processed by a machine learning inference engine to recognize up to 16 distinct hand gestures (e.g., fist, open hand, pinch, point, swipe left, swipe right) with a classification latency of less than 50 milliseconds. The recognized gestures are transmitted to a paired host device via BLE HID or USB HID to control cursor movement, media playback, presentation slides, or other human-computer interaction functions.

**B. TENS Stimulation Mode.** In the second mode, the switching network 212 configures the platinum electrodes 211 as stimulation electrodes for transcutaneous electrical nerve stimulation (TENS) therapy. An integrated boost converter 214 raises the 3.7V battery voltage to a programmable stimulation voltage of 10–80V. An H-bridge driver 215 generates biphasic square wave pulses with programmable pulse width (50–500 µs), frequency (1–150 Hz), and amplitude (0.1–80 mA), delivered through selected electrode pairs. The stimulation parameters are programmed by the user via the companion application and are subject to safety limits enforced by the microcontroller 190 to prevent tissue damage. TENS therapy applications supported by the apparatus 100 include: acute and chronic pain management, tremor suppression for essential tremor or Parkinson's disease, muscle rehabilitation following injury, and autonomic nervous system modulation.

The switching network 212 ensures that the sEMG sensing circuitry 213 is electrically isolated from the TENS stimulation circuitry 214, 215 during stimulation mode to prevent damage to the sensitive analog front-end components.

### VII. The Integrated Breath Analysis Channel

Referring to FIGS. 2 and 4, the Core module 110 integrates a breath analysis channel 220 on the superior surface of the Core module 110, adjacent to the female USB-C receptacle 140 on the second end 112. The breath analysis channel 220 is accessible to the user by raising the wrist to mouth level and exhaling directly into the channel 220 without removing the apparatus 100 from the wrist.

The breath analysis channel 220 comprises the following elements in series along the flow path:

**A. Inlet Grille.** A hexagonal titanium grille 221 with 0.5mm apertures covers the inlet of the breath analysis channel 220. The hexagonal geometry provides maximum open area (approximately 80%) while maintaining structural rigidity and preventing particulate contamination.

**B. Hydrophobic Membrane.** A polytetrafluoroethylene (PTFE) hydrophobic membrane 222 with a pore size of 0.2 µm is positioned immediately downstream of the inlet grille 221. The PTFE membrane 222 prevents liquid water from entering the breath analysis channel 220 while allowing water vapor and gas molecules to pass freely, protecting the electrochemical fuel cell 223 and MOx sensor 224 from liquid damage.

**C. Venturi Constriction.** A Venturi-shaped constriction 225 is formed in the walls of the breath analysis channel 220 downstream of the PTFE membrane 222. The Venturi constriction 225 accelerates the exhaled breath flow and produces a region of reduced pressure at the throat, creating laminar flow conditions across both the electrochemical fuel cell 223 and the MOx sensor 224. This laminar flow condition improves measurement accuracy by ensuring uniform gas distribution across the active sensing surfaces.

**D. Electrochemical Fuel Cell.** An electrochemical fuel cell 223 (e.g., Dart Sensors EC4-10-100) is positioned at the throat of the Venturi constriction 225. The fuel cell 223 is a three-electrode amperometric sensor that generates a current proportional to the ethanol concentration in the exhaled breath. The current output of the fuel cell 223 is measured by a precision transimpedance amplifier 226 and digitized by the microcontroller 190 to compute the blood alcohol content (BAC) of the user. The fuel cell 223 has a measurement range of 0–0.4% BAC with an accuracy of ±0.002% BAC and a response time of less than 10 seconds.

**E. Metal Oxide Gas Sensor.** A metal oxide (MOx) gas sensor 224 (e.g., Sensirion SGP40) is positioned downstream of the electrochemical fuel cell 223 within the Venturi constriction 225. The MOx sensor 224 measures the concentration of volatile organic compounds (VOCs) in the exhaled breath, including acetone (a biomarker for ketosis and diabetes), hydrogen sulfide (a biomarker for halitosis and gastrointestinal disorders), and ammonia (a biomarker for kidney function). The MOx sensor 224 operates at a heater temperature of approximately 350°C and provides a VOC Index output that is processed by the microcontroller 190 using a proprietary algorithm to identify and quantify individual VOC biomarkers.

**F. Exhaust Port.** An exhaust port 227 on the inferior surface of the Core module 110 allows the exhaled breath to exit the breath analysis channel 220 after passing over both sensors 223, 224, preventing pressure buildup and ensuring complete gas exchange during each measurement.

### VIII. The Companion Application

The apparatus 100 is designed to operate in conjunction with a companion application (the "EoS Health App") running on a paired smartphone, tablet, or computer. The companion application communicates with the apparatus 100 via BLE 5.3 (wireless) or USB HID (wired) and provides the following functions: real-time display of all sensor data; historical trend analysis and data visualization; gesture control configuration and training; TENS therapy programming and session management; BAC and VOC measurement logging and alerting; and cloud synchronization for longitudinal health tracking.

### IX. Alternative Embodiments

In an alternative embodiment, the Core module 110 may incorporate a micro-LED display array positioned behind a holographic diffuser film embedded flush in the outer surface of the Core module 110, wherein the diffuser film produces an iridescent floating-text visual effect for displaying health metrics and device status without a conventional flat-panel display substrate. This embodiment is the subject of a Continuation-In-Part (CIP) application to be filed before May 23, 2027.

In another alternative embodiment, the Strap 120 may incorporate additional sensors including a galvanic skin response (GSR) sensor for stress monitoring, a continuous glucose monitoring (CGM) interface for interstitial glucose measurement, or a near-infrared spectroscopy (NIRS) array for non-invasive hemoglobin measurement.

---

## CLAIMS

### Independent Claims

**Claim 1.** A wristband health monitoring apparatus comprising:
- a Core module comprising a rigid enclosure having a first end and a second end, wherein the first end carries a male Universal Serial Bus Type-C (USB-C) connector configured to mate with a USB-C receptacle of a host device, and the second end carries a female USB-C receptacle configured to receive a male USB-C plug of a power source;
- a flexible wristband Strap having a first end mechanically coupled to the first end of the Core module and a second end mechanically coupled to the second end of the Core module, forming a continuous loop configured to encircle a user's wrist;
- a pass-through power circuit within the Core module configured to route electrical power received at the female USB-C receptacle simultaneously to the male USB-C connector for delivery to the host device and to an internal battery charger for charging an internal battery; and
- a microcontroller within the Core module operatively coupled to the male USB-C connector, the female USB-C receptacle, and the internal battery.

**Claim 2.** A wristband health monitoring apparatus comprising:
- a flexible wristband Strap configured to encircle a user's wrist;
- a plurality of electrodes disposed on an inner surface of the flexible wristband Strap and configured to contact the user's skin when the apparatus is worn;
- a switching network electrically coupled to the plurality of electrodes and configurable in a first mode and a second mode; and
- a microcontroller operatively coupled to the switching network, wherein in the first mode the switching network configures the plurality of electrodes as differential sensing electrodes for detecting surface electromyography (sEMG) signals from the user's wrist musculature, and in the second mode the switching network configures the plurality of electrodes as stimulation electrodes for delivering transcutaneous electrical nerve stimulation (TENS) pulses to the user's wrist.

**Claim 3.** A wrist-worn health monitoring apparatus comprising:
- a housing configured to be worn on a user's wrist;
- a breath analysis channel integrated into the housing and accessible from a superior surface of the housing while the apparatus is worn on the wrist, the breath analysis channel comprising:
  - a hydrophobic membrane positioned at an inlet of the breath analysis channel;
  - a Venturi-shaped constriction downstream of the hydrophobic membrane;
  - an electrochemical fuel cell positioned within the Venturi-shaped constriction and configured to measure ethanol concentration in exhaled breath; and
  - a metal oxide gas sensor positioned within the Venturi-shaped constriction downstream of the electrochemical fuel cell and configured to measure volatile organic compound (VOC) concentration in exhaled breath;
- wherein the breath analysis channel is configured to receive exhaled breath from the user without the user removing the apparatus from the wrist.

---

### Dependent Claims

**Claim 4.** The apparatus of claim 1, wherein the pass-through power circuit further comprises a USB Power Delivery (USB-PD) controller configured to negotiate a power delivery contract with the power source connected to the female USB-C receptacle, and wherein the USB-PD controller dynamically allocates power between the host device and the internal battery charger based on the host device's power demand and the internal battery's state of charge.

**Claim 5.** The apparatus of claim 1, wherein the microcontroller is configured to, when the male USB-C connector is mated with the host device, enumerate the apparatus as a composite USB device comprising a Mass Storage Class (MSC) interface and a Human Interface Device (HID) interface, wherein the MSC interface provides the host device with access to a non-volatile flash memory within the Core module, and the HID interface streams real-time health sensor data to the host device.

**Claim 6.** The apparatus of claim 1, wherein the microcontroller is further configured to, when the male USB-C connector is not mated with the host device, operate a Bluetooth Low Energy (BLE) transceiver to wirelessly stream health sensor data to a paired device, powered by the internal battery.

**Claim 7.** The apparatus of claim 1, further comprising a photoplethysmography (PPG) sensor disposed on an inner surface of the Core module and configured to measure at least one of heart rate, blood oxygen saturation (SpO2), and heart rate variability (HRV).

**Claim 8.** The apparatus of claim 1, further comprising an electrocardiography (ECG) analog front-end circuit within the Core module, wherein a first ECG electrode is a metallic outer shield of the male USB-C connector and a second ECG electrode is a conductive contact pad on an outer surface of the Core module, and wherein the ECG analog front-end circuit measures a differential voltage between the first and second ECG electrodes to produce an ECG waveform.

**Claim 9.** The apparatus of claim 1, further comprising a skin temperature sensor disposed on an inner surface of the Core module and configured to measure the user's skin temperature with an accuracy of better than ±0.1°C.

**Claim 10.** The apparatus of claim 1, further comprising an inertial measurement unit (IMU) within the Core module configured to measure three-axis acceleration and three-axis angular velocity, wherein the microcontroller uses IMU data for at least one of: motion artifact cancellation in photoplethysmography measurements, step counting, sleep staging, and tremor analysis.

**Claim 11.** The apparatus of claim 1, further comprising an ultraviolet (UV) sensor disposed on an outer surface of the Core module and configured to measure UVA and UVB irradiance to compute a UV Index.

**Claim 12.** The apparatus of claim 2, wherein the plurality of electrodes comprises six platinum electrodes arranged in a 2×3 matrix on the inner surface of the flexible wristband Strap.

**Claim 13.** The apparatus of claim 2, wherein in the first mode the microcontroller processes the detected sEMG signals using a machine learning classifier to recognize a plurality of distinct hand gestures and transmits the recognized gestures to a host device as human-computer interface commands.

**Claim 14.** The apparatus of claim 2, wherein in the second mode the microcontroller controls a boost converter and an H-bridge driver to generate biphasic square wave TENS pulses with programmable pulse width in the range of 50–500 microseconds, programmable frequency in the range of 1–150 Hz, and programmable amplitude in the range of 0.1–80 milliamperes.

**Claim 15.** The apparatus of claim 2, wherein the switching network electrically isolates the sEMG sensing circuitry from the TENS stimulation circuitry during the second mode to prevent damage to the sEMG analog front-end.

**Claim 16.** The apparatus of claim 3, wherein the hydrophobic membrane comprises a polytetrafluoroethylene (PTFE) membrane with a pore size of 0.2 micrometers or less.

**Claim 17.** The apparatus of claim 3, wherein the inlet of the breath analysis channel is covered by a hexagonal titanium grille.

**Claim 18.** The apparatus of claim 3, wherein the electrochemical fuel cell is a three-electrode amperometric sensor configured to measure blood alcohol content (BAC) in the range of 0–0.4% with an accuracy of ±0.002% BAC.

**Claim 19.** The apparatus of claim 3, wherein the metal oxide gas sensor is configured to detect at least one of acetone, hydrogen sulfide, and ammonia in exhaled breath as biomarkers for ketosis, gastrointestinal disorders, and kidney function, respectively.

**Claim 20.** The apparatus of claim 3, wherein the breath analysis channel further comprises an exhaust port on an inferior surface of the housing configured to allow exhaled breath to exit the channel after passing over the electrochemical fuel cell and the metal oxide gas sensor.

**Claim 21.** A wristband health monitoring apparatus comprising the features of claims 1, 2, and 3, wherein the Core module and the flexible wristband Strap together form a continuous enclosure having no dedicated charging port, sensor window, or data port on any outer surface other than the male USB-C connector on the first end and the female USB-C receptacle on the second end of the Core module.

**Claim 22.** The apparatus of claim 21, wherein the second end of the Core module is mechanically coupled to the second end of the flexible wristband Strap via a magnetic latch mechanism, and wherein the female USB-C receptacle is accessible when the magnetic latch mechanism is in an engaged position.

**Claim 23.** The apparatus of claim 21, wherein the first end of the Core module is mechanically coupled to the first end of the flexible wristband Strap via a hinge mechanism configured to allow the Strap to rotate approximately 180 degrees relative to the Core module to enable donning and doffing of the apparatus.

**Claim 24.** The apparatus of claim 1, further comprising a micro-LED display array positioned behind a holographic diffuser film embedded flush in an outer surface of the Core module, wherein the holographic diffuser film produces an iridescent floating-text visual effect for displaying health metrics without a conventional flat-panel display substrate.

---

## ABSTRACT

A modular wristband health monitoring apparatus employs a Zero-Hole Architecture in which a rigid Core module and a flexible wristband Strap form a continuous wrist-worn enclosure with no dedicated charging ports or sensor windows. The Core module carries a male USB-C connector on a first end and a female USB-C receptacle on a second end, enabling pass-through power delivery to a host device while simultaneously charging an internal battery. The Strap incorporates six platinum electrodes on its inner surface, switchable between a surface electromyography (sEMG) sensing mode for gesture recognition and a transcutaneous electrical nerve stimulation (TENS) therapy mode for pain management and neuromodulation. A breath analysis channel integrated into the superior surface of the Core module allows the user to exhale directly into the device while wearing it, enabling blood alcohol content (BAC) measurement via an electrochemical fuel cell and volatile organic compound (VOC) detection via a metal oxide gas sensor, both positioned within a Venturi-shaped flow path behind a PTFE hydrophobic membrane. Additional sensors include PPG for heart rate and SpO2, ECG using the USB-C connector shield as an electrode, skin temperature, IMU, and UV index. The apparatus communicates with a companion application via USB HID or Bluetooth Low Energy.

---

## SEQUENCE LISTING

Not applicable.

---

## DRAWINGS DESCRIPTION REFERENCE TABLE

| Figure | Description | Key Reference Numerals |
|--------|-------------|------------------------|
| FIG. 1 | System block diagram | 100 (apparatus), 110 (Core), 120 (Strap), 130 (male USB-C), 140 (female USB-C), 190 (MCU) |
| FIG. 2 | Exploded Core module view | 111 (first end), 112 (second end), 150 (hinge), 160 (magnetic latch), 220 (breath channel) |
| FIG. 3 | Strap cross-section | 211a–f (platinum electrodes), 212 (switching network), 213 (sEMG AFE) |
| FIG. 4 | Breath analysis channel | 221 (Ti grille), 222 (PTFE membrane), 223 (fuel cell), 224 (MOx sensor), 225 (Venturi), 227 (exhaust) |
| FIG. 5 | Pass-through power schematic | 170 (power circuit), 171 (USB-PD IC), 172 (battery mgmt IC), 173 (power mux), 180 (battery) |
| FIG. 6 | Assembled wrist-worn view | 100 (apparatus), 220 (breath channel accessible) |
| FIG. 7 | Neuromuscular interface circuit | 212 (switching network), 214 (boost converter), 215 (H-bridge), 213 (sEMG AFE) |

---

*End of Patent Application*

**Prepared by:** Embedded Operating Systems Research Foundation (EoS)  
**Inventor:** Srikanth Patchava  
**Date Prepared:** May 27, 2026  
**Status:** Ready for attorney review and formal USPTO filing  
**Priority Deadline:** May 23, 2027 (12 months from provisional filing date)
