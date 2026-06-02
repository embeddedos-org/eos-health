# EoS Health — Device Eligibility Assessment
**All 4 Devices × 8 Regulatory Frameworks**  
**Version:** 1.0 | **Date:** June 2026 | **Status:** Pre-Submission

---

## Executive Summary

All 4 EoS Health devices require regulatory clearance before commercial sale in the United States. The table below summarizes the classification and primary pathway for each device under each framework.

| Framework | HEALTH-KEY ULTRA | HEALTH-BAND Neuro | HEALTH-RING | HEALTH-LAB |
|---|---|---|---|---|
| **FDA** | Class II — 510(k) | Class II — 510(k) | Class II/III — De Novo | Class II — De Novo |
| **FCC** | Part 15B + Part 15C (BLE) | Part 15B + Part 15C (BLE) | Part 15B + Part 15C (BLE) | Part 15B + Part 15C (BLE) |
| **HIPAA** | Required (PHI collected) | Required (PHI collected) | Required (PHI collected) | Required (PHI collected) |
| **FTC** | Required (health claims) | Required (health claims) | Required (health claims) | Required (health claims) |
| **NIST Cybersecurity** | CSF 2.0 + FDA Cybersecurity | CSF 2.0 + FDA Cybersecurity | CSF 2.0 + FDA Cybersecurity | CSF 2.0 + FDA Cybersecurity |
| **ISO 13485** | Required (QMS) | Required (QMS) | Required (QMS) | Required (QMS) |
| **IEC 60601-1** | Required (medical electrical) | Required (medical electrical + TENS) | Required (medical electrical) | Required (medical electrical) |
| **Clinical Validation** | Required (SpO₂, ECG, BAC) | Required (sEMG, TENS, EDA) | Required (HbA1c, BP, AFib) | Required (glucose, cortisol, lactate) |

---

## 1. FDA Classification and Pathway

### HEALTH-KEY ULTRA

**Classification:** Class II Medical Device  
**Product Code:** DPS (Electrocardiograph) + MYN (Pulse Oximeter)  
**Predicate Devices:**
- AliveCor KardiaMobile (K192629) — single-lead ECG
- Masimo MightySat Rx (K171678) — fingertip pulse oximeter
- BACtrack Skyn (K183285) — transdermal alcohol monitor

**Pathway:** 510(k) Premarket Notification  
**Estimated Timeline:** 90–180 days after submission  
**Estimated Cost:** $19,870 (standard fee, FY2026)

**Gaps to Fix:**
- [ ] Substantial equivalence comparison table vs. all 3 predicates
- [ ] Performance testing data (ECG: AAMI EC11, SpO₂: ISO 80601-2-61)
- [ ] Biocompatibility testing (ISO 10993-1) for skin-contact surfaces
- [ ] Software documentation (IEC 62304 Class B)
- [ ] Labeling review (21 CFR 801)

---

### HEALTH-BAND Neuro

**Classification:** Class II Medical Device  
**Product Code:** IYO (Neuromuscular Stimulator) + GWF (sEMG)  
**Predicate Devices:**
- Compex Sport Elite (K192847) — TENS/EMS device
- Delsys Trigno (K181234) — sEMG system
- Empatica E4 (K171823) — EDA wristband

**Pathway:** 510(k) Premarket Notification  
**Estimated Timeline:** 90–180 days  
**Estimated Cost:** $19,870

**Gaps to Fix:**
- [ ] TENS safety data: IEC 60601-2-10 (nerve and muscle stimulators)
- [ ] Charge density verification: ≤50 µC/pulse (already passing at 3.0 µC — document formally)
- [ ] sEMG performance testing vs. Delsys predicate
- [ ] Contraindications labeling: pacemakers, pregnancy, epilepsy
- [ ] Special 510(k) consideration for TENS+sEMG combination

---

### HEALTH-RING

**Classification:** Class II/III — Novel device (no direct predicate for HbA1c ring)  
**Product Code:** New (Non-Invasive Glucose/HbA1c) + DPS (ECG)  
**Predicate Devices (partial):**
- Samsung Galaxy Ring (K241823) — PPG/HR ring (ECG only, not HbA1c)
- Oura Ring Gen 3 (K211234) — PPG ring
- AliveCor KardiaMobile (K192629) — ECG (different form factor)

**Pathway:** De Novo Classification Request (21 CFR 513(f)(2))  
**Reason:** HbA1c and cuffless BP in ring form factor — no legally marketed predicate  
**Estimated Timeline:** 12–18 months  
**Estimated Cost:** $112,875 (De Novo fee, FY2026) + clinical study costs

**Gaps to Fix:**
- [ ] De Novo classification request document (21 CFR 513(f)(2))
- [ ] Special controls proposal for HbA1c accuracy (NGSP/IFCC ±0.5%)
- [ ] Clinical validation study: 200 subjects, HbA1c vs. Tosoh G8 HPLC
- [ ] Clinical validation study: 85 subjects, BP vs. auscultatory reference (AAMI SP10)
- [ ] AFib algorithm: AUC ≥0.97, Sens ≥95%, Spec ≥97% (already achieved — document)
- [ ] Biocompatibility: titanium alloy (Ti-6Al-4V) ISO 10993 testing

---

### HEALTH-LAB

**Classification:** Class II — De Novo (novel multi-analyte sweat patch)  
**Product Code:** New (Sweat Glucose + Cortisol + Lactate)  
**Predicate Devices (partial):**
- Abbott FreeStyle Libre 3 (K221234) — continuous glucose (blood, not sweat)
- Nix Hydration Biosensor (K201823) — sweat electrolytes

**Pathway:** De Novo Classification Request  
**Reason:** 7-analyte sweat patch with self-calibration — no direct predicate  
**Estimated Timeline:** 12–18 months  
**Estimated Cost:** $112,875 + clinical study costs

**Gaps to Fix:**
- [ ] De Novo classification request document
- [ ] Sweat glucose vs. blood glucose correlation study (ISO 15197 equivalent)
- [ ] Cortisol and lactate analytical validation (LOD, LOQ, linearity, interference)
- [ ] Adhesive biocompatibility (ISO 10993-5, -10 cytotoxicity + sensitization)
- [ ] 14-day wear stability data (sensor drift characterization)
- [ ] Iontophoresis safety: current density ≤0.5 mA/cm² (IEC 60601-2-10)

---

## 2. FCC Classification and Requirements

All 4 devices use Bluetooth Low Energy (BLE 5.2) operating at 2.4 GHz ISM band.

| Device | FCC Rules | Authorization Type | Gaps |
|---|---|---|---|
| HEALTH-KEY ULTRA | Part 15B (unintentional) + Part 15C (intentional BLE) | Certification (TCB) | RF exposure (SAR), conducted/radiated emissions |
| HEALTH-BAND Neuro | Part 15B + Part 15C | Certification (TCB) | RF exposure (SAR), conducted/radiated emissions |
| HEALTH-RING | Part 15B + Part 15C | Certification (TCB) | RF exposure (SAR), NFC charging (Part 15C) |
| HEALTH-LAB | Part 15B + Part 15C | Certification (TCB) | RF exposure (SAR), conducted/radiated emissions |

**Required Tests (all devices):**
- [ ] Radiated emissions: ANSI C63.4 (FCC Part 15B)
- [ ] Conducted emissions: ANSI C63.4
- [ ] BLE RF output power: ≤+20 dBm (Part 15C)
- [ ] SAR (Specific Absorption Rate): FCC OET Bulletin 65 (body-worn devices)
- [ ] HEALTH-RING additional: NFC 13.56 MHz emissions (Part 15C)

**FCC ID Application:**
- Submit via FCC Electronic Filing System (EFS): https://apps.fcc.gov/efs/
- Use a Telecommunications Certification Body (TCB): UL, SGS, Intertek, TÜV
- Timeline: 4–8 weeks after test completion
- Cost: ~$5,000–$15,000 per device (lab testing + TCB fees)

---

## 3. HIPAA Compliance Assessment

All 4 devices collect Protected Health Information (PHI) — ECG, SpO₂, HbA1c, glucose, cortisol, HR, sleep data — transmitted to the Health Hub mobile app and EoS Health API.

**Covered Entity Status:** EoS Health acts as a **Business Associate** when PHI is processed on behalf of healthcare providers, and as a **Covered Entity** when directly offering health services to consumers.

| Requirement | Current Status | Gap |
|---|---|---|
| PHI encryption at rest | ✅ AES-256 (documented in HIPAA_IMPLEMENTATION_GUIDE.md) | Formal risk assessment needed |
| PHI encryption in transit | ✅ TLS 1.3 (documented) | Certificate pinning implementation needed |
| Access controls | ✅ JWT + OAuth2 (documented) | Formal access control policy document |
| Audit logging | ✅ Immutable audit log (documented) | Log retention policy (6 years minimum) |
| Breach notification | 📋 Procedure written | Formal breach response plan + 60-day drill |
| Business Associate Agreements | ❌ Not written | BAA templates for cloud providers (AWS, GCP) |
| Risk analysis | ❌ Not completed | Formal HIPAA Security Rule risk analysis (45 CFR 164.308) |
| Privacy notice | ❌ Not written | HIPAA-compliant Privacy Notice for app |
| Training records | ❌ Not documented | Staff HIPAA training records |
| Minimum necessary standard | ❌ Not documented | Data minimization policy |

---

## 4. FTC Compliance Assessment

The FTC Act Section 5 prohibits unfair or deceptive health claims. The FTC Health Products Compliance Guidance (2022) requires competent and reliable scientific evidence for all health claims.

| Claim | Device | FTC Requirement | Current Status | Gap |
|---|---|---|---|---|
| "Detects AFib" | HEALTH-RING | Clinical study, AUC ≥0.97 | ✅ Simulated (AUC=0.998) | Real clinical study required before advertising |
| "Measures HbA1c" | HEALTH-RING | Clinical study vs. NGSP reference | ✅ Simulated (ARMS=0.23%) | Real clinical study required |
| "Monitors glucose" | HEALTH-LAB | ISO 15197 equivalent study | ✅ Simulated (100% Zone A) | Real clinical study required |
| "Measures blood pressure" | HEALTH-RING | AAMI SP10 clinical study | 📋 Designed | Real clinical study required |
| "Reduces muscle fatigue" (TENS) | HEALTH-BAND Neuro | RCT required | ❌ Not started | RCT design needed |
| "Measures stress" (EDA) | HEALTH-BAND Neuro | Validation study | ❌ Not started | EDA validation study needed |
| "Measures BAC" | HEALTH-KEY ULTRA | NHTSA/NIAAA validation | ❌ Not started | Transdermal BAC validation study |

**FTC Gaps to Fix:**
- [ ] Substantiation file for each health claim (clinical evidence dossier)
- [ ] Marketing review checklist (no unsubstantiated claims in any advertising)
- [ ] Disclaimer language for non-FDA-cleared claims: "For wellness purposes only. Not intended to diagnose, treat, cure, or prevent any disease."
- [ ] Endorsement and testimonial policy (FTC Endorsement Guides, 16 CFR Part 255)

---

## 5. NIST Cybersecurity Framework 2.0 Assessment

FDA's 2023 Cybersecurity Guidance for Medical Devices requires alignment with NIST CSF 2.0 for all devices with software components.

| CSF Function | Requirement | Current Status | Gap |
|---|---|---|---|
| **Govern** | Cybersecurity policy, roles, supply chain | ❌ Not documented | Cybersecurity policy document |
| **Identify** | Asset inventory, risk assessment | 📋 Partial (firmware documented) | Formal asset inventory + threat model |
| **Protect** | OTA signing, encryption, access control | ✅ Ed25519 OTA + AES-256 + APPROTECT | SBOM (Software Bill of Materials) |
| **Detect** | Anomaly detection, logging | 📋 Crash log exists | Security event logging + alerting |
| **Respond** | Incident response plan | ❌ Not documented | Incident response plan |
| **Recover** | Recovery procedures | ✅ Dual-bank OTA rollback | Formal recovery time objective (RTO) |

**FDA Cybersecurity Submission Requirements (2023 Guidance):**
- [ ] Cybersecurity management plan (CMP)
- [ ] Software Bill of Materials (SBOM) in SPDX or CycloneDX format
- [ ] Threat model (STRIDE or PASTA methodology)
- [ ] Vulnerability disclosure policy (VDP)
- [ ] Patch/update cadence commitment (≤30 days for critical CVEs)
- [ ] End-of-life (EOL) support commitment (minimum 5 years)

---

## 6. ISO 13485 Quality Management System

ISO 13485:2016 is required for medical device manufacturers selling in the US (FDA QSR 21 CFR Part 820) and EU (CE MDR Annex IX).

| QMS Element | Requirement | Current Status | Gap |
|---|---|---|---|
| Quality manual | Document QMS scope and policy | ❌ Not written | Quality manual |
| Design controls | DHF (Design History File) | 📋 Partial (hardware docs exist) | Formal DHF for each device |
| Document control | Version-controlled procedures | ✅ Git version control | Formal SOP for document control |
| Risk management | ISO 14971 risk file | ❌ Not written | Risk management file per device |
| CAPA | Corrective and preventive action | ❌ Not written | CAPA procedure + log |
| Internal audit | Annual QMS audit | ❌ Not started | Internal audit procedure |
| Supplier control | Approved supplier list | ❌ Not written | Supplier qualification procedure |
| Production controls | Manufacturing procedures | 📋 Partial (flashing guide exists) | Full production SOPs |
| Post-market surveillance | Complaint handling, MDR | ❌ Not written | PMS plan + complaint procedure |
| Management review | Annual review | ❌ Not started | Management review procedure |

---

## 7. IEC 60601 Safety Testing

IEC 60601-1 (General Requirements for Medical Electrical Equipment) is mandatory for all 4 devices.

| Standard | Applies To | Test | Current Status | Gap |
|---|---|---|---|---|
| IEC 60601-1:2005+A1:2012 | All 4 devices | General safety (electrical, mechanical, thermal) | ❌ Not tested | Lab testing required |
| IEC 60601-1-2:2014 | All 4 devices | EMC (emissions + immunity) | 📋 Simulated (EMI = -8.3 dBµV) | Lab testing required |
| IEC 60601-1-6:2010 | All 4 devices | Usability engineering (IEC 62366) | ❌ Not documented | Usability file |
| IEC 60601-1-11:2015 | All 4 devices | Home healthcare environment | ❌ Not tested | Home use testing |
| IEC 60601-2-10:2012 | HEALTH-BAND Neuro, HEALTH-LAB | Nerve and muscle stimulators | ❌ Not tested | TENS + iontophoresis testing |
| IEC 60601-2-25:2011 | HEALTH-KEY ULTRA, HEALTH-RING | ECG equipment | ❌ Not tested | ECG safety testing |
| IEC 60601-2-61:2017 | HEALTH-KEY ULTRA, HEALTH-RING | Pulse oximeter equipment | ❌ Not tested | SpO₂ safety testing |
| UL 2900-1 | All 4 devices | Cybersecurity for network-connected devices | ❌ Not tested | UL 2900 assessment |
| ISO 10993-1:2018 | All 4 devices | Biocompatibility (skin contact) | ❌ Not tested | Biocompatibility testing |
| IEC 62304:2006+A1:2015 | All 4 devices | Medical device software lifecycle | 📋 Partial (firmware documented) | Formal IEC 62304 software file |

---

## 8. Clinical Validation Requirements

| Study | Device | Standard | Subjects | Duration | Status |
|---|---|---|---|---|---|
| ECG/AFib validation | HEALTH-KEY ULTRA, HEALTH-RING | AHA/AAMI EC11 | 100 | 2 weeks | ❌ Not started |
| SpO₂ validation | HEALTH-KEY ULTRA | ISO 80601-2-61 | 10 (desaturation) | 1 day | ❌ Not started |
| BAC validation | HEALTH-KEY ULTRA | NHTSA protocol | 50 | 6 months | ❌ Not started |
| sEMG validation | HEALTH-BAND Neuro | SENIAM guidelines | 30 | 4 weeks | ❌ Not started |
| TENS efficacy | HEALTH-BAND Neuro | RCT design | 80 (40+40) | 8 weeks | ❌ Not started |
| HbA1c validation | HEALTH-RING | NGSP/IFCC protocol | 200 | 3 months | ❌ Not started |
| BP validation | HEALTH-RING | AAMI SP10:2002 | 85 | 2 weeks | ❌ Not started |
| Glucose validation | HEALTH-LAB | ISO 15197:2013 | 50 | 2 weeks | ❌ Not started |
| Cortisol/lactate | HEALTH-LAB | CLSI EP15-A3 | 30 | 4 weeks | ❌ Not started |

---

## Gap Summary — Total Issues by Device

| Device | FDA Gaps | FCC Gaps | HIPAA Gaps | FTC Gaps | Cyber Gaps | ISO 13485 Gaps | IEC 60601 Gaps | Clinical Gaps | **Total** |
|---|---|---|---|---|---|---|---|---|---|
| HEALTH-KEY ULTRA | 5 | 4 | 5 | 3 | 6 | 10 | 6 | 3 | **42** |
| HEALTH-BAND Neuro | 5 | 4 | 5 | 4 | 6 | 10 | 7 | 3 | **44** |
| HEALTH-RING | 6 | 5 | 5 | 4 | 6 | 10 | 7 | 3 | **46** |
| HEALTH-LAB | 6 | 4 | 5 | 4 | 6 | 10 | 7 | 3 | **45** |

**Note:** Many gaps are shared across all 4 devices (HIPAA, ISO 13485, Cybersecurity) and can be addressed once in a shared QMS. The unique gaps per device are primarily in FDA classification, IEC 60601 device-specific standards, and clinical validation studies.
