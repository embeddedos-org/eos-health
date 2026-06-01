# HEALTH-KEY ULTRA — Firmware

This directory contains the embedded firmware for the HEALTH-KEY ULTRA, running on the Nordic nRF52840 SoC.

## Architecture Overview

The firmware implements a **dual-mode autonomous switching architecture**. When a USB host is detected on the USB-C Male plug, the device enumerates as a USB Composite Device (CDC-ACM + HID + MSC). When no USB host is detected, the device automatically transitions to BLE 5.3 GATT Server mode, advertising health data to the companion app.

## Directory Structure

| Directory | Contents |
| :--- | :--- |
| `nrf52840/` | Main application firmware (Nordic nRF5 SDK or Zephyr RTOS) |
| `usb-hid/` | USB HID descriptor and report handler for health data over USB |
| `ble-gatt/` | BLE GATT service definitions for all 9 sensor characteristics |

## Key Firmware Modules

| Module | File | Description |
| :--- | :--- | :--- |
| Sensor Manager | `sensor_manager.c` | Schedules and reads all 9 sensors via I²C/SPI |
| BAC Engine | `bac_engine.c` | Dart fuel cell ADC sampling, temperature compensation |
| ECG Processor | `ecg_processor.c` | OPA391 AFE data acquisition, Pan-Tompkins QRS detection |
| PPG Driver | `ppg_driver.c` | MAX30101 Green/Red/IR LED control, SpO2 algorithm |
| Dual-Mode Manager | `dual_mode_manager.c` | USB VBUS detection, automatic USB↔BLE switching |
| LED Controller | `led_controller.c` | MAX30101 Green/Red channels repurposed for status indication |
| Flash Manager | `flash_manager.c` | W25N512GV NAND driver, FAT32 filesystem for USB MSC |

## Build Requirements

The firmware is built using the **Nordic nRF5 SDK v17.1.0** or **Zephyr RTOS v3.x**. A J-Link or nRF9160-DK is required for flashing. The build system uses CMake.

```bash
# Clone the nRF5 SDK
west init -m https://github.com/nrfconnect/sdk-nrf
west update

# Build for HEALTH-KEY ULTRA target
west build -b healthkey_ultra -- -DCONFIG_HEALTHKEY_ULTRA=y

# Flash
west flash
```
