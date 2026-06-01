# HEALTH-BAND Neuro Firmware Architecture

This directory contains the firmware architecture and module documentation for the HEALTH-BAND Neuro, built around the Nordic Semiconductor nRF52840 MCU.

## 1. System Overview

The firmware is designed for low-power, continuous operation. It utilizes a Real-Time Operating System (RTOS) to manage concurrent tasks, including sensor data acquisition, display rendering, BLE communication, and USB Mass Storage Class (MSC) handling.

## 2. Core Modules

### 2.1 Sensor Acquisition Layer
This module handles the initialization and continuous polling/interrupt handling for the sensor suite.

*   **I2C/SPI Bus Manager:** Coordinates communication with the BMI270 (IMU), SSD1306 (OLED), and W25N512GV (NAND Flash).
*   **I2C Bus Manager:** Coordinates communication with the MAX30101, AS6221, SGP40, and VEML6075.
*   **ADC Manager:** Samples the analog outputs from the OPA391 (ECG) and the Dart EC4-10-100 (BAC).

### 2.2 sEMG and TENS Controller
This specialized module manages the bidirectional neuromuscular interface.

*   **sEMG Processing:** Implements digital filtering (bandpass, notch) and feature extraction on the raw ADC data from the platinum electrodes to classify hand gestures.
*   **TENS Generation:** Controls the PWM signals to the boost converter and H-bridge to generate specific electrical stimulation waveforms (frequency, pulse width, amplitude) based on therapeutic protocols.

### 2.3 Display Driver
Manages the output to the 0.49-inch Micro OLED display.

*   **Frame Buffer:** Maintains a local 128x64 pixel buffer.
*   **UI Engine:** Renders text, icons, and basic graphs (e.g., HR sparklines). It is optimized to only update regions of the screen that have changed to minimize SPI traffic and power consumption.

### 2.4 USB and Storage Manager
Handles the dual-role nature of the device's storage.

*   **FatFS Implementation:** Manages the file system on the 64GB NAND flash for logging encrypted health data.
*   **USB MSC Device Class:** When the USB-C male plug is connected to a host PC, this module enumerates the device as a mass storage drive, allowing the host OS to access the FatFS partition.

### 2.5 BLE Stack
Utilizes the Nordic SoftDevice for Bluetooth Low Energy 5.3 communication.

*   **GATT Server:** Exposes custom services for real-time data streaming (when connected to a mobile app) and device configuration.
*   **Bonding/Security:** Implements LE Secure Connections to ensure health data privacy during wireless transmission.

## 3. Power States

The firmware implements aggressive power management:

*   **Active:** Display on, high-rate sensor sampling (e.g., during a gesture or ECG reading).
*   **Idle:** Display off, low-rate sensor sampling (e.g., background HR monitoring).
*   **Deep Sleep:** All sensors off except IMU wake-on-motion, waiting for user interaction or USB connection.
*   **Pass-Through Mode:** Detected via the BQ25185 PMIC; the system enters a specific state to monitor charging current and thermal limits while acting as an inline cable.
