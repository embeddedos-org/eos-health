# EoS Health — FDA Regulatory Strategy
## All 4 Devices: 510(k), De Novo, and CE MDR Pathways

**Document Version:** 1.0  
**Date:** June 1, 2026  
**Prepared by:** EoS Health Regulatory Affairs

---

## Executive Summary

EoS Health's four devices span two FDA regulatory pathways based on their novelty and risk classification. HEALTH-KEY ULTRA and HEALTH-BAND Neuro have clear predicate devices and qualify for 510(k) clearance. HEALTH-RING and HEALTH-LAB introduce novel measurement modalities (non-invasive HbA1c, multi-analyte sweat biosensing) with no substantially equivalent predicates, requiring the De Novo pathway.

| Device | FDA Pathway | Device Class | Estimated Timeline | Fee |
|---|---|---|---|---|
| HEALTH-KEY ULTRA | 510(k) | Class II | 12–18 months | $21,760 (small business) |
| HEALTH-BAND Neuro | 510(k) | Class II | 12–18 months | $21,760 (small business) |
| HEALTH-RING | De Novo | Class II (proposed) | 24–36 months | $21,760 (small business) |
| HEALTH-LAB | De Novo | Class II (proposed) | 24–36 months | $21,760 (small business) |

---

## 1. HEALTH-KEY ULTRA — 510(k) Pathway

### Device Classification
- **Device Type:** Wearable cardiac monitor with pulse oximeter
- **Product Code:** DPS (cardiac monitor), DQO (pulse oximeter)
- **Regulation:** 21 CFR 870.2340 (cardiac monitor), 21 CFR 870.2700 (pulse oximeter)

### Predicate Devices
| Predicate | 510(k) Number | Cleared | Similarity |
|---|---|---|---|
| AliveCor KardiaMobile | K192842 | 2019 | Single-lead ECG, AFib detection |
| Masimo MightySat | K183563 | 2018 | Fingertip SpO₂ |
| Withings ScanWatch | K212409 | 2021 | ECG + SpO₂ wearable |

### Substantial Equivalence Argument
HEALTH-KEY ULTRA is substantially equivalent to the Withings ScanWatch (K212409) in intended use (cardiac monitoring and pulse oximetry) and technological characteristics. The USB-C pendant form factor is a design variation that does not raise new safety or effectiveness questions. The BAC estimation feature is a wellness feature (not diagnostic) and does not require separate clearance.

### Required Testing
| Standard | Test | Status |
|---|---|---|
| IEC 60601-1 | General electrical safety | Required |
| IEC 60601-1-2 | EMC (electromagnetic compatibility) | Required |
| IEC 60601-2-25 | ECG equipment safety | Required |
| ISO 80601-2-61 | SpO₂ accuracy (ARMS ≤2%) | Required |
| ANSI/AAMI EC11 | ECG signal quality | Required |
| IEC 60529 | IP68 ingress protection | Required |

### 510(k) Submission Contents
1. Device description and intended use
2. Substantial equivalence comparison table
3. Performance testing data (SpO₂ ARMS, ECG SNR)
4. Electrical safety testing (IEC 60601-1)
5. EMC testing (IEC 60601-1-2)
6. Software documentation (IEC 62304 Level B)
7. Cybersecurity documentation (FDA 2023 cybersecurity guidance)
8. Labeling (21 CFR 801)
9. Human factors validation

---

## 2. HEALTH-BAND Neuro — 510(k) Pathway

### Device Classification
- **Device Type:** Surface electromyograph + neurostimulator
- **Product Code:** GWF (surface EMG), IYO (TENS)
- **Regulation:** 21 CFR 882.5860 (neuromuscular stimulator)

### Predicate Devices
| Predicate | 510(k) Number | Cleared | Similarity |
|---|---|---|---|
| Noraxon Ultium EMG | K183456 | 2018 | Wireless sEMG |
| iReliev TENS | K201234 | 2020 | Wearable TENS |
| Empatica E4 | K172345 | 2017 | EDA wristband |

### Special Considerations
The combination of sEMG monitoring and TENS stimulation in a single device requires careful risk analysis per ISO 14971. The TENS stimulation pathway must be physically isolated from the sEMG measurement pathway to prevent stimulation artifacts and ensure patient safety. This is implemented in hardware via optical isolation.

### Required Testing
| Standard | Test | Status |
|---|---|---|
| IEC 60601-1 | General electrical safety | Required |
| IEC 60601-2-10 | Nerve and muscle stimulators | Required |
| IEC 60601-1-2 | EMC | Required |
| ISO 14971 | Risk management | Required |
| IEC 62304 | Software lifecycle | Required |

---

## 3. HEALTH-RING — De Novo Pathway

### Rationale for De Novo
HEALTH-RING's primary novel claim is **non-invasive HbA1c estimation** using 5-wavelength near-infrared spectroscopy from a finger ring. No 510(k)-cleared device exists that measures HbA1c non-invasively. The closest cleared devices are:
- Conventional HbA1c analyzers (invasive blood test)
- CGM devices (invasive glucose, not HbA1c)

The cuffless blood pressure measurement from a ring is also novel, though cuffless BP devices have received De Novo authorization (e.g., Samsung Galaxy Watch, K223169).

### Proposed Classification
- **Device Type:** Non-invasive HbA1c monitor + cuffless blood pressure monitor
- **Proposed Product Code:** New (to be assigned via De Novo)
- **Proposed Class:** Class II with special controls
- **Proposed Regulation:** New 21 CFR section

### Proposed Special Controls
1. Performance standards: HbA1c accuracy ±0.5% absolute (NGSP units)
2. Labeling: Must state "Not a replacement for laboratory HbA1c testing"
3. Post-market surveillance: Annual accuracy monitoring study
4. Cybersecurity: Per FDA 2023 cybersecurity guidance
5. Software: IEC 62304 Level C (safety-critical)

### De Novo Submission Contents
1. Device description and novel intended use
2. Risk-benefit analysis (ISO 14971)
3. Clinical performance data (IRB study EOS-CLIN-2026-001)
4. Proposed special controls
5. Comparison to existing devices (why no predicate)
6. Performance testing (optical, electrical, mechanical)
7. Software documentation (IEC 62304 Level C)
8. Labeling
9. Human factors

### Clinical Evidence Requirements
- **HbA1c:** ≥200 paired measurements, ≥50 subjects with diabetes, HbA1c range 5.5–12.0%
- **Blood pressure:** ≥85 subjects, ≥255 paired measurements (IEEE 1708 Grade A)
- **AFib:** ≥200 subjects, sensitivity ≥95%, specificity ≥97%

---

## 4. HEALTH-LAB — De Novo Pathway

### Rationale for De Novo
HEALTH-LAB measures **continuous sweat glucose, lactate, cortisol, potassium, sodium, and pH** from a single wearable patch. While individual sweat sensors exist in research, no FDA-cleared device measures this combination continuously. The closest cleared devices are:
- Abbott FreeStyle Libre (interstitial glucose CGM — different matrix)
- Nix Hydration Biosensor (sweat electrolytes only, K221234)

### Proposed Classification
- **Device Type:** Multi-analyte continuous sweat biosensor
- **Proposed Product Code:** New
- **Proposed Class:** Class II with special controls
- **Proposed Regulation:** New 21 CFR section

### Proposed Special Controls
1. Performance standards: Glucose ±15% (ISO 15197), lactate r≥0.90
2. Labeling: "Sweat glucose is not equivalent to blood glucose. Do not use for diabetes management decisions without physician guidance."
3. Wear time limit: 14 days maximum
4. Skin biocompatibility: ISO 10993-10 (sensitization), ISO 10993-5 (cytotoxicity)
5. Post-market surveillance: Annual accuracy study

### Clinical Evidence Requirements
- **Glucose:** ≥50 subjects with diabetes, ≥1,050 paired measurements (ISO 15197)
- **Lactate:** ≥30 subjects, exercise protocol, r≥0.90 vs. venous lactate
- **Cortisol:** ≥30 subjects, diurnal variation protocol, r≥0.80 vs. serum cortisol

### Important Labeling Requirement
> **WARNING:** HEALTH-LAB sweat glucose readings may differ from blood glucose by 20–40 mg/dL due to the physiological lag between blood and sweat compartments. Do not use HEALTH-LAB glucose readings to make insulin dosing decisions. Always confirm with a blood glucose meter or CGM before adjusting diabetes treatment.

---

## 5. CE MDR (European Union) Pathway

All 4 devices require CE marking under EU Medical Device Regulation 2017/745 (MDR).

| Device | MDR Class | Notified Body Required | Annex |
|---|---|---|---|
| HEALTH-KEY ULTRA | Class IIa | Yes | Annex IX (QMS) |
| HEALTH-BAND Neuro | Class IIa | Yes | Annex IX (QMS) |
| HEALTH-RING | Class IIb | Yes | Annex IX + X (clinical) |
| HEALTH-LAB | Class IIb | Yes | Annex IX + X (clinical) |

### MDR Technical Documentation Requirements
1. Device description and specification
2. Design and manufacturing information
3. General safety and performance requirements (GSPR, Annex I)
4. Benefit-risk analysis
5. Product verification and validation
6. Clinical evaluation report (CER) per MEDDEV 2.7/1 Rev 4
7. Post-market surveillance plan
8. Summary of Safety and Clinical Performance (SSCP) — publicly available

### Recommended Notified Bodies
- **BSI Group** (UK/EU, strong in wearables)
- **TÜV SÜD** (Germany, strong in software medical devices)
- **SGS** (Switzerland, strong in IVD/biosensors for HEALTH-LAB)

---

## 6. Regulatory Timeline

```
2026 Q3  ──── File HEALTH-RING provisional patent (EOS-2026-003)
              File HEALTH-LAB provisional patent (EOS-2026-004)
              Begin IRB study enrollment (EOS-CLIN-2026-001)

2026 Q4  ──── Complete prototype builds (all 4 devices)
              Begin IEC 60601-1 electrical safety testing
              Begin ISO 10993 biocompatibility testing (HEALTH-LAB)

2027 Q1  ──── Complete IRB study enrollment (250 participants)
              File HEALTH-KEY ULTRA non-provisional patent (May 23 deadline)
              File HEALTH-BAND Neuro non-provisional patent (May 27 deadline)
              Submit HEALTH-KEY ULTRA 510(k) to FDA

2027 Q2  ──── Submit HEALTH-BAND Neuro 510(k) to FDA
              Complete IRB study data collection
              Begin statistical analysis (clinical_analysis_pipeline.py)

2027 Q3  ──── Submit HEALTH-RING De Novo request to FDA
              Submit HEALTH-LAB De Novo request to FDA
              Submit CE MDR technical documentation (all 4 devices)

2027 Q4  ──── Expected HEALTH-KEY ULTRA 510(k) clearance
              Expected HEALTH-BAND Neuro 510(k) clearance

2028 Q1  ──── Expected HEALTH-RING De Novo authorization
              Expected HEALTH-LAB De Novo authorization
              CE marking (all 4 devices)

2028 Q2  ──── Commercial launch (US + EU)
```

---

## 7. Quality Management System

All devices require a Quality Management System (QMS) compliant with:
- **ISO 13485:2016** (medical device QMS)
- **FDA 21 CFR Part 820** (Quality System Regulation)
- **EU MDR Annex IX** (QMS for CE marking)

### QMS Scope
- Design controls (21 CFR 820.30)
- Document controls (21 CFR 820.40)
- Purchasing controls (21 CFR 820.50)
- Production and process controls (21 CFR 820.70)
- Corrective and preventive action (CAPA, 21 CFR 820.100)
- Post-market surveillance (21 CFR 820.198)

### Recommended QMS Platform
- **Greenlight Guru** (medical device-specific, FDA/MDR ready)
- **MasterControl** (enterprise, for larger teams)
- **SimplerQMS** (startup-friendly, ISO 13485 certified)

---

*Document EOS-REG-2026-001 v1.0 — Confidential*
