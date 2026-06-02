# Clinical Validation Submission Checklist
## EoS Health — All 4 Devices
**Frameworks:** FDA 21 CFR Part 50 (Informed Consent), 21 CFR Part 56 (IRB), ICH E6(R2) GCP, ISO 14155:2020 (Clinical Investigation of Medical Devices), ClinicalTrials.gov (42 CFR Part 11)  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Overview

Clinical validation studies are required to support the FDA De Novo classification requests for HEALTH-RING (HbA1c, blood pressure, AFib) and HEALTH-LAB (sweat glucose, cortisol, lactate), and to strengthen the 510(k) submissions for HEALTH-KEY ULTRA (SpO₂ accuracy) and HEALTH-BAND Neuro (sEMG, TENS efficacy). All studies must comply with FDA 21 CFR Parts 50 and 56, ICH E6(R2) Good Clinical Practice (GCP), and ISO 14155:2020.

**Study Portfolio Summary:**

| Study ID | Device | Primary Endpoint | Design | n | IRB Type |
|---|---|---|---|---|---|
| EOS-CL-001 | HEALTH-KEY ULTRA | SpO₂ ARMS ≤2% vs. co-oximeter | Cross-sectional, desaturation | 10 | Commercial IRB |
| EOS-CL-002 | HEALTH-KEY ULTRA | AFib AUC ≥0.97 vs. 12-lead ECG | Case-control | 100 | Commercial IRB |
| EOS-CL-003 | HEALTH-BAND Neuro | sEMG correlation r ≥0.95 vs. Delsys | Cross-sectional | 30 | Commercial IRB |
| EOS-CL-004 | HEALTH-BAND Neuro | TENS pain VAS reduction ≥30% | RCT, crossover | 40 | Commercial IRB |
| EOS-CL-005 | HEALTH-RING | HbA1c ARMS ≤0.5% vs. Tosoh G8 HPLC | Cross-sectional | 200 | Commercial IRB |
| EOS-CL-006 | HEALTH-RING | BP accuracy ±5/±8 mmHg vs. auscultatory | Cross-sectional, AAMI SP10 | 85 | Commercial IRB |
| EOS-CL-007 | HEALTH-RING | AFib AUC ≥0.97 vs. 12-lead ECG | Case-control | 100 | Commercial IRB |
| EOS-CL-008 | HEALTH-LAB | Sweat glucose ISO 15197 Zone A+B ≥95% | Cross-sectional | 50 | Commercial IRB |
| EOS-CL-009 | HEALTH-LAB | Cortisol Pearson r ≥0.85 vs. serum ELISA | Cross-sectional | 30 | Commercial IRB |
| EOS-CL-010 | HEALTH-LAB | 14-day wear stability, drift ≤15%/day | Longitudinal | 20 | Commercial IRB |

---

## 2. IRB Submission Process

### 2.1 IRB Selection

EoS Health will use a **commercial (central) IRB** rather than an institutional IRB to enable multi-site enrollment and faster review timelines.

**Recommended Commercial IRBs:**

| IRB | Contact | Typical Initial Review | Cost Estimate |
|---|---|---|---|
| WCG IRB (formerly Schulman) | irb@wcgclinical.com | 2–4 weeks | $3,000–$8,000/study |
| Advarra IRB | irb@advarra.com | 2–4 weeks | $3,000–$8,000/study |
| WIRB-Copernicus Group (WCG) | wirb@wcgclinical.com | 2–4 weeks | $3,000–$8,000/study |
| Salus IRB | irb@salusirb.com | 1–3 weeks | $2,500–$6,000/study |

**Recommendation:** Engage WCG IRB or Advarra for all 10 studies under a single master agreement to reduce per-study costs.

### 2.2 IRB Submission Package (Per Study)

Each IRB submission must include:

| Document | Description | Template Location |
|---|---|---|
| Protocol | Full study protocol per ICH E6(R2) | `clinical/protocols/EOS-CL-XXX_PROTOCOL.md` |
| Informed Consent Form (ICF) | Plain language, ≤8th grade reading level | `clinical/icf/EOS-CL-XXX_ICF.md` |
| Investigator CV | PI and sub-investigators | Provided by site |
| Site qualifications | Facility and equipment description | Provided by site |
| Sponsor information | EoS Health company information | `regulatory/master/COMPANY_PROFILE.md` |
| Device description | Device description and intended use | Relevant datasheet |
| Risk-benefit analysis | ISO 14971 risk summary | `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md` |
| Statistical analysis plan | SAP with sample size justification | `clinical/sap/EOS-CL-XXX_SAP.md` |
| Data management plan | CRF design, data entry, monitoring | `clinical/dmp/EOS-CL-XXX_DMP.md` |
| Adverse event reporting plan | AE/SAE definitions and reporting timelines | `clinical/ae/AE_REPORTING_PLAN.md` |

### 2.3 IRB Checklist

- [ ] Select commercial IRB and execute master agreement
- [ ] Prepare protocol for each study (see Section 4)
- [ ] Prepare ICF for each study (see Section 5)
- [ ] Collect PI and sub-investigator CVs
- [ ] Prepare site qualification documentation
- [ ] Submit initial IRB application for all 10 studies
- [ ] Respond to IRB queries (typically 1–2 rounds)
- [ ] Receive IRB approval letter for each study
- [ ] Submit annual continuing review reports
- [ ] Submit protocol amendments as needed

---

## 3. ClinicalTrials.gov Registration

All interventional studies (EOS-CL-004 TENS RCT) and studies of FDA-regulated devices must be registered on ClinicalTrials.gov per 42 CFR Part 11 and FDAAA 801.

### 3.1 Registration Requirements

| Requirement | Description | Deadline |
|---|---|---|
| Registration | Register before first patient enrolled | Before enrollment begins |
| Results reporting | Report results within 12 months of primary completion | 12 months post-completion |
| Protocol amendments | Update registration within 30 days | Within 30 days of amendment |
| Responsible party | EoS Health (sponsor-investigator) | At registration |

### 3.2 ClinicalTrials.gov Registration Checklist

- [ ] Create ClinicalTrials.gov account at https://register.clinicaltrials.gov
- [ ] Register EOS-CL-004 (TENS RCT) — required by FDAAA 801
- [ ] Register EOS-CL-005 (HbA1c) — recommended for De Novo support
- [ ] Register EOS-CL-006 (BP) — recommended for De Novo support
- [ ] Register EOS-CL-007 (AFib) — recommended for De Novo support
- [ ] Register EOS-CL-008 (sweat glucose) — recommended for De Novo support
- [ ] Verify all required data elements per 42 CFR §11.28
- [ ] Submit results within 12 months of primary completion date

### 3.3 Required Registration Data Elements

| Element | Description |
|---|---|
| Brief title | Plain language study title |
| Official title | Full scientific title |
| Study type | Interventional or Observational |
| Primary purpose | Treatment, Diagnostic, Device Feasibility |
| Intervention | Device name, model, description |
| Primary outcome | Primary endpoint with time frame |
| Secondary outcomes | Secondary endpoints with time frames |
| Eligibility criteria | Inclusion/exclusion criteria |
| Enrollment target | Planned sample size |
| Study locations | Site name, city, country |
| Sponsor | EoS Health |
| Responsible party | Sponsor-Investigator |

---

## 4. Study Protocol Templates

### 4.1 Protocol Structure (ICH E6(R2) / ISO 14155:2020)

Each protocol must include the following sections:

1. **Title page** — Protocol ID, version, date, sponsor, PI
2. **Synopsis** — One-page summary of objectives, design, endpoints, sample size
3. **Background and rationale** — Literature review, device description, rationale for study
4. **Objectives** — Primary and secondary objectives
5. **Study design** — Design type, duration, number of sites
6. **Study population** — Inclusion/exclusion criteria, recruitment strategy
7. **Study procedures** — Visit schedule, procedures at each visit, device use instructions
8. **Primary and secondary endpoints** — Definitions, measurement methods, time points
9. **Statistical analysis plan** — Sample size, analysis methods, handling of missing data
10. **Safety monitoring** — AE/SAE definitions, reporting timelines, stopping rules
11. **Data management** — CRF design, data entry, quality control
12. **Ethical considerations** — ICF process, privacy, IRB oversight
13. **References**

### 4.2 Key Protocol Parameters by Study

| Study | Design | Duration | Visits | Primary Endpoint | Reference Standard |
|---|---|---|---|---|---|
| EOS-CL-001 (SpO₂) | Cross-sectional | 1 day | 1 | ARMS ≤2% (70–100% SpO₂) | CO-oximeter (Radiometer ABL800) |
| EOS-CL-002 (AFib) | Case-control | 1 day | 1 | AUC ≥0.97 | 12-lead ECG (cardiologist read) |
| EOS-CL-005 (HbA1c) | Cross-sectional | 1 day | 1 | ARMS ≤0.5% | Tosoh G8 HPLC |
| EOS-CL-006 (BP) | Cross-sectional | 1 day | 3 (AAMI SP10) | ±5/±8 mmHg | Auscultatory (trained observer) |
| EOS-CL-008 (glucose) | Cross-sectional | 1 day | 4 | ISO 15197 Zone A+B ≥95% | YSI 2300 glucose analyzer |
| EOS-CL-010 (wear) | Longitudinal | 14 days | 5 | Drift ≤15%/day | YSI 2300 (daily reference) |

---

## 5. Informed Consent Form (ICF) Requirements

### 5.1 Required ICF Elements (21 CFR §50.25)

- [ ] Statement that study involves research
- [ ] Description of procedures (experimental vs. standard)
- [ ] Reasonably foreseeable risks and discomforts
- [ ] Reasonably expected benefits (to subject or others)
- [ ] Alternative procedures or treatments
- [ ] Confidentiality of records
- [ ] Compensation for injury (if applicable)
- [ ] Contact information (questions about research, rights, injury)
- [ ] Participation is voluntary; right to withdraw
- [ ] Statement that FDA may inspect records

### 5.2 ICF Readability Requirements

- Reading level: ≤8th grade (Flesch-Kincaid Grade Level ≤8)
- Language: Plain English (no medical jargon without explanation)
- Length: ≤8 pages recommended
- Format: Large font (≥12 pt), clear headings, white space

---

## 6. Data Collection SOPs

### 6.1 Standard Operating Procedures Required

| SOP | Description | Owner |
|---|---|---|
| SOP-001 | Device preparation and calibration | Clinical operations |
| SOP-002 | Subject screening and enrollment | Site coordinator |
| SOP-003 | Informed consent process | PI |
| SOP-004 | Device application and use | Clinical operations |
| SOP-005 | Reference standard measurement | Clinical operations |
| SOP-006 | Data entry and CRF completion | Data management |
| SOP-007 | Adverse event identification and reporting | PI |
| SOP-008 | Protocol deviation reporting | PI |
| SOP-009 | Sample handling and storage | Clinical operations |
| SOP-010 | Study close-out | Clinical operations |

### 6.2 Data Management Requirements

| Requirement | Description | Tool |
|---|---|---|
| Electronic data capture | 21 CFR Part 11 compliant EDC system | REDCap or Medidata Rave |
| Audit trail | All data entries logged with timestamp and user | EDC system |
| Data validation | Range checks, logic checks, missing data alerts | EDC system |
| Data backup | Daily automated backup | EDC system |
| Data lock | After all queries resolved | Data management |
| Statistical analysis | Per SAP, blinded where applicable | R or SAS |

---

## 7. Statistical Analysis Plan (SAP) Templates

### 7.1 SAP Structure

Each SAP must include:

1. **Study objectives** — Primary and secondary
2. **Endpoints** — Definitions and measurement methods
3. **Sample size calculation** — Power, alpha, effect size, dropout rate
4. **Analysis populations** — ITT, PP, safety
5. **Primary analysis** — Statistical method, software, significance level
6. **Secondary analyses** — Methods for each secondary endpoint
7. **Handling of missing data** — Imputation method or sensitivity analysis
8. **Subgroup analyses** — Pre-specified subgroups (age, sex, BMI, disease status)
9. **Safety analysis** — AE/SAE tabulation, severity, relatedness

### 7.2 Sample Size Justifications

| Study | Primary Endpoint | Expected Value | Margin | Power | Alpha | n |
|---|---|---|---|---|---|---|
| EOS-CL-001 (SpO₂) | ARMS | 0.44% | ≤2.0% | 80% | 0.05 | 10 (per ISO 80601-2-61) |
| EOS-CL-002 (AFib) | AUC | 0.97 | ≥0.97 | 80% | 0.05 | 100 (50 AFib, 50 sinus) |
| EOS-CL-005 (HbA1c) | ARMS | 0.35% | ≤0.5% | 80% | 0.05 | 200 |
| EOS-CL-006 (BP) | Mean error | ±3/±5 mmHg | ±5/±8 mmHg | 80% | 0.05 | 85 (AAMI SP10 minimum) |
| EOS-CL-008 (glucose) | % in Zone A+B | 97% | ≥95% | 80% | 0.05 | 50 |

---

## 8. Adverse Event Reporting

### 8.1 AE/SAE Definitions

**Adverse Event (AE):** Any untoward medical occurrence in a study subject, whether or not related to the investigational device.

**Serious Adverse Event (SAE):** Any AE that results in death, life-threatening condition, hospitalization, disability, congenital anomaly, or requires medical/surgical intervention.

**Device-Related AE:** AE for which there is a reasonable possibility that the device caused or contributed to the event.

**Unanticipated Adverse Device Effect (UADE):** Any serious adverse effect on health or safety or any life-threatening problem or death caused by, or associated with, a device, if that effect, problem, or death was not previously identified in nature, severity, or degree of incidence in the investigational plan or application.

### 8.2 Reporting Timelines

| Event Type | Report To | Timeline |
|---|---|---|
| UADE | FDA (MedWatch) + IRB | Within 10 working days |
| SAE (device-related) | FDA + IRB + Sponsor | Within 10 working days |
| SAE (not device-related) | IRB + Sponsor | Within 15 calendar days |
| AE (non-serious) | Sponsor | At next scheduled visit or monthly |
| Protocol deviation | IRB + Sponsor | Within 5 working days |

---

## 9. Cost and Timeline Summary

| Activity | Estimated Cost | Timeline |
|---|---|---|
| IRB submissions (10 studies) | $30,000–$80,000 | 4–8 weeks per study |
| ClinicalTrials.gov registration | $0 (free) | 1–2 weeks |
| Protocol development (10 studies) | $50,000–$100,000 | 8–12 weeks |
| ICF development (10 studies) | $10,000–$20,000 | 4–6 weeks |
| SOP development | $20,000–$40,000 | 6–8 weeks |
| EDC system setup (REDCap) | $5,000–$15,000 | 4–6 weeks |
| Clinical study conduct (all 10) | $500,000–$1,500,000 | 12–24 months |
| Statistical analysis (all 10) | $50,000–$100,000 | 4–8 weeks post-enrollment |
| Clinical study report (all 10) | $50,000–$100,000 | 8–12 weeks post-analysis |
| **Total** | **$715,000–$1,955,000** | **18–36 months** |

> **Cost reduction strategies:**
> 1. Combine EOS-CL-002 and EOS-CL-007 (both AFib studies) into a single multi-device study
> 2. Use academic medical center as study site (lower per-subject costs vs. commercial CRO)
> 3. Use REDCap (free for academic sites) instead of commercial EDC

---

## 10. Master Clinical Validation Checklist

### Pre-Study
- [ ] Select commercial IRB (WCG or Advarra)
- [ ] Develop protocols for all 10 studies
- [ ] Develop ICFs for all 10 studies
- [ ] Develop SAPs for all 10 studies
- [ ] Develop SOPs (SOP-001 through SOP-010)
- [ ] Set up EDC system (REDCap)
- [ ] Submit IRB applications for all 10 studies
- [ ] Register interventional studies on ClinicalTrials.gov
- [ ] Receive IRB approvals

### During Study
- [ ] Screen and enroll subjects per protocol
- [ ] Collect data per SOPs
- [ ] Enter data into EDC within 24 hours of collection
- [ ] Report AEs/SAEs per timelines above
- [ ] Submit annual continuing review to IRB
- [ ] Monitor data quality (site monitoring visits)

### Post-Study
- [ ] Lock database after all queries resolved
- [ ] Conduct statistical analysis per SAP
- [ ] Write clinical study report (per ISO 14155:2020 Annex H)
- [ ] Update ClinicalTrials.gov with results
- [ ] Include clinical evidence in FDA submission package
- [ ] Archive all study records for ≥15 years (21 CFR Part 812)
