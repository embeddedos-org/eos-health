# FDA De Novo Special Controls Proposal
## HEALTH-RING (EOS-2026-003) and HEALTH-LAB (EOS-2026-004)
**Regulation:** 21 CFR 513(f)(2) — De Novo Classification Request  
**Reference:** FDA Guidance: De Novo Classification Process (Evaluation of Automatic Class III Designation), October 2021  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Purpose

This document proposes special controls for the De Novo classification of HEALTH-RING (non-invasive HbA1c + cuffless BP ring) and HEALTH-LAB (multi-analyte sweat biosensor patch). Special controls are device-specific requirements that, in combination with general controls, provide reasonable assurance of safety and effectiveness for Class II devices that cannot be classified as Class I.

Per 21 CFR 513(f)(2)(vi), the De Novo request must include a proposed classification and proposed special controls. This document fulfills that requirement.

---

## 2. HEALTH-RING — Proposed Special Controls

### 2.1 Proposed Classification

**Device Name:** Non-Invasive Wearable HbA1c and Blood Pressure Monitor with ECG  
**Proposed Class:** Class II (Special Controls)  
**Proposed Product Code:** New (to be assigned by FDA)  
**Proposed Regulation:** 21 CFR Part 870 (Cardiovascular Devices) or 21 CFR Part 862 (Clinical Chemistry Devices)

### 2.2 Proposed Special Controls

The following special controls are proposed to provide reasonable assurance of safety and effectiveness for HEALTH-RING:

#### Special Control 1: Performance Testing — HbA1c

**(a)** The device's HbA1c measurement performance shall be demonstrated through a clinical study comparing device measurements to a reference method (Tosoh G8 HPLC, NGSP-certified) in a minimum of 200 subjects with a range of HbA1c values (4.0%–14.0%).

**(b)** The device shall achieve:
- Accuracy: ARMS ≤0.5% HbA1c units vs. reference
- Bias: ≤0.3% HbA1c units
- Precision: CV ≤3% at all HbA1c levels

**(c)** The clinical study shall include subjects representing the intended use population:
- Age range: 18–80 years
- BMI range: 18.5–40 kg/m²
- Skin tone diversity: Fitzpatrick scale I–VI
- Minimum 30% subjects with HbA1c ≥7.0% (diabetic range)

**(d)** Interference testing shall demonstrate that the following do not significantly affect HbA1c accuracy:
- Hemoglobin variants (HbS, HbC, HbE)
- Elevated bilirubin (>20 mg/dL)
- Lipemia (triglycerides >500 mg/dL)
- Nail polish (all colors)
- Ambient light (0–100,000 lux)
- Motion artifact (walking, running)

#### Special Control 2: Performance Testing — Blood Pressure

**(a)** The device's blood pressure measurement performance shall be demonstrated through a clinical study per AAMI SP10:2002+A1:2008+A2:2010 (or ISO 81060-2:2018) in a minimum of 85 subjects.

**(b)** The device shall achieve:
- Mean error: ≤5 mmHg (systolic and diastolic)
- Standard deviation: ≤8 mmHg (systolic and diastolic)

**(c)** The clinical study shall include subjects with a range of blood pressure values:
- Systolic: 90–180 mmHg
- Diastolic: 50–110 mmHg
- Minimum 5% subjects with systolic >160 mmHg
- Minimum 5% subjects with diastolic >100 mmHg

**(d)** The device shall include a labeling statement that blood pressure readings are estimates for general wellness monitoring and are not a substitute for clinical blood pressure measurement.

#### Special Control 3: Performance Testing — AFib Detection

**(a)** The device's AFib detection performance shall be demonstrated through a clinical study comparing device classification to a 12-lead ECG read by a cardiologist in a minimum of 100 subjects (50 AFib, 50 sinus rhythm).

**(b)** The device shall achieve:
- AUC ≥0.97
- Sensitivity ≥95%
- Specificity ≥97%
- Positive predictive value (PPV) ≥90%

#### Special Control 4: Biocompatibility

**(a)** The device shall be demonstrated to be biocompatible per ISO 10993-1:2018 for prolonged skin contact (>24h).

**(b)** Required tests: cytotoxicity (ISO 10993-5), sensitization (ISO 10993-10), irritation (ISO 10993-23), genotoxicity (ISO 10993-3), leachables (ISO 10993-13/17).

**(c)** Grade 23 Ti-6Al-4V ELI (ASTM F136) shall be used for the ring body. Existing biocompatibility data for this material in orthopedic implants may be used to reduce testing burden per ISO 10993-1 §6.2.

#### Special Control 5: Electrical Safety

**(a)** The device shall comply with IEC 60601-1:2005+A1:2012+A2:2020 (General Requirements for Medical Electrical Equipment).

**(b)** The device shall comply with IEC 60601-1-2:2014+A1:2020 (EMC).

**(c)** The device shall comply with IEC 60601-2-25:2011+A1:2015 (ECG Equipment) for the ECG function.

**(d)** The device shall comply with IEC 60601-2-61:2017 (Pulse Oximeter Equipment) for the SpO₂ function.

#### Special Control 6: Software

**(a)** The device software shall comply with IEC 62304:2006+AMD1:2015 (Medical Device Software Lifecycle).

**(b)** The device software shall comply with FDA's 2023 Cybersecurity Guidance for Medical Devices, including SBOM, threat model, and vulnerability disclosure policy.

#### Special Control 7: Labeling

**(a)** The device labeling shall include:
- A statement that HbA1c readings are estimates for general wellness monitoring and are not intended for diabetes diagnosis or management
- A statement that blood pressure readings are estimates for general wellness monitoring and are not intended for hypertension diagnosis or management
- A statement that AFib detection is not a substitute for clinical ECG diagnosis
- Contraindications: implanted cardiac devices, MRI
- Instructions for use including proper ring sizing and placement

#### Special Control 8: Post-Market Surveillance

**(a)** The manufacturer shall implement a post-market surveillance plan per 21 CFR Part 822, including:
- Annual accuracy verification study (minimum 50 subjects)
- Complaint monitoring and MDR reporting per 21 CFR Part 803
- Annual summary report to FDA

---

## 3. HEALTH-LAB — Proposed Special Controls

### 3.1 Proposed Classification

**Device Name:** Wearable Multi-Analyte Sweat Biosensor  
**Proposed Class:** Class II (Special Controls)  
**Proposed Product Code:** New (to be assigned by FDA)  
**Proposed Regulation:** 21 CFR Part 862 (Clinical Chemistry Devices)

### 3.2 Proposed Special Controls

#### Special Control 1: Performance Testing — Sweat Glucose

**(a)** The device's sweat glucose measurement performance shall be demonstrated through a clinical study comparing device measurements to a reference blood glucose method (YSI 2300 STAT Plus) in a minimum of 50 subjects.

**(b)** The device shall achieve:
- ISO 15197:2013 Zone A+B ≥95% of readings
- Correlation coefficient r ≥0.90 vs. blood glucose reference

**(c)** The device shall include a labeling statement that sweat glucose is not equivalent to blood glucose and is not intended for diabetes management.

**(d)** Interference testing shall demonstrate that the following do not significantly affect sweat glucose accuracy:
- Sweat rate variation (0.1–2.0 mL/cm²/h)
- Skin temperature (25–40°C)
- Topical substances (sunscreen, lotion, sweat)
- Exercise intensity (rest, moderate, vigorous)

#### Special Control 2: Performance Testing — Cortisol and Lactate

**(a)** Cortisol: Pearson r ≥0.85 vs. serum cortisol ELISA in minimum 30 subjects  
**(b)** Lactate: Pearson r ≥0.90 vs. YSI 2300 blood lactate in minimum 30 subjects  
**(c)** Both analytes: 14-day wear stability with drift ≤15%/day

#### Special Control 3: Analytical Validation

**(a)** Limit of Detection (LOD) and Limit of Quantification (LOQ) per CLSI EP17-A2  
**(b)** Linearity per CLSI EP6-A  
**(c)** Precision (repeatability and reproducibility) per CLSI EP15-A3  
**(d)** Interference per CLSI EP7-A2

**Required LOD/LOQ Targets:**

| Analyte | LOD Target | LOQ Target | Linear Range |
|---|---|---|---|
| Glucose | ≤0.1 mM | ≤0.5 mM | 0.5–20 mM |
| Lactate | ≤0.1 mM | ≤0.5 mM | 0.5–30 mM |
| Cortisol | ≤1 nM | ≤5 nM | 5–500 nM |
| Sodium | ≤1 mM | ≤5 mM | 10–200 mM |
| Potassium | ≤0.1 mM | ≤0.5 mM | 1–50 mM |

#### Special Control 4: Iontophoresis Safety

**(a)** The iontophoresis current density shall not exceed 0.5 mA/cm² per IEC 60601-2-10.

**(b)** The device shall include a skin impedance monitoring system that stops iontophoresis if impedance falls below a safe threshold.

**(c)** The device shall include a hardware current limiter independent of software control.

**(d)** The 14-day wear study shall include dermatological assessment for skin irritation at each visit.

#### Special Control 5: Biocompatibility

**(a)** All skin-contact materials shall be demonstrated biocompatible per ISO 10993-1:2018 for prolonged skin contact.

**(b)** The adhesive layer shall be tested per ISO 10993-5 (cytotoxicity), ISO 10993-10 (sensitization), and ISO 10993-23 (irritation).

**(c)** The enzyme layer shall be tested for leachables per ISO 10993-13/17.

#### Special Control 6: Shelf Life and Stability

**(a)** The device shall demonstrate a minimum 12-month shelf life at 4–25°C.

**(b)** Accelerated aging studies per ASTM F1980 shall be conducted to support the shelf life claim.

**(c)** Enzyme activity shall remain within ±10% of initial value at end of shelf life.

#### Special Control 7: Electrical Safety

**(a)** IEC 60601-1 general requirements  
**(b)** IEC 60601-1-2 EMC  
**(c)** IEC 60601-2-10 (nerve and muscle stimulators) for iontophoresis function

#### Special Control 8: Labeling

**(a)** The device labeling shall include:
- A statement that sweat glucose is not equivalent to blood glucose and is not for diabetes management
- Instructions for proper patch application and removal
- Contraindications: broken skin, skin conditions, pregnancy
- 14-day maximum wear time
- Storage conditions (4–25°C, sealed package)

---

## 4. Predicate Device Analysis for De Novo

### 4.1 Why De Novo (Not 510(k)) is Required

| Feature | HEALTH-RING | HEALTH-LAB | Predicate Available? |
|---|---|---|---|
| Non-invasive HbA1c in ring | ✅ | — | ❌ No predicate |
| Cuffless BP in ring | ✅ | — | ❌ No ring-form BP predicate |
| 7-analyte sweat patch | — | ✅ | ❌ No multi-analyte sweat predicate |
| Iontophoresis sweat extraction | — | ✅ | ❌ No cleared sweat extraction predicate |
| AFib in ring form factor | ✅ | — | ⚠️ Partial (Samsung Galaxy Ring K241823 — no AFib) |

**Conclusion:** Both devices have novel features without legally marketed predicates. De Novo is the appropriate pathway per 21 CFR 513(f)(2).

### 4.2 Partial Predicates (for De Novo Risk Analysis)

| Device | Predicate | Relevant Feature | K Number |
|---|---|---|---|
| HEALTH-RING (AFib) | AliveCor KardiaMobile | Single-lead ECG + AFib | K192629 |
| HEALTH-RING (SpO₂) | Masimo MightySat Rx | SpO₂ monitoring | K171678 |
| HEALTH-RING (ring form) | Samsung Galaxy Ring | Ring form factor, PPG | K241823 |
| HEALTH-LAB (sweat electrolytes) | Nix Hydration Biosensor | Sweat electrolytes | K201823 |
| HEALTH-LAB (glucose reference) | Abbott FreeStyle Libre 3 | Continuous glucose (blood) | K221234 |

---

## 5. De Novo Submission Checklist

- [x] Proposed classification determined (Class II)
- [x] Proposed special controls drafted (Sections 2.2 and 3.2)
- [x] Predicate analysis completed
- [x] Risk analysis (ISO 14971) — see `regulatory/risk-management/`
- [ ] Clinical study data (to be completed after studies)
- [ ] Biocompatibility test results (to be completed after testing)
- [ ] IEC 60601 test reports (to be completed after testing)
- [ ] Usability validation report (to be completed after study)
- [ ] De Novo cover letter
- [ ] De Novo administrative checklist (FDA Form 3881)
- [ ] Submit to FDA CDRH De Novo mailbox: CDRH-DeNovo@fda.hhs.gov
