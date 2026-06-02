# HEALTH-KEY ULTRA — Production Datasheet
## EoS Health · Model EOS-HKU-001 · Revision 1.0

**Document:** EOS-DS-001-HKU · **Date:** June 1, 2026 · **Status:** Production Release

---

## 1. Product Overview

HEALTH-KEY ULTRA is a USB-C pendant health monitor that delivers clinical-grade ECG, SpO₂, blood alcohol estimation, UV index sensing, and real-time biometric analysis in a form factor worn around the neck or clipped to clothing. It connects simultaneously via USB-C (wired) and BLE 5.2 (wireless) to the EoS Health Hub mobile application.

---

## 2. Electrical Specifications

| Parameter | Min | Typ | Max | Unit |
|---|---|---|---|---|
| Supply voltage (USB-C VBUS) | 4.75 | 5.0 | 5.25 | V |
| Battery voltage (Li-Po) | 3.0 | 3.7 | 4.2 | V |
| Battery capacity | — | 210 | — | mAh |
| Active current (all sensors on) | — | 28.5 | 35 | mA |
| BLE advertising current | — | 4.2 | — | mA |
| Deep sleep current | — | 6.2 | 8 | µA |
| USB-C charging current | — | 500 | 1000 | mA |
| Charging time (0→100%) | — | 25 | 35 | min |

---

## 3. Sensor Suite

| Sensor | IC | Measurement | Accuracy | Sampling Rate |
|---|---|---|---|---|
| ECG (2-lead) | ADS1292R | Lead I, Lead II, derived Lead III | SNR ≥63 dB, CMRR ≥100 dB | 500 Hz |
| Pulse Oximetry | MAX30102 | SpO₂, Heart Rate | ARMS ≤0.44% (ISO 80601-2-61) | 100 Hz |
| Blood Alcohol | MQ-3B | BAC estimation (breath) | ±0.01% BAC | 1 Hz |
| UV Index | VEML6075 | UVA, UVB, UV Index | ±1 UV Index unit | 1 Hz |
| Accelerometer | LSM6DSO | 3-axis motion, step count | ±0.1 g | 104 Hz |
| Temperature | MCP9808 | Skin surface temperature | ±0.25°C | 1 Hz |

---

## 4. Wireless Specifications

| Parameter | Value |
|---|---|
| BLE version | 5.2 |
| PHY | 1M / 2M (auto-negotiated) |
| Frequency band | 2.402–2.480 GHz |
| TX power | −20 to +8 dBm (configurable) |
| Typical range (open air) | 100 m |
| Antenna | Molex 2137600100 chip antenna |
| Security | LE Secure Connections (LESC), AES-128-CCM |
| BLE services | EoS Health GATT (UUID: EOS1), Battery (0x180F), Device Info (0x180A) |

---

## 5. Mechanical Specifications

| Parameter | Value |
|---|---|
| Dimensions | 62 × 22 × 9 mm |
| Weight | 18 g (without lanyard) |
| Housing material | Anodized aluminum 6061-T6 |
| Connector | USB-C 2.0 (data + charging) |
| IP rating | IP68 (1 m, 30 min) |
| Operating temperature | −10°C to +50°C |
| Storage temperature | −20°C to +60°C |
| Drop resistance | 1.5 m onto concrete (MIL-STD-810H Method 516.8) |
| Lanyard attachment | Stainless steel swivel clip |

---

## 6. Processor and Memory

| Component | Part | Specification |
|---|---|---|
| MCU | Nordic nRF52840 | Cortex-M4F, 64 MHz, 1 MB Flash, 256 KB RAM |
| NVM | W25Q32JV | 4 MB SPI Flash (firmware + data buffer) |
| Secure element | ATECC608B | Ed25519 key storage, OTA verification |
| USB bridge | CP2102N | USB-C to UART, CDC ACM |

---

## 7. Power Budget

| Mode | Current | Duration | Energy |
|---|---|---|---|
| Active (all sensors, BLE connected) | 28.5 mA | 5 min/hr | 2.375 mAh/hr |
| Idle (BLE advertising, IMU only) | 4.2 mA | 50 min/hr | 3.500 mAh/hr |
| Deep sleep | 6.2 µA | 5 min/hr | 0.001 mAh/hr |
| **Weighted average** | **~28.8 mA** | — | — |
| **Battery life** | — | **~7.3 days** | — |

---

## 8. Firmware

| Component | Version | Description |
|---|---|---|
| EoS Firmware | 1.0.0 | Production release |
| MCUboot bootloader | 1.10.0 | Dual-bank OTA, Ed25519 verification |
| BLE stack | S140 v7.3.0 | Nordic SoftDevice |
| nRF5 SDK | 17.1.0 | Peripheral drivers |
| TFLite Micro | 2.14.0 | On-device AFib inference |

**OTA update:** Signed firmware packages delivered via BLE (SUIT manifest, Ed25519). Rollback automatic on boot failure. Minimum battery 20% required.

---

## 9. Regulatory Compliance

| Standard | Status |
|---|---|
| FCC Part 15 (BLE) | Certification pending |
| CE RED 2014/53/EU | Certification pending |
| FDA 510(k) | Pre-submission Q4 2026 |
| RoHS 3 (2015/863/EU) | Compliant |
| REACH SVHC | Compliant |
| IEC 60601-1 (electrical safety) | Testing Q4 2026 |
| ISO 80601-2-61 (SpO₂) | Validated (ARMS 0.44%) |
| ANSI/AAMI EC11 (ECG) | Validated (SNR 63.5 dB) |

---

## 10. BOM Summary (Production, 1k units)

| Category | Key Components | Unit Cost |
|---|---|---|
| MCU + memory | nRF52840, W25Q32JV, ATECC608B | $6.20 |
| Sensors | ADS1292R, MAX30102, MQ-3B, VEML6075, LSM6DSO, MCP9808 | $9.80 |
| Power | BQ25185 PMIC, MAX17048 fuel gauge, 210 mAh Li-Po | $4.10 |
| RF | Molex chip antenna, matching network | $0.85 |
| Connectivity | CP2102N USB bridge, USB-C connector | $1.20 |
| Passives + PCB | Resistors, caps, inductors, 4-layer PCB | $3.40 |
| Housing + assembly | Aluminum enclosure, lanyard, packaging | $8.50 |
| **Total BOM** | | **$34.05** |
| **Target retail** | | **$249** |

---

## 11. Ordering Information

| Model | Description | SKU |
|---|---|---|
| EOS-HKU-001-BLK | HEALTH-KEY ULTRA, Black Anodized | EOS-HKU-001-BLK |
| EOS-HKU-001-SLV | HEALTH-KEY ULTRA, Silver Anodized | EOS-HKU-001-SLV |
| EOS-HKU-001-DEV | Developer Kit (device + J-Link EDU Mini + breakout board) | EOS-HKU-001-DEV |

---

*EoS Health · EOS-DS-001-HKU Rev 1.0 · Confidential until commercial launch*
