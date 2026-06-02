# EoS Health — HIPAA Compliance & FDA Regulatory Pathway

**Version:** 1.0 | **Date:** June 2026 | **Author:** EoS Health Regulatory Affairs

This document defines the complete regulatory strategy for all four EoS Health devices. It covers HIPAA data handling requirements, FDA classification and clearance pathways, and the clinical validation framework required before commercial launch.

---

## Part 1 — HIPAA Compliance Framework

### 1.1 PHI Definition and Scope

Protected Health Information (PHI) under HIPAA includes any individually identifiable health information. For EoS Health devices, the following data types constitute PHI when linked to an individual:

| Data Type | PHI Status | Handling Requirement |
|---|---|---|
| ECG waveforms | PHI | AES-256 at rest, TLS 1.3 in transit |
| Heart rate + HRV | PHI | Encrypted, audit-logged |
| SpO₂ readings | PHI | Encrypted, audit-logged |
| Blood glucose estimates | PHI | AES-256, access-controlled |
| HbA1c estimates | PHI | AES-256, physician-access only |
| Sleep staging data | PHI | Encrypted, user-controlled |
| AFib detection flags | PHI | Encrypted, physician-notified |
| Body temperature | PHI | Encrypted |
| GPS/location (if collected) | PHI | Explicit consent required |
| Device serial number alone | Not PHI | Standard security |
| Aggregate anonymized data | Not PHI | De-identified per Safe Harbor |

### 1.2 Technical Safeguards (§164.312)

**Encryption at Rest:** All PHI stored on the mobile app (iOS/Android) uses AES-256-GCM with keys stored in the device Secure Enclave (iOS) or Android Keystore. The web companion app uses AES-256 with keys managed by AWS KMS. The firmware data buffer on the device stores only raw sensor data (not PHI) — PHI is only created after processing on the mobile app.

**Encryption in Transit:** All API calls use TLS 1.3 with certificate pinning. BLE communication uses AES-128 CCM (Bluetooth LE Security Mode 1, Level 3 — authenticated pairing with encryption). No PHI is transmitted over unencrypted channels under any circumstances.

**Access Controls:** Role-based access control (RBAC) with three tiers: User (own data only), Healthcare Provider (patient data with BAA), and Administrator (aggregate anonymized data only). Multi-factor authentication is required for all healthcare provider accounts.

**Audit Logging (§164.312(b)):** Every access to PHI is logged with: timestamp (UTC), user ID, action type (read/write/delete/export), data type accessed, and source IP address. Audit logs are immutable, stored separately from PHI, retained for 6 years, and reviewed monthly.

**Automatic Logoff (§164.312(a)(2)(iii)):** Mobile app auto-locks after 5 minutes of inactivity. Web app session expires after 30 minutes. Re-authentication required for any PHI access after lock.

### 1.3 De-Identification (Safe Harbor Method)

For research and analytics purposes, PHI is de-identified by removing all 18 Safe Harbor identifiers including: names, geographic data smaller than state, dates (except year), phone numbers, email addresses, SSN, medical record numbers, device identifiers, and any other unique identifiers. De-identified data may be used for algorithm training and population health research without HIPAA restrictions.

### 1.4 Business Associate Agreements (BAA)

EoS Health must execute BAAs with all third-party vendors who handle PHI:

| Vendor Category | Examples | BAA Required |
|---|---|---|
| Cloud storage | AWS S3, Google Cloud | Yes |
| Analytics | Any health analytics platform | Yes |
| Customer support | Zendesk, Intercom | Yes (if PHI shared) |
| Payment processing | Stripe | No (payment data only) |
| App distribution | Apple App Store, Google Play | No (no PHI access) |

### 1.5 Breach Notification (§164.400–414)

In the event of a PHI breach, EoS Health must notify affected individuals within 60 days of discovery. Breaches affecting 500+ individuals require notification to HHS and prominent media outlets within 60 days. All breaches are logged in the breach register and reported to HHS annually.

---

## Part 2 — FDA Regulatory Pathway

### 2.1 Device Classification by Product

FDA regulates medical devices under 21 CFR. The classification determines the regulatory pathway (exempt, 510(k), De Novo, or PMA).

| Device | Intended Use | FDA Class | Pathway | Predicate |
|---|---|---|---|---|
| **HEALTH-KEY ULTRA** | General wellness, SpO₂ monitoring | Class II | 510(k) | Apple Watch (K213766) |
| **HEALTH-BAND Neuro** | TENS therapy + wellness monitoring | Class II | 510(k) | TENS units (K193456) |
| **HEALTH-RING** (base) | General wellness, HR, SpO₂ | Class I | Exempt | — |
| **HEALTH-RING Ultra** | ECG, AFib detection | Class II | 510(k) | AliveCor KardiaMobile (K150014) |
| **HEALTH-LAB** (base) | General wellness, glucose trend | Class II | De Novo | No direct predicate |
| **HEALTH-LAB Ultra** | Continuous glucose monitoring | Class III | PMA | Dexcom G7 (P210007) |

> **Note on HEALTH-LAB:** The base tier (glucose trend, not diagnostic) may qualify for De Novo classification. The Ultra tier (continuous glucose monitoring for diabetes management) requires PMA — the highest regulatory standard. This is a 3–5 year pathway. Until PMA clearance, HEALTH-LAB Ultra is marketed as a wellness device only, with explicit disclaimers that it is not a medical device and not intended to diagnose or treat diabetes.

### 2.2 510(k) Pathway — HEALTH-RING Ultra (AFib Detection)

The 510(k) pathway requires demonstrating substantial equivalence to a legally marketed predicate device. For HEALTH-RING Ultra's AFib detection feature:

**Predicate Device:** AliveCor KardiaMobile (K150014) — single-lead ECG with AFib detection.

**Substantial Equivalence Argument:**
- Same intended use: detection of AFib in symptomatic individuals
- Same technology: single-lead ECG with algorithmic AFib classification
- Different form factor (ring vs handheld) — requires performance data showing equivalent accuracy
- Different electrode placement (finger vs palm) — requires clinical validation

**Required Performance Data:**
- Sensitivity ≥ 87% for AFib detection (vs Holter monitor reference)
- Specificity ≥ 97% for AFib detection
- Study population: ≥ 100 subjects with confirmed AFib + 100 controls
- Sites: ≥ 2 clinical sites with IRB approval
- Statistical analysis: Cohen's kappa ≥ 0.80

### 2.3 510(k) Pathway — HEALTH-BAND Neuro (TENS)

**Predicate Device:** Multiple cleared TENS devices (K193456, K201234).

**Key Requirements:**
- Electrical safety testing per IEC 60601-1 (general medical electrical equipment)
- Electromagnetic compatibility per IEC 60601-1-2
- Biocompatibility per ISO 10993 (skin contact materials)
- Usability testing per IEC 62366-1
- Maximum output current: 80 mA (matches predicate)
- Maximum frequency: 100 Hz (matches predicate)

### 2.4 Clinical Validation Study Design

All EoS Health devices requiring 510(k) clearance must complete the following clinical validation study:

**Study Title:** "Accuracy and Safety of EoS Health Wearable Devices for Cardiovascular and Metabolic Monitoring"

**Design:** Prospective, multi-site, non-interventional accuracy study

**Sites:** 3 clinical sites (academic medical centers with IRB approval)

**Sample Size:** 200 subjects per device (100 with condition, 100 controls)

**Primary Endpoints:**
- ECG/AFib: sensitivity and specificity vs 12-lead Holter monitor (24h)
- SpO₂: mean absolute difference vs co-oximetry (ISO 80601-2-61)
- Blood pressure: mean absolute difference vs auscultatory method (AAMI SP10)
- Glucose: mean absolute difference vs YSI 2300 STAT Plus analyzer (ISO 15197)

**Inclusion Criteria:**
- Age 18–80 years
- Able to provide written informed consent
- No active skin conditions at sensor placement sites

**Exclusion Criteria:**
- Implanted cardiac devices (pacemaker, ICD) — for ECG studies
- Active pregnancy — for TENS studies
- Known allergy to titanium or medical-grade adhesives

**Statistical Analysis:**
- Bland-Altman analysis for continuous measurements
- Sensitivity/specificity with 95% confidence intervals
- Cohen's kappa for categorical outcomes (AFib yes/no)
- Subgroup analysis by age, sex, BMI, skin tone (Fitzpatrick scale)

---

## Part 3 — Reliability Test Specifications

### 3.1 IP Rating Tests

| Device | Target Rating | Test Standard | Test Conditions |
|---|---|---|---|
| HEALTH-KEY ULTRA | IP68 (2m, 30min) | IEC 60529 | 2m freshwater, 30 min |
| HEALTH-BAND Neuro | IP68 (2m, 30min) | IEC 60529 | 2m freshwater, 30 min |
| HEALTH-RING | IP68 (200m, 30min) | IEC 60529 | 200m saltwater, 30 min |
| HEALTH-LAB | IPX7 (1m, 30min) | IEC 60529 | 1m freshwater, 30 min |

All devices must pass 10 consecutive immersion cycles with no water ingress and no degradation in sensor performance.

### 3.2 Drop Test Specification

**Standard:** MIL-STD-810H, Method 516.8
**Height:** 1.5 m onto concrete
**Orientations:** 26 (6 faces, 12 edges, 8 corners)
**Pass Criteria:** No functional failure, no structural damage, BLE connection maintained

### 3.3 Thermal Cycling

**Standard:** IEC 60068-2-14
**Range:** -20°C to +60°C
**Cycles:** 100 cycles (1 hour per cycle)
**Ramp rate:** 5°C/min
**Pass Criteria:** No functional failure, sensor accuracy within spec

### 3.4 Battery Cycle Life

**Test:** 500 full charge/discharge cycles at 25°C
**Pass Criteria:** Capacity retention ≥ 80% after 500 cycles
**Basis:** IEC 61960-3

### 3.5 Biocompatibility (ISO 10993)

All skin-contact materials (titanium, medical-grade silicone, adhesives) must pass:
- Cytotoxicity (ISO 10993-5)
- Sensitization (ISO 10993-10)
- Skin irritation (ISO 10993-23)
- Implantation (not required — surface contact only)

---

## Part 4 — Data Encryption Implementation

### 4.1 Firmware Level (Device)

The device firmware does not store PHI. Raw sensor data in the 64 KB data buffer is not individually identifiable without the user's account context. However, as a defense-in-depth measure, the data buffer is encrypted with a device-unique AES-128 key stored in the nRF52840 CRYPTOCELL hardware security module.

### 4.2 Mobile App Level

```
PHI Storage:
  iOS:     SQLCipher (AES-256) + keys in Secure Enclave
  Android: SQLCipher (AES-256) + keys in Android Keystore

PHI Transmission:
  BLE:     AES-128 CCM (BLE Security Mode 1 Level 3)
  API:     TLS 1.3 + certificate pinning
  
Data at rest encryption key rotation: 90 days
Session token expiry: 24 hours
Refresh token expiry: 30 days
```

### 4.3 Backend Level

```
Database:   AES-256 encryption at rest (AWS RDS encrypted)
S3 Storage: SSE-KMS (AWS KMS managed keys)
Key Management: AWS KMS with automatic annual rotation
Backup encryption: AES-256, stored in separate AWS region
Network: VPC with private subnets, no public database access
```

---

## Part 5 — Regulatory Timeline

| Milestone | Target Date | Notes |
|---|---|---|
| IRB protocol submission | Q4 2026 | 3 sites simultaneously |
| IRB approval | Q1 2027 | 60–90 day review |
| Clinical study enrollment | Q1 2027 | 200 subjects per device |
| Clinical study completion | Q3 2027 | 6-month enrollment |
| 510(k) submission — HEALTH-RING Ultra | Q4 2027 | After clinical data |
| 510(k) submission — HEALTH-BAND Neuro | Q4 2027 | After clinical data |
| 510(k) clearance (expected) | Q2 2028 | 90-day FDA review |
| HEALTH-LAB De Novo submission | Q1 2028 | Glucose trend only |
| Commercial launch (cleared devices) | Q3 2028 | US market |
| CE marking (EU MDR) | Q4 2028 | Parallel with FDA |

> **Important:** HEALTH-RING (base tier) and HEALTH-KEY ULTRA can launch as general wellness devices without 510(k) clearance, provided they do not make diagnostic claims. Marketing must clearly state "Not intended to diagnose, treat, cure, or prevent any disease."
