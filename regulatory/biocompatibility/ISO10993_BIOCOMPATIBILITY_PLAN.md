# ISO 10993 Biocompatibility Testing Plan
## EoS Health — All 4 Devices
**Standard:** ISO 10993-1:2018 (Biological Evaluation of Medical Devices — Part 1: Evaluation and Testing Within a Risk Management Process)  
**Companion Standards:** ISO 10993-5 (Cytotoxicity), ISO 10993-10 (Sensitization), ISO 10993-23 (Irritation), ISO 10993-4 (Hemolysis), ISO 10993-13 (Leachables), ISO 10993-17 (Toxicological Risk Assessment)  
**Date:** June 2026 | **Version:** 1.0 | **Status:** Ready for Lab Submission

---

## 1. Regulatory Basis

FDA requires biocompatibility evaluation for all medical devices that contact the body. Per FDA's Use of International Standard ISO 10993-1 (2020 Guidance), a risk-based approach using the ISO 10993-1:2018 framework is the accepted pathway. All 4 EoS Health devices have **skin contact** (external communicating device) and require biocompatibility testing before 510(k) or De Novo submission.

**Contact Classification per ISO 10993-1 Table A.1:**

| Device | Contact Type | Contact Duration | ISO 10993-1 Category |
|---|---|---|---|
| HEALTH-KEY ULTRA | Surface device — skin contact | Limited (≤24h per session) | A.1.1 — Surface, Skin, Limited |
| HEALTH-BAND Neuro | Surface device — skin contact + electrode contact | Prolonged (24h–30 days) | A.1.2 — Surface, Skin, Prolonged |
| HEALTH-RING | Surface device — skin contact | Prolonged (24h–30 days) | A.1.2 — Surface, Skin, Prolonged |
| HEALTH-LAB | Surface device — skin contact + adhesive | Prolonged (24h–30 days) | A.1.2 — Surface, Skin, Prolonged |

---

## 2. Materials Inventory by Device

### HEALTH-KEY ULTRA
| Component | Material | Skin Contact? | CAS / Grade |
|---|---|---|---|
| Enclosure | Medical-grade ABS (UL 94 V-0) | Yes (grip area) | SABIC Cycolac MG47F |
| USB-C connector | Stainless steel 316L | No | — |
| ECG contact pads | Stainless steel 316L | Yes (fingertip) | ASTM F138 |
| PPG window | Optical-grade PMMA | Yes (fingertip) | Evonik PLEXIGLAS 7N |
| Battery | LiPo (sealed) | No | — |
| Adhesive (label) | Acrylic pressure-sensitive | No (label only) | — |

### HEALTH-BAND Neuro
| Component | Material | Skin Contact? | CAS / Grade |
|---|---|---|---|
| Strap | Medical-grade silicone | Yes (continuous) | Dow SILASTIC MDX4-4210 |
| sEMG electrodes | Ag/AgCl (silver/silver chloride) | Yes (continuous) | ISO 13485-qualified |
| TENS electrodes | Ag/AgCl | Yes (continuous) | ISO 13485-qualified |
| Core enclosure | Medical-grade PC/ABS | Yes (wrist) | Covestro Bayblend T85 |
| Clasp | Stainless steel 316L | Yes (wrist) | ASTM F138 |
| Electrode gel | Hydrogel (polyacrylamide) | Yes (continuous) | USP Class VI |

### HEALTH-RING
| Component | Material | Skin Contact? | CAS / Grade |
|---|---|---|---|
| Ring body | Grade 23 Ti-6Al-4V ELI | Yes (continuous) | ASTM F136 |
| Inner coating | Medical-grade parylene C | Yes (continuous) | Specialty Coating Systems |
| PPG window | Sapphire glass | Yes (continuous) | Mohs 9, inert |
| ECG contacts | Platinum-iridium (Pt-10%Ir) | Yes (continuous) | ASTM F67 |
| NFC antenna | Copper (sealed in ring) | No | — |

### HEALTH-LAB
| Component | Material | Skin Contact? | CAS / Grade |
|---|---|---|---|
| Patch substrate | Medical-grade PET | Yes (continuous) | DuPont Melinex ST504 |
| Adhesive layer | Medical-grade acrylic | Yes (continuous) | 3M 1524 Medical Adhesive |
| Electrode array | Carbon + Ag/AgCl | Yes (continuous) | ISO 13485-qualified |
| Enzyme layer | GOx/LOx/CortBP enzymes | Yes (continuous) | Sigma-Aldrich BioXtra grade |
| Hydrogel reservoir | PVA hydrogel | Yes (continuous) | USP Class VI |
| Backing film | Medical-grade polyurethane | Yes (continuous) | Covestro Desmopan 9370 |

---

## 3. Required Tests by Device (ISO 10993-1 Table A.2)

### Test Matrix

| Test | Standard | KEY ULTRA | BAND Neuro | RING | LAB |
|---|---|---|---|---|---|
| Cytotoxicity | ISO 10993-5 | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Sensitization | ISO 10993-10 | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Irritation | ISO 10993-23 | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Systemic toxicity (acute) | ISO 10993-11 | — | ✅ Required | ✅ Required | ✅ Required |
| Subacute/subchronic toxicity | ISO 10993-11 | — | ✅ Required | ✅ Required | ✅ Required |
| Genotoxicity | ISO 10993-3 | — | ✅ Required | ✅ Required | ✅ Required |
| Implantation | ISO 10993-6 | — | — | — | — |
| Hemocompatibility | ISO 10993-4 | — | — | — | — |
| Leachables/extractables | ISO 10993-13/17 | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| Pyrogenicity | ISO 10993-11 | — | ✅ Required | ✅ Required | ✅ Required |

**Justification for omissions:**
- Implantation: Not applicable — no implanted components
- Hemocompatibility: Not applicable — no blood contact
- Systemic toxicity (KEY ULTRA): Limited contact duration (<24h per session) reduces risk; toxicological risk assessment sufficient per ISO 10993-17

---

## 4. Test Protocols

### 4.1 Cytotoxicity (ISO 10993-5:2009)

**Method:** Elution method (ISO 10993-5 §8.3) — preferred for solid materials  
**Cell line:** L-929 mouse fibroblast (ATCC CCL-1)  
**Extract preparation:** 37°C, 24h, 0.1 g/mL in DMEM + 10% FBS  
**Positive control:** 0.1% phenol solution  
**Negative control:** High-density polyethylene (HDPE)  
**Pass criterion:** Cell viability ≥70% of negative control (Grade 0–1 per ISO 10993-5 §8.5)

**Samples required per device:** 3 replicates of each skin-contact material  
**Estimated cost:** $800–$1,500 per material  
**Estimated timeline:** 2–3 weeks

### 4.2 Sensitization (ISO 10993-10:2021)

**Method:** Guinea Pig Maximization Test (GPMT) per ISO 10993-10 §6.3 — preferred for new materials  
**Alternative:** Local Lymph Node Assay (LLNA) per ISO 10993-10 §6.4 — acceptable for well-characterized materials  
**Animals:** 20 guinea pigs (10 test, 10 control) for GPMT  
**Induction phase:** Days 0, 7 (intradermal + topical)  
**Challenge phase:** Day 21 (topical, 24h occlusion)  
**Reading:** 24h and 48h post-challenge  
**Pass criterion:** <30% reaction rate (Grade 0–1 per Magnusson-Kligman scale)

**Estimated cost:** $3,000–$6,000 per material  
**Estimated timeline:** 6–8 weeks

### 4.3 Irritation (ISO 10993-23:2021)

**Method:** In vitro reconstructed human epidermis (RhE) — EpiDerm™ (MatTek) or SkinEthic™  
**Exposure:** 60 min (acute) or 24h (prolonged contact)  
**Endpoint:** MTT cell viability assay  
**Pass criterion:** Cell viability ≥50% (acute), ≥35% (prolonged) vs. negative control  
**Positive control:** 5% SDS  
**Negative control:** PBS

**Estimated cost:** $1,500–$3,000 per material  
**Estimated timeline:** 2–3 weeks

### 4.4 Leachables/Extractables (ISO 10993-13:2010 + ISO 10993-17:2002)

**Method:**  
1. Exhaustive extraction: simulated sweat (ISO 105-E04), 37°C, 72h  
2. Analytical characterization: GC-MS, LC-MS/MS, ICP-MS (metals)  
3. Toxicological risk assessment: compare identified leachables to Threshold of Toxicological Concern (TTC) per ISO 10993-17

**Samples:** 3 samples per device (full device extraction)  
**Estimated cost:** $5,000–$15,000 per device  
**Estimated timeline:** 6–10 weeks

### 4.5 Genotoxicity (ISO 10993-3:2014) — RING and LAB only

**Tests required:**
1. Ames test (bacterial reverse mutation) — ISO 10993-3 §5.2
2. In vitro chromosomal aberration or micronucleus test — ISO 10993-3 §5.3

**Pass criterion:** Negative result in both tests  
**Estimated cost:** $3,000–$6,000 per device  
**Estimated timeline:** 4–6 weeks

---

## 5. Existing Material Justifications (Reducing Testing Burden)

Per ISO 10993-1 §6.2, existing data can substitute for new testing when materials are well-characterized with a history of safe use.

| Material | Existing Data | Testing Reduction |
|---|---|---|
| Grade 23 Ti-6Al-4V ELI (ASTM F136) | Extensive ISO 10993 data for orthopedic implants; USP Class VI | Cytotoxicity, sensitization, irritation may be waived with literature review |
| Medical-grade silicone (Dow SILASTIC MDX4-4210) | USP Class VI, ISO 10993-5/10/23 certified by manufacturer | All tests may be waived with CoC from Dow |
| Ag/AgCl electrodes | Extensive history in ECG/EEG devices; FDA-cleared predicates | Cytotoxicity and sensitization may be waived with literature review |
| 3M 1524 Medical Adhesive | ISO 10993-5/10/23 certified by 3M | All tests may be waived with 3M CoC |
| Parylene C | USP Class VI; extensive biocompatibility data | Cytotoxicity, sensitization, irritation may be waived |

**Estimated testing reduction:** 40–60% of tests can be waived with manufacturer certificates of conformance (CoC) and literature review, reducing total biocompatibility cost by $20,000–$40,000.

---

## 6. Biocompatibility Risk Assessment Summary

Per ISO 10993-1 §4, a biological evaluation report (BER) must be prepared for each device summarizing:

1. Device description and intended use
2. Materials characterization (Section 2 above)
3. Contact classification (Section 1 above)
4. Existing data review (Section 5 above)
5. Test plan (Sections 3–4 above)
6. Test results (to be completed after testing)
7. Risk assessment conclusion

**BER Template Location:** `regulatory/biocompatibility/BER_{DEVICE}.md` (to be completed after testing)

---

## 7. Cost and Timeline Summary

| Device | Tests Required | Estimated Cost | Estimated Timeline |
|---|---|---|---|
| HEALTH-KEY ULTRA | Cytotox, sensitization, irritation, leachables | $12,000–$25,000 | 8–12 weeks |
| HEALTH-BAND Neuro | All above + systemic toxicity, genotoxicity, pyrogenicity | $25,000–$50,000 | 10–16 weeks |
| HEALTH-RING | All above + genotoxicity | $25,000–$50,000 | 10–16 weeks |
| HEALTH-LAB | All above + genotoxicity (adhesive + enzyme) | $30,000–$60,000 | 12–18 weeks |
| **Total** | | **$92,000–$185,000** | **12–18 weeks** |

**Recommended lab:** Nelson Labs (Salt Lake City, UT) — largest ISO 10993 testing lab in North America; FDA-recognized; one-stop for all tests.

---

## 8. Submission Checklist

- [x] Materials inventory complete for all 4 devices
- [x] Contact classification determined per ISO 10993-1 Table A.1
- [x] Test matrix defined per ISO 10993-1 Table A.2
- [x] Existing material data identified (CoC reduction strategy)
- [ ] Engage Nelson Labs — request quote and timeline
- [ ] Submit samples (5 per device) to Nelson Labs
- [ ] Receive and review cytotoxicity results (Week 3)
- [ ] Receive and review sensitization results (Week 8)
- [ ] Receive and review all remaining test results (Week 16)
- [ ] Prepare Biological Evaluation Report (BER) for each device
- [ ] Include BER in FDA 510(k) / De Novo submission package
