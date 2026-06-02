# Post-Market Surveillance Plan
## EoS Health Platform — All 4 Devices
**Document ID:** EOS-PMS-001 | **Version:** 1.0 | **Date:** 2026-06-02  
**Regulatory Basis:** FDA 21 CFR Part 803 (MDR) | EU MDR 2017/745 Article 83–86 | ISO 13485 §8.2.1

---

## 1. Purpose and Scope

This Post-Market Surveillance (PMS) Plan defines the systematic processes for collecting, recording, and analysing data on the quality, performance, and safety of all four EoS Health devices throughout their commercial lifetime. The plan satisfies requirements under FDA 21 CFR Part 803, EU MDR Article 83, and ISO 13485 §8.2.1.

**Devices in scope:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB.

---

## 2. PMS Data Sources

| Source | Collection Method | Frequency | Owner |
|--------|------------------|-----------|-------|
| App crash reports | Firebase Crashlytics | Real-time | Engineering |
| User complaints | In-app feedback + support tickets | Continuous | Customer Success |
| Adverse event reports | FDA MedWatch, EUDAMED | As reported | Regulatory Affairs |
| Sensor accuracy drift | OTA telemetry (opt-in) | Weekly | Clinical |
| Literature surveillance | PubMed, IEEE Xplore alerts | Monthly | Clinical |
| Competitor safety alerts | FDA MAUDE, EUDAMED | Monthly | Regulatory Affairs |
| App store reviews | iOS App Store, Google Play | Weekly | Product |
| Clinical study follow-up | Study coordinators | Per protocol | Clinical |
| Returned devices | RMA analysis | Per return | Quality |

---

## 3. Key Performance Indicators (KPIs)

| KPI | Target | Alert Threshold | Action |
|-----|--------|-----------------|--------|
| Complaint rate | <0.1% of units sold | >0.5% | CAPA initiation |
| Serious adverse event rate | 0 | Any SAE | Immediate FDA/MDR report |
| SpO₂ ARMS drift | ≤2% | >2.5% | Field safety notice |
| HbA1c LoA drift | ≤±0.5% | >±0.7% | Algorithm update |
| BP LoA drift | ≤±8 mmHg | >±10 mmHg | Algorithm update |
| AFib AUC | ≥0.97 | <0.95 | Immediate investigation |
| App crash rate | <0.1% sessions | >1% | Engineering sprint |
| OTA update success rate | ≥99% | <95% | OTA system review |

---

## 4. Vigilance and Mandatory Reporting

### 4.1 FDA MDR Reporting (21 CFR Part 803)

| Event Type | Report Type | Deadline |
|------------|-------------|----------|
| Death caused by device | MDR (MedWatch 3500A) | 30 days |
| Serious injury caused by device | MDR (MedWatch 3500A) | 30 days |
| Malfunction likely to cause death/injury if recurrence | MDR (MedWatch 3500A) | 30 days |
| Imminent hazard to public health | MDR + FDA notification | 5 days |

### 4.2 EU MDR Vigilance (MDR Article 87)

| Event Type | Report Type | Deadline |
|------------|-------------|----------|
| Death or serious deterioration | Serious Incident Report (EUDAMED) | 15 days |
| Imminent risk to life | Serious Incident Report | 2 days |
| Non-serious incident trend | Periodic Summary Report | Quarterly |
| Field Safety Corrective Action | FSCA notification | Before action |

---

## 5. Periodic Reporting

| Report | Frequency | Audience | Template |
|--------|-----------|----------|----------|
| PSUR (EU MDR Article 86) | Annual (Class IIa/IIb) | Notified Body | `EU_MDR_TECHNICAL_FILE_INDEX.md §4` |
| Summary of Safety and Clinical Performance (SSCP) | Annual | Public (EUDAMED) | Separate document |
| FDA Annual Report (if required) | Annual | FDA | 21 CFR 803.33 |
| Internal PMS Review | Quarterly | Management | This plan |

---

## 6. Signal Detection and Trend Analysis

A signal is defined as any new or changed information that suggests a causal relationship between the device and an adverse event, or a change in the benefit-risk profile.

**Signal detection triggers:**
- Statistical process control (SPC) chart breach on any KPI
- Three or more complaints of the same type within 30 days
- Any single death or serious injury report
- Published peer-reviewed paper contradicting clinical claims
- Competitor recall for similar technology

**Signal investigation process:**
1. Signal identified → logged in CAPA system within 24 hours
2. Initial assessment within 5 business days
3. Root cause analysis within 30 days
4. Corrective action plan within 45 days
5. Effectiveness verification within 90 days

---

## 7. Literature Surveillance Protocol

Monthly automated searches of:
- PubMed: ("photoplethysmography" OR "PPG" OR "wearable ECG" OR "continuous glucose monitor") AND ("accuracy" OR "validation" OR "adverse event")
- IEEE Xplore: ("smart ring" OR "wearable biosensor") AND ("clinical validation")
- FDA MAUDE: device type codes DPS (ECG), DQO (pulse oximeter), NBW (glucose monitor)
- EUDAMED: equivalent device types

All papers are reviewed by the Clinical team within 30 days of publication. Papers that contradict EoS Health clinical claims trigger an immediate signal investigation.

---

## 8. Responsibilities

| Role | Responsibility |
|------|---------------|
| VP Regulatory Affairs | PMS plan owner, PSUR approval |
| Clinical Affairs Manager | Literature surveillance, clinical KPI monitoring |
| Quality Manager | CAPA system, complaint handling |
| Engineering Lead | Telemetry analysis, OTA monitoring |
| Customer Success | Complaint intake, user feedback |
| Legal Counsel | Adverse event reporting, EU AR coordination |

---

*Document Owner: EmbeddedOS Regulatory Affairs | Review Cycle: Annual*  
*Next Review: 2027-06-01 | Maintained in: `regulatory/pms/`*
