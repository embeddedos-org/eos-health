# HEALTH-BAND Neuro: Electrical Engineering (EE) Documentation

This directory contains the electrical schematics, PCB layout files, and Bill of Materials (BOM) for the HEALTH-BAND Neuro V1 hardware.

## 1. PCB Architecture

Due to the flexible nature of the wristband, the electronics are distributed across a rigid-flex PCB assembly.

*   **Main Rigid Board:** Located centrally, housing the nRF52840 MCU, BQ25185 PMIC, BMI270 IMU, and the W25N512GV 64GB NAND Flash.
*   **Flexible Substrate:** Routes power and data to the peripheral components located at the ends and surfaces of the band.
*   **Left Rigid Board:** Houses the USB-C female receptacle, Dart EC4-10-100 fuel cell, and Sensirion SGP40.
*   **Right Rigid Board:** Houses the USB-C male plug.
*   **Display FPC:** Connects the 0.49-inch Micro OLED panel to the main board.
*   **Electrode FPC:** Routes the analog signals from the six platinum electrodes to the sEMG/TENS circuitry on the main board.

## 2. Key Component Bill of Materials (BOM)

| Reference | Component | Description | Manufacturer |
| :--- | :--- | :--- | :--- |
| **U1** | nRF52840 | MCU (ARM Cortex-M4, BLE 5.3, USB 2.0 FS) | Nordic Semiconductor |
| **U2** | BQ25185 | Wearable PMIC (Power Management, Pass-Through) | Texas Instruments |
| **U3** | W25N512GV | 64GB NAND Flash Memory (SPI/QSPI) | Winbond |
| **U4** | MAX30101 | Pulse Oximeter and Heart-Rate Sensor | Analog Devices |
| **U5** | OPA391 | High-Precision ECG Amplifier | Texas Instruments |
| **U6** | BMI270 | 6-Axis IMU | Bosch Sensortec |
| **U7** | SGP40 | Indoor Air Quality (VOC) Sensor | Sensirion |
| **U8** | AS6221 | High-Accuracy Digital Temperature Sensor | Texas Instruments |
| **U9** | VEML6075 | UVA and UVB Light Sensor | Vishay |
| **MOD1** | EC4-10-100 | BAC Fuel Cell | Dart Sensors |
| **DISP1** | SSD1306 (Module) | 0.49-inch Micro OLED Display (128x64) | Various (e.g., Sony) |
| **BAT1** | Custom Li-Po | 200mAh Flexible Lithium-Polymer Cell | Various |

## 3. Power Routing and Pass-Through

The BQ25185 PMIC is central to the Zero-Hole Architecture's pass-through charging capability. When a power source is connected to the USB-C female port and a device is connected to the USB-C male plug, the PMIC must dynamically manage the current limit to ensure the internal 200mAh battery charges safely while providing the maximum available current to the downstream device.

## 4. Neuromodulation Circuitry

The sEMG/TENS subsystem requires careful isolation and power design.

*   **Input (sEMG):** High-impedance instrumentation amplifiers capture the microvolt-level sEMG signals.
*   **Output (TENS):** A dedicated boost converter steps up the battery voltage to generate the necessary stimulation pulses (up to ~50V depending on the protocol), driven through an H-bridge to the platinum electrodes. Hardware interlocks prevent simultaneous activation of the input and output stages.
