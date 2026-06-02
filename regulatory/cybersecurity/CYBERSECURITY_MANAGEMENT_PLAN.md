# EoS Health — Cybersecurity Management Plan (CMP)
**Version:** 1.0 | **Date:** June 2026  
**Applies to:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB  
**Framework:** FDA Cybersecurity Guidance (2023) + NIST CSF 2.0 + UL 2900-1

---

## 1. Scope and Purpose

This Cybersecurity Management Plan (CMP) documents the cybersecurity controls, threat model, vulnerability management procedures, and incident response plan for all EoS Health devices. It is prepared in accordance with the FDA's 2023 guidance "Cybersecurity in Medical Devices: Quality System Considerations and Content of Premarket Submissions."

---

## 2. NIST CSF 2.0 Implementation

### GOVERN
- **Cybersecurity Policy:** All EoS Health firmware must implement Ed25519-signed OTA updates, AES-256 data encryption, and APPROTECT lock after provisioning.
- **Roles:** Chief Security Officer (CSO) — responsible for all cybersecurity decisions; Firmware Lead — responsible for secure coding; QA Lead — responsible for security testing.
- **Supply Chain:** All third-party libraries must be reviewed for known CVEs before inclusion. SBOM maintained in CycloneDX format.

### IDENTIFY
- **Asset Inventory:** See SBOM (Section 4).
- **Risk Assessment:** Threat model (Section 5) identifies all attack surfaces.
- **Vulnerability Management:** CVE scanning via OSV.dev on every firmware release.

### PROTECT
| Control | Implementation | Standard |
|---|---|---|
| OTA authentication | Ed25519 signature verification (MCUboot) | NIST SP 800-131A |
| Data encryption at rest | AES-256-GCM (SQLCipher) | NIST FIPS 197 |
| Data encryption in transit | TLS 1.3 with certificate pinning | NIST SP 800-52 Rev 2 |
| BLE pairing | LE Secure Connections (LESC), MITM protection | Bluetooth Core Spec 5.2 |
| Debug interface lock | APPROTECT enabled after factory provisioning | Nordic nRF52 APPROTECT |
| Unique device identity | Per-unit Ed25519 device key, burned at provisioning | NIST SP 800-57 |
| Secure boot | MCUboot with hardware root of trust | ARM TrustZone-M |

### DETECT
- Security event logging: all BLE connection attempts, OTA attempts, authentication failures logged to NVM
- Anomaly detection: firmware monitors for unexpected reset patterns (>3 resets in 1 hour → log security event)
- Log forwarding: Health Hub app forwards security events to EoS Health backend (TLS 1.3)

### RESPOND
- See Incident Response Plan (Section 6)
- Vulnerability Disclosure Policy (VDP): security@embeddedos.org, 90-day coordinated disclosure

### RECOVER
- Dual-bank OTA: automatic rollback to last known good firmware on boot failure
- Recovery Time Objective (RTO): ≤24 hours for critical security patches
- Recovery Point Objective (RPO): No health data loss (offline buffer survives reset)

---

## 3. Vulnerability Disclosure Policy (VDP)

**Contact:** security@embeddedos.org  
**PGP Key:** Published at https://github.com/embeddedos-org/eos-health/security/advisories  
**Response SLA:**
- Acknowledgment: ≤5 business days
- Triage: ≤14 days
- Critical CVE patch: ≤30 days
- High CVE patch: ≤90 days
- Medium/Low CVE patch: ≤180 days

**Safe Harbor:** EoS Health will not pursue legal action against researchers who follow responsible disclosure.

**End-of-Life Commitment:** Security patches provided for minimum 5 years from product launch date.

---

## 4. Software Bill of Materials (SBOM)

**Format:** CycloneDX 1.4 JSON  
**Generated:** At each firmware release via `eos_release.py --sbom`

### HEALTH-KEY ULTRA Firmware SBOM (v1.0.0)

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "version": 1,
  "metadata": {
    "component": {
      "type": "firmware",
      "name": "eos-health-key-ultra-firmware",
      "version": "1.0.0"
    }
  },
  "components": [
    {"type": "library", "name": "nRF5 SDK", "version": "17.1.0", "supplier": "Nordic Semiconductor", "licenses": [{"license": {"id": "Nordic-5-Clause"}}]},
    {"type": "library", "name": "MCUboot", "version": "1.9.0", "supplier": "MCUboot Project", "licenses": [{"license": {"id": "Apache-2.0"}}]},
    {"type": "library", "name": "TensorFlow Lite Micro", "version": "2.14.0", "supplier": "Google LLC", "licenses": [{"license": {"id": "Apache-2.0"}}]},
    {"type": "library", "name": "LZ4", "version": "1.9.4", "supplier": "Yann Collet", "licenses": [{"license": {"id": "BSD-2-Clause"}}]},
    {"type": "library", "name": "tinycrypt", "version": "0.2.8", "supplier": "Intel Corporation", "licenses": [{"license": {"id": "BSD-3-Clause"}}]},
    {"type": "library", "name": "mbedTLS", "version": "3.4.0", "supplier": "ARM Limited", "licenses": [{"license": {"id": "Apache-2.0"}}]},
    {"type": "library", "name": "FreeRTOS", "version": "10.5.1", "supplier": "Amazon Web Services", "licenses": [{"license": {"id": "MIT"}}]},
    {"type": "library", "name": "CMSIS-DSP", "version": "1.14.4", "supplier": "ARM Limited", "licenses": [{"license": {"id": "Apache-2.0"}}]}
  ]
}
```

*Same SBOM structure applies to HEALTH-BAND Neuro, HEALTH-RING, and HEALTH-LAB with device-specific component variations.*

---

## 5. Threat Model (STRIDE)

### Attack Surface Inventory

| Surface | HEALTH-KEY ULTRA | HEALTH-BAND Neuro | HEALTH-RING | HEALTH-LAB |
|---|---|---|---|---|
| BLE 2.4 GHz | ✅ | ✅ | ✅ | ✅ |
| USB-C (data) | ✅ | ❌ | ❌ | ❌ |
| NFC charging | ❌ | ❌ | ✅ | ❌ |
| SWD debug port | ✅ (locked) | ✅ (locked) | ✅ (locked) | ✅ (locked) |
| OTA update channel | ✅ | ✅ | ✅ | ✅ |
| Health Hub app | ✅ | ✅ | ✅ | ✅ |
| EoS Health API | ✅ | ✅ | ✅ | ✅ |

### STRIDE Threat Analysis

| Threat | Attack Vector | Mitigation | Residual Risk |
|---|---|---|---|
| **Spoofing** — fake device pairing | BLE advertising spoofing | LESC pairing + device certificate | Low |
| **Tampering** — firmware modification | OTA channel | Ed25519 signature verification | Low |
| **Repudiation** — deny health data access | API | Immutable audit log + JWT | Low |
| **Information Disclosure** — PHI leak | BLE sniffing | AES-128 BLE encryption (LESC) | Low |
| **Information Disclosure** — PHI at rest | Device theft | AES-256 NVM encryption | Low |
| **Denial of Service** — BLE jamming | RF interference | Frequency hopping (BLE 5.2) | Medium (physical) |
| **Denial of Service** — battery drain | Malicious connection storm | Connection rate limiting (max 10/hour) | Low |
| **Elevation of Privilege** — debug access | SWD port | APPROTECT lock after provisioning | Low |
| **Elevation of Privilege** — OTA rollback | Malicious OTA | Version counter (anti-rollback) | Low |

---

## 6. Incident Response Plan

### Severity Classification

| Severity | Definition | Response Time | Example |
|---|---|---|---|
| Critical (P1) | PHI breach, remote code execution | ≤4 hours | BLE RCE vulnerability |
| High (P2) | Authentication bypass, data integrity | ≤24 hours | JWT secret compromise |
| Medium (P3) | DoS, information disclosure | ≤72 hours | BLE jamming attack |
| Low (P4) | Minor issues, no PHI impact | ≤30 days | Log verbosity issue |

### Response Procedure

1. **Detection** — Security event log alert or external researcher report
2. **Triage** — CSO classifies severity within 5 business days
3. **Containment** — Disable affected API endpoints if PHI at risk
4. **Investigation** — Root cause analysis, affected device/user scope
5. **Remediation** — Patch development, testing, OTA deployment
6. **Notification** — HIPAA breach notification (if PHI involved): HHS within 60 days, affected users within 60 days
7. **Post-Incident Review** — Document lessons learned, update threat model

### HIPAA Breach Notification (if applicable)

- **HHS OCR:** Submit via https://ocrportal.hhs.gov within 60 days
- **Affected individuals:** Written notice within 60 days
- **Media notice:** If >500 individuals in a state, notify prominent media outlets

---

## 7. Patch Management

| Patch Type | Delivery | Timeline | User Action Required |
|---|---|---|---|
| Critical security patch | Mandatory OTA (auto-applied) | ≤30 days from CVE disclosure | None (automatic) |
| High security patch | Prompted OTA | ≤90 days | Tap "Update" in Health Hub |
| Feature update | Optional OTA | Quarterly | Tap "Update" in Health Hub |
| Firmware rollback | Automatic (boot failure) | Immediate | None (automatic) |

---

## 8. End-of-Life Policy

| Product | Launch Date (est.) | Security Support End | EOL Notice |
|---|---|---|---|
| HEALTH-KEY ULTRA | 2027 Q4 | 2032 Q4 (5 years) | 12 months advance notice |
| HEALTH-BAND Neuro | 2027 Q4 | 2032 Q4 (5 years) | 12 months advance notice |
| HEALTH-RING | 2028 Q2 | 2033 Q2 (5 years) | 12 months advance notice |
| HEALTH-LAB | 2028 Q2 | 2033 Q2 (5 years) | 12 months advance notice |
