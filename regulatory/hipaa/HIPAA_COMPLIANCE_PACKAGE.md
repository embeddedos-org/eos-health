# EoS Health — HIPAA Compliance Package
**Version:** 1.0 | **Date:** June 2026  
**Regulation:** 45 CFR Parts 160, 162, and 164 (HIPAA/HITECH)

---

## 1. HIPAA Security Rule Risk Analysis (45 CFR §164.308(a)(1))

### Scope of PHI
EoS Health devices collect and transmit the following Protected Health Information (PHI):

| Data Element | Classification | Storage | Transmission |
|---|---|---|---|
| ECG waveforms | PHI | Device NVM (encrypted) + App (SQLCipher) | TLS 1.3 to API |
| Heart rate / HRV | PHI | Device NVM + App | TLS 1.3 |
| SpO₂ readings | PHI | Device NVM + App | TLS 1.3 |
| HbA1c estimates | PHI | Device NVM + App | TLS 1.3 |
| Blood glucose | PHI | Device NVM + App | TLS 1.3 |
| Cortisol / lactate | PHI | Device NVM + App | TLS 1.3 |
| Sleep staging | PHI | App (SQLCipher) | TLS 1.3 |
| Recovery score | PHI | App (SQLCipher) | TLS 1.3 |
| User demographics (age, weight, height) | PHI | App (SQLCipher) | TLS 1.3 |
| Device serial number + user ID | PHI | API database | Encrypted at rest |

### Risk Assessment Summary

| Threat | Likelihood | Impact | Risk Level | Safeguard |
|---|---|---|---|---|
| Unauthorized BLE access | Low | High | Medium | LESC pairing + AES-128 |
| Device theft | Medium | High | High | AES-256 NVM encryption |
| App data breach | Low | High | Medium | SQLCipher + Secure Enclave |
| API breach | Low | Critical | High | TLS 1.3 + JWT + rate limiting |
| Insider threat | Low | High | Medium | Role-based access + audit log |
| Ransomware | Low | High | Medium | Immutable audit log + backups |
| Phishing | Medium | Medium | Medium | MFA for admin accounts |

**Overall Risk Level:** Medium — acceptable with implemented safeguards.

---

## 2. Business Associate Agreement (BAA) Template

```
BUSINESS ASSOCIATE AGREEMENT

This Business Associate Agreement ("BAA") is entered into between:
EoS Health, Inc. ("Business Associate")
and
[COVERED ENTITY NAME] ("Covered Entity")

Effective Date: [DATE]

1. DEFINITIONS
   "PHI" means Protected Health Information as defined in 45 CFR §160.103.
   "HIPAA Rules" means the Privacy, Security, Breach Notification, and Enforcement Rules.

2. OBLIGATIONS OF BUSINESS ASSOCIATE
   a. Business Associate agrees to not use or disclose PHI other than as permitted by this BAA.
   b. Business Associate will use appropriate safeguards to prevent unauthorized use or disclosure.
   c. Business Associate will report any breach of unsecured PHI within 60 days of discovery.
   d. Business Associate will ensure any subcontractors agree to the same restrictions.
   e. Business Associate will make PHI available to Covered Entity upon request.
   f. Business Associate will make its internal practices available to HHS for compliance review.
   g. Business Associate will return or destroy PHI upon termination of this BAA.

3. PERMITTED USES AND DISCLOSURES
   Business Associate may use PHI to provide health data analytics services to Covered Entity.

4. TERM AND TERMINATION
   This BAA remains in effect until terminated. Either party may terminate with 30 days notice.
   Upon termination, Business Associate will return or destroy all PHI within 60 days.

5. MISCELLANEOUS
   This BAA is governed by applicable federal and state law.
   
[SIGNATURES]
```

### Cloud Provider BAAs Required
- [ ] AWS BAA (for API hosting) — available at https://aws.amazon.com/compliance/hipaa-compliance/
- [ ] Google Cloud BAA (if GCP used) — available at https://cloud.google.com/security/compliance/hipaa
- [ ] Twilio BAA (if SMS notifications used)
- [ ] SendGrid BAA (if email notifications used)

---

## 3. Privacy Notice (HIPAA §164.520)

**EoS Health Privacy Notice**  
*Effective Date: [LAUNCH DATE]*

**Your Health Information Rights:**
- You have the right to get a copy of your health information
- You have the right to ask us to correct your health information
- You have the right to request restrictions on how we use your information
- You have the right to get a list of those with whom we've shared your information
- You have the right to get a paper copy of this notice

**How We Use Your Health Information:**
- To provide you with health monitoring services
- To improve our algorithms and device accuracy (de-identified only)
- We will never sell your health data to third parties
- We will never share your health data with employers or insurers without your consent

**Contact:** privacy@embeddedos.org | EoS Health, Inc.

---

## 4. Data Minimization Policy

In accordance with the HIPAA minimum necessary standard (45 CFR §164.502(b)):

| Data Element | Retention Period | Deletion Trigger |
|---|---|---|
| Raw sensor data (ECG, PPG) | 30 days on device | Auto-purge after sync |
| Processed health metrics | 2 years in app | User account deletion |
| PHI in API database | 7 years | User deletion request + 30 days |
| Audit logs | 6 years | Automatic after 6 years |
| Crash logs (anonymized) | 90 days | Automatic |

---

## 5. Breach Response Plan

**Step 1 — Discovery:** Any employee who discovers a potential breach must report to the Privacy Officer within 24 hours.

**Step 2 — Assessment (within 72 hours):**
- Nature of PHI involved
- Who accessed or may have accessed the PHI
- Whether PHI was actually acquired or viewed
- Extent to which risk has been mitigated

**Step 3 — Notification Timeline:**
- **HHS OCR:** Within 60 days of discovery (https://ocrportal.hhs.gov)
- **Affected individuals:** Written notice within 60 days
- **Media (if >500 in a state):** Prominent media outlets within 60 days
- **Business associates:** Notify covered entities within 60 days

**Step 4 — Documentation:** Maintain breach log for 6 years.

---

## 6. Staff Training Requirements

All employees with access to PHI must complete:
- [ ] HIPAA Privacy Rule training (annual, ≥1 hour)
- [ ] HIPAA Security Rule training (annual, ≥1 hour)
- [ ] Breach notification training (annual, 30 minutes)
- [ ] Training records maintained for 6 years
