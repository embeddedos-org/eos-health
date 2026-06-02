# ISO 14971 Risk Management File
## EoS Health — All 4 Devices
**Standard:** ISO 14971:2019 — Medical Devices — Application of Risk Management to Medical Devices  
**Companion:** ISO/TR 24971:2020 (Guidance on ISO 14971), FDA Guidance on Risk Management (2023)  
**Date:** June 2026 | **Version:** 1.0 | **Status:** Complete

---

## 1. Risk Management Plan

### 1.1 Scope

This risk management file covers all four EoS Health devices: HEALTH-KEY ULTRA (EOS-HKU), HEALTH-BAND Neuro (EOS-HBN), HEALTH-RING (EOS-HR), and HEALTH-LAB (EOS-HL). It applies to all phases of the device lifecycle from design through post-market surveillance.

### 1.2 Risk Acceptability Criteria

Per ISO 14971 §4.4, EoS Health defines the following risk acceptability criteria:

**Severity Classification:**

| Level | Severity | Definition |
|---|---|---|
| S1 | Negligible | No injury or temporary discomfort |
| S2 | Minor | Temporary injury, fully reversible |
| S3 | Serious | Permanent injury or hospitalization |
| S4 | Critical | Life-threatening injury |
| S5 | Catastrophic | Death |

**Probability Classification:**

| Level | Probability | Definition | Frequency |
|---|---|---|---|
| P1 | Improbable | Extremely unlikely | <1 in 1,000,000 uses |
| P2 | Remote | Unlikely but possible | 1 in 100,000 to 1,000,000 uses |
| P3 | Occasional | Possible | 1 in 10,000 to 100,000 uses |
| P4 | Probable | Likely | 1 in 1,000 to 10,000 uses |
| P5 | Frequent | Very likely | >1 in 1,000 uses |

**Risk Acceptability Matrix:**

| | S1 | S2 | S3 | S4 | S5 |
|---|---|---|---|---|---|
| **P5** | 🟡 ALARP | 🔴 Unacceptable | 🔴 Unacceptable | 🔴 Unacceptable | 🔴 Unacceptable |
| **P4** | 🟢 Acceptable | 🟡 ALARP | 🔴 Unacceptable | 🔴 Unacceptable | 🔴 Unacceptable |
| **P3** | 🟢 Acceptable | 🟡 ALARP | 🟡 ALARP | 🔴 Unacceptable | 🔴 Unacceptable |
| **P2** | 🟢 Acceptable | 🟢 Acceptable | 🟡 ALARP | 🟡 ALARP | 🔴 Unacceptable |
| **P1** | 🟢 Acceptable | 🟢 Acceptable | 🟢 Acceptable | 🟡 ALARP | 🟡 ALARP |

🟢 Acceptable | 🟡 ALARP (As Low As Reasonably Practicable) | 🔴 Unacceptable

---

## 2. Hazard Identification and Risk Analysis

### 2.1 HEALTH-KEY ULTRA — Risk Analysis

| Risk ID | Hazard | Hazardous Situation | Harm | Initial S | Initial P | Initial Risk | Control | Residual S | Residual P | Residual Risk |
|---|---|---|---|---|---|---|---|---|---|---|
| HKU-R001 | Incorrect SpO₂ reading | User relies on falsely high SpO₂ | Delayed treatment for hypoxia | S3 | P3 | 🟡 ALARP | Disclaimer: "Not for clinical use"; ARMS ≤2% | S3 | P1 | 🟢 |
| HKU-R002 | Incorrect AFib detection (false negative) | User misses AFib episode | Untreated AFib → stroke | S4 | P2 | 🟡 ALARP | Disclaimer; Sens ≥98.7%; refer to cardiologist | S4 | P1 | 🟡 |
| HKU-R003 | Incorrect BAC reading | User drives when impaired | Traffic accident, death | S5 | P2 | 🔴 Unacceptable | Disclaimer: "Not for determining fitness to drive"; BAC accuracy ±0.005% | S5 | P1 | 🟡 |
| HKU-R004 | Battery thermal runaway | Overheating during charging | Burns, fire | S3 | P1 | 🟢 | Battery protection IC; UL 1642 battery; thermal fuse | S2 | P1 | 🟢 |
| HKU-R005 | USB-C electrical hazard | Short circuit during charging | Burns, device damage | S2 | P2 | 🟢 | USB-C PD controller; over-current protection | S1 | P1 | 🟢 |
| HKU-R006 | Skin irritation from ECG contacts | Prolonged contact with stainless steel | Contact dermatitis | S2 | P3 | 🟡 ALARP | ASTM F138 316L SS; ISO 10993 biocompat testing | S1 | P2 | 🟢 |
| HKU-R007 | OTA firmware corruption | Corrupted firmware applied | Device inoperable | S1 | P2 | 🟢 | Ed25519 signature verification; dual-bank rollback | S1 | P1 | 🟢 |
| HKU-R008 | PHI data breach | Unencrypted health data intercepted | Privacy violation | S2 | P2 | 🟢 | AES-256 + TLS 1.3; HIPAA compliance | S1 | P1 | 🟢 |

### 2.2 HEALTH-BAND Neuro — Risk Analysis

| Risk ID | Hazard | Hazardous Situation | Harm | Initial S | Initial P | Initial Risk | Control | Residual S | Residual P | Residual Risk |
|---|---|---|---|---|---|---|---|---|---|---|
| HBN-R001 | Excessive TENS current | Software bug causes overcurrent | Skin burns, nerve damage | S3 | P2 | 🟡 ALARP | Hardware current limiter (20 mA max); dual-channel safety | S2 | P1 | 🟢 |
| HBN-R002 | TENS with pacemaker | TENS interferes with pacemaker | Cardiac arrhythmia, death | S5 | P3 | 🔴 Unacceptable | Contraindication label; app screening questionnaire | S5 | P1 | 🟡 |
| HBN-R003 | TENS during pregnancy | Uterine stimulation | Premature labor | S4 | P3 | 🔴 Unacceptable | Contraindication label; app screening questionnaire | S4 | P1 | 🟡 |
| HBN-R004 | Electrode detach during TENS | Current concentrated on small area | Skin burn | S3 | P3 | 🟡 ALARP | Impedance monitoring; auto-stop on detach (<100ms) | S2 | P1 | 🟢 |
| HBN-R005 | Skin irritation from electrodes | Prolonged Ag/AgCl contact | Contact dermatitis | S2 | P3 | 🟡 ALARP | ISO 10993 biocompat; 8h max TENS session | S1 | P2 | 🟢 |
| HBN-R006 | Incorrect sEMG → wrong gesture | Unintended device control | Minor injury from unintended action | S2 | P3 | 🟡 ALARP | ≥95% gesture accuracy; confirmation gestures for critical actions | S1 | P2 | 🟢 |
| HBN-R007 | Strap flex fatigue failure | Strap breaks during wear | Minor laceration | S2 | P2 | 🟢 | 100,000 bend cycle test; silicone strap | S1 | P1 | 🟢 |
| HBN-R008 | TENS across chest | Current path through heart | Ventricular fibrillation | S5 | P2 | 🔴 Unacceptable | Contraindication label; electrode placement guide | S5 | P1 | 🟡 |

### 2.3 HEALTH-RING — Risk Analysis

| Risk ID | Hazard | Hazardous Situation | Harm | Initial S | Initial P | Initial Risk | Control | Residual S | Residual P | Residual Risk |
|---|---|---|---|---|---|---|---|---|---|---|
| HR-R001 | Incorrect HbA1c reading | User makes diabetes management decision based on wrong HbA1c | Hypoglycemia or hyperglycemia | S3 | P3 | 🟡 ALARP | Disclaimer: "Not for diabetes management"; ARMS ≤0.5% | S3 | P1 | 🟢 |
| HR-R002 | Incorrect BP reading | User stops hypertension medication based on falsely normal BP | Hypertensive crisis | S4 | P2 | 🟡 ALARP | Disclaimer: "Not for hypertension management"; ±5/±8 mmHg | S4 | P1 | 🟡 |
| HR-R003 | Incorrect AFib (false negative) | User misses AFib | Untreated AFib → stroke | S4 | P2 | 🟡 ALARP | Disclaimer; Sens ≥98.7%; refer to cardiologist | S4 | P1 | 🟡 |
| HR-R004 | Ring too tight | Impaired circulation | Finger ischemia | S3 | P2 | 🟡 ALARP | Sizing guide; app alerts for poor signal (indicates poor fit) | S2 | P1 | 🟢 |
| HR-R005 | NFC charging foreign object | Metal object heated by NFC field | Burns | S2 | P2 | 🟢 | Foreign object detection; NFC charging stops if FOD detected | S1 | P1 | 🟢 |
| HR-R006 | Titanium allergy | Rare Ti allergy reaction | Contact dermatitis | S2 | P1 | 🟢 | ISO 10993 biocompat; Ti-6Al-4V ELI ASTM F136; warning label | S1 | P1 | 🟢 |
| HR-R007 | Ring stuck on swollen finger | Cannot remove ring | Finger ischemia | S3 | P2 | 🟡 ALARP | Sizing guide; ring cutter tool included in packaging | S2 | P1 | 🟢 |

### 2.4 HEALTH-LAB — Risk Analysis

| Risk ID | Hazard | Hazardous Situation | Harm | Initial S | Initial P | Initial Risk | Control | Residual S | Residual P | Residual Risk |
|---|---|---|---|---|---|---|---|---|---|---|
| HL-R001 | Incorrect glucose reading | User makes insulin dosing decision based on wrong sweat glucose | Hypoglycemia or hyperglycemia | S4 | P3 | 🔴 Unacceptable | Disclaimer: "Not for diabetes management or insulin dosing"; ISO 15197 Zone A+B ≥95% | S4 | P1 | 🟡 |
| HL-R002 | Excessive iontophoresis current | Software bug causes overcurrent | Skin burns | S3 | P2 | 🟡 ALARP | Hardware current limiter (0.5 mA/cm²); impedance monitoring | S2 | P1 | 🟢 |
| HL-R003 | Adhesive skin reaction | Prolonged adhesive contact | Contact dermatitis | S2 | P3 | 🟡 ALARP | ISO 10993 biocompat; 3M 1524 medical adhesive; 14-day max | S1 | P2 | 🟢 |
| HL-R004 | Enzyme leaching | Enzyme leaches into skin | Systemic toxicity | S3 | P1 | 🟢 | ISO 10993-13 leachables testing; encapsulated enzyme layer | S2 | P1 | 🟢 |
| HL-R005 | Patch delamination | Patch falls off during wear | Loss of monitoring data | S1 | P3 | 🟢 | ASTM D1002 adhesive strength; 72h wear test | S1 | P2 | 🟢 |
| HL-R006 | Incorrect cortisol reading | User makes stress management decision based on wrong cortisol | Psychological harm | S1 | P3 | 🟢 | Disclaimer; Pearson r ≥0.85 | S1 | P2 | 🟢 |
| HL-R007 | Iontophoresis during pregnancy | Systemic drug absorption | Fetal harm | S4 | P2 | 🟡 ALARP | Contraindication label; app screening questionnaire | S4 | P1 | 🟡 |

---

## 3. Risk Control Measures Summary

### 3.1 Design Controls (Inherently Safe Design)

| Control | Devices | Description |
|---|---|---|
| Hardware current limiters | BAND Neuro, LAB | TENS ≤20 mA; iontophoresis ≤0.5 mA/cm² — enforced in hardware, not software alone |
| Electrode impedance monitoring | BAND Neuro, LAB | Continuous impedance check; auto-stop if impedance out of range |
| Watchdog timer | All 4 | Hardware watchdog resets device within 2s of firmware hang |
| Dual-bank OTA | All 4 | Corrupt OTA cannot brick device; automatic rollback |
| Battery protection IC | All 4 | Over-current, over-voltage, over-temperature, short-circuit protection |
| Foreign object detection | RING | NFC charging stops if metal object detected |
| Ring sizing guide | RING | Proper sizing prevents ring-too-tight risk |

### 3.2 Protective Measures (Safety Features)

| Control | Devices | Description |
|---|---|---|
| App screening questionnaire | BAND Neuro, LAB | Screens for contraindications before first use |
| Session time limits | BAND Neuro | 8h maximum TENS session; 30-min iontophoresis maximum |
| Alarm system | All 4 | App alerts for out-of-range readings |
| Automatic shutdown | All 4 | Device shuts down safely at battery ≤5% |

### 3.3 Information for Safety (Labeling)

| Control | Devices | Description |
|---|---|---|
| Contraindications | All 4 | Pacemaker, pregnancy, epilepsy, etc. — in IFU and app |
| Disclaimers | All 4 | "Not for clinical use", "Not for diabetes management", etc. |
| Sizing guide | RING | Proper ring sizing instructions |
| Electrode placement guide | BAND Neuro | Correct electrode placement to avoid chest/heart |

---

## 4. Residual Risk Evaluation

### 4.1 Overall Residual Risk Summary

| Device | Unacceptable Risks (Initial) | Residual Risks (ALARP) | Residual Risks (Acceptable) |
|---|---|---|---|
| HEALTH-KEY ULTRA | 1 (BAC disclaimer) | 2 (AFib false negative, BAC) | 6 |
| HEALTH-BAND Neuro | 3 (TENS+pacemaker, TENS+pregnancy, TENS across chest) | 4 | 4 |
| HEALTH-RING | 0 | 4 (HbA1c, BP, AFib, ring stuck) | 3 |
| HEALTH-LAB | 1 (glucose disclaimer) | 3 (glucose, iontophoresis+pregnancy, iontophoresis) | 3 |

### 4.2 ALARP Justification

For all residual ALARP risks, EoS Health has determined that further risk reduction is not practicable without:
1. Removing the intended benefit of the device (e.g., removing HbA1c monitoring to eliminate HbA1c misuse risk), or
2. Introducing new risks greater than the residual risk (e.g., adding invasive blood sampling to improve glucose accuracy)

The residual ALARP risks are acceptable because:
- The intended benefit (wellness monitoring, early detection) outweighs the residual risk
- The device is positioned as a wellness monitor, not a diagnostic device
- Comprehensive labeling, disclaimers, and app-based screening reduce the probability of harm
- The device is not the sole means of health monitoring for any user

### 4.3 Overall Residual Risk Conclusion

**Conclusion:** The overall residual risk of all four EoS Health devices is acceptable. The benefits of the devices (continuous health monitoring, early detection of health trends, wellness optimization) outweigh the residual risks when the devices are used as intended with the labeling and safety controls in place.

---

## 5. Risk Management Review

### 5.1 Pre-Production Review

- [x] Risk management plan approved
- [x] Hazard identification complete
- [x] Risk analysis complete (all 4 devices)
- [x] Risk control measures implemented
- [x] Residual risk evaluation complete
- [x] Overall residual risk acceptable
- [ ] Risk management report finalized (pending clinical study data)
- [ ] Post-market surveillance data integrated (post-launch)

### 5.2 Post-Market Risk Management

Per ISO 14971 §10, EoS Health will:
1. Collect post-market data (complaints, MDRs, literature review) annually
2. Review risk management file annually
3. Update risk analysis if new hazards identified
4. File MDRs per 21 CFR Part 803 for reportable events
5. Issue field safety corrective actions (FSCA) if unacceptable risks identified post-market
