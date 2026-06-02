# IEC 60601 / UL Safety Testing Checklist
## EoS Health — All 4 Devices
**Standards:** IEC 60601-1:2005+A1:2012+A2:2020, IEC 60601-1-2:2014+A1:2020 (EMC), IEC 60601-1-6:2010+A1:2013+A2:2020 (Usability), IEC 60601-1-11:2015+A1:2020 (Home Healthcare), IEC 60601-2-10:2012+A1:2021 (TENS), UL 2900-2-1:2019 (Cybersecurity)  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Overview

IEC 60601-1 is the foundational safety standard for medical electrical equipment. Compliance is required for FDA 510(k) and De Novo submissions, CE marking (EU MDR), and Health Canada licensing. All four EoS Health devices are classified as **Type BF Applied Parts** (body-floating, not cardiac-applied) except HEALTH-BAND Neuro which includes a TENS function classified as **Type BF Applied Part with defibrillation protection** per IEC 60601-2-10.

**Device Classification Summary:**

| Device | IEC 60601-1 Type | Applied Part | Protection Class |
|---|---|---|---|
| HEALTH-KEY ULTRA | Type BF | ECG electrodes, PPG sensor | Class III (battery-powered) |
| HEALTH-BAND Neuro | Type BF (TENS: CF) | TENS electrodes, sEMG electrodes | Class III (battery-powered) |
| HEALTH-RING | Type BF | PPG sensor, ECG electrodes | Class III (battery-powered) |
| HEALTH-LAB | Type BF | Sweat biosensor electrodes | Class III (battery-powered) |

---

## 2. IEC 60601-1 General Safety (Clause-by-Clause Checklist)

### Clause 4 — General Requirements

| Clause | Requirement | EoS Health Implementation | Test Required | Status |
|---|---|---|---|---|
| 4.3 | Essential performance defined | HR, SpO₂, ECG, TENS output | Document in risk file | 📋 Required |
| 4.4 | Acceptable risk | ISO 14971 risk management | Risk file complete | ✅ Documented |
| 4.5 | Mechanical strength | Drop test, crush test | Lab testing | 📋 Required |
| 4.6 | Parts and connections | All components rated for medical use | BOM review | 📋 Required |

### Clause 6 — Protection Against Electrical Hazards

| Clause | Requirement | Limit | EoS Health Status |
|---|---|---|---|
| 6.2 | Leakage current — chassis | ≤100 µA (NC), ≤500 µA (SFC) | Battery-powered: typically <1 µA | ✅ Expected pass |
| 6.3 | Leakage current — patient (BF) | ≤100 µA (NC), ≤500 µA (SFC) | Battery-powered: typically <10 µA | ✅ Expected pass |
| 6.4 | Leakage current — patient (CF) | ≤10 µA (NC), ≤50 µA (SFC) | HEALTH-BAND TENS: requires measurement | 📋 Required |
| 6.5 | Patient auxiliary current | ≤100 µA (BF) | ECG auxiliary current: <10 µA | ✅ Expected pass |
| 6.8 | Dielectric strength | 1500 V (1 min) | Between patient circuit and chassis | 📋 Required |

### Clause 7 — Protection Against Mechanical Hazards

| Clause | Requirement | Test | Status |
|---|---|---|---|
| 7.2 | Mechanical strength | IEC 60068-2-27 (shock), IEC 60068-2-6 (vibration) | 📋 Required |
| 7.3 | Moving parts | No moving parts in any device | ✅ N/A |
| 7.4 | Stability | Drop test from 1 m onto concrete | 📋 Required |

### Clause 8 — Protection Against Radiation Hazards

| Clause | Requirement | Status |
|---|---|---|
| 8.2 | Optical radiation | PPG LEDs: IEC 62471 assessment required | 📋 Required |
| 8.3 | Ultrasound | Not applicable | ✅ N/A |
| 8.4 | Microwave | BLE: FCC SAR/MPE (see FCC checklist) | 📋 Required |

### Clause 11 — Protection Against Excessive Temperatures

| Clause | Requirement | Limit | Status |
|---|---|---|---|
| 11.1 | Temperature limits — applied parts | ≤41°C (skin contact, continuous) | Thermal testing required | 📋 Required |
| 11.1 | Temperature limits — enclosure | ≤48°C (accessible surfaces) | Thermal testing required | 📋 Required |
| 11.2 | Abnormal operation | No fire/smoke under single fault | Thermal runaway test (battery) | 📋 Required |

### Clause 14 — Programmable Electrical Medical Systems (PEMS)

| Clause | Requirement | Status |
|---|---|---|
| 14.1 | PEMS development lifecycle | IEC 62304 software lifecycle | ✅ Documented |
| 14.2 | PEMS risk management | ISO 14971 integrated with IEC 62304 | ✅ Documented |
| 14.3 | PEMS validation | 51/51 algorithm tests, 89/89 corner case tests | ✅ Complete |

---

## 3. IEC 60601-1-2 EMC Testing (Clause-by-Clause)

### Emissions Tests

| Test | Standard | Limit | Frequency Range | Status |
|---|---|---|---|---|
| Radiated emissions | CISPR 11 Group 1 Class B | 30 dBµV/m @ 3m | 30 MHz–1 GHz | 📋 Required |
| Conducted emissions | CISPR 11 Group 1 Class B | 66–56 dBµV | 150 kHz–30 MHz | 📋 Required |
| Harmonic current | IEC 61000-3-2 | Class A limits | 50/60 Hz harmonics | ✅ N/A (battery-powered) |
| Voltage fluctuations | IEC 61000-3-3 | ≤3.3% | 50/60 Hz | ✅ N/A (battery-powered) |

### Immunity Tests

| Test | Standard | Test Level | Pass Criterion | Status |
|---|---|---|---|---|
| ESD | IEC 61000-4-2 | ±8 kV contact, ±15 kV air | Criterion B | 📋 Required |
| Radiated RF immunity | IEC 61000-4-3 | 10 V/m (80 MHz–2.7 GHz) | Criterion A | 📋 Required |
| Electrical fast transient | IEC 61000-4-4 | ±2 kV | Criterion B | ✅ N/A (battery-powered) |
| Surge | IEC 61000-4-5 | ±1 kV | Criterion B | ✅ N/A (battery-powered) |
| Conducted RF immunity | IEC 61000-4-6 | 3 Vrms (150 kHz–80 MHz) | Criterion A | 📋 Required |
| Power frequency magnetic field | IEC 61000-4-8 | 30 A/m | Criterion A | 📋 Required |
| Proximity fields (RFID/NFC) | IEC 60601-1-2 Table 9 | Per table | Criterion A | 📋 Required (RING NFC) |

**EMC Test Environment:** Professional EMC test chamber (anechoic or semi-anechoic)  
**Estimated EMC testing cost:** $8,000–$20,000 per device

---

## 4. IEC 60601-1-6 Usability Engineering

| Activity | Standard | EoS Health Implementation | Status |
|---|---|---|---|
| Usability engineering plan | IEC 60601-1-6 §4 | Usability plan document | 📋 Required |
| Task analysis | IEC 60601-1-6 §5 | User task analysis for each device | 📋 Required |
| Formative usability studies | IEC 60601-1-6 §6 | Prototype testing with 5–8 users | 📋 Required |
| Summative usability validation | IEC 60601-1-6 §7 | Validation testing with 15+ representative users | 📋 Required |
| Use error analysis | IEC 60601-1-6 §5.4 | FMEA for use errors | 📋 Required |
| Instructions for use review | IEC 60601-1-6 §7.2 | User manual review with target users | 📋 Required |

**Usability study participants:** 15 representative users per device (healthy adults, 18–75 years)  
**Estimated usability testing cost:** $15,000–$40,000 per device

---

## 5. IEC 60601-1-11 Home Healthcare

All four EoS Health devices are intended for use in home/consumer settings. IEC 60601-1-11 applies as a collateral standard.

| Requirement | Description | Status |
|---|---|---|
| Environmental conditions | 10–40°C, 15–95% RH (non-condensing) | ✅ Specified in datasheet |
| Robustness | IP68 (1m/30min) for all devices | ✅ Specified |
| Instructions for use | Plain language, no medical training assumed | 📋 Required |
| Maintenance | User-replaceable: none (sealed devices) | ✅ Documented |
| Electromagnetic environment | Home healthcare environment (Table 1) | 📋 Required |

---

## 6. IEC 60601-2-10 TENS (HEALTH-BAND Neuro Only)

| Clause | Requirement | HEALTH-BAND Neuro Specification | Status |
|---|---|---|---|
| 201.6.2 | Maximum output current | ≤50 mA peak | 20 mA max | ✅ |
| 201.6.3 | Maximum charge per pulse | ≤50 µC | 3.0 µC | ✅ |
| 201.6.4 | Maximum current density | ≤2 mA/cm² | 0.8 mA/cm² | ✅ |
| 201.6.5 | Pulse width | ≤1 ms | 200 µs | ✅ |
| 201.6.6 | Frequency range | 1–150 Hz | 2–100 Hz | ✅ |
| 201.7 | Electrode impedance monitoring | Required | Hardware impedance monitor | ✅ |
| 201.8 | Electrode detach detection | Required | Hardware interlock | ✅ |
| 201.9 | Output off on electrode detach | Required | SW + HW enforced | ✅ |
| 201.12 | Alarm system | Required for essential performance | Alarm in mobile app | 📋 Required |
| 201.101 | TENS specific safety | Defibrillation protection | CF type applied part | 📋 Required |

---

## 7. UL 2900-2-1 Cybersecurity for Medical Devices

| Requirement | Description | EoS Health Implementation | Status |
|---|---|---|---|
| Software bill of materials | SBOM per NTIA minimum elements | See NIST CSF document | ✅ Documented |
| Vulnerability scanning | Static analysis + CVE monitoring | cppcheck + NVD monitoring | ✅ Implemented |
| Penetration testing | Network + firmware penetration test | 📋 Required (pre-submission) | 📋 Required |
| Malware protection | Signed firmware (Ed25519) | MCUboot signature verification | ✅ Implemented |
| Cryptographic controls | AES-256, TLS 1.3, Ed25519 | Implemented in firmware + cloud | ✅ Implemented |
| Security risk assessment | STRIDE threat model | See Cybersecurity Management Plan | ✅ Documented |
| Incident response | 90-day disclosure, OTA patch | See Cybersecurity Management Plan | ✅ Documented |

---

## 8. Recommended Test Laboratories

| Lab | Accreditation | Specialization | Contact |
|---|---|---|---|
| SGS | A2LA, NVLAP | Medical devices, EMC, safety | medical@sgs.com |
| Intertek | A2LA, NVLAP | Medical devices, EMC, BLE | medical@intertek.com |
| TÜV Rheinland | DAkkS, A2LA | Medical devices, IEC 60601 | medical@tuv.com |
| UL | A2LA, NVLAP | Medical devices, cybersecurity | medical@ul.com |
| Nemko | ILAC | Medical devices, Nordic countries | medical@nemko.com |
| Element Materials Technology | A2LA | Medical devices, EMC | medical@element.com |

**Recommendation:** Engage a single lab (SGS or Intertek) for all 4 devices to reduce coordination overhead and potentially negotiate volume pricing.

---

## 9. Cost and Timeline Summary

| Device | Tests Required | Estimated Cost | Estimated Timeline |
|---|---|---|---|
| HEALTH-KEY ULTRA | IEC 60601-1, -1-2 (EMC), -1-6 (usability), -1-11 | $45,000–$90,000 | 12–18 weeks |
| HEALTH-BAND Neuro | IEC 60601-1, -1-2, -1-6, -1-11, -2-10 (TENS), UL 2900-2-1 | $65,000–$120,000 | 16–24 weeks |
| HEALTH-RING | IEC 60601-1, -1-2, -1-6, -1-11 | $45,000–$90,000 | 12–18 weeks |
| HEALTH-LAB | IEC 60601-1, -1-2, -1-6, -1-11 | $45,000–$90,000 | 12–18 weeks |
| **Total (4 devices)** | | **$200,000–$390,000** | **16–24 weeks** |

> **Cost reduction strategies:**
> 1. Conduct all 4 devices at same lab in same engagement (10–20% discount)
> 2. Use pre-compliance testing to identify and fix issues before formal testing (reduces re-test costs)
> 3. Leverage nRF52840 module certifications where applicable

---

## 10. Master Testing Checklist

### Pre-Testing Preparation
- [ ] Complete risk management file (ISO 14971) for each device
- [ ] Complete IEC 62304 software documentation
- [ ] Complete usability engineering plan (IEC 60601-1-6)
- [ ] Prepare 5 production-representative samples per device
- [ ] Prepare test report templates
- [ ] Select and engage test laboratory
- [ ] Conduct pre-compliance testing (EMC, electrical safety)

### IEC 60601-1 General Safety
- [ ] Leakage current measurements (all devices)
- [ ] Dielectric strength test (all devices)
- [ ] Mechanical strength tests (drop, vibration, shock)
- [ ] Temperature testing (applied parts + enclosure)
- [ ] Battery safety testing (thermal runaway)
- [ ] IP68 ingress protection testing

### IEC 60601-1-2 EMC
- [ ] Radiated emissions (all devices)
- [ ] Conducted emissions (all devices)
- [ ] ESD immunity (all devices)
- [ ] Radiated RF immunity (all devices)
- [ ] Conducted RF immunity (all devices)
- [ ] NFC proximity field immunity (HEALTH-RING only)

### IEC 60601-1-6 Usability
- [ ] Usability engineering plan approved
- [ ] Formative usability studies (5–8 users, prototype)
- [ ] Summative usability validation (15+ users, final product)
- [ ] Use error analysis (FMEA)

### IEC 60601-2-10 TENS (HEALTH-BAND Neuro only)
- [ ] Output current measurement
- [ ] Charge per pulse measurement
- [ ] Current density measurement
- [ ] Electrode impedance monitoring verification
- [ ] Electrode detach detection verification
- [ ] CF type applied part leakage current

### UL 2900-2-1 Cybersecurity (HEALTH-BAND Neuro, optional for others)
- [ ] SBOM review
- [ ] Penetration testing (network + firmware)
- [ ] Vulnerability scanning
- [ ] Cryptographic controls review

### Post-Testing
- [ ] Review test reports for failures
- [ ] Address any failures (design changes + re-test)
- [ ] Compile technical file / design history file
- [ ] Submit to FDA as part of 510(k) / De Novo package
- [ ] Apply CE marking (EU MDR) after EU Notified Body review
