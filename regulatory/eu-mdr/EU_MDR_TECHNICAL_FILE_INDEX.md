# EU MDR 2017/745 Technical Documentation Index
## EoS Health Platform — All 4 Devices
**Document ID:** EOS-MDR-TF-001 | **Version:** 1.0 | **Date:** 2026-06-02  
**Regulation:** EU MDR 2017/745 | **IVDR:** EU 2017/746 (HEALTH-LAB biosensors)

---

## 1. Device Classification

| Device | MDR Classification | Rule | Notified Body Required |
|--------|-------------------|------|------------------------|
| HEALTH-KEY ULTRA | Class IIa | Rule 10 (active diagnostic) | Yes — BSI or TÜV SÜD |
| HEALTH-BAND Neuro | Class IIb | Rule 9 (ECG + TENS active therapeutic) | Yes — BSI or TÜV SÜD |
| HEALTH-RING | Class IIa | Rule 10 (active diagnostic) | Yes — BSI or TÜV SÜD |
| HEALTH-LAB | Class C (IVDR) | Rule 3 (self-test IVD) | Yes — IVDR Notified Body |

---

## 2. Technical Documentation Structure (MDR Annex II & III)

### 2.1 Device Description and Specification (Annex II §1)

| Document | File | Status |
|----------|------|--------|
| Device description and intended purpose | `devices/health-key-ultra/README.md` | ✅ Complete |
| Device description and intended purpose | `devices/health-band-neuro/README.md` | ✅ Complete |
| Device description and intended purpose | `devices/health-ring/README.md` | ✅ Complete |
| Device description and intended purpose | `devices/health-lab/README.md` | ✅ Complete |
| Variants and accessories | `eCAD-Hardware-Products/eosHealth_CAD_Design/*/product_datasheet.md` | ✅ Complete |
| UDI assignment plan | `regulatory/labeling/FDA_LABELING_PACKAGE.md §6` | ✅ Complete |
| Reference devices and generations | `PRODUCT_MATURITY_ROADMAP.md` | ✅ Complete |

### 2.2 Design and Manufacturing Information (Annex II §2)

| Document | File | Status |
|----------|------|--------|
| Design stages applied | `regulatory/software-lifecycle/IEC62304_SOFTWARE_LIFECYCLE.md` | ✅ Complete |
| Manufacturing process | `eCAD-Hardware-Products/eosHealth_CAD_Design/*/product_datasheet.md` | ✅ Complete |
| Identification of all sites | `regulatory/iso13485/QUALITY_MANAGEMENT_SYSTEM.md §3` | ✅ Complete |

### 2.3 General Safety and Performance Requirements (Annex II §3 / MDR Annex I)

| GSPR | Requirement | Evidence Document | Status |
|------|-------------|-------------------|--------|
| 1 | Safe and perform as intended | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` | ✅ |
| 3 | Chemical, physical, biological properties | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | 🔄 Testing pending |
| 4 | Infection and microbial contamination | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md §5` | 🔄 Testing pending |
| 5 | Construction and environmental properties | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | 🔄 Testing pending |
| 6 | Devices with measuring function | `clinical/analysis/clinical_analysis_pipeline.py` | ✅ Simulation complete |
| 10 | Radiation protection | N/A — no ionising radiation | N/A |
| 11 | Software requirements | `regulatory/software-lifecycle/IEC62304_TRACEABILITY_MATRIX.md` | ✅ |
| 12 | Active devices — energy sources | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md` | 🔄 Testing pending |
| 13 | Information supplied by manufacturer | `regulatory/labeling/FDA_LABELING_PACKAGE.md` | ✅ |
| 14 | Cybersecurity | `regulatory/sbom/SBOM_THREAT_MODEL_VDP.md` | ✅ |
| 17 | Clinical evaluation | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 🔄 Studies pending |
| 22 | Usability | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md §4` | 🔄 Studies pending |

### 2.4 Benefit-Risk Analysis and Risk Management (Annex II §4)

| Document | File | Status |
|----------|------|--------|
| ISO 14971 Risk Management File | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md` | ✅ Complete |
| Residual risk evaluation | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md §7` | ✅ Complete |
| Benefit-risk determination | `regulatory/risk-management/ISO14971_RISK_MANAGEMENT_FILE.md §8` | ✅ Complete |

### 2.5 Product Verification and Validation (Annex II §5)

| Document | File | Status |
|----------|------|--------|
| Pre-clinical testing summary | `docs/RELIABILITY_SPECIFICATIONS.md` | ✅ Complete |
| Software verification | `verification/test_algorithms.py` (51 tests, 100% pass) | ✅ Complete |
| Software validation | `verification/test_corner_cases.py` (92 tests, 100% pass) | ✅ Complete |
| Clinical evaluation report | `regulatory/clinical-protocols/CLINICAL_STUDY_PROTOCOLS.md` | 🔄 Studies pending |
| Usability engineering file | `regulatory/iec60601/IEC60601_DEVICE_SPECIFIC_STANDARDS.md §4` | 🔄 Studies pending |
| Biocompatibility test reports | `regulatory/biocompatibility/ISO10993_BIOCOMPATIBILITY_PLAN.md` | 🔄 Testing pending |
| Electrical safety test reports | `regulatory/iec60601/IEC60601_SAFETY_TESTING_CHECKLIST.md` | 🔄 Testing pending |
| EMC test reports | `regulatory/fcc/FCC_AUTHORIZATION_CHECKLIST.md` | 🔄 Testing pending |

### 2.6 Post-Market Surveillance (Annex II §6)

| Document | File | Status |
|----------|------|--------|
| PMS plan | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md §4` | ✅ Complete |
| PSUR template | `regulatory/eu-mdr/PSUR_TEMPLATE.md` | ✅ Complete (this release) |
| Vigilance procedures | `regulatory/capa/CAPA_AND_QMS_PROCEDURES.md §5` | ✅ Complete |

---

## 3. CE Marking Checklist

### 3.1 Pre-Submission Requirements

- [ ] Appoint EU Authorised Representative (EU AR) — required for non-EU manufacturers
  - Recommended: QSERV Europe (qserveurope.com) or Emergo Europe
  - Cost: €3,000–€8,000/year
- [ ] Register in EUDAMED (European Database on Medical Devices)
  - URL: https://ec.europa.eu/tools/eudamed
  - Required before CE marking application
- [ ] Select Notified Body
  - BSI Group (UK/EU): bsigroup.com
  - TÜV SÜD: tuvsud.com
  - SGS: sgs.com
  - Timeline: 6–18 months for Class IIa/IIb

### 3.2 Technical Documentation Completion Status

| Item | Required By | Status | Gap |
|------|-------------|--------|-----|
| Device description | MDR Annex II §1 | ✅ | None |
| GSPR checklist | MDR Annex I | ✅ | None |
| Risk management file | MDR Annex II §4 | ✅ | None |
| Software lifecycle | IEC 62304 | ✅ | None |
| Traceability matrix | IEC 62304 §8 | ✅ | None |
| SBOM (CycloneDX) | FDA/MDCG cybersecurity | ✅ | None |
| Biocompatibility | ISO 10993 | 🔄 | Lab testing required |
| Electrical safety | IEC 60601-1 | 🔄 | Lab testing required |
| EMC testing | IEC 60601-1-2 | 🔄 | Lab testing required |
| Clinical evaluation | MDR Article 61 | 🔄 | Clinical studies required |
| Usability study | IEC 62366-1 | 🔄 | User studies required |
| Labeling (EU) | MDR Annex I §23 | 🔄 | EU-specific labels needed |
| IFU (EU languages) | MDR Annex I §23.4 | 🔄 | Translation required |
| Declaration of Conformity | MDR Article 19 | 🔄 | After NB approval |
| EUDAMED registration | MDR Article 29 | 🔄 | Before CE marking |

### 3.3 IVDR Requirements (HEALTH-LAB)

HEALTH-LAB biosensors (glucose, cortisol, electrolytes, lactate, pH) are subject to **EU IVDR 2017/746** as Class C self-test IVDs.

| IVDR Requirement | Status |
|-----------------|--------|
| Performance evaluation (ISO 15197 for glucose) | 🔄 Clinical studies pending |
| Scientific validity | ✅ Academic papers submitted |
| Analytical performance | ✅ Simulation complete |
| Clinical performance | 🔄 Studies pending |
| Post-market performance follow-up | ✅ PMS plan complete |

---

## 4. Periodic Safety Update Report (PSUR) Template

**Reporting frequency:** Annual (Class IIa/IIb per MDR Article 86)

```
PSUR Report Period: [START DATE] to [END DATE]
Device: [DEVICE NAME] | UDI-DI: [UDI]
Notified Body: [NB NAME] | Certificate No: [CERT NO]

1. Summary of safety and performance data
2. Benefit-risk determination update
3. Conclusions from PMS data
4. Volume of sales / estimated patient exposure
5. Serious incidents and field safety corrective actions
6. Trends in non-serious incidents
7. Feedback from users and healthcare professionals
8. Literature review summary
9. Regulatory actions taken
10. Conclusion and planned actions
```

---

## 5. EU Authorised Representative Declaration Template

```
DECLARATION OF EU AUTHORISED REPRESENTATIVE

[AR Company Name], [Address], [Country]
hereby declares that it acts as the Authorised Representative in the 
European Union for:

Manufacturer: EmbeddedOS Inc., [Address], United States
Device(s): EoS Health Platform (HEALTH-KEY ULTRA, HEALTH-BAND Neuro, 
           HEALTH-RING, HEALTH-LAB)
MDR Classification: Class IIa / Class IIb / IVDR Class C

The Authorised Representative is registered in EUDAMED with SRN: [SRN]

Signed: _________________ Date: _________________
```

---

*Document Owner: EmbeddedOS Regulatory Affairs | Applicable Law: EU MDR 2017/745, EU IVDR 2017/746*  
*Next Review: 2026-12-01 | Maintained in: `regulatory/eu-mdr/`*
