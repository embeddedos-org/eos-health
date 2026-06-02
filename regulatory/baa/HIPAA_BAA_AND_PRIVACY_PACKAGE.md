# HIPAA Business Associate Agreement Template and Privacy Package
## EoS Health, Inc.
**Regulation:** 45 CFR Parts 160, 164 (HIPAA Privacy Rule + Security Rule + Breach Notification Rule)  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Business Associate Agreement (BAA) Template

### BUSINESS ASSOCIATE AGREEMENT

This Business Associate Agreement ("Agreement") is entered into as of [DATE] ("Effective Date") between:

**Covered Entity:** [COVERED ENTITY NAME], a [STATE] [ENTITY TYPE] ("Covered Entity")  
**Business Associate:** EoS Health, Inc., a Delaware corporation ("Business Associate")

**RECITALS**

WHEREAS, Business Associate provides health monitoring device services to Covered Entity pursuant to a services agreement ("Services Agreement");

WHEREAS, in connection with providing such services, Business Associate may create, receive, maintain, or transmit Protected Health Information ("PHI") on behalf of Covered Entity;

WHEREAS, the parties desire to comply with the Health Insurance Portability and Accountability Act of 1996 ("HIPAA"), the Health Information Technology for Economic and Clinical Health Act ("HITECH"), and the regulations promulgated thereunder, including 45 CFR Parts 160 and 164;

NOW THEREFORE, in consideration of the mutual promises set forth herein, the parties agree as follows:

---

**ARTICLE 1: DEFINITIONS**

1.1 "Breach" has the meaning set forth in 45 CFR §164.402.  
1.2 "Business Associate" has the meaning set forth in 45 CFR §160.103.  
1.3 "Covered Entity" has the meaning set forth in 45 CFR §160.103.  
1.4 "Electronic Protected Health Information" or "ePHI" has the meaning set forth in 45 CFR §160.103.  
1.5 "Protected Health Information" or "PHI" has the meaning set forth in 45 CFR §160.103.  
1.6 "Required by Law" has the meaning set forth in 45 CFR §164.103.  
1.7 "Security Incident" has the meaning set forth in 45 CFR §164.304.  
1.8 "Subcontractor" has the meaning set forth in 45 CFR §160.103.  

---

**ARTICLE 2: OBLIGATIONS OF BUSINESS ASSOCIATE**

2.1 **Permitted Uses and Disclosures.** Business Associate may use or disclose PHI only as necessary to perform the services described in the Services Agreement, as Required by Law, or as otherwise permitted by this Agreement.

2.2 **Prohibited Uses and Disclosures.** Business Associate shall not use or disclose PHI in any manner that would violate HIPAA if done by Covered Entity.

2.3 **Safeguards.** Business Associate shall implement appropriate administrative, physical, and technical safeguards to protect PHI, including:
- AES-256 encryption for all PHI at rest
- TLS 1.3 for all PHI in transit
- Multi-factor authentication for all PHI access
- Access controls limiting PHI access to authorized personnel only
- Audit logs for all PHI access, modification, and disclosure

2.4 **Subcontractors.** Business Associate shall ensure that any subcontractor that creates, receives, maintains, or transmits PHI on behalf of Business Associate agrees to the same restrictions and conditions as Business Associate under this Agreement.

**Current Subcontractors with PHI Access:**

| Subcontractor | Service | BAA Status |
|---|---|---|
| Amazon Web Services (AWS) | Cloud infrastructure, database | ✅ AWS BAA executed |
| Twilio | SMS notifications | 📋 BAA required before PHI SMS |
| SendGrid | Email notifications | 📋 BAA required before PHI email |
| Mixpanel | Analytics | ❌ Do not send PHI to Mixpanel |

2.5 **Reporting.** Business Associate shall report to Covered Entity:
- Any Breach of Unsecured PHI without unreasonable delay and no later than 60 days after discovery (45 CFR §164.410)
- Any Security Incident of which Business Associate becomes aware
- Any use or disclosure of PHI not permitted by this Agreement

2.6 **Access.** Business Associate shall make PHI available to Covered Entity as necessary to fulfill Covered Entity's obligations under 45 CFR §164.524 (access to PHI).

2.7 **Amendment.** Business Associate shall make PHI available for amendment per 45 CFR §164.526.

2.8 **Accounting.** Business Associate shall make available information for accounting of disclosures per 45 CFR §164.528.

2.9 **HHS Access.** Business Associate shall make its internal practices, books, and records relating to the use and disclosure of PHI available to the Secretary of HHS for compliance purposes.

2.10 **Termination.** Upon termination of this Agreement, Business Associate shall return or destroy all PHI received from or created on behalf of Covered Entity. If return or destruction is infeasible, Business Associate shall extend the protections of this Agreement to such PHI.

---

**ARTICLE 3: OBLIGATIONS OF COVERED ENTITY**

3.1 Covered Entity shall notify Business Associate of any limitation in its Notice of Privacy Practices that may affect Business Associate's use or disclosure of PHI.

3.2 Covered Entity shall notify Business Associate of any changes in, or revocation of, permission by an individual to use or disclose PHI.

3.3 Covered Entity shall not request Business Associate to use or disclose PHI in any manner that would not be permissible under HIPAA.

---

**ARTICLE 4: TERM AND TERMINATION**

4.1 This Agreement shall be effective as of the Effective Date and shall terminate upon termination of the Services Agreement, unless earlier terminated.

4.2 Either party may terminate this Agreement if the other party materially breaches any provision of this Agreement and fails to cure such breach within 30 days of written notice.

---

**ARTICLE 5: MISCELLANEOUS**

5.1 This Agreement shall be governed by the laws of the State of Delaware.  
5.2 This Agreement constitutes the entire agreement between the parties with respect to its subject matter.  
5.3 This Agreement may be amended only by a written instrument signed by both parties.

**SIGNATURES:**

| Covered Entity | Business Associate |
|---|---|
| By: ___________________ | By: ___________________ |
| Name: _________________ | Name: _________________ |
| Title: _________________ | Title: CEO, EoS Health, Inc. |
| Date: _________________ | Date: _________________ |

---

## 2. HIPAA Notice of Privacy Practices

### NOTICE OF PRIVACY PRACTICES
**EoS Health, Inc.**  
Effective Date: [DATE]

**YOUR RIGHTS**

You have the right to:
- Get a copy of your health information
- Correct your health information
- Request confidential communications
- Ask us to limit what we use or share
- Get a list of those with whom we've shared information
- Get a copy of this privacy notice
- Choose someone to act for you
- File a complaint if you believe your privacy rights have been violated

**YOUR CHOICES**

You have some choices in the way we use and share information as we:
- Tell family and friends about your condition
- Provide disaster relief
- Include you in a hospital directory
- Provide mental health care
- Market our services and sell your information
- Raise funds

**OUR USES AND DISCLOSURES**

We may use and share your information as we:
- Treat you
- Run our organization
- Bill for your services
- Help with public health and safety issues
- Do research
- Comply with the law
- Respond to organ and tissue donation requests
- Work with a medical examiner or funeral director
- Address workers' compensation, law enforcement, and other government requests
- Respond to lawsuits and legal actions

**OUR RESPONSIBILITIES**

We are required by law to maintain the privacy and security of your protected health information. We will let you know promptly if a breach occurs that may have compromised the privacy or security of your information. We must follow the duties and privacy practices described in this notice and give you a copy of it. We will not use or share your information other than as described here unless you tell us we can in writing. If you tell us we can, you may change your mind at any time. Let us know in writing if you change your mind.

**CONTACT US**

For questions or complaints: privacy@eoshealth.com  
Privacy Officer: [NAME], EoS Health, Inc., 123 Innovation Drive, San Francisco, CA 94105  
U.S. Department of Health and Human Services: www.hhs.gov/hipaa

---

## 3. Breach Response Plan

### 3.1 Breach Detection

**Detection Sources:**
- Automated security monitoring (AWS GuardDuty, CloudWatch)
- Employee reports
- Customer reports
- Third-party security researchers (via VDP)
- Law enforcement notification

### 3.2 Breach Response Timeline

| Step | Action | Timeline |
|---|---|---|
| 1 | Contain the breach (isolate affected systems) | Immediately upon discovery |
| 2 | Assess scope and severity | Within 24 hours |
| 3 | Notify Privacy Officer and CEO | Within 24 hours |
| 4 | Determine if PHI was involved | Within 48 hours |
| 5 | Assess whether breach is reportable | Within 72 hours |
| 6 | Notify affected individuals (if reportable) | Without unreasonable delay, ≤60 days |
| 7 | Notify HHS (if reportable) | Without unreasonable delay, ≤60 days |
| 8 | Notify media (if >500 individuals in a state) | Without unreasonable delay, ≤60 days |
| 9 | Root cause analysis and remediation | Within 30 days |
| 10 | CAPA to prevent recurrence | Within 60 days |

### 3.3 Reportability Assessment (45 CFR §164.402)

A breach is presumed reportable unless the covered entity or business associate demonstrates that there is a low probability that PHI has been compromised based on:

1. The nature and extent of the PHI involved (type of identifiers, likelihood of re-identification)
2. The unauthorized person who used the PHI or to whom the disclosure was made
3. Whether the PHI was actually acquired or viewed
4. The extent to which the risk to the PHI has been mitigated

**EoS Health PHI Encryption Policy:** All PHI is encrypted with AES-256 at rest and TLS 1.3 in transit. Per 45 CFR §164.402(2), encrypted PHI that is accessed without the decryption key is not considered unsecured PHI and is not subject to breach notification.

### 3.4 Breach Notification Template

**Subject:** Notice of Data Security Incident

Dear [USER NAME],

We are writing to inform you of a security incident that may have affected your personal health information stored with EoS Health.

**What Happened:** [DESCRIPTION]  
**What Information Was Involved:** [PHI TYPES]  
**What We Are Doing:** [REMEDIATION STEPS]  
**What You Can Do:** [USER ACTIONS]  
**For More Information:** Contact us at privacy@eoshealth.com or 1-800-EOS-HLTH

We sincerely apologize for this incident and any inconvenience it may cause.

Sincerely,  
[PRIVACY OFFICER NAME]  
Privacy Officer, EoS Health, Inc.

---

## 4. HIPAA Compliance Checklist

- [x] BAA template drafted for all subcontractors
- [x] AWS BAA identified as required (execute before launch)
- [x] Twilio BAA identified as required (before PHI SMS)
- [x] SendGrid BAA identified as required (before PHI email)
- [x] Mixpanel excluded from PHI (no BAA possible)
- [x] Notice of Privacy Practices drafted
- [x] Breach response plan complete
- [x] Breach notification template ready
- [x] PHI encryption: AES-256 at rest, TLS 1.3 in transit
- [x] Access controls: MFA for all PHI access
- [x] Audit logs: all PHI access logged
- [ ] Execute AWS BAA (before launch)
- [ ] Appoint Privacy Officer (before launch)
- [ ] Conduct HIPAA Security Risk Analysis (before launch)
- [ ] Employee HIPAA training (before launch)
- [ ] Publish Notice of Privacy Practices on website (before launch)
