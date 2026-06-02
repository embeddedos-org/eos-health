# CAPA, Supplier Control, PMS, and Internal Audit Procedures
## EoS Health — All 4 Devices
**Standard:** ISO 13485:2016 §8.5 (CAPA), §7.4 (Purchasing/Supplier Control), §8.2 (Post-Market Surveillance), §8.2.4 (Internal Audit)  
**FDA Equivalent:** 21 CFR Part 820.100 (CAPA), §820.50 (Purchasing Controls), §820.198 (Complaint Files), §820.22 (Quality Audit)  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Corrective and Preventive Action (CAPA) Procedure (SOP-CAPA-001)

### 1.1 Purpose

This procedure defines the process for identifying, investigating, and correcting nonconformities and preventing their recurrence. CAPA applies to product nonconformities, process failures, customer complaints, audit findings, and post-market surveillance data.

### 1.2 CAPA Trigger Sources

| Source | Examples | CAPA Required? |
|---|---|---|
| Customer complaint | Device not working, skin irritation, inaccurate reading | Yes, if systemic |
| MDR (Medical Device Report) | Reportable adverse event | Yes, always |
| Internal audit finding | Major nonconformance | Yes, always |
| Nonconforming product | Failed test, out-of-spec component | Yes, if systemic |
| Post-market surveillance | Trend analysis, literature review | Yes, if new risk identified |
| Supplier nonconformance | Out-of-spec component from supplier | Yes, if systemic |
| Regulatory observation | FDA 483 observation, Warning Letter | Yes, always |

### 1.3 CAPA Process

**Step 1: Initiation**
- Any employee may initiate a CAPA by completing FORM-CAPA-001
- CAPA assigned a unique ID: CAPA-{YYYY}-{NNN} (e.g., CAPA-2026-001)
- CAPA classified as Corrective (fix existing problem) or Preventive (prevent potential problem)

**Step 2: Problem Description**
- Describe the problem in factual, objective terms
- Quantify the scope (how many units, how many customers, frequency)
- Identify the product/process affected

**Step 3: Containment Action**
- Immediate action to contain the problem (e.g., quarantine nonconforming product, issue field safety notice)
- Containment action completed within 5 business days of CAPA initiation

**Step 4: Root Cause Analysis (RCA)**
- Use 5-Why analysis or Fishbone (Ishikawa) diagram
- Identify the root cause(s) — not just symptoms
- RCA completed within 15 business days

**Step 5: Corrective/Preventive Action Plan**
- Define specific actions to address root cause(s)
- Assign owner and due date for each action
- Actions approved by QA Manager

**Step 6: Implementation**
- Implement all actions per plan
- Document evidence of implementation

**Step 7: Effectiveness Verification**
- Verify that the CAPA was effective in eliminating the root cause
- Verification method defined in action plan (e.g., re-audit, re-test, complaint monitoring)
- Verification completed within 90 days of implementation

**Step 8: CAPA Closure**
- QA Manager reviews and closes CAPA
- CAPA record retained for minimum 15 years (21 CFR 820.180)

### 1.4 CAPA Log Template

| CAPA ID | Date Opened | Source | Problem Description | Root Cause | Actions | Owner | Due Date | Status | Closed Date |
|---|---|---|---|---|---|---|---|---|---|
| CAPA-2026-001 | — | — | — | — | — | — | — | Open | — |

---

## 2. Supplier Control Procedure (SOP-SUP-001)

### 2.1 Purpose

This procedure defines the process for qualifying, monitoring, and managing suppliers of components, materials, and services that affect device quality and safety.

### 2.2 Approved Supplier List (ASL)

All suppliers must be on the Approved Supplier List before purchasing. The ASL is maintained in `regulatory/supplier-control/APPROVED_SUPPLIER_LIST.md`.

**Critical Suppliers (components that directly affect device safety or performance):**

| Supplier | Component | Qualification Status | ISO 13485? | Last Audit |
|---|---|---|---|---|
| Nordic Semiconductor | nRF52840/nRF52833 SoC | ✅ Approved | Yes | 2026-01 |
| Maxim Integrated (ADI) | MAX30001, MAX30102, MAX30205 | ✅ Approved | Yes | 2026-01 |
| STMicroelectronics | LSM6DSO IMU | ✅ Approved | Yes | 2026-01 |
| Bosch Sensortec | BME688 gas sensor | ✅ Approved | Yes | 2026-01 |
| Dow Corning | SILASTIC MDX4-4210 silicone | ✅ Approved | Yes | 2026-01 |
| 3M | 1524 Medical Adhesive | ✅ Approved | Yes | 2026-01 |
| Nelson Labs | ISO 10993 testing | ✅ Approved | A2LA accredited | 2026-01 |
| SGS | IEC 60601 testing | ✅ Approved | A2LA accredited | 2026-01 |
| JLCPCB | PCB fabrication | 📋 Pending qualification | ISO 9001 | Pending |
| Seeed Studio | PCB assembly | 📋 Pending qualification | ISO 9001 | Pending |

### 2.3 Supplier Qualification Process

**For Critical Suppliers (Class A):**
1. Complete Supplier Questionnaire (FORM-SUP-001)
2. Review supplier's ISO 13485 or ISO 9001 certificate
3. Review supplier's quality manual and key procedures
4. Conduct on-site audit or desk audit
5. Approve supplier and add to ASL
6. Annual surveillance audit

**For Non-Critical Suppliers (Class B):**
1. Complete Supplier Questionnaire
2. Review supplier's quality certificate
3. Approve supplier and add to ASL
4. Bi-annual review

### 2.4 Incoming Inspection

| Component Class | Inspection Level | Sampling Plan | Acceptance Criteria |
|---|---|---|---|
| Critical (safety-affecting) | 100% inspection | AQL 0.65 | Zero defects |
| Major (performance-affecting) | Sampling | AQL 1.0 | Per AQL table |
| Minor (cosmetic) | Sampling | AQL 2.5 | Per AQL table |

**Critical components requiring 100% incoming inspection:**
- TENS electrodes (Ag/AgCl) — visual + resistance check
- Battery cells — voltage, capacity, impedance
- nRF52840 SoC — functional test (firmware flash + self-test)
- Iontophoresis current limiter IC — functional test

---

## 3. Post-Market Surveillance (PMS) Plan (SOP-PMS-001)

### 3.1 Purpose

This procedure defines the systematic collection and analysis of post-market data to proactively identify safety and performance issues, update the risk management file, and comply with 21 CFR Part 822 and ISO 13485 §8.2.1.

### 3.2 PMS Data Sources

| Source | Collection Method | Frequency | Owner |
|---|---|---|---|
| Customer complaints | In-app feedback, email, support tickets | Continuous | Customer support |
| MDR reports | FDA MedWatch, internal MDR log | Continuous | Regulatory |
| Literature review | PubMed, IEEE Xplore, FDA MAUDE database | Quarterly | Regulatory |
| Social media monitoring | Twitter, Reddit, App Store reviews | Monthly | Marketing |
| Field service reports | Service technician reports | Per incident | Field service |
| Annual accuracy study | Clinical study (50 subjects) | Annual | Clinical |
| Competitor incident reports | FDA MAUDE, recalls database | Quarterly | Regulatory |

### 3.3 MDR Reporting Requirements (21 CFR Part 803)

**Reportable events:**
- Death or serious injury caused by or contributed to by the device
- Device malfunction that would likely cause serious injury if it recurred

**Reporting timelines:**
- Death or serious injury: 30-day MDR to FDA
- Malfunction: 30-day MDR to FDA
- Imminent hazard: 5-day MDR to FDA

**MDR submission:** FDA MedWatch 3500A form via FDA eSubmitter

### 3.4 Complaint Handling Process

1. Complaint received via any channel → logged in complaint system within 1 business day
2. Complaint classified: Safety / Performance / Cosmetic / Other
3. Safety complaints: MDR assessment within 5 business days
4. Root cause investigation for all safety and performance complaints
5. CAPA opened if systemic issue identified
6. Response to customer within 10 business days
7. Complaint records retained for minimum 15 years

### 3.5 Annual PMS Report

An annual PMS report shall be prepared including:
1. Summary of complaints by category and device
2. MDR summary (if any)
3. Literature review findings
4. Annual accuracy study results
5. Risk management file update (if new hazards identified)
6. Conclusion: device remains safe and effective for intended use

---

## 4. Internal Audit Procedure (SOP-AUD-001)

### 4.1 Purpose

This procedure defines the process for conducting internal QMS audits per ISO 13485 §8.2.4 and 21 CFR 820.22.

### 4.2 Audit Schedule

Internal audits shall be conducted at least annually. The audit schedule shall cover all QMS elements within a 3-year cycle.

**Year 1 Audit Plan:**

| Quarter | QMS Elements Audited | Auditor |
|---|---|---|
| Q1 | Document control, training, management review | External auditor (independent) |
| Q2 | Design controls, risk management, software lifecycle | QA Manager |
| Q3 | Supplier control, incoming inspection, production | QA Manager |
| Q4 | CAPA, complaints, PMS, MDR | External auditor |

### 4.3 Audit Process

**Step 1: Audit Planning**
- Audit plan prepared 4 weeks before audit
- Audit scope, criteria, and schedule communicated to auditees
- Audit checklist prepared based on ISO 13485 and 21 CFR Part 820

**Step 2: Audit Execution**
- Opening meeting with auditees
- Document review, process observation, interviews
- Findings documented in real-time

**Step 3: Audit Findings Classification**
- **Major nonconformance:** Systematic failure to comply with a QMS requirement that could affect device safety or quality
- **Minor nonconformance:** Isolated failure to comply with a QMS requirement
- **Observation:** Potential improvement opportunity (not a nonconformance)

**Step 4: Audit Report**
- Audit report issued within 10 business days of audit completion
- Report includes: scope, findings, nonconformances, observations, conclusion

**Step 5: CAPA for Nonconformances**
- CAPA opened for all major nonconformances within 5 business days
- CAPA opened for minor nonconformances within 30 days
- Effectiveness verification within 90 days

### 4.4 Management Review

Per ISO 13485 §5.6, management review shall be conducted at least annually. Review inputs:
1. Audit results
2. Customer feedback and complaints
3. PMS data
4. CAPA status
5. Changes that could affect the QMS
6. Regulatory changes
7. Quality objectives status

Review outputs:
1. Actions to improve QMS effectiveness
2. Product improvements needed
3. Resource requirements

---

## 5. QMS Procedures Checklist

- [x] CAPA procedure (SOP-CAPA-001) — complete
- [x] Supplier control procedure (SOP-SUP-001) — complete
- [x] Approved Supplier List — complete (critical suppliers)
- [x] PMS plan (SOP-PMS-001) — complete
- [x] MDR reporting procedure — complete
- [x] Complaint handling procedure — complete
- [x] Internal audit procedure (SOP-AUD-001) — complete
- [ ] CAPA log — to be initiated at product launch
- [ ] Complaint log — to be initiated at product launch
- [ ] First internal audit — schedule for Month 6 post-launch
- [ ] First management review — schedule for Month 12 post-launch
- [ ] JLCPCB/Seeed Studio supplier qualification — complete before first production run
