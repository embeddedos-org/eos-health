# EoS Health — Institutional Review Board (IRB) Protocol
## Clinical Validation Study for All 4 EoS Health Devices

**Protocol Number:** EOS-CLIN-2026-001  
**Version:** 1.0  
**Date:** June 1, 2026  
**Principal Investigator:** [PI Name], MD/PhD  
**Sponsor:** EoS Health (EmbeddedOS Organization)  
**Study Sites:** [University Hospital / Research Center]

---

## 1. Background and Rationale

EoS Health has developed four wearable medical-grade biosensing devices that collectively monitor over 40 physiological parameters. Before commercial deployment and regulatory submission, each device requires clinical validation against medical-grade reference instruments in a controlled study population. This protocol governs the validation of all four devices in a single unified study to maximize efficiency and minimize participant burden.

The four devices under investigation are:

| Device | Form Factor | Key Novel Claims | Regulatory Pathway |
|---|---|---|---|
| HEALTH-KEY ULTRA | USB-C pendant | ECG, SpO₂, BAC, UV | FDA 510(k) / CE MDR Class IIa |
| HEALTH-BAND Neuro | Wristband | sEMG, EDA, TENS | FDA 510(k) / CE MDR Class IIa |
| HEALTH-RING | Titanium ring | HbA1c, cuffless BP, AFib | FDA De Novo / CE MDR Class IIb |
| HEALTH-LAB | Biosensor patch | Glucose, lactate, cortisol | FDA De Novo / CE MDR Class IIb |

The HEALTH-RING and HEALTH-LAB require De Novo pathways because no substantially equivalent predicate device exists for non-invasive HbA1c measurement from a ring or multi-analyte continuous sweat biosensing.

---

## 2. Study Objectives

### Primary Objectives

**HEALTH-KEY ULTRA:**
- Validate ECG rhythm classification accuracy vs. 12-lead Holter monitor (AHA EC11 standard)
- Validate SpO₂ accuracy vs. co-oximetry (ISO 80601-2-61: ARMS ≤2%)
- Validate BAC estimation vs. breathalyzer (Dräger Alcotest 9510)

**HEALTH-BAND Neuro:**
- Validate sEMG signal fidelity vs. clinical EMG system (Noraxon Ultium)
- Validate EDA stress response vs. Empatica E4 (Pearson r ≥0.85)
- Validate TENS therapeutic efficacy vs. sham control (VAS pain scale)

**HEALTH-RING:**
- Validate HbA1c estimation vs. laboratory HbA1c (NGSP/IFCC, ±0.5% absolute)
- Validate cuffless blood pressure vs. validated sphygmomanometer (IEEE 1708: Grade A)
- Validate AFib detection vs. 12-lead ECG (sensitivity ≥95%, specificity ≥97%)

**HEALTH-LAB:**
- Validate continuous glucose monitoring vs. YSI 2900 biochemistry analyzer (ISO 15197: 95% within ±15%)
- Validate sweat lactate vs. venous lactate (Pearson r ≥0.90)
- Validate sweat cortisol vs. serum cortisol (Pearson r ≥0.80)

### Secondary Objectives
- Assess user comfort and wearability (validated comfort scale, 7-day wear)
- Measure skin irritation and adverse events (CTCAE v5.0)
- Evaluate data completeness and dropout rate
- Assess battery life under real-world conditions

---

## 3. Study Design

**Design:** Prospective, single-arm, observational validation study with concurrent reference measurements.

**Duration:** 12 months total (3 months enrollment, 7 days per participant, 2 months analysis)

**Sample Size Calculation:**

For SpO₂ (ISO 80601-2-61): Minimum 10 healthy subjects, 5 desaturation levels (70–100%), 15 measurements per level = 750 paired measurements. With 20% dropout: **n=12 subjects**.

For HbA1c (primary endpoint): Assuming σ=0.4%, δ=0.5%, α=0.05, power=80%: n=26. With 20% dropout: **n=32 subjects** with diabetes.

For AFib detection: Assuming prevalence 30% in target population, sensitivity 95%, specificity 97%, CI width 5%: **n=200 subjects** (mixed AF/sinus rhythm).

For glucose (ISO 15197): Minimum 50 subjects, 3 measurements/day × 7 days = 1,050 paired measurements. **n=60 subjects** with diabetes.

**Total enrollment target: 250 participants** across all sub-studies.

---

## 4. Participant Eligibility

### Inclusion Criteria (All Sub-Studies)
- Age 18–75 years
- Able to provide written informed consent
- Able to comply with study procedures
- Willing to wear devices for 7 consecutive days

### Exclusion Criteria (All Sub-Studies)
- Active implanted cardiac device (pacemaker, ICD, neurostimulator)
- Known allergy to titanium, silicone, or medical-grade adhesive
- Active skin condition at device wear sites (eczema, psoriasis, open wounds)
- Pregnancy or breastfeeding
- Participation in another interventional study within 30 days
- BMI >40 kg/m² (affects PPG signal quality)

### Sub-Study Specific Inclusion

**HbA1c Sub-Study (HEALTH-RING):**
- Diagnosed Type 1 or Type 2 diabetes mellitus
- HbA1c range 5.5–12.0% (to ensure adequate dynamic range)
- Stable diabetes management for ≥3 months

**Glucose Sub-Study (HEALTH-LAB):**
- Diagnosed Type 1 or Type 2 diabetes mellitus
- Using continuous glucose monitoring (CGM) or self-monitoring blood glucose
- Willing to perform 4 fingerstick glucose measurements per day

**AFib Sub-Study (HEALTH-RING):**
- Known paroxysmal or persistent atrial fibrillation (confirmed by ECG)
- OR age ≥65 with ≥2 CHADS₂-VASc risk factors (control group)

---

## 5. Study Procedures

### Screening Visit (Day -7 to Day 0)
1. Review inclusion/exclusion criteria
2. Obtain written informed consent
3. Medical history and physical examination
4. Baseline laboratory tests:
   - HbA1c (NGSP-certified laboratory)
   - Fasting glucose, insulin, lipid panel
   - Complete blood count, comprehensive metabolic panel
   - Serum cortisol (8 AM draw)
5. 12-lead ECG (Holter setup for AFib sub-study)
6. Validated blood pressure measurement (3 readings, 5-min intervals)
7. Device fitting and training

### Day 1 — Device Initialization
1. Apply all assigned devices:
   - HEALTH-RING: fitted to non-dominant index or middle finger
   - HEALTH-BAND Neuro: worn on non-dominant wrist
   - HEALTH-KEY ULTRA: worn as pendant
   - HEALTH-LAB: applied to upper arm (posterior surface)
2. Verify BLE connectivity to Health Hub app
3. Baseline sensor readings with concurrent reference measurements
4. Participant training on app and data review

### Days 1–7 — Continuous Monitoring
**Daily procedures (participant home-based):**
- Morning: body weight, blood pressure (validated home monitor)
- 4× daily: fingerstick glucose (glucose sub-study only)
- Continuous: all device sensors active 24/7
- Evening: app review of daily summary, adverse event diary

**Clinic visits (Days 2, 4, 7):**
- Concurrent reference measurements (see Section 6)
- Adverse event review
- Device inspection and data download

### Day 7 — Final Visit
1. Device removal
2. Final concurrent reference measurements
3. Skin inspection (CTCAE v5.0 grading)
4. Comfort questionnaire
5. Final laboratory tests
6. Data download and device return

---

## 6. Reference Measurement Procedures

### ECG Reference (HEALTH-KEY ULTRA, HEALTH-RING)
- **Device:** Mortara H3+ 12-lead Holter monitor
- **Duration:** 24-hour continuous recording
- **Analysis:** Certified cardiac electrophysiologist, blinded to EoS device output
- **Rhythm classification:** Normal sinus rhythm, AFib, AFL, SVT, VT, PVC, PAC

### SpO₂ Reference (HEALTH-KEY ULTRA)
- **Device:** Masimo Radical-7 co-oximeter (gold standard)
- **Protocol:** Controlled desaturation study (healthy subjects only)
  - Inspired O₂ reduced from 21% to 14% in 5 steps
  - 15 paired measurements per desaturation level
  - Arterial blood gas at each level for co-oximetry

### Blood Pressure Reference (HEALTH-RING)
- **Device:** Omron HEM-9000AI (IEEE 1708 Grade A validated)
- **Protocol:** 3 measurements, 5-min intervals, seated position
- **Timing:** Concurrent with HEALTH-RING cuffless measurement

### HbA1c Reference (HEALTH-RING)
- **Device:** Bio-Rad D-10 HPLC analyzer (NGSP-certified, CV <1%)
- **Timing:** Baseline, Day 4, Day 7 (3 paired measurements per participant)
- **Sample:** Venous blood draw, EDTA tube

### Glucose Reference (HEALTH-LAB)
- **Device:** YSI 2900 biochemistry analyzer (±2% accuracy)
- **Protocol:** Venous blood draw concurrent with HEALTH-LAB reading
- **Timing:** Fasting, 1h post-meal, 2h post-meal, bedtime (4×/day × 7 days)

### Lactate Reference (HEALTH-LAB)
- **Device:** YSI 2900 (lactate channel)
- **Protocol:** Venous blood draw concurrent with HEALTH-LAB sweat reading
- **Timing:** Rest, 5 min exercise, 15 min exercise, 30 min recovery

### Cortisol Reference (HEALTH-LAB)
- **Device:** Elecsys Cortisol II immunoassay (Roche, CV <3%)
- **Timing:** 8 AM, 12 PM, 4 PM, 8 PM (4×/day × 3 days)

### sEMG Reference (HEALTH-BAND Neuro)
- **Device:** Noraxon Ultium EMG (16-bit, 2000 Hz, CMRR >100 dB)
- **Protocol:** Standardized muscle activation protocol
  - Wrist flexion/extension at 25%, 50%, 75%, 100% MVC
  - 5 repetitions per level, 5-second contractions

### EDA Reference (HEALTH-BAND Neuro)
- **Device:** Empatica E4 (validated research device)
- **Protocol:** Standardized stress induction (Trier Social Stress Test)
- **Concurrent wear:** HEALTH-BAND Neuro and E4 on contralateral wrists

---

## 7. Statistical Analysis Plan

### Primary Endpoints

**Bland-Altman Analysis** (continuous measurements: SpO₂, BP, HbA1c, glucose):
- Mean bias ± 95% limits of agreement
- Proportional bias test (regression of difference on mean)
- Acceptable: bias <1 unit, LoA within ±2× clinical decision threshold

**Sensitivity/Specificity** (classification: AFib, arrhythmia):
- Receiver Operating Characteristic (ROC) curve
- Area Under Curve (AUC) with 95% CI
- Optimal threshold by Youden's J statistic
- Acceptable: sensitivity ≥95%, specificity ≥97%, AUC ≥0.97

**Pearson Correlation** (continuous biomarkers: lactate, cortisol, EDA):
- Pearson r with 95% CI
- Lin's Concordance Correlation Coefficient (CCC)
- Acceptable: r ≥0.85, CCC ≥0.80

**ISO 15197 Grid Analysis** (glucose):
- Clarke Error Grid Analysis
- Acceptable: ≥95% in Zone A+B

### Sample Size Justification
All sample sizes calculated at α=0.05, power=80%, with 20% dropout buffer. See Section 3.

### Subgroup Analyses
- Age groups: 18–40, 41–60, 61–75
- Sex: male/female
- BMI: <25, 25–30, >30
- Fitzpatrick skin type: I–III vs. IV–VI (PPG accuracy)
- Diabetes status (where applicable)

### Missing Data
- Multiple imputation for <10% missing data
- Complete case analysis as sensitivity analysis
- Per-protocol and intention-to-treat populations reported

---

## 8. Safety Monitoring

### Adverse Events
All adverse events graded per CTCAE v5.0:
- Grade 1: Mild skin irritation (expected, monitor)
- Grade 2: Moderate skin reaction (remove device, treat, report)
- Grade 3: Severe skin reaction (remove, treat, report to IRB within 24h)
- Grade 4: Life-threatening (immediate medical attention, report within 24h)

### Data Safety Monitoring Board (DSMB)
- 3-member DSMB (biostatistician, cardiologist, dermatologist)
- Reviews safety data after every 50 participants
- Stopping rules: >5% Grade 3+ adverse events, >2 serious adverse events

### TENS Safety (HEALTH-BAND Neuro)
- Maximum charge density: 50 µC/phase (IEC 60601-1 limit)
- Automatic shutoff if impedance <200 Ω (electrode detachment)
- Contraindicated in participants with cardiac devices (excluded)

---

## 9. Data Management and Privacy

### Data Collection
- Primary: Health Hub app (encrypted, HIPAA-compliant)
- Secondary: REDCap electronic data capture system
- Reference: Laboratory information system (LIS)

### HIPAA Compliance
- All participant data de-identified at source
- Participant ID assigned at enrollment (no PHI in research database)
- Data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Access controls: role-based, minimum necessary
- Data retention: 15 years per FDA 21 CFR Part 11

### Data Sharing
- Anonymized dataset to be shared on PhysioNet after publication
- No commercial use of participant data without separate consent

---

## 10. Regulatory Compliance

| Regulation | Requirement | Compliance |
|---|---|---|
| FDA 21 CFR Part 50 | Informed consent | Written consent form (Appendix A) |
| FDA 21 CFR Part 56 | IRB review | Full board review required |
| FDA 21 CFR Part 11 | Electronic records | REDCap + audit trail |
| HIPAA Privacy Rule | PHI protection | De-identification at source |
| ICH E6(R2) | Good Clinical Practice | GCP training required for all staff |
| ISO 14155:2020 | Clinical investigation of medical devices | Full compliance |
| 45 CFR Part 46 | Common Rule | Full board review |

---

## 11. Ethical Considerations

### Risk-Benefit Assessment
**Risks:** Mild skin irritation from adhesive (HEALTH-LAB, expected 5–15%), minor discomfort from ring wear, rare BLE interference. No ionizing radiation, no blood draws beyond routine clinical care.

**Benefits:** Participants receive 7 days of comprehensive health monitoring at no cost, including ECG, glucose, and blood pressure data. Potential early detection of undiagnosed AFib or diabetes.

**Conclusion:** Risks are minimal and manageable. Benefits include direct participant benefit and societal benefit from validated wearable health technology.

### Vulnerable Populations
- Diabetic participants: extra care with glucose monitoring, hypoglycemia protocol
- Elderly (>65): simplified app interface, caregiver assistance permitted
- No minors, prisoners, or cognitively impaired participants

---

## 12. Publication Plan

Results will be submitted to:
1. **npj Digital Medicine** (primary: HbA1c, glucose)
2. **Journal of the American College of Cardiology** (primary: AFib detection)
3. **IEEE Transactions on Biomedical Engineering** (primary: sEMG, sensor fusion)
4. **Diabetes Care** (primary: glucose, HbA1c combined)

All results will be reported regardless of outcome (positive or negative) per CONSORT/STROBE guidelines.

---

## Appendix A — Informed Consent Form

*(Full ICF text — see `clinical/INFORMED_CONSENT_FORM.md`)*

## Appendix B — Adverse Event Reporting Form

*(See `clinical/ADVERSE_EVENT_FORM.md`)*

## Appendix C — Statistical Analysis Plan (Full)

*(See `clinical/STATISTICAL_ANALYSIS_PLAN.md`)*

---

*Protocol version 1.0 — June 1, 2026*  
*This document is confidential and intended for IRB review only.*
