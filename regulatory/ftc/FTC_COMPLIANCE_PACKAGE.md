# EoS Health — FTC Compliance Package
**Version:** 1.0 | **Date:** June 2026  
**Regulation:** FTC Act Section 5 + Health Products Compliance Guidance (2022) + Endorsement Guides (16 CFR Part 255)

---

## 1. Health Claim Substantiation Matrix

All advertising claims must be substantiated with "competent and reliable scientific evidence" before use.

| Claim | Device | Required Evidence | Current Status | Approved for Use? |
|---|---|---|---|---|
| "Detects atrial fibrillation" | HEALTH-RING | Clinical study, AUC ≥0.97, n≥100 | ❌ Simulated only | **NO** — add disclaimer |
| "Measures HbA1c" | HEALTH-RING | NGSP/IFCC clinical study, n≥200 | ❌ Simulated only | **NO** — add disclaimer |
| "Monitors blood glucose" | HEALTH-LAB | ISO 15197 study, n≥50 | ❌ Simulated only | **NO** — add disclaimer |
| "Measures blood pressure" | HEALTH-RING | AAMI SP10 study, n≥85 | ❌ Simulated only | **NO** — add disclaimer |
| "Measures heart rate" | All | Published PPG validation | ✅ Extensive literature | **YES** |
| "Measures SpO₂" | KEY ULTRA | ISO 80601-2-61 study | ❌ Simulated only | **NO** — add disclaimer |
| "Measures sleep stages" | All | Published actigraphy validation | ✅ Extensive literature | **YES** (with accuracy caveat) |
| "Measures HRV" | All | Published HRV validation | ✅ Extensive literature | **YES** |
| "Reduces muscle fatigue" (TENS) | BAND Neuro | RCT, n≥80 | ❌ Not started | **NO** — do not claim |
| "Measures stress" (EDA) | BAND Neuro | EDA validation study | ❌ Not started | **NO** — add disclaimer |
| "Measures BAC" | KEY ULTRA | NHTSA/NIAAA validation | ❌ Not started | **NO** — add disclaimer |

---

## 2. Required Disclaimers (Pre-Clearance)

All marketing, packaging, and app UI must include these disclaimers until clinical studies are complete:

**For all devices:**
> "For general wellness and informational purposes only. Not intended to diagnose, treat, cure, or prevent any disease or medical condition. Not a substitute for professional medical advice. Consult your healthcare provider before making any medical decisions based on this device."

**For HEALTH-RING (HbA1c, BP, AFib):**
> "HbA1c, blood pressure, and AFib detection features are in research mode. Results have not been validated in clinical studies and should not be used for medical diagnosis or treatment decisions."

**For HEALTH-LAB (glucose, cortisol, lactate):**
> "Glucose, cortisol, and lactate measurements are for wellness tracking only. HEALTH-LAB is not a medical glucose monitor and must not be used to make insulin dosing decisions."

**For HEALTH-KEY ULTRA (BAC):**
> "Transdermal alcohol monitoring is for informational purposes only. Do not use to determine fitness to drive. Results may vary based on individual physiology."

**For HEALTH-BAND Neuro (TENS):**
> "TENS therapy is for muscle relaxation only. Do not use if you have a pacemaker, are pregnant, or have epilepsy. Consult your physician before use."

---

## 3. Endorsement and Testimonial Policy (16 CFR Part 255)

**Required Disclosures:**
- All paid endorsers must disclose their material connection to EoS Health
- All influencer posts must include #ad or #sponsored
- Typical results must be disclosed if testimonials are used
- Expert endorsers must have genuine expertise and the endorsement must reflect their honest opinion

**Prohibited Practices:**
- Fake reviews or testimonials
- Paying for positive reviews without disclosure
- Using before/after photos without disclosing typical results
- Claiming celebrity endorsement without written agreement

---

## 4. Marketing Review Checklist

Before publishing any marketing material (website, app store, social media, press release):

- [ ] All health claims reviewed against substantiation matrix above
- [ ] Required disclaimers present and legible (minimum 8pt font)
- [ ] No claims about diagnosing, treating, curing, or preventing disease (unless FDA cleared)
- [ ] Paid endorsements disclosed
- [ ] Typical results disclosed for testimonials
- [ ] No false comparative claims against competitors
- [ ] Legal review completed
- [ ] QA sign-off obtained

---

## 5. Post-Clearance Claim Upgrade Plan

Once clinical studies are complete, claims can be upgraded:

| Milestone | Claim Unlocked |
|---|---|
| SpO₂ ISO 80601-2-61 study complete | "Clinically validated SpO₂ accuracy" |
| AFib clinical study complete (AUC ≥0.97) | "FDA-cleared AFib detection" (after 510k/De Novo) |
| HbA1c NGSP study complete | "Non-invasive HbA1c monitoring" |
| Glucose ISO 15197 study complete | "Clinically validated glucose monitoring" |
| TENS RCT complete | "Clinically proven muscle recovery" |
