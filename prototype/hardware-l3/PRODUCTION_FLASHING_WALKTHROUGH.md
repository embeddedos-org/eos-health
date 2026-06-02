# EoS Health — Production Flashing & Factory Test Walkthrough

**Version:** 1.0 | **Applies to:** All 4 EoS Health Devices | **Audience:** Production Line Technicians

---

## Overview

This document provides the complete step-by-step production flashing and factory test procedure for all four EoS Health devices. Every step includes the exact expected terminal output, error codes, recovery procedures, and pass/fail criteria. A trained technician can flash and test one unit in under 6 minutes.

---

## Equipment Required

| Item | Model | Purpose |
|---|---|---|
| J-Link EDU Mini | SEGGER 8.08.28 | SWD programming interface |
| USB-C cable | 3A rated | Power + data |
| NFC charging cradle | EoS-CHRG-01 | HEALTH-RING only |
| Multimeter | Fluke 117 | Voltage verification |
| BLE test host | MacBook/Linux PC | BLE commissioning |
| Factory test jig | EoS-JIG-{MODEL} | Pogo pin contact |

---

## Step 1 — Pre-Flash Hardware Inspection (2 minutes)

Before connecting any device to the programmer, complete the visual inspection checklist:

```
□ PCB has no visible solder bridges (use 10x loupe)
□ All ICs are correctly oriented (pin 1 marker aligned)
□ No missing components (compare against BOM)
□ Battery connector polarity correct (red=+, black=-)
□ SWD test pads accessible (TP1=SWDIO, TP2=SWDCLK, TP3=GND, TP4=VCC)
□ Antenna area clear of metal objects
```

**If any item fails:** Mark PCB as "REWORK" and set aside. Do not proceed.

---

## Step 2 — Connect J-Link and Verify Target Power

### 2a. Connect SWD

Connect J-Link to the device test pads using the pogo pin jig:

```
J-Link Pin 1  (VTref)  → TP4 (3.3V)
J-Link Pin 7  (SWDIO)  → TP1
J-Link Pin 9  (SWDCLK) → TP2
J-Link Pin 4  (GND)    → TP3
```

### 2b. Power On and Verify

Apply 3.3V via bench supply (limit to 200 mA). Measure at TP4:

**Expected:** 3.28V – 3.32V

**If voltage is 0V:** Check battery connector, check LDO (U2 — TPS62840)
**If voltage is >3.35V:** Check LDO feedback resistors R3/R4

### 2c. Verify J-Link Connection

```bash
$ JLinkExe -device nRF52840_xxAA -if SWD -speed 4000 -autoconnect 1
```

**Expected output:**
```
SEGGER J-Link Commander V7.88 (Compiled Nov 15 2024)
Connecting to target via SWD
Found SW-DP with ID 0x2BA01477
Found 1 JTAG device, Total IRLen = 4
Cortex-M4 identified.
Target interface speed: 4000 kHz
J-Link>
```

**Error: "Could not connect to target"**
→ Check SWD connections, verify 3.3V present, check for solder bridges on SWD pads

**Error: "No emulator connected"**
→ Reconnect USB, try different USB port, check J-Link driver installation

---

## Step 3 — Erase and Flash Firmware

### 3a. Run the Automated Flash Script

```bash
$ cd /path/to/eos-health/firmware/build-system
$ ./flash_all_devices.sh --device health-ring --unit-serial EOS-RING-2026-000001
```

**Expected output (HEALTH-RING example):**
```
═══════════════════════════════════════════════════
  EoS Health Production Flash Tool v1.0
  Device: HEALTH-RING
  Serial: EOS-RING-2026-000001
  Firmware: v1.1.0 (build 20260601-001)
═══════════════════════════════════════════════════

[01/08] Erasing flash...
  Erasing device (0x00000000 - 0x000FFFFF)... OK (2.1s)

[02/08] Flashing MCUboot bootloader...
  Flashing bootloader.hex (48 KB)... OK (0.8s)
  Verifying bootloader... OK (CRC32: 0xA3F2C891)

[03/08] Flashing application firmware...
  Flashing eos-health-ring-v1.1.0.hex (312 KB)... OK (4.2s)
  Verifying application... OK (CRC32: 0x7B4D2E56)

[04/08] Writing provisioning data...
  Serial number: EOS-RING-2026-000001
  Device model: HEALTH-RING
  Hardware rev: 1.0
  OTA public key: [32 bytes Ed25519]
  Calibration slot: EMPTY (to be filled in Step 5)
  Writing to NVM page 0xFF000... OK

[05/08] Writing device identity...
  BLE static address: C4:A5:3B:00:00:01 (derived from serial)
  Device name: "EoS RING 000001"
  Writing to NVM page 0xFF100... OK

[06/08] Enabling APPROTECT (read-back protection)...
  WARNING: This locks SWD access permanently after reboot
  Confirm? [y/N]: y
  APPROTECT enabled. Device will lock on next boot.

[07/08] Generating QR label data...
  QR payload: EOS-RING-2026-000001|C4A53B000001|v1.1.0
  Saved to: labels/EOS-RING-2026-000001.png

[08/08] Flash complete.
  Total time: 8.4 seconds
  Status: ✅ PASS

═══════════════════════════════════════════════════
  NEXT STEP: Run factory test (Step 5)
═══════════════════════════════════════════════════
```

### Flash Error Codes

| Error Code | Message | Cause | Recovery |
|---|---|---|---|
| `FLASH_E001` | Erase timeout | Flash write protection active | Full chip erase with `--recover` flag |
| `FLASH_E002` | CRC mismatch after flash | Corrupted firmware file | Re-download firmware from release server |
| `FLASH_E003` | NVM write failed | NVM page worn out | Replace PCB |
| `FLASH_E004` | Invalid serial format | Wrong serial number entered | Verify serial against production manifest |
| `FLASH_E005` | Duplicate serial | Serial already used | Check production database, assign new serial |
| `FLASH_E006` | J-Link timeout | SWD connection lost mid-flash | Reconnect, re-erase, re-flash from beginning |

---

## Step 4 — First Power-On Verification

### 4a. Remove Bench Supply, Connect Battery

For HEALTH-RING: Place in NFC charging cradle (do not use bench supply after APPROTECT enabled).
For other devices: Connect battery, apply power via USB-C.

### 4b. Observe Boot Sequence

Connect serial monitor at 115200 baud (before APPROTECT locks SWD — use USB-C UART):

```
$ screen /dev/ttyUSB0 115200
```

**Expected boot log:**
```
[0000ms] EoS Health RING v1.1.0 booting...
[0001ms] MCUboot: Image 0 validated (Ed25519 OK)
[0002ms] MCUboot: Jumping to application
[0010ms] [BOOT] Hardware revision: 1.0
[0011ms] [BOOT] Serial: EOS-RING-2026-000001
[0012ms] [POWER] Battery: 87% (4.08V), charging: NO
[0015ms] [SENSOR] MAX30101 PPG: INIT OK
[0016ms] [SENSOR] MAX30208 Temp: INIT OK (25.3°C)
[0017ms] [SENSOR] LSM6DSO IMU: INIT OK
[0018ms] [SENSOR] AFE4900 ECG: INIT OK
[0020ms] [BLE] Advertising started: "EoS RING 000001"
[0021ms] [OTA] Slot A: v1.1.0 (active), Slot B: empty
[0025ms] [READY] All systems nominal. Entering IDLE state.
```

**Error: "[SENSOR] MAX30101 PPG: INIT FAIL"**
→ Check I²C bus (SDA/SCL), verify 1.8V LDO for sensor, check solder joints on U5

**Error: "[SENSOR] AFE4900 ECG: INIT FAIL"**
→ Check SPI bus, verify RESET pin (active low), check U7 orientation

**Error: "[POWER] Battery: 0% (0.00V)"**
→ Check battery connector, check MAX17048 fuel gauge (U4), verify battery is charged

**Error: "MCUboot: Image 0 validation FAILED"**
→ Firmware corrupted during flash. Re-flash from Step 3.

---

## Step 5 — Sensor Calibration

Run the per-unit calibration tool. This step requires the calibration jig with reference sensors:

```bash
$ python3 prototype/hardware-l3/calibration/factory_calibration.py \
    --device health-ring \
    --serial EOS-RING-2026-000001 \
    --ble-mac C4:A5:3B:00:00:01
```

**Expected output:**
```
═══════════════════════════════════════════════════
  EoS Health Factory Calibration Tool v1.0
  Device: HEALTH-RING (EOS-RING-2026-000001)
═══════════════════════════════════════════════════

Connecting via BLE... Connected (RSSI: -42 dBm)

[1/4] PPG Calibration (3 reference points)...
  Point 1: raw=1024, ref=70 mg/dL... OK
  Point 2: raw=2048, ref=100 mg/dL... OK
  Point 3: raw=4096, ref=180 mg/dL... OK
  Slope: 0.0854, Intercept: -17.5, R²=0.9998 ✅

[2/4] Temperature Calibration (2 reference points)...
  Point 1: raw=25.1°C, ref=25.0°C (ice bath)... OK
  Point 2: raw=37.2°C, ref=37.0°C (body temp)... OK
  Offset: -0.15°C ✅

[3/4] ECG Electrode Impedance Check...
  Electrode 1: 8.2 kΩ (spec: <15 kΩ) ✅
  Electrode 2: 9.1 kΩ (spec: <15 kΩ) ✅

[4/4] Writing calibration to NVM...
  Calibration data written (64 bytes)... OK ✅

Calibration complete. Time: 45 seconds.
Status: ✅ PASS
```

**Calibration Failure Codes:**

| Code | Meaning | Action |
|---|---|---|
| `CAL_E001` | R² < 0.99 (poor linearity) | Clean sensor window, retry. If persistent: replace PCB |
| `CAL_E002` | Electrode impedance > 15 kΩ | Check electrode contact, clean with IPA |
| `CAL_E003` | Temperature offset > 2°C | Check MAX30208 solder joints |
| `CAL_E004` | BLE disconnected during calibration | Retry from beginning |

---

## Step 6 — Automated Factory Test Suite

```bash
$ python3 prototype/test-runner/run_l3_verification.py \
    --device health-ring \
    --mac C4:A5:3B:00:00:01 \
    --serial EOS-RING-2026-000001
```

**Expected output (abbreviated):**
```
═══════════════════════════════════════════════════
  EoS Health Factory Test Suite v1.0
  Device: HEALTH-RING | Serial: EOS-RING-2026-000001
═══════════════════════════════════════════════════

[TEST 01/15] BLE Advertisement Scan.............. ✅ PASS (-42 dBm)
[TEST 02/15] BLE Connection & MTU................ ✅ PASS (MTU=247)
[TEST 03/15] GATT Profile Validation............. ✅ PASS (12/12 chars)
[TEST 04/15] ECG Signal Quality (30s)............ ✅ PASS (SNR=61.2 dB)
[TEST 05/15] Heart Rate Accuracy (72 bpm ref).... ✅ PASS (71 bpm, Δ=1)
[TEST 06/15] SpO2 Reading (98% ref).............. ✅ PASS (97.8%, ARMS=0.2%)
[TEST 07/15] Skin Temperature (37.0°C ref)....... ✅ PASS (36.9°C, Δ=0.1°C)
[TEST 08/15] IMU Accelerometer (1g static)....... ✅ PASS (0.998g)
[TEST 09/15] IMU Step Count (100 steps).......... ✅ PASS (99 steps, Δ=1%)
[TEST 10/15] Battery Level Read.................. ✅ PASS (87%)
[TEST 11/15] NFC Charging Detection.............. ✅ PASS (detected in 2.1s)
[TEST 12/15] Data Buffer Write/Read.............. ✅ PASS (1000 records)
[TEST 13/15] OTA Slot Status..................... ✅ PASS (Slot A active)
[TEST 14/15] Crash Recovery (watchdog test)...... ✅ PASS (recovered in 1.2s)
[TEST 15/15] Power State Transitions............. ✅ PASS (all 5 states)

═══════════════════════════════════════════════════
  RESULT: 15/15 PASS ✅
  Time: 3m 42s
  Unit: EOS-RING-2026-000001 → PRODUCTION READY
═══════════════════════════════════════════════════
```

### Test Failure Recovery

| Test | Common Failure | Recovery |
|---|---|---|
| BLE Advertisement | Not visible | Check antenna, verify firmware booted |
| ECG Signal Quality | SNR < 40 dB | Check electrode impedance, verify AFE4900 |
| SpO2 Reading | >2% error | Clean PPG window, verify MAX30101 |
| NFC Charging | Not detected | Check coil placement, verify BQ51013 |
| Crash Recovery | No recovery | Check watchdog timer config in firmware |

---

## Step 7 — QR Label and Database Entry

### 7a. Print QR Label

```bash
$ python3 prototype/hardware-l3/calibration/factory_calibration.py --print-label \
    --serial EOS-RING-2026-000001
```

Label contains:
- Serial number (human readable + QR code)
- BLE MAC address
- Firmware version
- Calibration date
- Batch number

### 7b. Record in Production Database

```bash
$ python3 prototype/hardware-l3/calibration/factory_calibration.py --register \
    --serial EOS-RING-2026-000001 \
    --batch 2026-06-001 \
    --technician TECH-001 \
    --result PASS
```

**Expected:**
```
Unit EOS-RING-2026-000001 registered in production database.
Status: PASS | Batch: 2026-06-001 | Technician: TECH-001
```

---

## Step 8 — Final Packaging

```
□ Place device in anti-static bag
□ Attach QR label to bag exterior
□ Insert into retail box with charging cradle/cable
□ Seal box with tamper-evident sticker
□ Scan box barcode into shipping system
□ Place in shipping carton (12 units per carton)
```

---

## Device-Specific Differences

| Step | HEALTH-KEY ULTRA | HEALTH-BAND Neuro | HEALTH-RING | HEALTH-LAB |
|---|---|---|---|---|
| Power during flash | USB-C 5V | USB-C 5V | Bench 3.3V | Bench 3.3V |
| SWD access | USB-C port pads | Back pads | Ring inner pads | Patch flex pads |
| Charging test | N/A | USB-C | NFC cradle | NFC (base) |
| Extra tests | USB HID enumeration | TENS safety check | Ring wear sensor | Potentiostat linearity |
| Total test time | 4m 10s | 5m 30s | 3m 42s | 4m 55s |

---

## Production Throughput

With 2 technicians and 4 J-Link stations:

| Metric | Value |
|---|---|
| Time per unit | 6 minutes (including handling) |
| Units per station per hour | 10 |
| Units per day (8h, 4 stations) | 320 |
| Monthly capacity | ~6,400 units |

---

## Error Code Reference — Complete List

| Code | Category | Description | Action |
|---|---|---|---|
| `FLASH_E001`–`E006` | Flashing | See Step 3 table | See Step 3 |
| `BOOT_E001` | Boot | Sensor init failed | Check I²C/SPI, solder joints |
| `BOOT_E002` | Boot | Firmware signature invalid | Re-flash from Step 3 |
| `BOOT_E003` | Boot | Battery critically low | Charge before testing |
| `CAL_E001`–`E004` | Calibration | See Step 5 table | See Step 5 |
| `TEST_E001` | BLE | Advertisement not found | Check antenna, firmware |
| `TEST_E002` | BLE | GATT profile incomplete | Re-flash firmware |
| `TEST_E003` | Sensor | ECG SNR below spec | Check AFE4900, electrodes |
| `TEST_E004` | Sensor | SpO2 error > 2% | Clean PPG window |
| `TEST_E005` | Power | Battery read failed | Check MAX17048 |
| `TEST_E006` | Charging | NFC not detected | Check BQ51013, coil |
| `TEST_E007` | Firmware | Crash recovery failed | Check watchdog config |
| `PROV_E001` | Provisioning | Duplicate serial | Check production DB |
| `PROV_E002` | Provisioning | Invalid serial format | Verify serial number |
