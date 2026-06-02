# EoS Health — Quality Management System (QMS)
**Standard:** ISO 13485:2016 + FDA 21 CFR Part 820 (QSR)  
**Version:** 1.0 | **Date:** June 2026  
**Applies to:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB

---

## 1. Quality Manual

### 1.1 Scope
This QMS applies to the design, development, production, and post-market surveillance of all EoS Health medical devices. EoS Health, Inc. is committed to consistently meeting customer and regulatory requirements for safe and effective medical devices.

### 1.2 Quality Policy
EoS Health designs and manufactures wearable health monitoring devices that are safe, effective, and compliant with all applicable regulatory requirements. We commit to continuous improvement of our QMS and the safety of our products.

### 1.3 Quality Objectives
- Zero critical defects escaping to market
- ≤0.1% field complaint rate in first 12 months
- 100% on-time regulatory submission
- Annual internal QMS audit with zero major non-conformances

---

## 2. Design History File (DHF) Structure

Each device maintains a Design History File containing:

| DHF Section | Document | Status |
|---|---|---|
| Design and Development Plan | `devices/{device}/hardware/Hardware_Architecture.md` | ✅ |
| Design Input | `devices/{device}/README.md` (specs section) | ✅ |
| Design Output | `devices/{device}/hardware/pcb/*.kicad_sch` + BOM | ✅ |
| Design Review Records | `verification/VERIFICATION_REPORT.md` | ✅ |
| Design Verification | `verification/` + `simulation/` + `prototype/` | ✅ |
| Design Validation | `clinical/` (IRB protocol + analysis pipeline) | 📋 In progress |
| Design Transfer | `prototype/hardware-l3/PRODUCTION_FLASHING_WALKTHROUGH.md` | ✅ |
| Design Changes | Git commit history (all changes tracked) | ✅ |

---

## 3. Document Control Procedure (SOP-001)

**Purpose:** Ensure all QMS documents are reviewed, approved, and version-controlled.

**Procedure:**
1. All documents created in `/home/ubuntu/eos-health/` repository
2. Version control via Git — every change requires a commit message
3. Document approval: pull request review by QA Lead before merge to `main`
4. Obsolete documents: archived in `archive/` branch, never deleted
5. Document numbering: `{category}-{number}-{revision}` (e.g., SOP-001-A)

**Document Categories:**
- SOP: Standard Operating Procedure
- WI: Work Instruction
- FORM: Form/Template
- SPEC: Specification
- PLAN: Plan document

---

## 4. Risk Management File (ISO 14971:2019)

### Risk Management Process (per device)

**Step 1 — Hazard Identification**

| Hazard | Device | Potential Harm | P1 (before) | S | RPN | Control | P1 (after) | RPN (after) |
|---|---|---|---|---|---|---|---|---|
| Incorrect ECG reading | KEY ULTRA, RING | Missed AFib diagnosis | 3 | 4 | 12 | Algorithm validation + disclaimer | 2 | 8 |
| False low SpO₂ | KEY ULTRA | Delayed hypoxia treatment | 2 | 5 | 10 | Dark skin correction + disclaimer | 1 | 5 |
| TENS overcurrent | BAND Neuro | Skin burn, cardiac risk | 2 | 5 | 10 | Hardware current limiter + SW interlock | 1 | 5 |
| Incorrect glucose | HEALTH-LAB | Insulin dosing error | 3 | 5 | 15 | ISO 15197 validation + "not for dosing" label | 2 | 10 |
| Battery thermal runaway | All | Fire, burn | 1 | 5 | 5 | BMS with OTP + NTC thermal cutoff | 1 | 5 |
| BLE data breach | All | PHI exposure | 2 | 3 | 6 | AES-128 BLE + TLS 1.3 | 1 | 3 |
| Allergic reaction (adhesive) | HEALTH-LAB | Skin sensitization | 2 | 2 | 4 | ISO 10993-10 sensitization testing | 1 | 2 |
| NFC charging overcharge | HEALTH-RING | Battery damage | 2 | 2 | 4 | BQ25155 charge termination | 1 | 2 |

*P1 = Probability (1=rare, 5=frequent) | S = Severity (1=negligible, 5=catastrophic) | RPN = P×S*

**Residual Risk Acceptability:** All post-control RPNs ≤10 are acceptable per ISO 14971 ALARP principle.

---

## 5. CAPA Procedure (SOP-002)

**Purpose:** Identify, investigate, and eliminate causes of non-conformances.

**Trigger Events:**
- Customer complaint
- Internal audit finding
- Adverse event report
- OTA update failure
- Clinical validation deviation

**CAPA Process:**
1. **Initiation:** Log in CAPA register within 5 business days of trigger
2. **Investigation:** Root cause analysis (5-Why or Fishbone) within 30 days
3. **Action Plan:** Corrective and/or preventive actions defined within 45 days
4. **Implementation:** Actions completed within 90 days
5. **Effectiveness Check:** Verify action resolved root cause within 180 days
6. **Closure:** QA Lead approves closure

---

## 6. Supplier Qualification Procedure (SOP-003)

### Approved Supplier List (ASL)

| Supplier | Component | Qualification Status | Audit Frequency |
|---|---|---|---|
| Nordic Semiconductor | nRF52840, nRF52833 | ✅ ISO 9001 certified | Annual |
| Maxim Integrated (ADI) | MAX30101, MAX32666 | ✅ ISO 9001 certified | Annual |
| Texas Instruments | AFE4900, BQ25155, INA219 | ✅ ISO 9001 certified | Annual |
| Bosch Sensortec | BMI270 IMU | ✅ ISO 9001 certified | Annual |
| JLCPCB | PCB fabrication | 📋 Qualification in progress | Semi-annual |
| Seeed Studio | PCB assembly | 📋 Qualification in progress | Semi-annual |
| Digi-Key Electronics | Component distribution | ✅ ISO 9001 certified | Annual |
| Mouser Electronics | Component distribution | ✅ ISO 9001 certified | Annual |

**Qualification Criteria:**
- ISO 9001 or ISO 13485 certification preferred
- On-time delivery ≥95%
- Incoming inspection failure rate ≤0.5%
- Counterfeit component prevention program

---

## 7. Production SOPs

### SOP-004: PCB Assembly and Inspection

1. Receive PCBs from JLCPCB — inspect for warpage, soldermask defects, dimension check
2. Incoming component inspection — verify part numbers, date codes, lot traceability
3. SMT assembly — reflow profile per IPC-7711/7721
4. AOI (Automated Optical Inspection) — 100% boards
5. X-ray inspection — BGA components (if applicable)
6. Electrical test — continuity, shorts, power-on test
7. Firmware flashing — `eos_bringup.py` + `flash_all_devices.sh`
8. Factory test — `run_l3_verification.py` (15 tests, 3–5 min)
9. Calibration — `factory_calibration.py` (per-unit sensor calibration)
10. Final inspection — visual, label, packaging
11. Record — serial number, test results, calibration data in production database

### SOP-005: Firmware Release

1. Feature freeze and code review (pull request)
2. Run full test suite: `python3 verification/run_all_checks.py`
3. Run corner case tests: `python3 verification/test_corner_cases.py`
4. Build release: `python3 firmware/build-system/eos_release.py --device {device} --version {version}`
5. Sign OTA package with Ed25519 private key (HSM-stored)
6. Stage to OTA server — 1% canary rollout for 48 hours
7. Monitor crash rates and error logs
8. Full rollout if canary passes

---

## 8. Post-Market Surveillance Plan (SOP-006)

### Complaint Handling

1. Complaints received via: app feedback, support email, app store reviews, MDR reports
2. All complaints logged in complaint database within 2 business days
3. MDR-reportable events (serious injury, malfunction that could cause injury) reported to FDA within 30 days (MDR 21 CFR Part 803)
4. Trend analysis: monthly review of complaint rates by device and complaint type

### Post-Market Clinical Follow-Up (PMCF)

- Annual review of published literature on wearable health monitoring
- Annual review of adverse event databases (MAUDE, EUDAMED)
- User satisfaction survey (annual, n≥100 per device)
- Real-world performance data: algorithm accuracy vs. clinical reference (annual, n≥50)

### Periodic Safety Update Report (PSUR)

- Frequency: Annual (CE MDR requirement)
- Content: Complaint summary, PMCF results, benefit-risk assessment, labeling review

---

## 9. Internal Audit Procedure (SOP-007)

**Frequency:** Annual  
**Scope:** All QMS elements (ISO 13485 Sections 4–8)  
**Auditor:** Independent (not responsible for area being audited)

**Audit Schedule:**
- Q1: Design controls + risk management
- Q2: Production + supplier controls
- Q3: Post-market surveillance + CAPA
- Q4: Document control + management review

**Non-Conformance Handling:** All audit findings entered into CAPA system within 5 business days.

---

## 10. Management Review Procedure (SOP-008)

**Frequency:** Annual  
**Participants:** CEO, QA Lead, Regulatory Lead, Engineering Lead

**Agenda:**
1. QMS performance metrics (complaint rate, CAPA status, audit findings)
2. Regulatory status (FDA, CE, FCC)
3. Post-market surveillance summary
4. Resource requirements
5. Quality objectives review
6. Opportunities for improvement

**Output:** Management review minutes, updated quality objectives, resource allocation decisions
