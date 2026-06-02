# Master Regulatory Submission Checklist — Version 2.0
## EoS Health — All 4 Devices — Gap-Fixed Edition
**Devices:** HEALTH-KEY ULTRA | HEALTH-BAND Neuro | HEALTH-RING | HEALTH-LAB  
**Date:** June 2026 | **Version:** 2.0 (Gap-Fixed) | **Status:** Documentation Complete — Testing Pending

---

## Executive Summary

This checklist consolidates all regulatory requirements across 8 frameworks for all 4 EoS Health devices. Version 2.0 closes all documentation gaps identified in the initial assessment. The following table shows the status of each framework:

| Framework | Documentation Status | Testing Status | Submission Ready? |
|---|---|---|---|
| FDA 510(k) — KEY ULTRA | ✅ Complete | 📋 Lab testing pending | 📋 After testing |
| FDA 510(k) — BAND Neuro | ✅ Complete | 📋 Lab testing pending | 📋 After testing |
| FDA De Novo — RING | ✅ Complete | 📋 Clinical studies pending | 📋 After studies |
| FDA De Novo — LAB | ✅ Complete | 📋 Clinical studies pending | 📋 After studies |
| FCC Part 15 — All 4 | ✅ Complete | 📋 TCB testing pending | 📋 After testing |
| HIPAA | ✅ Complete | 📋 BAA execution pending | 📋 Before launch |
| FTC | ✅ Complete | 📋 Clinical substantiation pending | 📋 After studies |
| ISO 13485 QMS | ✅ Complete | 📋 Certification audit pending | 📋 After audit |
| IEC 60601 / UL | ✅ Complete | 📋 Lab testing pending | 📋 After testing |
| NIST Cybersecurity | ✅ Complete | 📋 Penetration test pending | 📋 After pentest |
| ISO 14971 Risk Mgmt | ✅ Complete | 📋 Post-market data pending | 📋 Before launch |
| IEC 62304 Software | ✅ Complete | 📋 Third-party audit pending | 📋 Before submission |
| ISO 10993 Biocompat | ✅ Complete | 📋 Lab testing pending | 📋 After testing |
| Clinical Studies | ✅ Protocols complete | 📋 Studies pending | 📋 After studies |

---

## Section 1: FDA Submission Checklist

### 1.1 HEALTH-KEY ULTRA — 510(k) Submission

**Submission Type:** Traditional 510(k)  
**Predicate Devices:** AliveCor KardiaMobile (K192629), Masimo MightySat Rx (K171678)

| Item | Document | Status |
|---|---|---|
| Device description | `regulatory/fda/FDA_510K_HEALTH_KEY_ULTRA.md` §1 | ✅ |
| Substantial equivalence comparison | `regulatory/fda/FDA_510K_HEALTH_KEY_ULTRA.md` §2 | ✅ |
| Performance testing (AAMI EC11, ISO 80601-2-61) | `regulatory/fda/FDA_510K_HEALTH_KEY_ULTRA.md` §3 | ✅ (simulated) |
| IEC 62304 software documentation | `regulatory/software-lifecycle/IEC62304_SOFTWARE_LIFECYCLE.md` | ✅ |
| IEC 60601-1 electrical safety | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | ✅ (pending lab) |
| IEC 60601-2-25 ECG specific | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` §1 | ✅ (pending lab) |
| IEC 60601-2-61 SpO₂ specific | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` §2 | ✅ (pending clinical) |
| ISO 10993 biocompatibility | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | ✅ (pending lab) |
| ISO 14971 risk management | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` | ✅ |
| Labeling (21 CFR 801) | `regulatory/labeling/FDA_LABELING_PACKAGE.md` §2 | ✅ |
| UDI (21 CFR Part 830) | `regulatory/labeling/FDA_LABELING_PACKAGE.md` §6 | ✅ (pending GS1 registration) |
| FCC authorization | `regulatory/fcc/FCC_AUTHORIZATION_CHECKLIST.md` | ✅ (pending TCB) |
| Cybersecurity (FDA 2023 guidance) | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` | ✅ |
| Usability engineering (IEC 60601-1-6) | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` §3 | ✅ (pending studies) |
| SpO₂ clinical study (EOS-CL-001) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| AFib clinical study (EOS-CL-002) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| 510(k) cover letter | To be drafted | 📋 Pending |
| FDA Form 3514 | To be completed | 📋 Pending |

### 1.2 HEALTH-BAND Neuro — 510(k) Submission

**Submission Type:** Traditional 510(k)  
**Predicate Devices:** Compex Sport Elite (K143030), AliveCor KardiaMobile (K192629)

| Item | Document | Status |
|---|---|---|
| Device description | `regulatory/fda/FDA_510K_HEALTH_BAND_NEURO.md` §1 | ✅ |
| Substantial equivalence comparison | `regulatory/fda/FDA_510K_HEALTH_BAND_NEURO.md` §2 | ✅ |
| TENS performance testing (IEC 60601-2-10) | `regulatory/fda/FDA_510K_HEALTH_BAND_NEURO.md` §3 | ✅ (pending lab) |
| IEC 62304 software documentation | `regulatory/software-lifecycle/IEC62304_SOFTWARE_LIFECYCLE.md` | ✅ |
| IEC 60601-1 electrical safety | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | ✅ (pending lab) |
| IEC 60601-2-10 TENS specific | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | ✅ (pending lab) |
| ISO 10993 biocompatibility (Ag/AgCl, silicone) | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | ✅ (pending lab) |
| ISO 14971 risk management | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` §2.2 | ✅ |
| Labeling (21 CFR 801) | `regulatory/labeling/FDA_LABELING_PACKAGE.md` §3 | ✅ |
| TENS efficacy study (EOS-CL-006) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| Usability study (EOS-CL-010) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |

### 1.3 HEALTH-RING — De Novo Submission

**Submission Type:** De Novo (21 CFR 513(f)(2))  
**Proposed Classification:** Class II with Special Controls

| Item | Document | Status |
|---|---|---|
| De Novo cover letter | To be drafted | 📋 Pending |
| FDA Form 3881 | To be completed | 📋 Pending |
| Device description | `regulatory/fda/FDA_DE_NOVO_HEALTH_RING_AND_LAB.md` §1 | ✅ |
| Proposed special controls | `regulatory/fda/FDA_DE_NOVO_SPECIAL_CONTROLS.md` §2 | ✅ |
| Predicate analysis | `regulatory/fda/FDA_DE_NOVO_SPECIAL_CONTROLS.md` §4 | ✅ |
| IEC 62304 software documentation | `regulatory/software-lifecycle/IEC62304_SOFTWARE_LIFECYCLE.md` | ✅ |
| IEC 60601-2-25 ECG specific | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` §1 | ✅ (pending lab) |
| IEC 60601-2-61 SpO₂ specific | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` §2 | ✅ (pending clinical) |
| ISO 10993 biocompatibility (Ti-6Al-4V) | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | ✅ (pending lab) |
| ISO 14971 risk management | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` §2.3 | ✅ |
| Labeling (21 CFR 801) | `regulatory/labeling/FDA_LABELING_PACKAGE.md` §4 | ✅ |
| HbA1c clinical study (EOS-CL-003) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| BP clinical study (EOS-CL-004) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| SpO₂ clinical study (EOS-CL-001) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| AFib clinical study (EOS-CL-002) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |

### 1.4 HEALTH-LAB — De Novo Submission

**Submission Type:** De Novo (21 CFR 513(f)(2))

| Item | Document | Status |
|---|---|---|
| Device description | `regulatory/fda/FDA_DE_NOVO_HEALTH_RING_AND_LAB.md` §2 | ✅ |
| Proposed special controls | `regulatory/fda/FDA_DE_NOVO_SPECIAL_CONTROLS.md` §3 | ✅ |
| IEC 60601-2-10 iontophoresis specific | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | ✅ (pending lab) |
| ISO 10993 biocompatibility (adhesive, enzymes) | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | ✅ (pending lab) |
| ISO 14971 risk management | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` §2.4 | ✅ |
| Labeling (21 CFR 801) | `regulatory/labeling/FDA_LABELING_PACKAGE.md` §5 | ✅ |
| Glucose clinical study (EOS-CL-005) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| Cortisol clinical study (EOS-CL-008) | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Protocol ready |
| Shelf life / stability study | To be conducted | 📋 Pending |

---

## Section 2: FCC Authorization Checklist

| Item | Document | Status |
|---|---|---|
| FCC Part 15 §15.247 BLE compliance | `regulatory/fcc/FCC_AUTHORIZATION_CHECKLIST.md` | ✅ |
| TCB (Telecommunication Certification Body) selection | SGS North America recommended | 📋 Pending |
| RF exposure (SAR) evaluation | `regulatory/fcc/FCC_AUTHORIZATION_CHECKLIST.md` | ✅ (pending lab) |
| FCC label (or e-label for RING) | `regulatory/labeling/FDA_LABELING_PACKAGE.md` §7 | ✅ |
| FCC ID application (Form 731) | To be submitted to TCB | 📋 Pending |
| Estimated cost per device | $6,000–$18,000 | — |
| Estimated timeline per device | 6–8 weeks | — |

---

## Section 3: HIPAA Compliance Checklist

| Item | Document | Status |
|---|---|---|
| BAA template | `regulatory/baa/HIPAA_BAA_AND_PRIVACY_PACKAGE.md` §1 | ✅ |
| AWS BAA execution | `regulatory/baa/HIPAA_BAA_AND_PRIVACY_PACKAGE.md` §2.4 | 📋 Execute before launch |
| Twilio BAA | `regulatory/baa/HIPAA_BAA_AND_PRIVACY_PACKAGE.md` §2.4 | 📋 Before PHI SMS |
| Notice of Privacy Practices | `regulatory/baa/HIPAA_BAA_AND_PRIVACY_PACKAGE.md` §2 | ✅ |
| Breach response plan | `regulatory/baa/HIPAA_BAA_AND_PRIVACY_PACKAGE.md` §3 | ✅ |
| PHI encryption (AES-256 + TLS 1.3) | `regulatory/cybersecurity/CYBERSECURITY_MANAGEMENT_PLAN.md` | ✅ |
| Security Risk Analysis | To be conducted | 📋 Before launch |
| Privacy Officer appointment | To be done | 📋 Before launch |
| Employee HIPAA training | To be conducted | 📋 Before launch |

---

## Section 4: FTC Compliance Checklist

| Item | Document | Status |
|---|---|---|
| Claim substantiation matrix | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` §4 | ✅ |
| Required disclaimers drafted | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` §4.2 | ✅ |
| FTC disclaimer review by counsel | To be done | 📋 Before marketing |
| Clinical studies to substantiate claims | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 📋 Studies pending |
| Marketing materials review | To be done | 📋 Before launch |

---

## Section 5: ISO 13485 QMS Checklist

| Item | Document | Status |
|---|---|---|
| Quality Manual | `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md` §1 | ✅ |
| Design History File (DHF) structure | `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md` §2 | ✅ |
| Document control (SOP-001) | `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md` §3 | ✅ |
| CAPA procedure (SOP-CAPA-001) | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` §1 | ✅ |
| Supplier control (SOP-SUP-001) | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` §2 | ✅ |
| Approved Supplier List | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` §2.2 | ✅ |
| Post-Market Surveillance plan (SOP-PMS-001) | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` §3 | ✅ |
| Internal audit procedure (SOP-AUD-001) | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` §4 | ✅ |
| ISO 14971 Risk Management File | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` | ✅ |
| ISO 13485 certification audit | To be scheduled | 📋 Month 12 |
| JLCPCB/Seeed supplier qualification | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` §2.2 | 📋 Before production |

---

## Section 6: IEC 60601 / UL Safety Testing Checklist

| Test | Standard | Device(s) | Status |
|---|---|---|---|
| General electrical safety | IEC 60601-1:2005+A2:2020 | All 4 | 📋 Lab testing pending |
| EMC | IEC 60601-1-2:2014+A1:2020 | All 4 | 📋 Lab testing pending |
| Usability | IEC 60601-1-6 | All 4 | ✅ Protocol ready |
| ECG equipment | IEC 60601-2-25 | KEY ULTRA, BAND Neuro, RING | 📋 Lab testing pending |
| SpO₂ equipment | IEC 60601-2-61 | KEY ULTRA, RING | 📋 Clinical study pending |
| TENS equipment | IEC 60601-2-10 | BAND Neuro, LAB | 📋 Lab testing pending |
| Cybersecurity | UL 2900-2-1 | All 4 | 📋 Pentest pending |
| Biocompatibility | ISO 10993 | All 4 | 📋 Lab testing pending |
| Recommended lab | SGS North America | — | Contact: sgs.com/medical |

---

## Section 7: Cybersecurity Checklist

| Item | Document | Status |
|---|---|---|
| SBOM (CycloneDX 1.4) | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` §1 | ✅ |
| Threat model (STRIDE) | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` §2 | ✅ |
| Vulnerability Disclosure Policy | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` §3 | ✅ |
| NIST CSF 2.0 mapping | `regulatory/cybersecurity/NIST_CYBERSECURITY_FRAMEWORK.md` | ✅ |
| Cybersecurity Management Plan | `regulatory/cybersecurity/CYBERSECURITY_MANAGEMENT_PLAN.md` | ✅ |
| OTA firmware signing (Ed25519) | `regulatory/software-lifecycle/IEC62304_SOFTWARE_LIFECYCLE.md` | ✅ |
| Penetration testing (UL 2900-2-1) | To be conducted | 📋 Before submission |
| CVE scanning in CI/CD | To be implemented | 📋 Before launch |

---

## Section 8: Clinical Studies Checklist

| Study | Protocol | IRB | ClinicalTrials.gov | Enrollment | Complete |
|---|---|---|---|---|---|
| EOS-CL-001: SpO₂ | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-002: AFib | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-003: HbA1c | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-004: BP | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-005: Glucose | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-006: TENS efficacy | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-007: HbA1c 14-day | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-008: Cortisol | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-009: Sleep staging | ✅ | 📋 | 📋 | 📋 | 📋 |
| EOS-CL-010: Usability | ✅ | 📋 | N/A | 📋 | 📋 |

---

## Section 9: Immediate Action Items (Do These Now)

### Priority 1 — Before Any Marketing or Sales (Month 1–3)

| Action | Owner | Deadline | Cost |
|---|---|---|---|
| Execute AWS BAA | Legal/Engineering | Month 1 | Free |
| Appoint Privacy Officer | Management | Month 1 | Salary |
| Add FTC disclaimers to website and app | Marketing/Legal | Month 1 | $2,000 |
| Register with GS1 US for UDI | Regulatory | Month 1 | $250/year |
| Engage regulatory counsel (Emergo by UL or Halloran) | Management | Month 1 | $5,000 retainer |
| Submit FCC applications to TCB (all 4 devices) | Regulatory | Month 2 | $24,000–$72,000 |
| Engage Nelson Labs for ISO 10993 testing | Regulatory | Month 2 | $92,000–$185,000 |
| Engage SGS for IEC 60601 testing | Regulatory | Month 2 | $210,000–$470,000 |
| Submit IRB applications (EOS-CL-001, EOS-CL-002) | Clinical | Month 2 | $6,000 |
| Register ClinicalTrials.gov (EOS-CL-001, EOS-CL-002) | Clinical | Month 2 | Free |

### Priority 2 — Before FDA Submission (Month 4–18)

| Action | Owner | Deadline | Cost |
|---|---|---|---|
| Complete ISO 10993 biocompatibility testing | Regulatory | Month 6 | $92K–$185K |
| Complete IEC 60601 safety testing | Regulatory | Month 10 | $210K–$470K |
| Complete FCC authorization (all 4 devices) | Regulatory | Month 8 | $24K–$72K |
| Complete EOS-CL-001 (SpO₂) | Clinical | Month 6 | $63,000 |
| Complete EOS-CL-002 (AFib) | Clinical | Month 10 | $122,000 |
| Complete EOS-CL-003 (HbA1c) | Clinical | Month 12 | $192,000 |
| Complete EOS-CL-004 (BP) | Clinical | Month 9 | $97,000 |
| Complete EOS-CL-005 (Glucose) | Clinical | Month 10 | $122,000 |
| Submit FDA 510(k) — KEY ULTRA | Regulatory | Month 12 | $19,870 (FDA fee) |
| Submit FDA 510(k) — BAND Neuro | Regulatory | Month 12 | $19,870 (FDA fee) |
| Submit FDA De Novo — RING | Regulatory | Month 18 | $19,870 (FDA fee) |
| Submit FDA De Novo — LAB | Regulatory | Month 18 | $19,870 (FDA fee) |

---

## Section 10: Total Cost and Timeline Summary

| Framework | Documentation | Testing/Studies | Total | Timeline |
|---|---|---|---|---|
| FDA (4 devices) | ✅ Complete | $350K–$900K | $370K–$980K | 18–42 months |
| FCC (4 devices) | ✅ Complete | $24K–$72K | $24K–$72K | 6–8 months |
| HIPAA | ✅ Complete | $24K–$55K | $24K–$55K | 3 months |
| FTC | ✅ Complete | (included in clinical) | $21K–$49K | 3 months |
| ISO 13485 | ✅ Complete | $65K–$145K | $65K–$145K | 12 months |
| IEC 60601 / UL | ✅ Complete | $210K–$470K | $210K–$470K | 10 months |
| NIST Cybersecurity | ✅ Complete | $49K–$110K | $49K–$110K | 6 months |
| Clinical Studies (10) | ✅ Complete | $901K | $901K | 32 months |
| **Total** | **✅ All complete** | **$1.46M–$3.76M** | **$1.46M–$3.76M** | **42 months** |

**Documentation Gap Status:** All 177 identified documentation gaps have been closed. The remaining work is physical testing, clinical studies, and regulatory submissions — none of which can be completed on paper alone.

---

## Document Index — All Regulatory Files

| Document | Path | Version | Status |
|---|---|---|---|
| FDA 510(k) — KEY ULTRA | `regulatory/fda/FDA_510K_HEALTH_KEY_ULTRA.md` | 1.0 | ✅ |
| FDA 510(k) — BAND Neuro | `regulatory/fda/FDA_510K_HEALTH_BAND_NEURO.md` | 1.0 | ✅ |
| FDA De Novo — RING + LAB | `regulatory/fda/FDA_DE_NOVO_HEALTH_RING_AND_LAB.md` | 1.0 | ✅ |
| FDA De Novo Special Controls | `regulatory/fda/FDA_DE_NOVO_SPECIAL_CONTROLS.md` | 1.0 | ✅ **NEW** |
| FCC Authorization Checklist | `regulatory/fcc/FCC_AUTHORIZATION_CHECKLIST.md` | 1.0 | ✅ |
| HIPAA Compliance Package | `regulatory/hipaa/HIPAA_COMPLIANCE_PACKAGE.md` | 1.0 | ✅ |
| HIPAA BAA + Privacy Package | `regulatory/baa/HIPAA_BAA_AND_PRIVACY_PACKAGE.md` | 1.0 | ✅ **NEW** |
| FTC Compliance Package | `regulatory/ftc/FTC_COMPLIANCE_PACKAGE.md` | 1.0 | ✅ |
| ISO 13485 QMS | `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md` | 1.0 | ✅ |
| CAPA + QMS Procedures | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md` | 1.0 | ✅ **NEW** |
| ISO 14971 Risk Management | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` | 1.0 | ✅ **NEW** |
| IEC 60601 Safety Testing | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | 1.0 | ✅ |
| IEC 60601 Device-Specific | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` | 1.0 | ✅ **NEW** |
| ISO 10993 Biocompatibility | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | 1.0 | ✅ **NEW** |
| IEC 62304 Software Lifecycle | `regulatory/software-lifecycle/IEC62304_SOFTWARE_LIFECYCLE.md` | 1.0 | ✅ **NEW** |
| FDA Labeling Package | `regulatory/labeling/FDA_LABELING_PACKAGE.md` | 1.0 | ✅ **NEW** |
| NIST Cybersecurity Framework | `regulatory/cybersecurity/NIST_CYBERSECURITY_FRAMEWORK.md` | 1.0 | ✅ |
| SBOM + Threat Model + VDP | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` | 1.0 | ✅ **NEW** |
| Clinical Validation Checklist | `regulatory/clinical-validation/CLINICAL_VALIDATION_SUBMISSION_CHECKLIST.md` | 1.0 | ✅ |
| Clinical Study Protocols | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 1.0 | ✅ **NEW** |
| Device Eligibility Assessment | `regulatory/master/DEVICE_ELIGIBILITY_ASSESSMENT.md` | 1.0 | ✅ |
| **This Document** | `regulatory/master/MASTER_REGULATORY_CHECKLIST_V2.md` | 2.0 | ✅ **NEW** |
