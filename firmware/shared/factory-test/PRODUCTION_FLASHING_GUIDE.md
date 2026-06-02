# EoS Health — Production Flashing, Provisioning & Factory Test Guide

**Version:** 1.0.0
**Applies to:** HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB
**Toolchain:** eBuild + J-Link + nRF Command Line Tools 10.21+

---

## Overview

Every EoS Health device unit goes through a 4-stage production process before it leaves the factory:

| Stage | Name | Duration | Tool |
|---|---|---|---|
| 1 | **Flash** | 45 seconds | J-Link + eBuild |
| 2 | **Provision** | 30 seconds | eos-factory-tool (BLE) |
| 3 | **Factory Test** | 3–5 minutes | eos-factory-tool (BLE) |
| 4 | **Label & Pack** | 30 seconds | QR printer |

Total per unit: **~6 minutes**

---

## 1. Flash Stage

### 1.1 Equipment

| Item | Model | Notes |
|---|---|---|
| Programmer | J-Link EDU Mini | Or J-Link BASE for production |
| Test fixture | EoS-JIG-001 (ring) / EoS-JIG-002 (patch) | Custom pogo-pin bed |
| Host PC | Ubuntu 22.04 LTS | eBuild + nRF tools installed |
| Power supply | Bench PSU 3.3V, 500mA | For fixture power |

### 1.2 Firmware Images

Each device ships with 3 images flashed in sequence:

```
1. Bootloader (MCUboot):  build/health-ring-ultra/bootloader.hex
2. SoftDevice (S140):     lib/softdevice/s140_nrf52_7.3.0_softdevice.hex
3. Application:           build/health-ring-ultra/app_signed.hex
```

The application image is **Ed25519-signed** at build time:
```bash
# Sign the image (done by CI/CD pipeline, not manually)
imgtool sign \
  --key keys/eos_ota_signing_key.pem \
  --header-size 0x200 \
  --align 4 \
  --version 1.0.0 \
  --slot-size 0x5F000 \
  build/health-ring-ultra/app.hex \
  build/health-ring-ultra/app_signed.hex
```

### 1.3 Flash Procedure

```bash
# Step 1: Erase entire flash
nrfjprog --family nRF52 --eraseall

# Step 2: Flash bootloader
nrfjprog --family nRF52 --program build/health-ring-ultra/bootloader.hex --verify

# Step 3: Flash SoftDevice
nrfjprog --family nRF52 --program lib/softdevice/s140_nrf52_7.3.0_softdevice.hex --verify

# Step 4: Flash signed application
nrfjprog --family nRF52 --program build/health-ring-ultra/app_signed.hex --verify

# Step 5: Reset
nrfjprog --family nRF52 --reset

# Step 6: Verify boot (check RTT log for "EoS HEALTH-RING Firmware v1.0.0")
JLinkRTTLogger -Device nRF52840_xxAA -If SWD -Speed 4000 -RTTChannel 0 /tmp/boot.log &
sleep 3
grep "boot complete" /tmp/boot.log && echo "FLASH: PASS" || echo "FLASH: FAIL"
```

### 1.4 Automated Flash Script

```bash
#!/bin/bash
# eos-flash.sh — Production flash script
# Usage: ./eos-flash.sh <device_type> <hw_revision>
# Example: ./eos-flash.sh health-ring-ultra rev-a

DEVICE=$1
HW_REV=$2
BUILD_DIR="build/${DEVICE}"

echo "=== EoS Flash: ${DEVICE} ${HW_REV} ==="

# Detect J-Link
JLINK_SN=$(JLinkExe -CommandFile /dev/null 2>&1 | grep "Serial number" | awk '{print $3}')
if [ -z "$JLINK_SN" ]; then
    echo "ERROR: J-Link not detected"
    exit 1
fi
echo "J-Link SN: ${JLINK_SN}"

# Flash all images
nrfjprog --family nRF52 --eraseall --snr ${JLINK_SN}
nrfjprog --family nRF52 --program ${BUILD_DIR}/bootloader.hex --verify --snr ${JLINK_SN}
nrfjprog --family nRF52 --program lib/softdevice/s140_nrf52_7.3.0_softdevice.hex \
         --verify --snr ${JLINK_SN}
nrfjprog --family nRF52 --program ${BUILD_DIR}/app_signed.hex --verify --snr ${JLINK_SN}
nrfjprog --family nRF52 --reset --snr ${JLINK_SN}

# Verify boot
sleep 2
BOOT_LOG=$(JLinkRTTLogger -Device nRF52840_xxAA -If SWD -Speed 4000 \
           -RTTChannel 0 -AutoExit 3 /tmp/boot_${JLINK_SN}.log 2>&1)

if grep -q "boot complete" /tmp/boot_${JLINK_SN}.log; then
    echo "FLASH: PASS"
    exit 0
else
    echo "FLASH: FAIL — boot log:"
    cat /tmp/boot_${JLINK_SN}.log
    exit 1
fi
```

---

## 2. Provision Stage

Provisioning is performed via BLE after flashing. The device boots into
**factory mode** (no provisioning data found) and exposes a provisioning
GATT characteristic secured with BT_SECURITY_L3 (authenticated pairing).

### 2.1 Provisioning Tool

```bash
# eos-provision.py — Factory provisioning tool
# Requires: bleak (Python BLE library), ed25519 library

python3 tools/eos-provision.py \
  --device-type health-ring-ultra \
  --hw-revision rev-a \
  --serial EHR-2026-$(printf "%06d" $UNIT_NUMBER) \
  --ota-key keys/eos_ota_public_key.pem \
  --device-key keys/device_keys/EHR-2026-$(printf "%06d" $UNIT_NUMBER).pem \
  --calibration calibration/EHR-2026-$(printf "%06d" $UNIT_NUMBER).json \
  --provisioner-id FACTORY-LINE-01
```

### 2.2 Provisioning Data Written

```json
{
  "magic": "0xEA5P0001",
  "device_type": 3,
  "hw_revision": 0,
  "serial_number": "EHR-2026-000001",
  "ble_address": [0xC0, 0x12, 0x34, 0x56, 0x78, 0x9A],
  "ota_public_key": "<32-byte Ed25519 public key>",
  "device_private_key": "<32-byte Ed25519 device key>",
  "calibration": {
    "ecg_offset": -120,
    "ecg_gain": 1024,
    "ppg_red_offset": 50,
    "ppg_ir_offset": 45,
    "ppg_red_gain": 998,
    "ppg_ir_gain": 1002,
    "temp_offset": -3
  },
  "production_test_result": 0,
  "provisioned_at_unix": 1748995200,
  "provisioner_id": "FACTORY-LINE-01"
}
```

### 2.3 Serial Number Format

| Device | Format | Example |
|---|---|---|
| HEALTH-KEY ULTRA | `EHK-YYYY-NNNNNN` | `EHK-2026-000001` |
| HEALTH-BAND Neuro | `EHB-YYYY-NNNNNN` | `EHB-2026-000001` |
| HEALTH-RING | `EHR-YYYY-NNNNNN` | `EHR-2026-000001` |
| HEALTH-LAB | `EHL-YYYY-NNNNNN` | `EHL-2026-000001` |

---

## 3. Factory Test Stage

After provisioning, the factory test suite runs automatically. The mobile
`eos-factory-tool` app connects via BLE and executes each test in sequence.

### 3.1 Test Suite — HEALTH-RING

| Test ID | Test Name | Pass Criteria | Timeout |
|---|---|---|---|
| FT-001 | BLE Advertising | RSSI > -70 dBm at 1m | 10s |
| FT-002 | BLE Connection | Connect + MTU=247 negotiated | 15s |
| FT-003 | ECG Lead Contact | Lead-off flag = 0, signal > 100 µV p-p | 10s |
| FT-004 | ECG Signal Quality | QRS detected, HR 60–100 BPM | 30s |
| FT-005 | PPG Red Channel | Signal > 50,000 counts, AC/DC > 0.5% | 10s |
| FT-006 | PPG IR Channel | Signal > 50,000 counts, AC/DC > 0.5% | 10s |
| FT-007 | SpO₂ Estimate | 95–100% (test finger on fixture) | 30s |
| FT-008 | IMU Self-Test | LSM6DSO self-test pass (±10% of spec) | 5s |
| FT-009 | Temperature Sensor | 20–30°C (room temp) | 5s |
| FT-010 | Battery Voltage | 3.8–4.2V (fully charged) | 5s |
| FT-011 | NFC Charging | Charging current > 15 mA detected | 15s |
| FT-012 | Flash Read/Write | Write/read 1KB pattern, 0 errors | 10s |
| FT-013 | OTA Slot Erase | Slot B erased successfully | 10s |
| FT-014 | Provisioning Read | Serial number matches expected | 5s |
| FT-015 | Crash Log Clear | Crash log empty | 5s |
| FT-016 | BLE Throughput | > 200 KB/s sustained (2M PHY) | 30s |

**Total: ~3.5 minutes**

### 3.2 Test Suite — HEALTH-LAB

| Test ID | Test Name | Pass Criteria | Timeout |
|---|---|---|---|
| FT-001 | BLE Advertising | RSSI > -70 dBm at 1m | 10s |
| FT-002 | BLE Connection | Connect + MTU=247 | 15s |
| FT-003 | LMP91000 Init | TIA gain registers read correctly | 5s |
| FT-004 | Glucose Electrode | Current 10–100 nA in 5 mM glucose solution | 60s |
| FT-005 | Lactate Electrode | Current 20–200 nA in 2 mM lactate solution | 60s |
| FT-006 | Reference Electrode | Voltage 190–210 mV vs Ag/AgCl | 10s |
| FT-007 | Na⁺ ISE | 130–150 mEq/L in calibration solution | 30s |
| FT-008 | K⁺ ISE | 3.5–5.5 mEq/L in calibration solution | 30s |
| FT-009 | pH Sensor | pH 7.0–7.4 in calibration buffer | 20s |
| FT-010 | Temperature Sensor | 20–30°C | 5s |
| FT-011 | PPG Signal | HR detected, AC/DC > 0.3% | 30s |
| FT-012 | Iontophoresis (Ultra) | Current 280–320 µA at 0.3 mA setpoint | 20s |
| FT-013 | Adhesive Integrity | Visual inspection (camera) | Manual |
| FT-014 | Battery Voltage | 3.7–4.2V | 5s |
| FT-015 | Provisioning Read | Serial matches | 5s |

**Total: ~5 minutes**

### 3.3 Factory Test Output

```json
{
  "serial": "EHR-2026-000001",
  "device_type": "health-ring-ultra",
  "hw_revision": "rev-a",
  "test_date": "2026-06-01T10:23:45Z",
  "station_id": "FACTORY-LINE-01",
  "overall_result": "PASS",
  "tests": [
    {"id": "FT-001", "name": "BLE Advertising", "result": "PASS", "value": "-58 dBm"},
    {"id": "FT-002", "name": "BLE Connection",  "result": "PASS", "value": "MTU=247"},
    {"id": "FT-003", "name": "ECG Lead Contact","result": "PASS", "value": "lead_off=0"},
    {"id": "FT-004", "name": "ECG Signal",      "result": "PASS", "value": "HR=72 BPM"},
    {"id": "FT-005", "name": "PPG Red",         "result": "PASS", "value": "65432 counts"},
    ...
  ],
  "calibration_applied": true,
  "fw_version": "1.0.0",
  "ota_key_hash": "a3f2b1..."
}
```

---

## 4. Label & Pack Stage

After passing all factory tests, the provisioning tool:

1. Generates a QR code containing:
   ```
   EOS:EHR-2026-000001:C012345678:9A
   (product:serial:ble_address_compressed)
   ```
2. Prints label on Zebra ZD421 thermal printer
3. Records unit in production database (PostgreSQL)
4. Marks unit as `PRODUCTION_READY` in inventory system

---

## 5. OTA Update Process (Field)

### 5.1 Update Flow

```
Mobile App                    Device
    │                            │
    │── Check FW version ────────►│ (BLE read: Device Info Service)
    │◄─ Current: 1.0.0 ──────────│
    │                            │
    │── Download 1.1.0 from CDN  │
    │── Verify Ed25519 sig       │
    │                            │
    │── OTA Init (size, SHA256, sig) ──►│
    │◄─ OTA Started ─────────────│
    │                            │
    │── Chunk 0 (512B + CRC32) ──►│ (write to slot B)
    │── Chunk 1 (512B + CRC32) ──►│
    │── ... (progress 0–100%) ───►│
    │── Chunk N ─────────────────►│
    │                            │
    │◄─ OTA Complete (100%) ──────│
    │                            │
    │   [Device verifies SHA256 + Ed25519]
    │   [Device calls boot_request_upgrade()]
    │   [Device reboots in 3s]
    │                            │
    │◄─ BLE Disconnected ─────────│
    │                            │
    │   [MCUboot swaps slot A ↔ slot B]
    │   [Device boots new firmware]
    │                            │
    │── Reconnect ───────────────►│
    │◄─ Advertising (new FW) ─────│
    │── Connect ─────────────────►│
    │◄─ FW version: 1.1.0 ────────│
    │── Confirm image ───────────►│ (prevents rollback)
```

### 5.2 Rollback Scenario

If the new firmware fails to boot (crash loop detected by MCUboot):
- MCUboot automatically reverts to slot A (previous firmware)
- Device boots with old firmware
- Crash log records the failed OTA attempt
- Mobile app notified on next connection

### 5.3 OTA Security

| Layer | Mechanism |
|---|---|
| Transport | BLE GATT with BT_SECURITY_L2 (encrypted) |
| Image integrity | SHA-256 hash verification |
| Image authenticity | Ed25519 signature (private key never leaves CI/CD) |
| Downgrade protection | MCUboot version counter (monotonic) |
| Battery protection | OTA refused if battery < 20% |

---

## 6. Build System (eBuild)

```bash
# Install eBuild
pip3 install ebuild-eos

# Build all devices (release mode)
eBuild build-all --config firmware/shared/ebuild/ebuild-production.yaml

# Build single device
eBuild build --target health-ring-ultra-rev-a \
             --config devices/health-ring/firmware/ebuild.config \
             --release

# Run unit tests
eBuild test --target health-ring-ultra-rev-a --suite unit

# Run factory test suite (requires hardware)
eBuild test --target health-ring-ultra-rev-a --suite factory --port /dev/ttyUSB0

# Generate release artifacts
eBuild release --version 1.0.0 --sign keys/eos_ota_signing_key.pem
```

### 6.1 Release Artifacts

```
release/v1.0.0/
├── health-key-ultra-rev-a-v1.0.0.hex        ← Full flash image
├── health-key-ultra-rev-a-v1.0.0.bin        ← OTA update binary
├── health-key-ultra-rev-a-v1.0.0.bin.sig    ← Ed25519 signature
├── health-band-neuro-rev-a-v1.0.0.hex
├── health-band-neuro-rev-a-v1.0.0.bin
├── health-band-neuro-rev-a-v1.0.0.bin.sig
├── health-ring-base-rev-a-v1.0.0.hex
├── health-ring-base-rev-a-v1.0.0.bin
├── health-ring-base-rev-a-v1.0.0.bin.sig
├── health-ring-ultra-rev-a-v1.0.0.hex
├── health-ring-ultra-rev-a-v1.0.0.bin
├── health-ring-ultra-rev-a-v1.0.0.bin.sig
├── health-lab-base-rev-a-v1.0.0.hex
├── health-lab-base-rev-a-v1.0.0.bin
├── health-lab-base-rev-a-v1.0.0.bin.sig
├── health-lab-ultra-rev-a-v1.0.0.hex
├── health-lab-ultra-rev-a-v1.0.0.bin
├── health-lab-ultra-rev-a-v1.0.0.bin.sig
├── manifest.json                             ← Version manifest for CDN
└── RELEASE_NOTES.md
```
