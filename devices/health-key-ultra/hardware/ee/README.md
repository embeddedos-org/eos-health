# HEALTH-KEY ULTRA — Electrical Engineering Files

This directory contains all electrical engineering design files for the HEALTH-KEY ULTRA.

## Directory Structure

| Directory | Contents |
| :--- | :--- |
| `schematics/` | KiCad or Altium schematic files (.sch, .kicad_sch) |
| `gerbers/` | Gerber files for PCB fabrication (6-layer HDI) |
| `bom/` | Bill of Materials with Digi-Key and Mouser part numbers |
| `pcb-renders/` | 3D renders and layout screenshots |

## Key ICs and Components

| Component | Part Number | Function | Vendor |
| :--- | :--- | :--- | :--- |
| MCU | Nordic nRF52840 | BLE 5.3 + USB 2.0 FS + 64MHz ARM Cortex-M4 | Nordic Semi |
| Optical PPG | Maxim MAX30101 | HR, HRV, SpO2 — Green + Red + IR LEDs | Maxim/Analog Devices |
| ECG AFE | Texas Instruments OPA391 | Lead I ECG via USB-C shield electrode | TI |
| IMU | Bosch BMI270 | 6-axis tremor, step, activity | Bosch |
| Gas Sensor | Sensirion SGP40 | VOC index, ketosis, halitosis | Sensirion |
| UV Sensor | Vishay VEML6075 | UVA/UVB index | Vishay |
| Temperature | Texas Instruments AS6221 | Skin temp ±0.09°C | TI |
| BAC Fuel Cell | Dart Sensors EC4-10-100 | Electrochemical BAC | Dart Sensors |
| MEMS Gas | Sensirion SGP40 | VOC/BAC cross-validation | Sensirion |
| Flash Storage | Winbond W25N512GV | 64GB NAND Flash | Winbond |
| Battery | Custom Li-Po | 40mAh 3.7V | TBD |
| USB-C Connector | Amphenol 12401548E4#2A | Male plug with isolated shield | Amphenol |

## PCB Specifications

The HEALTH-KEY ULTRA PCB is a **6-layer HDI (High-Density Interconnect)** board measuring **44mm × 14mm**. Layer stack-up: Signal / Ground / Power / Signal / Ground / Signal. Minimum trace width: 0.075mm. Minimum via drill: 0.1mm (laser via). The USB-C connector shield is electrically isolated from the PCB ground plane via a 0402 capacitor (100nF) to enable its use as a biopotential ECG electrode.
