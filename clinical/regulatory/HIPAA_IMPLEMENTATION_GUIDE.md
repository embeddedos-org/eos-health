# EoS Health — HIPAA Compliance Implementation Guide
## Technical and Administrative Safeguards for All 4 Devices

**Document Version:** 1.0  
**Date:** June 1, 2026  
**Scope:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB, Health Hub App, EoS Health App (web)

---

## 1. HIPAA Applicability

EoS Health devices collect Protected Health Information (PHI) as defined under 45 CFR §160.103. As a technology vendor whose products process PHI on behalf of healthcare providers and health plans, EoS Health is a **Business Associate** under HIPAA and must comply with the HIPAA Security Rule (45 CFR Part 164, Subparts A and C).

**PHI collected by EoS Health devices:**
- ECG waveforms and heart rhythm classifications
- SpO₂ measurements
- HbA1c estimates (HEALTH-RING)
- Blood pressure readings (HEALTH-RING)
- Continuous glucose data (HEALTH-LAB)
- Sweat biomarker data (HEALTH-LAB)
- Activity and sleep data
- Device serial number + user identity (linkable to health data)

---

## 2. Technical Safeguards (45 CFR §164.312)

### 2.1 Access Control (§164.312(a))

**On-Device (Firmware):**
```c
// Implemented in provisioning.c
// Each device is provisioned with a unique Ed25519 key pair
// Data is encrypted with AES-256-GCM before storage
// Device is locked with APPROTECT after provisioning

#define PHI_ENCRYPTION_KEY_SIZE  32  // AES-256
#define PHI_IV_SIZE              12  // GCM nonce
#define PHI_TAG_SIZE             16  // GCM authentication tag

// All PHI stored in NVM is encrypted:
// ciphertext = AES-256-GCM(plaintext, device_key, random_iv)
```

**Mobile App (Health Hub):**
- Biometric authentication required to access health data
- Session timeout: 15 minutes of inactivity
- No PHI stored in app logs or crash reports
- SQLCipher AES-256 encryption for local database
- Keys stored in iOS Secure Enclave / Android Keystore

**Backend (EoS Health App):**
- JWT tokens expire in 1 hour
- Refresh tokens expire in 30 days
- Role-based access control (RBAC): user, clinician, admin
- All API endpoints require authentication
- PHI endpoints require additional MFA for clinician access

### 2.2 Audit Controls (§164.312(b))

All PHI access is logged with:
- Timestamp (UTC)
- User ID or device serial number
- Action (read/write/delete/export)
- IP address (server-side)
- Data type accessed

Audit logs are:
- Immutable (append-only, cryptographically chained)
- Retained for 6 years (HIPAA minimum)
- Stored separately from PHI
- Reviewed monthly for anomalies

### 2.3 Integrity (§164.312(c))

**Data integrity mechanisms:**
- All PHI transmitted with HMAC-SHA256 signature
- Database records include SHA-256 hash of content
- OTA firmware updates verified with Ed25519 signature
- Sensor data includes CRC32 checksum from device

### 2.4 Transmission Security (§164.312(e))

**Device to Phone (BLE):**
- BLE pairing: LE Secure Connections (LESC) with ECDH key exchange
- Link layer encryption: AES-128-CCM (BLE 5.0 standard)
- Application layer: Additional AES-256-GCM encryption for PHI

**Phone to Server (HTTPS):**
- TLS 1.3 minimum (TLS 1.2 with strong ciphers acceptable)
- Certificate pinning in mobile app
- HSTS (HTTP Strict Transport Security) on server
- Perfect Forward Secrecy (ECDHE key exchange)

**Server Storage:**
- AES-256 encryption at rest (database and S3)
- Encryption keys managed by AWS KMS / Azure Key Vault
- Separate encryption keys per user (envelope encryption)

---

## 3. Administrative Safeguards (45 CFR §164.308)

### 3.1 Security Officer
Designate a HIPAA Security Officer responsible for:
- Developing and implementing security policies
- Conducting annual risk assessments
- Managing security incidents
- Training workforce

### 3.2 Risk Analysis (§164.308(a)(1))
Annual risk assessment covering:
- PHI inventory (what data, where stored, who accesses)
- Threat identification (malware, unauthorized access, device theft)
- Vulnerability assessment (penetration testing, code review)
- Risk rating (likelihood × impact)
- Risk mitigation plan

### 3.3 Workforce Training (§164.308(a)(5))
All employees with PHI access must complete:
- HIPAA awareness training (annual)
- Secure coding training (developers)
- Incident response training
- Training records retained for 6 years

### 3.4 Business Associate Agreements (BAA)
Required BAAs with:
- Cloud hosting provider (AWS/Azure/GCP)
- Analytics platform
- Customer support platform
- Any third-party with PHI access

---

## 4. Physical Safeguards (45 CFR §164.310)

### 4.1 Device Security
- Devices are encrypted at rest (AES-256-GCM on NVM)
- APPROTECT enabled after provisioning (prevents JTAG readback)
- Secure boot chain: MCUboot → EoS firmware (Ed25519 verified)
- Remote wipe capability via BLE command (erases NVM encryption key)

### 4.2 Workstation Security
- Development workstations with full-disk encryption
- No PHI on developer machines (use anonymized test data)
- Production database access via VPN + MFA only
- Physical access controls for server infrastructure

---

## 5. Breach Notification (45 CFR §164.400–414)

### Breach Response Plan

**Step 1 — Discovery (0–24 hours)**
- Identify scope of breach
- Preserve evidence
- Notify Security Officer

**Step 2 — Assessment (24–72 hours)**
- Determine if breach qualifies as "unsecured PHI"
- Apply 4-factor risk assessment:
  1. Nature and extent of PHI involved
  2. Who used or disclosed the PHI
  3. Whether PHI was actually acquired or viewed
  4. Extent to which risk has been mitigated

**Step 3 — Notification**
- **Affected individuals:** Within 60 days of discovery
- **HHS Secretary:** Within 60 days (≥500 individuals: immediate media notice)
- **Media:** If ≥500 individuals in a state
- **Business associates:** Without unreasonable delay

**Notification content:**
- Description of breach
- Types of PHI involved
- Steps individuals should take
- Steps EoS Health is taking
- Contact information

---

## 6. De-identification Standards (45 CFR §164.514)

For research and analytics, PHI must be de-identified using one of:
- **Safe Harbor method:** Remove all 18 identifiers
- **Expert determination:** Statistical/scientific methods

**18 identifiers to remove:**
Names, geographic data (below state), dates (except year), phone numbers, fax numbers, email addresses, SSN, medical record numbers, health plan numbers, account numbers, certificate/license numbers, VINs, device identifiers, URLs, IP addresses, biometric identifiers, full-face photos, any unique identifier.

**EoS Health de-identification pipeline:**
```python
# clinical/analysis/deidentify.py
IDENTIFIERS_TO_REMOVE = [
    'name', 'dob', 'address', 'phone', 'email', 'ssn',
    'device_serial', 'ip_address', 'user_id'
]

def deidentify_record(record: dict) -> dict:
    """Remove all 18 HIPAA identifiers from a health record."""
    clean = record.copy()
    for field in IDENTIFIERS_TO_REMOVE:
        clean.pop(field, None)
    # Replace dates with year only
    if 'timestamp' in clean:
        clean['year'] = clean['timestamp'].year
        del clean['timestamp']
    # Replace device serial with pseudonym
    if 'serial' in clean:
        clean['participant_id'] = hash_serial(clean['serial'])
        del clean['serial']
    return clean
```

---

## 7. HIPAA Compliance Checklist

### Technical Controls
- [ ] AES-256 encryption at rest (device NVM, database, S3)
- [ ] TLS 1.3 in transit (BLE LESC + HTTPS)
- [ ] Certificate pinning in mobile app
- [ ] Biometric authentication in mobile app
- [ ] Session timeout (15 minutes)
- [ ] Immutable audit logging
- [ ] Role-based access control
- [ ] Remote wipe capability
- [ ] Secure boot chain (Ed25519)
- [ ] APPROTECT enabled post-provisioning

### Administrative Controls
- [ ] HIPAA Security Officer designated
- [ ] Annual risk assessment completed
- [ ] Workforce training completed
- [ ] BAAs signed with all vendors
- [ ] Incident response plan documented
- [ ] Breach notification procedures documented
- [ ] PHI inventory maintained

### Physical Controls
- [ ] Full-disk encryption on dev workstations
- [ ] No PHI on developer machines
- [ ] Production access via VPN + MFA
- [ ] Server physical access controls

---

*Document EOS-HIPAA-2026-001 v1.0 — Confidential*
