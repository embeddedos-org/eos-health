# HEALTH-RING — Production Datasheet
## EoS Health · Models EOS-HR-001 (Base) / EOS-HR-002 (Ultra) · Revision 1.0

**Document:** EOS-DS-003-HR · **Date:** June 1, 2026 · **Status:** Production Release

---

## 1. Product Overview

HEALTH-RING is a titanium finger ring health monitor available in two tiers. The Base tier delivers ECG, 3-wavelength PPG, skin temperature, and motion tracking in the world's thinnest ECG ring at 2.0 mm. The Ultra tier adds 5-wavelength NIR spectroscopy for non-invasive HbA1c estimation, cuffless blood pressure via piezoelectric pulse transit time, and an on-device AI co-processor — capabilities no other ring-form-factor device offers.

---

## 2. Tier Comparison

| Specification | Base (EOS-HR-001) | Ultra (EOS-HR-002) |
|---|---|---|
| Ring width | 2.0 mm | 2.8 mm |
| Ring profile | 2.5 mm | 3.2 mm |
| Weight | 3.2 g | 4.8 g |
| Battery | 60 mAh | 170 mAh |
| Battery life | 4 days | 7 days |
| Charging | NFC inductive (13.56 MHz) | NFC inductive (13.56 MHz) |
| MCU | nRF52833 | nRF52840 + MAX32666 AI |
| PPG wavelengths | 3 (660/850/940 nm) | 5 (660/730/850/940/1300 nm) |
| ECG electrodes | ZPIES flush gold | DAEA dual-arc Pt-Ir |
| HbA1c | — | ✅ ±0.23% ARMS |
| Cuffless BP | — | ✅ ±5 mmHg |
| AFib detection | ✅ | ✅ AUC 0.998 |
| SpO₂ | ✅ ARMS 0.44% | ✅ ARMS 0.44% |
| Retail price | $199 | $399 |

---

## 3. Electrical Specifications

### Base (EOS-HR-001)

| Parameter | Min | Typ | Max | Unit |
|---|---|---|---|---|
| Battery capacity | — | 60 | — | mAh |
| Active current | — | 6.2 | 9 | mA |
| Deep sleep current | — | 3.1 | 5 | µA |
| NFC charging power | — | 0.5 | 1.0 | W |
| Charging time | — | 90 | 120 | min |

### Ultra (EOS-HR-002)

| Parameter | Min | Typ | Max | Unit |
|---|---|---|---|---|
| Battery capacity | — | 170 | — | mAh |
| Active current | — | 9.8 | 14 | mA |
| Deep sleep current | — | 3.8 | 6 | µA |
| NFC charging power | — | 1.0 | 2.0 | W |
| Charging time | — | 90 | 120 | min |

---

## 4. Sensor Suite

| Sensor | IC | Tier | Measurement | Accuracy |
|---|---|---|---|---|
| ECG (ZPIES) | ADS1291 | Base | Single-lead ECG, HR, HRV, AFib | SNR ≥58 dB |
| ECG (DAEA) | ADS1292R | Ultra | Dual-arc ECG, Lead I+II | SNR ≥63 dB |
| PPG 3λ | MAX30102 | Base | SpO₂, HR, HRV | ARMS ≤0.44% |
| PPG 5λ (MSHE) | MAX86176 | Ultra | SpO₂, HbA1c, HbO₂, MetHb | ARMS ≤0.44% |
| Piezo BP (PPTT) | LDT0-028K | Ultra | Cuffless systolic/diastolic BP | ±5 mmHg |
| Accelerometer | LIS2DH12 | Both | 3-axis motion, sleep staging | ±0.05 g |
| Temperature | MCP9808 | Both | Skin temperature, circadian | ±0.25°C |
| KEHS harvester | LTC3588-1 | Base | Kinetic energy → +18% battery | — |

---

## 5. Mechanical Specifications

| Parameter | Base | Ultra |
|---|---|---|
| Ring width | 2.0 mm | 2.8 mm |
| Ring profile height | 2.5 mm | 3.2 mm |
| Inner diameter options | 14–23 mm (sizes 3–13 US) | 14–23 mm (sizes 3–13 US) |
| Material | Grade 5 Titanium (Ti-6Al-4V) | Grade 5 Titanium (Ti-6Al-4V) |
| Finish | Polished / Matte / PVD Black | Polished / Matte / PVD Black / Rose Gold |
| IP rating | IP68 (200 m, 2 hr) | IP68 (200 m, 2 hr) |
| PCB type | Flexible PCB (FPCB), 4-layer | Flexible PCB (FPCB), 6-layer |
| Electrode material | 24K gold-on-anodized-Ti (ZPIES) | Platinum-iridium arc (DAEA) |

---

## 6. Processor and Memory

| Component | Base | Ultra |
|---|---|---|
| MCU | nRF52833 (Cortex-M4F, 512 KB Flash) | nRF52840 (Cortex-M4F, 1 MB Flash) |
| AI co-processor | — | MAX32666 (dual M4F, TFLite) |
| NVM | W25Q16JV (2 MB) | W25Q32JV (4 MB) |
| Secure element | ATECC608B | ATECC608B |

---

## 7. BOM Summary (Production, 1k units)

| Category | Base Cost | Ultra Cost |
|---|---|---|
| MCU + memory | $4.20 | $8.80 |
| Sensors | $7.40 | $14.60 |
| Power (PMIC + battery + NFC coil) | $5.80 | $8.20 |
| Flexible PCB | $6.50 | $9.80 |
| Titanium ring body + machining | $8.20 | $11.40 |
| Assembly + test | $3.50 | $4.50 |
| Charging dock | $4.80 | $6.20 |
| Packaging | $2.10 | $3.20 |
| **Total BOM** | **$42.50** | **$66.70** |
| **Target retail** | **$199** | **$399** |

---

## 8. Charging Dock Specifications

| Parameter | Value |
|---|---|
| Charging standard | NFC inductive, 13.56 MHz |
| Input | USB-C 5V/1A |
| Charging current | 100–500 mA (adaptive) |
| Dock material | Anodized aluminum |
| Dimensions | 40 × 40 × 12 mm |
| Included in box | Yes (both tiers) |

---

*EoS Health · EOS-DS-003-HR Rev 1.0 · Confidential until commercial launch*
