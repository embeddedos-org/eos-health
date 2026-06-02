# EoS Health — L3 Reliability & Environmental Test Procedures

**Standards:** IEC 60529 (IP ratings), IEC 60068 (environmental testing), MIL-STD-810H (drop/shock)  
**Applies to:** All 4 EoS Health prototype devices  
**Required equipment:** Water tank, pressure gauge, drop rig, thermal chamber, PPKII power profiler, J-Link

---

## 1. IP68 Water Resistance Test

**Standard:** IEC 60529 — IP68 (continuous immersion >1m)  
**Applies to:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING  
**HEALTH-LAB:** IPX7 only (30 min at 1m — sweat/rain resistance)

### Equipment
- Water tank (minimum 30 cm deep)
- Pressure gauge (0–5 bar)
- Stopwatch
- Desiccant indicator cards (inside device)

### Procedure

**Pre-test:**
1. Verify all seals are intact (O-rings, potting, adhesive)
2. Insert desiccant indicator card (blue = dry, pink = moisture)
3. Photograph device before test
4. Verify device is powered on and BLE advertising

**IP68 Test (2m depth, 30 minutes):**
1. Fill tank to 2m equivalent pressure (0.3 bar gauge = 3m water column)
2. Submerge device completely
3. Start timer: 30 minutes
4. Every 5 minutes: verify BLE still advertising (scan with phone)
5. After 30 minutes: remove device, dry exterior
6. Immediately check desiccant card: must remain **blue** (dry)
7. Check BLE: must still advertise
8. Check all sensor readings: must be within spec

**Pass criteria:**
- [ ] Desiccant card remains blue (no moisture ingress)
- [ ] BLE advertising throughout immersion
- [ ] All sensors functional after immersion
- [ ] No corrosion on electrodes after 24h

**HEALTH-RING additional test (NFC charging after immersion):**
- [ ] Place ring on charging cradle immediately after drying
- [ ] Verify charging initiates within 30 seconds

---

## 2. Drop Test

**Standard:** MIL-STD-810H Method 516.8 (Shock)  
**Drop height:** 1.5m onto concrete (simulates dropping from hand height)  
**Applies to:** All 4 devices

### Procedure

1. Drop device from 1.5m height onto concrete floor
2. Perform 6 drops: 4 faces + 2 edges
3. After each drop:
   - [ ] Visual inspection: no cracks, no delamination
   - [ ] BLE: still advertising
   - [ ] All sensors: functional

**Pass criteria:**
- No structural failure (cracks, broken display, delamination)
- Device remains functional after all 6 drops
- No data loss (check flash memory integrity via BLE)

**HEALTH-RING additional:**
- [ ] Ring body not cracked (titanium Grade 23)
- [ ] PCB not cracked inside ring (verify via ECG signal quality)

---

## 3. Thermal Cycling Test

**Standard:** IEC 60068-2-14 (Thermal shock)  
**Range:** -20°C to +60°C (storage) / 0°C to +45°C (operating)  
**Applies to:** All 4 devices

### Equipment
- Thermal chamber (or freezer + oven)
- Thermometer

### Procedure

**Cycle (repeat 10×):**
1. Cold soak: -20°C for 30 minutes
2. Ramp to +60°C: 10 minutes
3. Hot soak: +60°C for 30 minutes
4. Ramp to -20°C: 10 minutes

**After 10 cycles:**
- [ ] Visual inspection: no delamination, no solder joint cracks
- [ ] BLE: advertising normally
- [ ] Battery: voltage within ±5% of pre-test value
- [ ] All sensors: functional

**Operating range test:**
1. Set chamber to 0°C — verify device operates normally
2. Set chamber to 45°C — verify device operates normally
3. Verify temperature sensor reads correctly at both extremes

---

## 4. Battery Life Measurement

**Equipment:** Nordic PPKII (Power Profiler Kit II) — measures µA resolution  
**Applies to:** All 4 devices

### Procedure

1. Fully charge device (100%)
2. Connect PPKII in series with battery (cut battery wire, insert PPKII)
3. Run device in **typical use profile:**
   - HEALTH-KEY ULTRA: ECG 30s/hr, PPG continuous, BLE connected
   - HEALTH-BAND Neuro: sEMG 5min/hr, ECG 30s/hr, BLE connected
   - HEALTH-RING: PPG continuous, ECG 30s/hr, BLE connected
   - HEALTH-LAB: glucose every 15min, BLE connected 8hr/day

4. Log current consumption for 24 hours
5. Calculate average current and project battery life

**Pass criteria:**

| Device | Battery | Target Life | Pass if |
|---|---|---|---|
| HEALTH-KEY ULTRA | 210 mAh | 7 days | ≥7.0 days |
| HEALTH-BAND Neuro | 300 mAh | 5 days | ≥5.0 days |
| HEALTH-RING | 170 mAh | 7 days | ≥7.0 days |
| HEALTH-LAB | 65 mAh | 14 days | ≥14.0 days |

**HEALTH-RING NFC charging test:**
1. Discharge ring to 10%
2. Place on charging cradle
3. Measure: time to 80% charge (spec: ≤4 hours)
4. Measure: time to 100% charge (spec: ≤8 hours)
5. Verify: charging stops automatically at 100% (BQ25125 termination)

---

## 5. OTA Firmware Update End-to-End Test

**Applies to:** All 4 devices  
**Tests:** Normal update, interrupted update, rollback, signature verification

### Test Cases

**TC-OTA-01: Normal update**
1. Flash device with v1.0.0 firmware
2. Initiate OTA update to v1.0.1 via BLE (nRF Connect or Health Hub app)
3. Verify: update completes successfully
4. Verify: device boots v1.0.1
5. Verify: all sensors functional after update

**TC-OTA-02: Interrupted update (power loss)**
1. Start OTA update
2. Remove power at 50% transfer
3. Restore power
4. Verify: device boots v1.0.0 (MCUboot rollback)
5. Verify: device still functional (no brick)

**TC-OTA-03: Invalid signature rejection**
1. Create a firmware image with invalid Ed25519 signature
2. Attempt OTA update
3. Verify: update rejected with error
4. Verify: device continues running current firmware

**TC-OTA-04: Rollback on boot failure**
1. Flash a firmware image that crashes on boot (infinite loop)
2. Verify: MCUboot detects boot failure after 3 attempts
3. Verify: MCUboot rolls back to previous firmware
4. Verify: device boots previous firmware successfully

**TC-OTA-05: Battery guard**
1. Discharge device to 15% battery
2. Attempt OTA update
3. Verify: OTA rejected with "battery too low" error
4. Verify: device continues normal operation

**Pass criteria:** All 5 test cases pass

---

## 6. Flex Fatigue Test (HEALTH-BAND Neuro and HEALTH-LAB)

**Applies to:** HEALTH-BAND Neuro (FPCB strap), HEALTH-LAB (flex patch)  
**Standard:** IEC 60068-2-21 (Robustness of terminations)

### HEALTH-BAND Neuro FPCB Strap
1. Bend strap to 90° and return to flat — repeat 10,000 cycles
2. After 1,000 cycles: check electrical continuity of all traces
3. After 5,000 cycles: check continuity + sEMG signal quality
4. After 10,000 cycles: check continuity + full sensor validation

**Pass criteria:**
- No trace breaks at any cycle count
- sEMG signal quality unchanged after 10,000 cycles

### HEALTH-LAB Patch Adhesion
1. Apply patch to forearm, wear for 7 days
2. Check adhesion every 24 hours (edge lift, center bubble)
3. After 7 days: remove patch, inspect electrodes

**Pass criteria:**
- Patch remains adhered for 7 days (no edge lift >5mm)
- Electrodes not degraded (impedance <10 kΩ after 7 days)

---

## 7. Biocompatibility Test (HEALTH-RING and HEALTH-LAB)

**Standard:** ISO 10993-5 (Cytotoxicity), ISO 10993-10 (Sensitization)  
**Applies to:** HEALTH-RING (skin contact), HEALTH-LAB (extended skin contact)  
**Note:** Requires certified testing laboratory

### Materials to test
- HEALTH-RING: Grade 23 Ti-6Al-4V ELI, Loctite M-21HP epoxy, Pt-Ir electrode alloy
- HEALTH-LAB: Polyimide coverlay, 3M 1524 adhesive, Ag/AgCl electrode ink

### Tests required
1. **ISO 10993-5:** Cytotoxicity (MEM elution, 24h, L929 cells) — pass: ≤Grade 2
2. **ISO 10993-10:** Sensitization (Guinea pig maximization test or LLNA) — pass: no sensitization
3. **ISO 10993-23:** Irritation (skin patch test, 24h, 10 subjects) — pass: no irritation

**Estimated cost:** $8,000–$15,000 per device  
**Lead time:** 6–8 weeks

---

## Reliability Test Summary

| Test | Device(s) | Equipment | Duration | Cost |
|---|---|---|---|---|
| IP68 immersion | KEY, BAND, RING | Water tank | 30 min | $0 |
| IPX7 (LAB) | LAB | Water tank | 30 min | $0 |
| Drop test | All 4 | Concrete floor | 1 hour | $0 |
| Thermal cycling | All 4 | Thermal chamber | 1 week | $200/day rental |
| Battery life | All 4 | PPKII ($99) | 24h per device | $99 |
| OTA end-to-end | All 4 | J-Link + phone | 2 hours | $0 |
| Flex fatigue | BAND, LAB | Bending fixture | 2 weeks | $500 |
| Biocompatibility | RING, LAB | Certified lab | 6–8 weeks | $25,000 |

**Total estimated cost for full L3 reliability testing:** ~$30,000  
**Total estimated time:** 8–10 weeks (biocompatibility is the long pole)
