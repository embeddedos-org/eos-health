# FCC Equipment Authorization Checklist
## EoS Health — All 4 Devices
**Regulation:** 47 CFR Part 15 Subpart C (§15.247) — BLE 2.4 GHz  
**Date:** June 2026 | **Version:** 1.0

---

## 1. Overview

All four EoS Health devices transmit in the 2.4 GHz ISM band using Bluetooth Low Energy (BLE 5.2) via the Nordic Semiconductor nRF52840 (HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING Ultra) and nRF52833 (HEALTH-RING Base, HEALTH-LAB). Each device requires FCC equipment authorization before it can be marketed or sold in the United States.

**Authorization Route:** Certification via Telecommunications Certification Body (TCB) — required for intentional radiators under 47 CFR §15.247.

> **Note:** The nRF52840 and nRF52833 modules from Nordic Semiconductor already hold FCC modular approval (FCC ID: 2AEMI-NRF52840, 2AEMI-NRF52833). If the EoS Health devices use these modules in a manner consistent with the modular grant conditions, a **Class II Permissive Change** or **new application referencing the module grant** may be sufficient rather than full re-testing. Confirm with your TCB.

---

## 2. Applicable Regulations

| Rule | Description | Applies To |
|---|---|---|
| 47 CFR §15.247 | Operation in 2.4 GHz ISM band (frequency hopping spread spectrum) | All 4 devices |
| 47 CFR §15.209 | Radiated emission limits for unintentional radiators | All 4 devices |
| 47 CFR §15.205 | Restricted frequency bands | All 4 devices |
| 47 CFR §15.27 | Special accessories | All 4 devices |
| 47 CFR §2.1091 | RF exposure (SAR) evaluation | All 4 devices |
| 47 CFR §2.1093 | RF exposure (MPE) evaluation | All 4 devices |
| 47 CFR §15.19 | Labeling requirements | All 4 devices |
| 47 CFR §15.21 | User manual statement | All 4 devices |

---

## 3. Required Tests

### 3.1 Radiated Emissions (47 CFR §15.247)

| Test | Limit | Method | Lab |
|---|---|---|---|
| Conducted power | ≤30 dBm EIRP | ANSI C63.10 | Accredited EMC lab |
| Radiated emissions | ≤74 dBµV/m @ 3m (30–1000 MHz) | ANSI C63.10 | Accredited EMC lab |
| Frequency hopping | ≥15 hop channels, ≤400 ms/channel | Spectrum analyzer | Accredited EMC lab |
| Occupied bandwidth | ≤1 MHz per channel | Spectrum analyzer | Accredited EMC lab |

### 3.2 RF Exposure (SAR / MPE)

| Device | Body Separation | Evaluation Method | Limit |
|---|---|---|---|
| HEALTH-KEY ULTRA | 0 mm (USB-C contact) | SAR (body-worn) | ≤1.6 W/kg (1g tissue) |
| HEALTH-BAND Neuro | 0 mm (wrist contact) | SAR (body-worn) | ≤1.6 W/kg (1g tissue) |
| HEALTH-RING | 0 mm (finger contact) | SAR (body-worn) | ≤1.6 W/kg (1g tissue) |
| HEALTH-LAB | 0 mm (skin contact) | SAR (body-worn) | ≤1.6 W/kg (1g tissue) |

> **SAR Note:** For BLE devices with output power ≤20 mW (13 dBm), SAR testing may be replaced by MPE calculation per 47 CFR §2.1091(d)(3). Nordic nRF52840 typical TX power is +8 dBm (6.3 mW). Confirm with TCB whether SAR testing is required or if MPE calculation suffices.

### 3.3 Unintentional Emissions

| Test | Limit | Standard |
|---|---|---|
| Conducted emissions (AC mains) | CISPR 22 Class B | ANSI C63.4 |
| Radiated emissions | FCC Part 15 Class B | ANSI C63.4 |

---

## 4. FCC ID Labeling Requirements (47 CFR §15.19)

Each device must display the FCC ID. For small devices (HEALTH-RING), electronic labeling is permitted under 47 CFR §15.19(a)(10).

| Device | Labeling Method | Location |
|---|---|---|
| HEALTH-KEY ULTRA | Physical label on device | Bottom of USB-C housing |
| HEALTH-BAND Neuro | Physical label on device | Inside band clasp area |
| HEALTH-RING | Electronic label (e-label) | Accessible via companion app |
| HEALTH-LAB | Physical label on packaging | Patch packaging only (patch too small) |

**Required label text:**
```
FCC ID: [ASSIGNED ID]
This device complies with Part 15 of the FCC Rules. Operation is subject to the following two conditions:
(1) This device may not cause harmful interference, and
(2) This device must accept any interference received, including interference that may cause undesired operation.
```

---

## 5. TCB Submission Process

### Step 1: Select an Accredited TCB

Recommended TCBs for medical/wearable BLE devices:

| TCB | Contact | Typical Turnaround | Cost Estimate |
|---|---|---|---|
| UL (Underwriters Laboratories) | fcc@ul.com | 4–6 weeks | $3,000–$8,000/device |
| SGS | fcc.testing@sgs.com | 3–5 weeks | $3,500–$7,500/device |
| Intertek | fcc@intertek.com | 3–5 weeks | $3,000–$7,000/device |
| TÜV Rheinland | fcc@tuv.com | 4–6 weeks | $4,000–$9,000/device |
| Bureau Veritas | fcc@bureauveritas.com | 4–6 weeks | $3,500–$8,000/device |

### Step 2: Prepare Test Samples

- [ ] 3 production-representative samples per device (or engineering samples with production RF characteristics)
- [ ] Samples must use final antenna design and PCB layout
- [ ] Samples must run final firmware (or firmware representative of RF behavior)
- [ ] Provide: schematics, PCB Gerber files, antenna placement diagrams, BOM

### Step 3: Pre-Compliance Testing (Recommended)

Before formal TCB submission, conduct pre-compliance testing at an accredited lab or in-house using a spectrum analyzer to:
- Verify output power is within limits
- Verify frequency hopping behavior
- Estimate SAR/MPE

**Estimated pre-compliance cost:** $500–$2,000 per device

### Step 4: Submit to TCB

Required submission documents:

| Document | Description |
|---|---|
| FCC Form 731 | Application for Equipment Authorization |
| Block diagram | RF signal path from MCU to antenna |
| Schematics | Full circuit schematics |
| PCB layout | Antenna placement and ground plane |
| BOM | Bill of materials with RF components |
| Test report | Radiated/conducted emissions, SAR/MPE |
| User manual | Draft with FCC statements |
| Photos | External and internal device photos |
| Label artwork | FCC ID label design |
| Letter of authorization | If using third-party test lab |

### Step 5: FCC Grant of Equipment Authorization

- TCB reviews submission and issues FCC Grant
- FCC ID assigned (format: GRANTEE_CODE-PRODUCT_CODE)
- Grant published in FCC Equipment Authorization System (EAS)
- Device may be marketed after grant is issued

**FCC EAS Database:** https://www.fcc.gov/oet/ea/fccid

---

## 6. Cost and Timeline Summary

| Device | Test Type | Estimated Cost | Estimated Timeline |
|---|---|---|---|
| HEALTH-KEY ULTRA | BLE + SAR/MPE | $5,000–$12,000 | 6–10 weeks |
| HEALTH-BAND Neuro | BLE + SAR/MPE | $5,000–$12,000 | 6–10 weeks |
| HEALTH-RING | BLE + SAR/MPE + e-label | $6,000–$14,000 | 6–10 weeks |
| HEALTH-LAB | BLE + SAR/MPE | $5,000–$12,000 | 6–10 weeks |
| **Total (4 devices)** | | **$21,000–$50,000** | **6–10 weeks** |

> **Cost reduction strategy:** If all 4 devices use the same nRF52840/nRF52833 module under the same modular grant conditions, a single TCB engagement covering all 4 devices may reduce total cost by 30–40%.

---

## 7. International Equivalents

| Jurisdiction | Regulation | Body | Notes |
|---|---|---|---|
| Canada | RSS-247 (BLE) | ISED | Typically accepted alongside FCC data |
| European Union | EN 300 328 (BLE) | Notified Body | CE marking required |
| Japan | TELEC (Article 2-1-19) | MIC | Separate testing required |
| South Korea | KCC | MSIT | Separate testing required |
| Australia | AS/NZS 4268 | ACMA | Accepts FCC data in many cases |

---

## 8. Checklist Summary

### Pre-Testing
- [ ] Confirm nRF52840/nRF52833 modular grant conditions (can we reference module FCC ID?)
- [ ] Select TCB and get quote
- [ ] Prepare 3 production-representative samples per device
- [ ] Finalize antenna design and PCB layout
- [ ] Conduct pre-compliance testing

### Testing
- [ ] Radiated emissions (47 CFR §15.247) — all 4 devices
- [ ] Conducted emissions (Part 15 Class B) — all 4 devices
- [ ] SAR or MPE evaluation — all 4 devices
- [ ] Frequency hopping verification — all 4 devices

### Submission
- [ ] Complete FCC Form 731 for each device
- [ ] Prepare all required documents (see Section 5, Step 4)
- [ ] Submit to TCB
- [ ] Receive FCC Grant of Equipment Authorization
- [ ] Apply FCC ID label (physical or electronic)
- [ ] Add FCC statement to user manual

### Post-Authorization
- [ ] Update product packaging with FCC ID
- [ ] Update product website with FCC ID
- [ ] File FCC ID in internal compliance records
- [ ] Set reminder for any design changes (require new authorization or permissive change)
