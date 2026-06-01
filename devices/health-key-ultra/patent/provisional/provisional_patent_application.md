# PROVISIONAL PATENT APPLICATION

**Title of Invention:** Dual-Mode Multi-Sensor Health Monitoring Apparatus with Integrated Biopotential Electrodes and Mass Storage

**Inventor:** Srikanth Patchava
**Address:** 2601 Cortez Dr Unit 1104, Santa Clara, CA 95051-0968
**Country:** United States

**Date:** May 2026

---

## CROSS-REFERENCE TO RELATED APPLICATIONS
Not Applicable.

## STATEMENT REGARDING FEDERALLY SPONSORED RESEARCH OR DEVELOPMENT
Not Applicable.

## BACKGROUND OF THE INVENTION

### 1. Field of the Invention
The present invention relates generally to portable health monitoring devices, and more specifically to an ultra-compact, multi-sensor dongle capable of dual-mode (wired and wireless) operation, breath analysis, biopotential measurement, and mass data storage, housed within a form factor compatible with a standard USB-C keychain dongle.

### 2. Description of Prior Art
Existing portable health monitors generally fall into three categories: (1) wireless breathalyzers (e.g., US9020773B2 — BACtrack) that pair with smartphones via Bluetooth but lack secondary health sensors and cannot function as a USB storage device; (2) dedicated electrocardiogram (ECG) devices (e.g., US8509882B2 — AliveCor) that require separate electrode pads or credit-card-sized form factors and cannot perform breath analysis; and (3) continuous wrist-worn wearables (e.g., Whoop, Oura, Apple Watch) that cannot perform breath analysis, do not function as USB storage, and require separate charging infrastructure.

There remains an unmet need for a single, pocketable device — specifically in a keychain USB-C dongle form factor — that simultaneously performs: (a) clinical-grade electrochemical breath alcohol analysis; (b) volatile organic compound (VOC) breath analysis for metabolic markers; (c) biopotential measurements including ECG and bioimpedance; (d) photoplethysmography (PPG) for heart rate and blood oxygen saturation; and (e) functions as a standard USB mass storage device, all without requiring a separate charging cable, external electrodes, or additional accessories.

## SUMMARY OF THE INVENTION
The present invention solves the aforementioned problems by providing a highly integrated health monitoring apparatus contained within an ultra-compact housing measuring approximately 48 × 18 × 9.5 mm. The apparatus comprises a male USB-C connector, a microcontroller unit (MCU) with an integrated Bluetooth Low Energy (BLE) wireless transceiver, an internal rechargeable battery, a non-volatile mass storage memory, and a plurality of health sensors.

**First novel aspect:** The metallic outer ground shield of the male USB-C connector serves as a first active biopotential electrode for ECG and bioimpedance measurements, working in conjunction with a second metallic region on the apparatus housing (the "bezel electrode"), enabling single-lead ECG acquisition and skin hydration measurement when the user contacts both surfaces simultaneously — with no external electrode accessories required.

**Second novel aspect:** An electrochemical fuel cell and a MEMS environmental gas sensor are co-located within a single Venturi-shaped breath channel, enabling simultaneous detection of blood alcohol content (BAC) from the fuel cell and volatile organic compounds (VOCs) — including acetone as a ketosis marker and volatile sulfur compounds as a halitosis indicator — from the gas sensor, all from a single exhalation event.

**Third novel aspect:** A dual-mode operational architecture wherein the apparatus automatically enumerates as a composite USB device (Mass Storage Class + Human Interface Device) when physically connected to a host, simultaneously charging its internal battery from the host's VBUS power; and automatically transitions to a Bluetooth Low Energy GATT server mode when disconnected from the host, streaming the same health data pipeline wirelessly.

## BRIEF DESCRIPTION OF THE DRAWINGS
The accompanying drawings form part of this specification:

**FIG. 1** is a schematic block diagram of the full system architecture, showing all sensor subsystems, the MCU, battery management, USB-C connector, and dual-mode operation logic.

**FIG. 2** is a top plan view of the printed circuit board (PCB) layout illustrating the placement of all components on the 48 × 18 mm, 6-layer HDI board.

**FIG. 3(a)** is a perspective view of the apparatus enclosure showing the Venturi breath bore, optical window, biopotential bezel electrode, USB-C tongue, and keyring aperture. **FIG. 3(b)** is a cross-sectional view showing the 6-layer PCB stackup.

## DETAILED DESCRIPTION OF THE INVENTION

### A. Physical Construction
The apparatus comprises a 6-layer High-Density Interconnect (HDI) printed circuit board (PCB) measuring 48 × 18 mm with a total thickness of approximately 1.0 mm, housed within a polymeric enclosure measuring approximately 48 × 18 × 9.5 mm. A keyring aperture of approximately 4 mm diameter is provided at one end of the enclosure. A male USB-C connector extends from the opposite end of the enclosure.

### B. Microcontroller and Wireless Subsystem
The MCU (e.g., Nordic Semiconductor nRF52840 or equivalent) integrates a 32-bit ARM Cortex-M4 processor, a Bluetooth 5.3 Low Energy radio, and a full-speed/high-speed USB 2.0 physical layer (PHY) within a single chip package. The MCU monitors the VBUS pin of the USB-C connector to detect host connection and manages the transition between wired and wireless operating modes without user intervention.

### C. Dual-Function USB-C Electrode System
The male USB-C connector's metallic outer shield (ground shell) is electrically isolated from the digital ground plane via a high-impedance path and is routed to the input of a biopotential analog front-end (AFE) chip (e.g., Analog Devices AD5940). A stainless steel strip embedded in the top surface of the enclosure serves as the second biopotential electrode. When the user holds the apparatus between two fingers — one finger contacting the USB-C metal shell and the other contacting the top bezel — the AFE captures a single-lead ECG waveform and measures skin bioimpedance for hydration estimation. This configuration requires no external leads, patches, or accessories.

### D. Co-Axial Breath Analysis Channel
A cylindrical Venturi-shaped bore traverses the enclosure along its longitudinal axis. The bore narrows at a central constriction point to accelerate breath flow and create a stable laminar flow region. Positioned within this bore are two distinct sensors:

1. An 11mm diameter electrochemical fuel cell (e.g., Dart Sensors Premium Series) optimized for ethanol detection, providing a current output proportional to blood alcohol content (BAC) in the range of 0.00–0.40% BAC with a resolution of 0.001% BAC.

2. A MEMS multi-parameter environmental sensor (e.g., Bosch BME688) optimized for VOC and volatile sulfur compound (VSC) detection. This sensor simultaneously measures: (a) VOC concentration for acetone-based ketosis detection; (b) VSC concentration for halitosis assessment; (c) barometric pressure variation during exhalation for forced expiratory volume (FEV1) estimation; and (d) temperature and relative humidity for fuel cell baseline compensation.

### E. Photoplethysmography (PPG) Subsystem
An optical PPG sensor (e.g., Maxim Integrated MAX30102) comprising red (660nm), infrared (880nm), and green (530nm) LEDs and a photodetector is positioned beneath a transparent optical window on the top surface of the enclosure. The user places a fingertip over this window to measure heart rate (HR), blood oxygen saturation (SpO2), and heart rate variability (HRV) via the reflected light signal.

### F. Inertial Measurement Unit (IMU)
A 6-axis IMU (e.g., Bosch BMI270) comprising a 3-axis accelerometer and 3-axis gyroscope is mounted on the PCB. The IMU serves two functions: (1) motion artifact detection and cancellation during PPG and ECG measurements; and (2) tremor analysis for neurological screening.

### G. UV Sensor
An ultraviolet (UV) sensor (e.g., Vishay VEML6075) measures UVA and UVB irradiance to compute the UV Index and estimate vitamin D synthesis exposure.

### H. Mass Storage Subsystem
A NAND flash memory chip (e.g., 64GB eMMC) is connected to the MCU via a high-speed interface. When the apparatus is connected to a host via USB-C, the MCU enumerates the flash memory as a standard USB Mass Storage Class (MSC) device, allowing the host operating system to read and write files to the storage without any driver installation. Simultaneously, the MCU enumerates a second USB interface as a Human Interface Device (HID) to stream real-time health sensor data to a companion application on the host.

### I. Battery Management
An 80mAh lithium polymer (LiPo) battery and a charger IC (e.g., Texas Instruments BQ25100) are integrated within the enclosure. When the apparatus is connected to a host via USB-C, the charger IC draws current from VBUS to charge the battery. When disconnected, the battery powers the MCU and all sensors in wireless mode for approximately 8–12 hours of intermittent use.

## CLAIMS
*(Formal claims are not required for a Provisional Application but are included here to establish the scope of the invention.)*

**Claim 1.** A health monitoring apparatus comprising: a housing; a male Universal Serial Bus Type-C (USB-C) connector extending from the housing; a microcontroller; and a biopotential analog front-end circuit; wherein the metallic outer shield of the male USB-C connector is electrically coupled to the biopotential analog front-end circuit to serve as a first active biopotential electrode for measuring physiological electrical signals from a user.

**Claim 2.** The apparatus of claim 1, further comprising a second metallic region on an exterior surface of the housing serving as a second active biopotential electrode for the biopotential analog front-end circuit, wherein the first and second electrodes form a single-lead electrocardiogram (ECG) measurement system.

**Claim 3.** The apparatus of claim 1, further comprising: a breath channel extending into the housing; an electrochemical fuel cell positioned within the breath channel configured to detect ethanol concentration in exhaled breath; and a micro-electromechanical systems (MEMS) gas sensor positioned within the same breath channel configured to detect volatile organic compounds (VOCs) in exhaled breath; wherein both the fuel cell and the MEMS gas sensor receive exhaled breath from a single exhalation event through the breath channel.

**Claim 4.** The apparatus of claim 3, wherein the breath channel comprises a Venturi-shaped constriction configured to produce laminar flow across both the fuel cell and the MEMS gas sensor.

**Claim 5.** The apparatus of claim 1, further comprising: a non-volatile mass storage memory; an internal rechargeable battery; a wireless transceiver; wherein the microcontroller is configured to: (a) when the male USB-C connector is coupled to a host device, enumerate the apparatus as a composite USB device comprising a Mass Storage Class interface providing access to the non-volatile mass storage memory and a Human Interface Device interface streaming health sensor data, while simultaneously charging the internal battery from the host's power supply; and (b) when the male USB-C connector is not coupled to a host device, operate the wireless transceiver to stream health sensor data wirelessly, powered by the internal battery.

**Claim 6.** The apparatus of claim 1, further comprising a photoplethysmography (PPG) sensor positioned beneath a transparent optical window on an exterior surface of the housing, configured to measure at least one of heart rate, blood oxygen saturation (SpO2), and heart rate variability (HRV).

**Claim 7.** The apparatus of claim 1, further comprising a keyring aperture in the housing configured to receive a keyring or lanyard attachment.

## ABSTRACT
A dual-mode, multi-sensor health monitoring apparatus in a keychain USB-C dongle form factor. The apparatus uses the metallic shield of its USB-C connector as a first biopotential electrode for ECG and bioimpedance measurement, eliminating the need for external electrodes. An integrated Venturi breath channel houses both an electrochemical fuel cell for blood alcohol content (BAC) measurement and a MEMS gas sensor for simultaneous volatile organic compound (VOC) analysis — including ketosis and halitosis markers — from a single breath. A PPG sensor measures heart rate and SpO2. The apparatus automatically operates as a USB mass storage device and health data HID when wired to a host, and switches to Bluetooth Low Energy wireless streaming when unplugged, powered by an internal rechargeable battery that charges from the host when connected.

---

*This document constitutes a Provisional Patent Application under 35 U.S.C. § 111(b).*
*Inventor: Srikanth Patchava — 2601 Cortez Dr Unit 1104, Santa Clara, CA 95051-0968*
