# HEALTH-LAB — Production Datasheet
## EoS Health · Models EOS-HL-001 (Base) / EOS-HL-002 (Ultra) · Revision 1.0

**Document:** EOS-DS-004-HL · **Date:** June 1, 2026 · **Status:** Production Release

---

## 1. Product Overview

HEALTH-LAB is a flexible biosensor patch that continuously measures sweat biomarkers from the skin surface. It is the world's first wearable to simultaneously measure glucose, lactate, cortisol, potassium, sodium, and pH in real time using aerosol-jet printed nano-electrodes and time-multiplexed amperometric/potentiometric sensing. The patch adheres to the upper arm or chest and transmits data wirelessly to the EoS Health Hub app.

---

## 2. Tier Comparison

| Specification | Base (EOS-HL-001) | Ultra (EOS-HL-002) |
|---|---|---|
| Analytes | 4 (glucose, lactate, Na⁺, pH) | 7 (+ cortisol, K⁺, uric acid) |
| Wear time | 7 days | 14 days |
| Glucose accuracy | ±15% (ISO 15197) | ±5% (SCBN Kalman) |
| Iontophoresis | Passive sweat only | Active (carbachol stimulation) |
| MCU | nRF52833 | nRF52840 |
| Battery | 30 mAh | 65 mAh |
| Retail price | $49/patch | $89/patch |
| Subscription | None | None |

---

## 3. Electrochemical Specifications

| Analyte | Method | Electrode | Range | Accuracy | Tier |
|---|---|---|---|---|---|
| Glucose | Amperometric (GOx) | NEBA Pt nano | 40–400 mg/dL | ±15% (Base), ±5% (Ultra) | Both |
| Lactate | Amperometric (LOx) | NEBA Pt nano | 0.5–20 mmol/L | ±10% | Both |
| Sodium (Na⁺) | Potentiometric (ISE) | NEBA Ag/AgCl | 10–200 mmol/L | ±5 mmol/L | Both |
| pH | Potentiometric | NEBA Ir/IrO₂ | 4.0–8.0 | ±0.1 pH | Both |
| Cortisol | Aptamer-based | NEBA Au nano | 1–200 ng/mL | ±20% | Ultra |
| Potassium (K⁺) | Potentiometric (ISE) | NEBA Ag/AgCl | 1–50 mmol/L | ±3 mmol/L | Ultra |
| Uric acid | Amperometric (UOx) | NEBA Pt nano | 0.1–1.5 mmol/L | ±15% | Ultra |

**NEBA:** Nano-Electrode Bio-Array — aerosol-jet printed platinum/gold/iridium nano-electrodes on polyimide substrate.

---

## 4. Electrical Specifications

| Parameter | Base | Ultra | Unit |
|---|---|---|---|
| Battery capacity | 30 | 65 | mAh |
| Active current (sensing + BLE) | 3.8 | 5.2 | mA |
| Iontophoresis current (Ultra only) | — | 0.5 | mA |
| Deep sleep current | 2.1 | 2.8 | µA |
| Battery life | 7 | 14 | days |
| Charging | NFC (13.56 MHz) | NFC (13.56 MHz) | — |

---

## 5. Mechanical and Physical Specifications

| Parameter | Value |
|---|---|
| Patch dimensions | 55 × 35 × 2.5 mm |
| Weight | 4.2 g |
| Substrate | Polyimide (Kapton) + medical-grade silicone adhesive |
| Electrode material | Aerosol-jet printed Pt/Au/Ir nanoparticles on polyimide |
| Adhesive | 3M 2477P medical-grade acrylic adhesive |
| Skin contact biocompatibility | ISO 10993-5 (cytotoxicity), ISO 10993-10 (sensitization) |
| IP rating | IPX7 (1 m, 30 min) |
| Bend radius | ≥5 mm (flexible substrate) |
| Wear locations | Upper arm, chest, lower back |
| Single-use | Yes (patch body is single-use; electronics module is reusable) |

---

## 6. System Architecture

HEALTH-LAB uses a two-part design:

**Disposable patch body:** Contains the NEBA electrodes, reference electrode, iontophoresis electrodes (Ultra), and adhesive layer. Single-use, replaced every 7 or 14 days.

**Reusable electronics module:** Snaps onto the patch body via a 12-pin ZIF connector. Contains the MCU, BLE radio, battery, and analog front-end. Reused across multiple patch bodies.

---

## 7. Processor and Memory

| Component | Base | Ultra |
|---|---|---|
| MCU | nRF52833 | nRF52840 |
| AFE | LMP91000 (3-channel) | LMP91002 (7-channel) |
| NVM | W25Q16JV (2 MB) | W25Q32JV (4 MB) |
| Secure element | ATECC608B | ATECC608B |

---

## 8. SCBN Kalman Calibration (Ultra only)

The HEALTH-LAB Ultra uses a 3-reference electrode Kalman filter (SCBN — Self-Calibrating Biosensor Network) that continuously corrects for electrode drift, temperature variation, and sweat pH interference:

| Parameter | Value |
|---|---|
| Kalman state vector | [glucose, drift_rate, pH_correction, temp_correction] |
| Process noise covariance | Q = diag([0.01, 0.001, 0.005, 0.002]) |
| Measurement noise covariance | R = 0.04 (2% sensor noise) |
| Calibration interval | Continuous (every 30 s) |
| Glucose accuracy improvement | ±15% → ±5% vs. uncalibrated |

---

## 9. BOM Summary (Production, 1k units)

| Category | Base Cost | Ultra Cost |
|---|---|---|
| MCU + AFE | $3.80 | $6.40 |
| NEBA electrodes (aerosol-jet print) | $4.20 | $8.60 |
| Polyimide substrate + adhesive | $2.10 | $3.40 |
| Power (PMIC + battery + NFC) | $3.20 | $5.80 |
| Electronics module housing | $2.80 | $3.60 |
| Assembly + calibration | $2.40 | $3.80 |
| Packaging (3-pack) | $1.80 | $2.40 |
| **Total BOM (per patch)** | **$20.30** | **$34.00** |
| **Target retail** | **$49** | **$89** |

---

## 10. Sweat Biomarker Reference Ranges

| Biomarker | Normal Range | Clinical Significance |
|---|---|---|
| Glucose | 40–120 mg/dL (fasting) | Diabetes monitoring, hypoglycemia alert |
| Lactate | 0.5–2.0 mmol/L (rest) | Exercise intensity, metabolic stress |
| Sodium | 10–90 mmol/L | Hydration status, cystic fibrosis screening |
| pH | 4.5–7.5 | Skin health, metabolic alkalosis |
| Cortisol | 5–25 ng/mL (morning) | Stress, adrenal function, sleep quality |
| Potassium | 5–25 mmol/L | Electrolyte balance, cardiac risk |
| Uric acid | 0.2–0.8 mmol/L | Gout risk, purine metabolism |

---

*EoS Health · EOS-DS-004-HL Rev 1.0 · Confidential until commercial launch*
