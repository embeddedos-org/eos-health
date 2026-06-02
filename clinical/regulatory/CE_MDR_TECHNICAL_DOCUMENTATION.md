# EoS Health — CE MDR Technical Documentation Template
## EU Medical Device Regulation 2017/745 Compliance

**Document Version:** 1.0  
**Date:** June 1, 2026  
**Applies to:** All 4 EoS Health Devices

---

## MDR Article 10 — General Obligations

### Technical Documentation Structure (Annex II)

#### Section 1 — Device Description and Specification

| Field | HEALTH-KEY ULTRA | HEALTH-BAND Neuro | HEALTH-RING | HEALTH-LAB |
|---|---|---|---|---|
| **Device Name** | HEALTH-KEY ULTRA | HEALTH-BAND Neuro | HEALTH-RING | HEALTH-LAB |
| **Model Number** | EOS-HKU-001 | EOS-HBN-001 | EOS-HR-001/002 | EOS-HL-001/002 |
| **MDR Class** | IIa | IIa | IIb | IIb |
| **Intended Use** | Cardiac monitoring, SpO₂, wellness | sEMG, EDA, TENS therapy | ECG, SpO₂, HbA1c, BP | Sweat glucose, lactate, cortisol, electrolytes |
| **Intended Users** | General consumers ≥18 years | General consumers ≥18 years | General consumers ≥18 years | General consumers ≥18 years |
| **Intended Environment** | Home, ambulatory | Home, ambulatory | Home, ambulatory | Home, ambulatory |
| **Sterile?** | No | No | No | No (patch is single-use) |
| **Measuring Function?** | Yes (ECG, SpO₂) | Yes (sEMG, EDA) | Yes (ECG, HbA1c, BP) | Yes (glucose, lactate) |

#### Section 2 — Reference to Previous Generations

No previous generations exist. This is a first-generation device family.

#### Section 3 — General Safety and Performance Requirements (GSPR)

All devices must demonstrate conformity with Annex I GSPR. Key requirements:

| GSPR | Requirement | Applicable Standard | Status |
|---|---|---|---|
| 1 | Devices shall not compromise safety | ISO 14971 risk management | Required |
| 3 | Devices shall achieve intended performance | Clinical performance data | Required |
| 5 | Design lifetime | Specified in labeling | Required |
| 10.1 | Chemical, physical, biological properties | ISO 10993 series | Required |
| 10.4.1 | Substances ≥0.1% w/w | REACH compliance | Required |
| 11 | Infection and microbial contamination | ISO 11135 (if sterile) | N/A |
| 12 | Devices with measuring function | IEC 60601-2-25 (ECG) | Required |
| 14 | Electronic programmable systems | IEC 62304 | Required |
| 14.5 | Cybersecurity | ETSI EN 303 645 | Required |
| 15 | Active devices | IEC 60601-1 | Required |
| 17 | Labeling | MDR Annex I §23 | Required |

---

## Biocompatibility (ISO 10993 Series)

| Test | Standard | Devices | Rationale |
|---|---|---|---|
| Cytotoxicity | ISO 10993-5 | All 4 | Skin contact |
| Sensitization | ISO 10993-10 | All 4 | Prolonged skin contact |
| Skin irritation | ISO 10993-23 | All 4 | Prolonged skin contact |
| Systemic toxicity (acute) | ISO 10993-11 | HEALTH-LAB | Iontophoresis |
| Genotoxicity | ISO 10993-3 | HEALTH-LAB | Novel electrode materials |
| Implantation | ISO 10993-6 | N/A | Not implanted |

**Materials of concern:**
- Titanium (HEALTH-RING): Excellent biocompatibility, ISO 10993-5 cytotoxicity test required
- Platinum-iridium electrodes (HEALTH-RING): Established biocompatibility, literature evidence acceptable
- PEDOT:PSS conductive polymer (HEALTH-LAB): Novel material, full ISO 10993 battery required
- Aerosol-jet printed nano-electrodes (HEALTH-LAB): Novel, full ISO 10993 battery required

---

## Software Documentation (IEC 62304)

| Device | Software Safety Class | Rationale |
|---|---|---|
| HEALTH-KEY ULTRA | Class B | Incorrect SpO₂ could delay treatment but not cause direct harm |
| HEALTH-BAND Neuro | Class B | TENS stimulation is low-risk; sEMG is monitoring only |
| HEALTH-RING | Class C | Incorrect HbA1c could lead to incorrect diabetes management |
| HEALTH-LAB | Class C | Incorrect glucose could lead to incorrect insulin dosing |

### IEC 62304 Deliverables Required

1. **Software Development Plan** — development process, tools, standards
2. **Software Requirements Specification** — functional and safety requirements
3. **Software Architecture Document** — system decomposition, interfaces
4. **Software Design Document** — detailed design, data flows
5. **Software Unit Implementation** — source code with comments
6. **Software Unit Verification** — unit test results
7. **Software Integration Testing** — integration test results
8. **Software System Testing** — system test results
9. **Software Release** — version control, release notes
10. **Problem Resolution Process** — bug tracking, CAPA

---

## Clinical Evaluation Report (CER) — MEDDEV 2.7/1 Rev 4

### CER Structure

**Stage 1 — Identify applicable regulations and scope**
- Intended purpose, indications, contraindications
- Target population, user profile

**Stage 2 — Identify relevant clinical data**
- Literature search (PubMed, Embase, Cochrane)
- Clinical investigation data (IRB study EOS-CLIN-2026-001)
- Post-market clinical follow-up (PMCF) plan

**Stage 3 — Appraise clinical data**
- Methodological quality assessment
- Statistical analysis (clinical_analysis_pipeline.py)

**Stage 4 — Analyse clinical data**
- Benefit-risk analysis
- Residual risks

**Stage 5 — Conclusions**
- Conformity with GSPR
- Unresolved issues and PMCF plan

### Literature Search Strategy

```
Database: PubMed, Embase, IEEE Xplore, Cochrane Library
Date range: 2015–2026
Search terms (HEALTH-RING):
  ("non-invasive" OR "noninvasive") AND ("HbA1c" OR "glycated hemoglobin")
  AND ("near-infrared" OR "NIR" OR "photoplethysmography")
  
Search terms (HEALTH-LAB):
  ("wearable" OR "continuous") AND ("sweat" OR "perspiration")
  AND ("glucose" OR "lactate" OR "cortisol")
  AND ("biosensor" OR "electrochemical")
```

---

## Post-Market Surveillance (PMS) Plan

Per MDR Article 83, all devices require a PMS plan:

| Activity | Frequency | Responsible |
|---|---|---|
| Complaint analysis | Continuous | Quality team |
| Serious incident reporting (EUDAMED) | Within 15 days | Regulatory affairs |
| Trend reporting | Quarterly | Quality team |
| Literature surveillance | Monthly | Clinical team |
| Post-market clinical follow-up (PMCF) | Annual | Clinical team |
| Periodic Safety Update Report (PSUR) | Annual (Class IIb) | Regulatory affairs |
| Summary of Safety and Clinical Performance (SSCP) | Annual update | Regulatory affairs |

---

## Unique Device Identification (UDI)

All devices require UDI per MDR Article 27 and EU Regulation 2017/745 Annex VI:

| Component | Requirement |
|---|---|
| UDI-DI (Device Identifier) | GS1 or HIBCC issuing agency |
| UDI-PI (Production Identifier) | Lot/batch number, serial number, expiry date |
| Label | Human-readable + AIDC (barcode/DataMatrix) |
| EUDAMED registration | Required before placing on EU market |

---

## Labeling Requirements (MDR Annex I §23)

All labeling must include:
- [ ] Device name and model number
- [ ] Manufacturer name and address
- [ ] Date of manufacture (or lot number)
- [ ] Expiry date (HEALTH-LAB patch: 14 days from activation)
- [ ] UDI-DI and UDI-PI
- [ ] CE marking with Notified Body number
- [ ] Intended purpose (brief)
- [ ] Warnings and contraindications
- [ ] Instructions for use (IFU) reference
- [ ] Storage conditions
- [ ] Single-use symbol (HEALTH-LAB patch)
- [ ] IP rating symbol
- [ ] Wireless symbol (BLE)

---

*Document EOS-MDR-2026-001 v1.0 — Confidential*
