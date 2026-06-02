# FDA De Novo Classification Request Packages
## HEALTH-RING (EOS-2026-003) + HEALTH-LAB (EOS-2026-004)
**Submission Type:** De Novo Classification Request (21 CFR 513(f)(2))  
**Date:** June 2026 | **Version:** 1.0

---

## PART A: HEALTH-RING De Novo Request

### A.1 Device Description

**Device Name:** EoS Health HEALTH-RING  
**Intended Use:** The HEALTH-RING is a finger-worn wearable device for continuous monitoring of: ECG (single-lead), heart rate, HRV, SpO₂, skin temperature, blood pressure (cuffless, trend monitoring), and estimated HbA1c (non-invasive, trend monitoring). Intended for adults 18 years and older for general wellness monitoring.

**Novel Features Requiring De Novo:**
1. **Non-invasive HbA1c estimation** via 5-wavelength NIR spectroscopy in ring form factor — no legally marketed predicate
2. **Cuffless blood pressure monitoring** in ring form factor — no legally marketed predicate with ring form factor
3. **Combination of ECG + HbA1c + BP in single ring** — no predicate for this combination

### A.2 Proposed Classification

**Proposed Device Type:** Wearable Multi-Parameter Health Monitor  
**Proposed Class:** Class II  
**Proposed Product Code:** New (request new product code)  
**Proposed Special Controls:**
1. Performance standards: HbA1c accuracy per NGSP/IFCC (ARMS ≤0.5%), BP accuracy per AAMI SP10 (±5/±8 mmHg), SpO₂ per ISO 80601-2-61 (ARMS ≤2%), AFib per AHA/AAMI EC11 (AUC ≥0.97)
2. Labeling: "For wellness monitoring only. Not for medical diagnosis. Consult healthcare provider."
3. Post-market surveillance: Annual real-world accuracy study (n≥50)
4. Cybersecurity controls per FDA 2023 guidance

### A.3 Clinical Evidence Summary

| Metric | Study Design | Sample Size | Primary Endpoint | Status |
|---|---|---|---|---|
| HbA1c | Cross-sectional, vs. Tosoh G8 HPLC | n=200 | ARMS ≤0.5% | 📋 IRB protocol ready |
| Blood pressure | Cross-sectional, vs. auscultatory | n=85 (AAMI SP10) | ±5/±8 mmHg | 📋 IRB protocol ready |
| AFib detection | Case-control, vs. 12-lead ECG | n=100 (50 AFib) | AUC ≥0.97 | 📋 IRB protocol ready |
| SpO₂ | Desaturation study | n=10 | ARMS ≤2% | 📋 IRB protocol ready |

### A.4 De Novo Submission Checklist

- [ ] Cover letter with De Novo request
- [ ] Device description and photos
- [ ] Proposed classification and special controls
- [ ] Risk analysis (ISO 14971) — see `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md`
- [ ] Clinical evidence (complete after IRB studies)
- [ ] Performance testing data
- [ ] Biocompatibility (ISO 10993) — titanium + skin contact
- [ ] Electrical safety (IEC 60601-1)
- [ ] EMC (IEC 60601-1-2)
- [ ] NFC charging safety
- [ ] Software documentation (IEC 62304)
- [ ] Cybersecurity documentation
- [ ] Labeling
- [ ] User fee payment ($112,875 standard / $28,219 small business)

**Timeline:** 12–18 months from submission  
**FDA Contact:** CDRH Division of Chemistry and Toxicology Devices + Division of Cardiovascular Devices (joint review)

---

## PART B: HEALTH-LAB De Novo Request

### B.1 Device Description

**Device Name:** EoS Health HEALTH-LAB  
**Intended Use:** The HEALTH-LAB is a flexible biosensor patch worn on the upper arm for continuous monitoring of sweat biomarkers including glucose, lactate, sodium, potassium, pH, and (Ultra tier) cortisol and uric acid. Intended for adults 18 years and older for general wellness and athletic performance monitoring. **Not intended for insulin dosing decisions.**

**Novel Features Requiring De Novo:**
1. **7-analyte simultaneous sweat monitoring** — no predicate for this combination
2. **SCBN Kalman self-calibration** — novel 3-reference electrode self-calibration in sweat
3. **14-day continuous wear** — no predicate for extended-wear sweat biosensor patch
4. **Iontophoresis-assisted sweat stimulation** — combined with passive sweat monitoring

### B.2 Proposed Classification

**Proposed Device Type:** Wearable Sweat Biosensor  
**Proposed Class:** Class II  
**Proposed Special Controls:**
1. Glucose accuracy: ISO 15197:2013 equivalent (95% within ±15% of reference)
2. Cortisol/lactate: CLSI EP15-A3 analytical validation
3. Labeling: "Not for insulin dosing. For wellness monitoring only."
4. Adhesive biocompatibility: ISO 10993-5, -10
5. Iontophoresis safety: current density ≤0.5 mA/cm²
6. Wear duration: validated for claimed wear period (7 or 14 days)

### B.3 Clinical Evidence Summary

| Metric | Study Design | Sample Size | Primary Endpoint | Status |
|---|---|---|---|---|
| Sweat glucose vs. blood glucose | Cross-sectional, vs. YSI 2300 | n=50 | ISO 15197 Zone A+B ≥95% | 📋 IRB protocol ready |
| Cortisol | Cross-sectional, vs. serum ELISA | n=30 | Pearson r ≥0.85 | 📋 IRB protocol ready |
| Lactate | Cross-sectional, vs. YSI lactate | n=30 | Pearson r ≥0.90 | 📋 IRB protocol ready |
| 14-day wear stability | Longitudinal | n=20 | Drift ≤15%/day | 📋 IRB protocol ready |
| Adhesive biocompatibility | ISO 10993-10 | n=50 | Zero sensitization reactions | 📋 Lab testing required |

### B.4 De Novo Submission Checklist

- [ ] Cover letter with De Novo request
- [ ] Device description, photos, and electrode diagram
- [ ] Proposed classification and special controls
- [ ] Risk analysis (ISO 14971)
- [ ] Clinical evidence (complete after IRB studies)
- [ ] Analytical validation (LOD, LOQ, linearity, interference)
- [ ] Biocompatibility (ISO 10993-5, -10) — adhesive + electrode materials
- [ ] Iontophoresis safety (IEC 60601-2-10)
- [ ] Electrical safety (IEC 60601-1)
- [ ] EMC (IEC 60601-1-2)
- [ ] Wear duration validation
- [ ] Software documentation (IEC 62304)
- [ ] Cybersecurity documentation
- [ ] Labeling with "not for insulin dosing" warning
- [ ] User fee payment ($112,875)

**Timeline:** 12–18 months from submission  
**FDA Contact:** CDRH Division of Chemistry and Toxicology Devices

---

## Pre-Submission (Q-Sub) Strategy for Both De Novo Devices

Before filing either De Novo, request Q-Sub meetings to confirm:

1. **HEALTH-RING Q-Sub agenda:**
   - Is HbA1c in ring form factor De Novo or could a 510(k) be supported?
   - What clinical study design is acceptable for HbA1c and BP?
   - Is AFib detection subject to separate software review?

2. **HEALTH-LAB Q-Sub agenda:**
   - Is sweat glucose subject to same requirements as blood glucose (ISO 15197)?
   - What is FDA's position on "not for insulin dosing" labeling for sweat glucose?
   - Is 14-day wear a De Novo issue or can it be addressed in special controls?

**Q-Sub Timeline:** Submit 6 months before De Novo filing
