# NIST Cybersecurity Framework 2.0 Compliance Mapping
## EoS Health — All 4 Devices + Cloud Backend
**Framework:** NIST CSF 2.0 (February 2024)  
**FDA Alignment:** FDA 2023 Cybersecurity Guidance for Medical Devices  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Executive Summary

This document maps all EoS Health cybersecurity controls to the NIST Cybersecurity Framework (CSF) 2.0 six core functions: **Govern (GV)**, **Identify (ID)**, **Protect (PR)**, **Detect (DE)**, **Respond (RS)**, and **Recover (RC)**. It also aligns with FDA's 2023 Cybersecurity Guidance for Medical Devices and supports the FDA 510(k) and De Novo submissions.

**Scope:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB firmware and cloud backend.

---

## 2. GOVERN (GV) — Cybersecurity Risk Management Strategy

### GV.OC — Organizational Context

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| GV.OC-01 | Organizational mission understood | EoS Health mission: democratize health monitoring | ✅ Implemented |
| GV.OC-02 | Internal/external stakeholders identified | Users, clinicians, developers, regulators | ✅ Implemented |
| GV.OC-03 | Legal/regulatory requirements understood | FDA, FCC, HIPAA, FTC, IEC 60601 | ✅ Documented |
| GV.OC-04 | Critical objectives and dependencies identified | BLE, cloud backend, mobile app | ✅ Documented |
| GV.OC-05 | Outcomes and priorities established | Patient safety > data privacy > availability | ✅ Documented |

### GV.RM — Risk Management Strategy

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| GV.RM-01 | Risk management policy established | See `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md` | ✅ Documented |
| GV.RM-02 | Risk appetite and tolerance defined | ALARP principle per ISO 14971 | ✅ Documented |
| GV.RM-03 | Cybersecurity risk management integrated into ERM | ISO 13485 QMS + cybersecurity plan | ✅ Documented |
| GV.RM-04 | Strategic direction for cybersecurity risk management | Annual security review cycle | ✅ Documented |
| GV.RM-06 | Policies, processes, and procedures established | See `regulatory/cybersecurity/CYBERSECURITY_MANAGEMENT_PLAN.md` | ✅ Documented |
| GV.RM-07 | Strategic opportunities considered | Open-source hardware increases community scrutiny | ✅ Considered |

### GV.SC — Cybersecurity Supply Chain Risk Management

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| GV.SC-01 | Supply chain risk management policy | SBOM maintained per NTIA minimum elements | ✅ Implemented |
| GV.SC-02 | Cybersecurity requirements established for suppliers | Nordic Semiconductor, Maxim, Bosch evaluated | ✅ Documented |
| GV.SC-04 | Suppliers screened | All IC vendors are Tier-1 with public security advisories | ✅ Verified |
| GV.SC-06 | Planning/due diligence for critical suppliers | nRF52840 security advisory subscription active | ✅ Active |
| GV.SC-07 | Risks from suppliers managed | SBOM updated on each firmware release | ✅ Implemented |
| GV.SC-09 | Suppliers assessed for compliance | Nordic Semiconductor PSA Certified Level 2 | ✅ Verified |

---

## 3. IDENTIFY (ID) — Asset Management and Risk Assessment

### ID.AM — Asset Management

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| ID.AM-01 | Hardware inventoried | All 4 devices with BOM in `hardware/*/bom/` | ✅ Complete |
| ID.AM-02 | Software inventoried | SBOM in `regulatory/cybersecurity/CYBERSECURITY_MANAGEMENT_PLAN.md` | ✅ Complete |
| ID.AM-03 | Network/communication flows mapped | BLE → mobile app → cloud backend (TLS 1.3) | ✅ Documented |
| ID.AM-04 | External systems catalogued | Cloud backend (AWS), mobile app stores (Apple, Google) | ✅ Documented |
| ID.AM-05 | Resources prioritized | Patient safety data highest priority | ✅ Documented |
| ID.AM-07 | Inventories of data and corresponding metadata | PHI data flows documented in HIPAA package | ✅ Documented |
| ID.AM-08 | Systems/hardware/software/services managed throughout lifecycle | MCUboot OTA with Ed25519 signing | ✅ Implemented |

### ID.RA — Risk Assessment

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| ID.RA-01 | Vulnerabilities identified and documented | CVE monitoring via NVD for all dependencies | ✅ Active |
| ID.RA-02 | Cyber threat intelligence received | Nordic Security Advisory mailing list | ✅ Active |
| ID.RA-03 | Internal/external threats identified | Threat model in Cybersecurity Management Plan | ✅ Documented |
| ID.RA-04 | Potential impacts and likelihoods determined | STRIDE threat model with CVSS scoring | ✅ Documented |
| ID.RA-05 | Threats, vulnerabilities, likelihoods, impacts used to understand risk | Risk matrix in ISO 13485 QMS | ✅ Documented |
| ID.RA-06 | Risk responses identified and prioritized | CAPA process in QMS | ✅ Documented |
| ID.RA-07 | Changes and exceptions managed | Change control procedure in QMS | ✅ Documented |
| ID.RA-08 | Processes for receiving/analyzing/responding to vulnerability disclosures | security@embeddedos.com + 90-day disclosure policy | ✅ Implemented |
| ID.RA-09 | Authenticity and integrity of hardware/software verified | Ed25519 firmware signing + MCUboot verification | ✅ Implemented |
| ID.RA-10 | Critical suppliers/third parties monitored | Nordic, Maxim, Bosch advisories monitored | ✅ Active |

---

## 4. PROTECT (PR) — Safeguards

### PR.AA — Identity Management, Authentication, and Access Control

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| PR.AA-01 | Identities and credentials managed | BLE pairing with Ed25519 device identity | ✅ Implemented |
| PR.AA-02 | Identities proofed and bound to credentials | Device provisioning with unique Ed25519 keypair per device | ✅ Implemented |
| PR.AA-03 | Users, services, hardware authenticated | BLE bonding + cloud JWT authentication | ✅ Implemented |
| PR.AA-04 | Identity assertions protected | JWT signed with RS256, 15-min expiry | ✅ Implemented |
| PR.AA-05 | Access permissions managed | Role-based access: user, clinician, admin | ✅ Implemented |
| PR.AA-06 | Physical access managed | Sealed titanium (RING), IP68 enclosures | ✅ Implemented |

### PR.AT — Awareness and Training

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| PR.AT-01 | Personnel informed and trained | Security training for all engineers (annual) | 📋 Planned |
| PR.AT-02 | Privileged users trained | Admin access training for cloud infrastructure | 📋 Planned |

### PR.DS — Data Security

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| PR.DS-01 | Data at rest protected | AES-256 encryption for stored health data | ✅ Implemented |
| PR.DS-02 | Data in transit protected | TLS 1.3 for all cloud communications | ✅ Implemented |
| PR.DS-10 | Data in use protected | Secure enclave for keys (nRF52840 CryptoCell-310) | ✅ Implemented |
| PR.DS-11 | Backups maintained | Cloud database daily backups with 30-day retention | ✅ Implemented |

### PR.IR — Technology Infrastructure Resilience

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| PR.IR-01 | Networks protected | BLE bonding prevents unauthorized pairing | ✅ Implemented |
| PR.IR-02 | Surveillance technologies managed | No surveillance — health data only | ✅ N/A |
| PR.IR-03 | Technology infrastructure managed | MCUboot dual-bank OTA with rollback | ✅ Implemented |
| PR.IR-04 | Adequate resource capacity ensured | 64 MB flash buffer for data resilience | ✅ Implemented |

### PR.PS — Platform Security

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| PR.PS-01 | Configuration management | Firmware config locked at provisioning | ✅ Implemented |
| PR.PS-02 | Software maintained | OTA update system with Ed25519 verification | ✅ Implemented |
| PR.PS-03 | Computers/hardware managed | Hardware BOM with component lifecycle tracking | ✅ Implemented |
| PR.PS-04 | Log records generated/protected | Crash logs with HMAC integrity protection | ✅ Implemented |
| PR.PS-05 | Installation/execution of unauthorized software prevented | MCUboot signature verification blocks unsigned firmware | ✅ Implemented |
| PR.PS-06 | Secure software development practices followed | MISRA C 2012, static analysis (cppcheck), 51/51 tests | ✅ Implemented |

---

## 5. DETECT (DE) — Anomalies and Events

### DE.AE — Adverse Event Analysis

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| DE.AE-02 | Potentially adverse events analyzed | Anomaly detection in health algorithms (AFib, SpO₂ drop) | ✅ Implemented |
| DE.AE-03 | Information correlated from multiple sources | Sensor fusion algorithm correlates ECG + PPG + IMU | ✅ Implemented |
| DE.AE-04 | Estimated impact and scope of adverse events | Severity classification in CAPA system | ✅ Documented |
| DE.AE-06 | Information on adverse events communicated | Alert system in mobile app + cloud dashboard | ✅ Implemented |
| DE.AE-07 | Cyber threat intelligence and other information integrated | CVE monitoring integrated into release process | ✅ Implemented |
| DE.AE-08 | Incidents declared when adverse events meet criteria | Incident response procedure in Cybersecurity Plan | ✅ Documented |

### DE.CM — Continuous Monitoring

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| DE.CM-01 | Networks monitored | Cloud backend network monitoring (AWS CloudWatch) | ✅ Implemented |
| DE.CM-03 | Personnel activity monitored | Admin access logs with audit trail | ✅ Implemented |
| DE.CM-06 | External service provider activities monitored | Nordic, AWS security advisories monitored | ✅ Active |
| DE.CM-09 | Computing hardware/software monitored | Firmware integrity check on boot (MCUboot) | ✅ Implemented |

---

## 6. RESPOND (RS) — Incident Response

### RS.MA — Incident Management

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| RS.MA-01 | Incident response plan executed | See Cybersecurity Management Plan §6 | ✅ Documented |
| RS.MA-02 | Incident reports triaged | security@embeddedos.com triage within 24 hours | ✅ Documented |
| RS.MA-03 | Incidents categorized and prioritized | CVSS scoring + patient safety impact assessment | ✅ Documented |
| RS.MA-04 | Incidents escalated | Critical (CVSS ≥9.0) → CEO + regulatory counsel within 4 hours | ✅ Documented |
| RS.MA-05 | Incidents declared over | Post-incident review within 30 days | ✅ Documented |

### RS.AN — Incident Analysis

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| RS.AN-03 | Analysis performed to establish root cause | Root cause analysis (RCA) in CAPA system | ✅ Documented |
| RS.AN-06 | Actions performed during investigation documented | Incident log with timestamps | ✅ Documented |
| RS.AN-07 | Incident data collected and preserved | Firmware crash logs + cloud audit logs | ✅ Implemented |
| RS.AN-08 | Magnitude of incident estimated | Patient safety impact + data breach scope | ✅ Documented |

### RS.CO — Incident Response Reporting and Communication

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| RS.CO-02 | Internal/external stakeholders notified | Users notified within 72 hours of breach (HIPAA) | ✅ Documented |
| RS.CO-03 | Information shared with designated authorities | FDA MDR (21 CFR Part 803) if patient harm | ✅ Documented |
| RS.CO-04 | Coordination with stakeholders | Coordinated disclosure with security researchers | ✅ Documented |
| RS.CO-05 | Voluntary information sharing | ISAC participation planned | 📋 Planned |

### RS.MI — Incident Mitigation

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| RS.MI-01 | Incidents contained | OTA firmware patch deployment within 72 hours | ✅ Implemented |
| RS.MI-02 | Incidents eradicated | Vulnerability patched + SBOM updated | ✅ Implemented |

---

## 7. RECOVER (RC) — Recovery Planning

### RC.RP — Incident Recovery Plan Execution

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| RC.RP-01 | Recovery plan executed | MCUboot rollback to last known good firmware | ✅ Implemented |
| RC.RP-02 | Recovery strategy updated | Post-incident review updates recovery procedures | ✅ Documented |
| RC.RP-03 | Recovery activities communicated | Status page + user notifications | ✅ Documented |
| RC.RP-04 | Critical functions restored | Dual-bank OTA ensures always-bootable state | ✅ Implemented |
| RC.RP-05 | Restoration integrity verified | Ed25519 signature verification after restore | ✅ Implemented |
| RC.RP-06 | End of incident declared | Post-incident review sign-off | ✅ Documented |

### RC.CO — Incident Recovery Communication

| Control ID | Control Description | EoS Health Implementation | Status |
|---|---|---|---|
| RC.CO-03 | Recovery activities communicated to stakeholders | User app notification + email | ✅ Documented |
| RC.CO-04 | Public updates on recovery | Status page at status.embeddedos.com | 📋 Planned |

---

## 8. Software Bill of Materials (SBOM)

Per FDA 2023 Cybersecurity Guidance and NTIA minimum elements:

### Firmware SBOM — HEALTH-KEY ULTRA (representative; same for all devices)

| Component | Version | License | Supplier | Known CVEs |
|---|---|---|---|---|
| FreeRTOS | 10.5.1 | MIT | Amazon | None active |
| MCUboot | 1.10.0 | Apache 2.0 | MCUboot Project | None active |
| nRF5 SDK | 17.1.0 | Nordic 5-clause | Nordic Semiconductor | None active |
| TinyCBOR | 0.6.0 | MIT | Intel | None active |
| mbedTLS | 3.4.0 | Apache 2.0 | ARM | None active |
| libsodium | 1.0.18 | ISC | Frank Denis | None active |
| CMSIS | 5.9.0 | Apache 2.0 | ARM | None active |
| EoS Health Algorithms | 1.0.0 | CERN OHL-S v2 | EoS Health | N/A |

### Cloud Backend SBOM

| Component | Version | License | Supplier | Known CVEs |
|---|---|---|---|---|
| Node.js | 22.13.0 | MIT | OpenJS Foundation | None active |
| Express | 4.x | MIT | OpenJS Foundation | None active |
| tRPC | 11.x | MIT | tRPC | None active |
| Drizzle ORM | 0.x | Apache 2.0 | Drizzle Team | None active |
| JWT (jose) | 5.x | MIT | Panva | None active |
| TLS (Node built-in) | 1.3 | Node.js license | OpenJS Foundation | None active |

**SBOM Format:** CycloneDX 1.4 (machine-readable SBOM available at `regulatory/cybersecurity/sbom/`)  
**SBOM Update Frequency:** Every firmware release + quarterly for cloud backend

---

## 9. FDA 2023 Cybersecurity Guidance Alignment

| FDA Guidance Section | Requirement | EoS Health Implementation | Status |
|---|---|---|---|
| Section IV.A | Cybersecurity design controls | Threat model, SBOM, secure boot | ✅ |
| Section IV.B | Transparency documentation | SBOM, vulnerability disclosure policy | ✅ |
| Section IV.C | Cybersecurity testing | Static analysis (cppcheck), 51/51 tests | ✅ |
| Section IV.D | Cybersecurity management plan | See Cybersecurity Management Plan | ✅ |
| Section V | Post-market cybersecurity | OTA updates, CVE monitoring, incident response | ✅ |
| Section VI | Vulnerability disclosure | security@embeddedos.com, 90-day disclosure | ✅ |

---

## 10. Compliance Gap Analysis

| Gap | Priority | Owner | Target Date |
|---|---|---|---|
| PR.AT-01: Annual security training program | Medium | HR/Engineering | Q4 2026 |
| RS.CO-05: ISAC membership | Low | CISO | Q1 2027 |
| RC.CO-04: Public status page | Low | DevOps | Q3 2026 |
| GV.SC-09: Formal supplier security assessments | Medium | Procurement | Q4 2026 |
