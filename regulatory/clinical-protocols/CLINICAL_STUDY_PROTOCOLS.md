# Clinical Study Protocols and Statistical Analysis Plans
## EoS Health — Priority Studies for FDA Submission
**Studies:** EOS-CL-001 through EOS-CL-005 (FDA-critical studies)  
**Framework:** ICH E6(R2) GCP, 21 CFR Part 50 (Informed Consent), 21 CFR Part 56 (IRB), 45 CFR Part 46 (Common Rule)  
**Date:** June 2026 | **Version:** 1.0

---

## Study EOS-CL-001: SpO₂ Accuracy Validation (HEALTH-KEY ULTRA and HEALTH-RING)

### Protocol Summary

**Title:** Validation of SpO₂ Accuracy of EoS Health HEALTH-KEY ULTRA and HEALTH-RING Against Co-Oximetry Reference During Induced Hypoxia  
**Study Type:** Prospective, single-center, non-randomized, interventional  
**Phase:** Device validation (not drug trial)  
**Regulatory Basis:** IEC 60601-2-61:2017 §201.12.1.101  
**IRB Category:** Expedited review (Category 6 — voice, video, digital, or image recordings)  
**ClinicalTrials.gov Registration:** Required before enrollment

### Objectives

**Primary:** Demonstrate that HEALTH-KEY ULTRA and HEALTH-RING SpO₂ measurements achieve ARMS ≤2% vs. arterial blood co-oximetry (reference standard) across the SpO₂ range of 70–100%.

**Secondary:** Demonstrate accuracy at low perfusion (PI ≥0.3%), response time ≤10 seconds, and performance across Fitzpatrick skin tones I–VI.

### Study Design

**Study Population:** Healthy adult volunteers, 18–50 years  
**Sample Size:** 10 subjects minimum (per IEC 60601-2-61 §201.12.1.101)  
**Recommended Sample Size:** 15 subjects to provide statistical robustness

**Inclusion Criteria:**
- Age 18–50 years
- Healthy (no cardiopulmonary disease)
- Fitzpatrick skin tone I–VI (minimum 2 subjects per tone)
- Non-smoker or ex-smoker (>1 year)
- BMI 18.5–35 kg/m²

**Exclusion Criteria:**
- Hemoglobin variants (HbS, HbC, HbE) — screen with hemoglobin electrophoresis
- Anemia (Hgb <10 g/dL)
- Peripheral vascular disease
- Nail polish or artificial nails
- Current smoker
- Pregnancy

### Procedures

1. **Screening:** Medical history, physical exam, hemoglobin electrophoresis, pulse oximetry baseline
2. **Arterial line placement:** Radial artery catheter by trained physician
3. **Hypoxia induction:** Controlled nitrogen/oxygen gas mixture via face mask
4. **SpO₂ levels:** 10 stable SpO₂ plateaus from 100% to 70% (10% decrements)
5. **Data collection:** Simultaneous EoS Health device reading + arterial blood sample at each plateau
6. **Recovery:** 100% O₂ until SpO₂ ≥98%

### Statistical Analysis Plan

**Primary Endpoint:** ARMS (Accuracy Root Mean Square)

$$ARMS = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(SpO_2^{device} - SpO_2^{reference})^2}$$

**Pass Criterion:** ARMS ≤2.0% across SpO₂ range 70–100%

**Secondary Endpoints:**
- Bias: Mean(SpO₂^device − SpO₂^reference)
- Precision: SD of differences
- Bland-Altman plot with 95% limits of agreement
- Performance by Fitzpatrick skin tone (subgroup analysis)
- Performance at low perfusion (PI ≥0.3%)

**Sample Size Justification:** Per IEC 60601-2-61, minimum 10 subjects with minimum 200 data points across 70–100% SpO₂ range. With 15 subjects × 10 plateaus = 150 paired measurements (supplemented by continuous data).

**Analysis Software:** R (version 4.3.0), packages: `BlandAltmanLeh`, `ggplot2`

### Timeline and Cost

| Activity | Timeline | Cost |
|---|---|---|
| IRB submission | Month 1 | $2,000 |
| IRB approval | Month 2 | — |
| ClinicalTrials.gov registration | Month 2 | Free |
| Subject recruitment | Month 3 | $3,000 |
| Study conduct (15 subjects) | Month 3–4 | $45,000 |
| Data analysis | Month 4–5 | $8,000 |
| Study report | Month 5–6 | $5,000 |
| **Total** | **6 months** | **$63,000** |

---

## Study EOS-CL-002: AFib Detection Validation (HEALTH-KEY ULTRA and HEALTH-RING)

### Protocol Summary

**Title:** Validation of Atrial Fibrillation Detection Accuracy of EoS Health HEALTH-KEY ULTRA and HEALTH-RING Against 12-Lead ECG Reference  
**Study Type:** Prospective, multi-center, non-randomized, observational  
**IRB Category:** Expedited review (Category 5 — research involving materials collected solely for non-research purposes)

### Objectives

**Primary:** Demonstrate that AFib detection achieves AUC ≥0.97, sensitivity ≥95%, and specificity ≥97% vs. 12-lead ECG read by a board-certified cardiologist.

### Study Design

**Study Population:** Adults with known AFib (confirmed by 12-lead ECG) and adults with sinus rhythm  
**Sample Size:** 200 subjects (100 AFib, 100 sinus rhythm)

**Sample Size Justification:** With 100 AFib and 100 sinus rhythm subjects, 95% CI for sensitivity of 95% is [88.6%, 98.4%] and for specificity of 97% is [91.5%, 99.4%]. This provides sufficient precision for FDA submission.

**Inclusion Criteria (AFib group):**
- Age ≥18 years
- Confirmed AFib on 12-lead ECG at time of enrollment
- Paroxysmal, persistent, or permanent AFib

**Inclusion Criteria (Sinus rhythm group):**
- Age ≥18 years
- Confirmed sinus rhythm on 12-lead ECG at time of enrollment

**Exclusion Criteria:**
- Pacemaker or ICD
- Severe peripheral vascular disease
- Unable to provide informed consent

### Procedures

1. 12-lead ECG recorded by cardiologist (reference standard)
2. EoS Health device recording (30-second single-lead ECG)
3. Cardiologist reads 12-lead ECG blinded to device result
4. Device algorithm classifies ECG as AFib or non-AFib
5. Comparison of device classification vs. cardiologist classification

### Statistical Analysis Plan

**Primary Endpoints:**
- AUC (Area Under ROC Curve) with 95% CI (DeLong method)
- Sensitivity = TP/(TP+FN) with 95% CI (Clopper-Pearson)
- Specificity = TN/(TN+FP) with 95% CI (Clopper-Pearson)
- PPV = TP/(TP+FP) with 95% CI
- NPV = TN/(TN+FN) with 95% CI

**Pass Criteria:**
- AUC ≥0.97 (lower bound of 95% CI ≥0.95)
- Sensitivity ≥95% (lower bound of 95% CI ≥90%)
- Specificity ≥97% (lower bound of 95% CI ≥93%)

**Analysis Software:** R, packages: `pROC`, `epiR`

### Timeline and Cost

| Activity | Timeline | Cost |
|---|---|---|
| IRB submission (2 sites) | Month 1 | $4,000 |
| IRB approval | Month 2–3 | — |
| Subject recruitment (200) | Month 3–6 | $20,000 |
| Study conduct | Month 3–8 | $80,000 |
| Data analysis | Month 8–9 | $10,000 |
| Study report | Month 9–10 | $8,000 |
| **Total** | **10 months** | **$122,000** |

---

## Study EOS-CL-003: HbA1c Accuracy Validation (HEALTH-RING)

### Protocol Summary

**Title:** Validation of Non-Invasive HbA1c Estimation Accuracy of EoS Health HEALTH-RING Against HPLC Reference Method  
**Study Type:** Prospective, single-center, non-randomized, observational  
**Regulatory Basis:** De Novo Special Control 1 (Section 2.2 of FDA_DE_NOVO_SPECIAL_CONTROLS.md)

### Objectives

**Primary:** Demonstrate that HEALTH-RING HbA1c estimation achieves ARMS ≤0.5% HbA1c units and bias ≤0.3% vs. Tosoh G8 HPLC (NGSP-certified reference).

### Study Design

**Study Population:** Adults with a range of HbA1c values (4.0%–14.0%), including diabetic and non-diabetic subjects  
**Sample Size:** 200 subjects

**Sample Size Justification:** With 200 subjects spanning HbA1c 4.0–14.0%, the study provides sufficient power to demonstrate ARMS ≤0.5% with 95% confidence. Based on pilot data showing ARMS = 0.44% (simulated), 200 subjects provides 90% power to demonstrate ARMS ≤0.5% with α = 0.05.

**Required Distribution:**
- HbA1c <5.7% (normal): ≥30 subjects
- HbA1c 5.7–6.4% (prediabetes): ≥40 subjects
- HbA1c ≥6.5% (diabetes): ≥80 subjects (minimum 30% per De Novo special control)
- HbA1c >10% (poorly controlled): ≥20 subjects
- Fitzpatrick skin tone I–VI: minimum 20 subjects per tone

**Inclusion Criteria:**
- Age 18–80 years
- Stable HbA1c (no change >1% in past 3 months)
- Fitzpatrick skin tone I–VI

**Exclusion Criteria:**
- Hemoglobin variants (HbS, HbC, HbE) — screen with hemoglobin electrophoresis
- Anemia (Hgb <8 g/dL)
- Recent blood transfusion (<3 months)
- Pregnancy
- Nail polish or artificial nails

### Procedures

1. Venous blood draw for HPLC HbA1c measurement (reference)
2. HEALTH-RING HbA1c estimation (3 consecutive readings, average)
3. Interference testing: repeat in subset of 30 subjects with nail polish, 30 with elevated bilirubin

### Statistical Analysis Plan

**Primary Endpoints:**
- ARMS vs. HPLC reference
- Bias (mean difference)
- Precision (SD of differences)
- Bland-Altman plot with 95% limits of agreement

**Pass Criteria:**
- ARMS ≤0.5% HbA1c units
- Bias ≤0.3% HbA1c units
- 95% limits of agreement within ±1.0% HbA1c units

**Subgroup Analysis:**
- By HbA1c range (normal, prediabetes, diabetes)
- By Fitzpatrick skin tone
- By BMI (normal, overweight, obese)
- By age (18–40, 41–60, 61–80)

### Timeline and Cost

| Activity | Timeline | Cost |
|---|---|---|
| IRB submission | Month 1 | $2,000 |
| IRB approval | Month 2 | — |
| HPLC reference lab contract | Month 2 | $5,000 |
| Subject recruitment (200) | Month 3–8 | $40,000 |
| Study conduct | Month 3–10 | $120,000 |
| Data analysis | Month 10–11 | $15,000 |
| Study report | Month 11–12 | $10,000 |
| **Total** | **12 months** | **$192,000** |

---

## Study EOS-CL-004: Blood Pressure Accuracy Validation (HEALTH-RING)

### Protocol Summary

**Title:** Validation of Cuffless Blood Pressure Estimation Accuracy of EoS Health HEALTH-RING Against Auscultatory Reference per AAMI SP10  
**Study Type:** Prospective, single-center, non-randomized, observational  
**Regulatory Basis:** De Novo Special Control 2 (AAMI SP10:2002+A1:2008+A2:2010 or ISO 81060-2:2018)

### Objectives

**Primary:** Demonstrate that HEALTH-RING BP estimation achieves mean error ≤5 mmHg and SD ≤8 mmHg (systolic and diastolic) vs. auscultatory reference per AAMI SP10.

### Study Design

**Sample Size:** 85 subjects (per AAMI SP10 minimum requirement)

**Required BP Distribution (AAMI SP10 Table 1):**
- Systolic <100 mmHg: ≥5 subjects
- Systolic 100–139 mmHg: ≥30 subjects
- Systolic 140–159 mmHg: ≥15 subjects
- Systolic ≥160 mmHg: ≥5 subjects
- Diastolic <60 mmHg: ≥5 subjects
- Diastolic 60–79 mmHg: ≥20 subjects
- Diastolic 80–89 mmHg: ≥20 subjects
- Diastolic ≥90 mmHg: ≥10 subjects

### Procedures

1. Subject seated, 5-minute rest
2. Reference: 3 auscultatory BP measurements by trained observer (average = reference)
3. HEALTH-RING: 3 consecutive BP estimations (average = device reading)
4. Repeat at 3 time points: morning, afternoon, evening (3 days)

### Statistical Analysis Plan

**Primary Endpoints (AAMI SP10 §5.2):**
- Mean error (device − reference) for systolic and diastolic
- SD of errors for systolic and diastolic

**Pass Criteria:**
- Mean error ≤5 mmHg (systolic and diastolic)
- SD ≤8 mmHg (systolic and diastolic)

**Additional Analysis:**
- Bland-Altman plot
- Subgroup analysis by hypertension status
- Subgroup analysis by Fitzpatrick skin tone

### Timeline and Cost

| Activity | Timeline | Cost |
|---|---|---|
| IRB submission | Month 1 | $2,000 |
| IRB approval | Month 2 | — |
| Subject recruitment (85) | Month 3–5 | $17,000 |
| Study conduct | Month 3–7 | $60,000 |
| Data analysis | Month 7–8 | $10,000 |
| Study report | Month 8–9 | $8,000 |
| **Total** | **9 months** | **$97,000** |

---

## Study EOS-CL-005: Sweat Glucose Accuracy Validation (HEALTH-LAB)

### Protocol Summary

**Title:** Validation of Sweat Glucose Monitoring Accuracy of EoS Health HEALTH-LAB Against Blood Glucose Reference During Exercise and Rest  
**Study Type:** Prospective, single-center, non-randomized, observational  
**Regulatory Basis:** De Novo Special Control 1 for HEALTH-LAB (ISO 15197:2013)

### Objectives

**Primary:** Demonstrate that HEALTH-LAB sweat glucose monitoring achieves ISO 15197:2013 Zone A+B ≥95% vs. YSI 2300 STAT Plus blood glucose reference.

**Secondary:** Demonstrate correlation r ≥0.90 between sweat glucose and blood glucose, and 14-day wear stability with drift ≤15%/day.

### Study Design

**Study Population:** Adults with a range of blood glucose values (70–400 mg/dL), including diabetic and non-diabetic subjects  
**Sample Size:** 50 subjects (per De Novo special control)

**Inclusion Criteria:**
- Age 18–70 years
- Able to perform moderate exercise (stationary bike)
- Minimum 20 subjects with diabetes (Type 1 or Type 2)
- Minimum 10 subjects with blood glucose >200 mg/dL at some point during study

### Procedures

1. HEALTH-LAB patch applied to upper arm
2. Finger-stick blood glucose (YSI 2300 reference) every 15 minutes
3. Exercise protocol: 30 minutes moderate cycling (60–70% max HR) to induce sweating
4. Data collection: 4-hour session (rest + exercise + recovery)
5. Repeat at Days 1, 7, and 14 to assess drift

### Statistical Analysis Plan

**Primary Endpoint:** ISO 15197:2013 Clarke Error Grid Analysis (EGA)

**Pass Criterion:** ≥95% of paired readings in Zone A+B of Clarke Error Grid

**Secondary Endpoints:**
- Pearson r vs. blood glucose
- Bland-Altman analysis
- Drift analysis (Day 1 vs. Day 7 vs. Day 14 ARMS)

**Pass Criteria (secondary):**
- Pearson r ≥0.90
- Drift ≤15%/day (ARMS increase per day)

### Timeline and Cost

| Activity | Timeline | Cost |
|---|---|---|
| IRB submission | Month 1 | $2,000 |
| IRB approval | Month 2 | — |
| YSI reference lab setup | Month 2 | $10,000 |
| Subject recruitment (50) | Month 3–5 | $15,000 |
| Study conduct (50 subjects × 3 visits) | Month 3–8 | $75,000 |
| Data analysis | Month 8–9 | $12,000 |
| Study report | Month 9–10 | $8,000 |
| **Total** | **10 months** | **$122,000** |

---

## Clinical Studies Summary

| Study | Device | FDA Requirement | Sample Size | Timeline | Cost |
|---|---|---|---|---|---|
| EOS-CL-001: SpO₂ | KEY ULTRA + RING | IEC 60601-2-61 | 15 subjects | 6 months | $63,000 |
| EOS-CL-002: AFib | KEY ULTRA + RING | 510(k) performance | 200 subjects | 10 months | $122,000 |
| EOS-CL-003: HbA1c | RING | De Novo special control | 200 subjects | 12 months | $192,000 |
| EOS-CL-004: BP | RING | De Novo special control | 85 subjects | 9 months | $97,000 |
| EOS-CL-005: Glucose | LAB | De Novo special control | 50 subjects | 10 months | $122,000 |
| EOS-CL-006: TENS efficacy | BAND Neuro | FTC substantiation | 60 subjects | 8 months | $85,000 |
| EOS-CL-007: HbA1c 14-day | RING | De Novo PMS | 30 subjects | 6 months | $45,000 |
| EOS-CL-008: Cortisol | LAB | De Novo special control | 30 subjects | 6 months | $55,000 |
| EOS-CL-009: Sleep staging | RING | FTC substantiation | 40 subjects | 8 months | $80,000 |
| EOS-CL-010: Usability | All 4 | IEC 60601-1-6 | 60 subjects | 4 months | $40,000 |
| **Total** | | | **770 subjects** | **32 months** | **$901,000** |

**Critical Path:** EOS-CL-001 (SpO₂) → EOS-CL-002 (AFib) can run in parallel. EOS-CL-003 (HbA1c) is the longest study (12 months) and determines the De Novo submission date for HEALTH-RING.

---

## IRB Submission Checklist (All Studies)

- [x] Study protocols drafted (EOS-CL-001 through EOS-CL-005)
- [x] Statistical analysis plans complete
- [x] Informed consent templates drafted
- [x] Inclusion/exclusion criteria defined
- [x] Sample size justifications complete
- [ ] IRB application forms completed (site-specific)
- [ ] Investigator CVs collected
- [ ] Site agreements executed
- [ ] ClinicalTrials.gov registrations submitted (before enrollment)
- [ ] IRB approvals received
- [ ] Study initiation visits conducted
- [ ] First subject enrolled
