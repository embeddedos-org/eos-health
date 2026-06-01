# HEALTH-BAND Neuro — Firmware Flashing Guide
## Using eBuild on EmbeddedOS with J-Link / USB DFU / BLE OTA

**Target SoC:** Nordic nRF52840
**Firmware:** EmbeddedOS v1.0.0
**Build System:** eBuild (EmbeddedOS Build System)
**Patent Pending:** U.S. App. No. 64/076,078

---

## Prerequisites

### Hardware Required
| Item | Purpose | Source |
|---|---|---|
| HEALTH-BAND Neuro Rev-A PCB | Target device | See `pcb/rev-A-engineering/` |
| SEGGER J-Link EDU Mini | SWD programming interface | https://www.segger.com/products/debug-probes/j-link/models/j-link-edu-mini/ |
| Tag-Connect TC2030-CTX | SWD pogo-pin connector | https://www.tag-connect.com/product/tc2030-ctx |
| USB-C cable | Power + data | Standard |
| Linux / macOS / Windows PC | Build host | — |

### Software Required
```bash
# Install eBuild (EmbeddedOS Build System)
git clone https://github.com/embeddedos-org/ebuild
cd ebuild && sudo ./install.sh

# Install ARM GCC toolchain
sudo apt install gcc-arm-none-eabi  # Ubuntu/Debian
brew install arm-none-eabi-gcc      # macOS

# Install SEGGER J-Link tools
# Download from https://www.segger.com/downloads/jlink/
# Install JLinkExe and nrfjprog

# Install nRF Command Line Tools
# Download from https://www.nordicsemi.com/Products/Development-tools/nRF-Command-Line-Tools
```

---

## Method 1: J-Link SWD (Recommended for Initial Programming)

This is the primary method for flashing a blank or bricked device. Requires physical access to the SWD pads on the PCB.

### Step 1 — Connect J-Link to PCB
Connect the J-Link EDU Mini to the Tag-Connect TC2030-CTX pads on the Core Module:
```
J-Link Pin  → TC2030 Pin → Signal
1 (VTref)   → 1          → 3.3V
2 (GND)     → 3          → GND
7 (SWDIO)   → 2          → SWDIO
9 (SWDCLK)  → 4          → SWDCLK
15 (nRESET) → 6          → RESET
```

### Step 2 — Clone the Repository
```bash
git clone https://github.com/embeddedos-org/HEALTH-BAND-Neuro
cd HEALTH-BAND-Neuro/firmware
```

### Step 3 — Configure the Build
```bash
ebuild configure \
  --target nrf52840 \
  --board health-band-neuro-rev-a \
  --os embeddedos-v1.0.0 \
  --features "ble,usb,semg,tens,bac,ppg,ecg,imu,oled,emmc"
```

### Step 4 — Build the Firmware
```bash
# Debug build (includes logging, assertions)
ebuild build --debug

# Release build (optimized, signed for OTA)
ebuild build --release --sign-key keys/eos_signing_key.pem
```

Build output:
```
build/
├── health_band_neuro_rev_a_debug.hex      ← Debug firmware (J-Link)
├── health_band_neuro_rev_a_release.hex    ← Release firmware (J-Link)
├── health_band_neuro_rev_a_dfu.zip        ← OTA package (BLE DFU)
└── health_band_neuro_rev_a.elf            ← ELF with debug symbols
```

### Step 5 — Flash via J-Link
```bash
# Flash the softdevice (Nordic BLE stack) — only needed once
ebuild flash --interface jlink \
             --device nRF52840_xxAA \
             --softdevice s140 \
             --erase-all

# Flash the application firmware
ebuild flash --interface jlink \
             --device nRF52840_xxAA \
             --firmware build/health_band_neuro_rev_a_release.hex

# Verify the flash
ebuild verify --interface jlink --device nRF52840_xxAA
```

### Step 6 — Verify Boot
Open a serial terminal (115200 baud) on the J-Link RTT viewer:
```bash
JLinkRTTViewer &
# Or use ebuild's built-in RTT console:
ebuild console --interface jlink
```

Expected boot output:
```
[eBoot] EmbeddedOS v1.0.0 — HEALTH-BAND Neuro Rev-A
[eBoot] Partition A: valid, signature OK
[eKernel] Starting scheduler — 7 tasks
[eBLE] BLE 5.3 stack initialized
[eUSB] USB enumerated: MSC + HID
[SEMG] Electrode array ready — 6 channels
[BAC] Breath channel warm-up (20 min)
[OLED] Display initialized 128x64
[HEALTH-BAND] Ready
```

---

## Method 2: USB DFU (Device Firmware Update via USB-C)

Use this method when the device is already running a valid firmware and you want to update it via USB without a J-Link.

### Step 1 — Enter DFU Mode
Hold the **DFU button** (GPIO P0.18) while plugging in the USB-C cable, OR send the DFU trigger command via the companion app.

### Step 2 — Flash via nrfutil
```bash
# Install nrfutil
pip3 install nrfutil

# Flash the DFU package
nrfutil dfu usb-serial \
  -pkg build/health_band_neuro_rev_a_dfu.zip \
  -p /dev/ttyACM0  # Linux
  # -p /dev/tty.usbmodem* on macOS
  # -p COM3 on Windows
```

---

## Method 3: BLE OTA (Over-The-Air Update)

Use this method for field updates without physical access. Requires the device to be powered on and BLE advertising.

### Via Companion App (Recommended)
1. Open the EoS Health companion app
2. Navigate to **Settings → Firmware Update**
3. The app will detect available updates and show the current version
4. Tap **Update** → the app downloads the signed DFU package and transfers it via BLE
5. Device reboots automatically after successful update

### Via nRF Connect (Developer)
1. Install **nRF Connect for Mobile** (iOS / Android)
2. Connect to the device (advertises as "HEALTH-BAND-XXXX")
3. Tap the DFU icon → upload `build/health_band_neuro_rev_a_dfu.zip`

### Via eBuild CLI
```bash
ebuild ota \
  --device-name "HEALTH-BAND-XXXX" \
  --firmware build/health_band_neuro_rev_a_dfu.zip \
  --interface ble
```

---

## Generating Signing Keys

All release firmware must be signed with Ed25519 keys for OTA security. Generate a new key pair:

```bash
# Generate key pair
ebuild keygen --algorithm ed25519 --output keys/

# This creates:
# keys/eos_signing_key.pem      ← Private key (KEEP SECRET, never commit)
# keys/eos_signing_key_pub.pem  ← Public key (embedded in bootloader)

# Embed public key in bootloader
ebuild configure --verify-key keys/eos_signing_key_pub.pem
ebuild build --release --sign-key keys/eos_signing_key.pem
```

> ⚠️ **Security:** Never commit `eos_signing_key.pem` to the repository. Add it to `.gitignore`. Store it in a secure location (hardware security module or encrypted vault).

---

## CAD Files and Mechanical Assembly

The mechanical enclosure STEP files are in `pcb/rev-A-engineering/cad/`. To use them:

1. Open `HEALTH_BAND_Full_Assembly.step` in FreeCAD or any STEP-compatible CAD tool
2. The assembly includes the Core Module PCB, Strap Module FPCB, USB-C clasp (hook + latch), and Breath Analysis Channel housing
3. Export individual parts for 3D printing or CNC machining

**3D Printing the Prototype Enclosure:**
```
Material:     PLA or PETG (prototype), PA12 Nylon (final)
Layer height: 0.15 mm
Infill:       40%
Supports:     Required for USB-C clasp overhang
Post-process: Sand and prime the clasp housing for IP68 gasket seating
```

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| J-Link not detected | Driver not installed | Install SEGGER J-Link drivers |
| `Error: No target connected` | SWD wiring incorrect | Check TC2030 pin mapping |
| `Verification failed` | Flash corruption | `ebuild flash --erase-all` then reflash |
| BLE OTA fails at 50% | Insufficient battery | Charge to > 30% before OTA |
| `Signature verification failed` | Wrong signing key | Rebuild with correct key |
| OLED not initializing | I2C address conflict | Check U1 I2C pull-ups (R3, R4) |
| sEMG noise > 50 μV RMS | Electrode contact poor | Clean electrodes with isopropyl alcohol |

---

## Firmware Architecture Overview

```
firmware/
├── FLASHING_GUIDE.md           ← This file
├── src/
│   ├── main.c                  ← Entry point, task creation
│   ├── sensors/
│   │   ├── ppg.c               ← MAX30102 driver
│   │   ├── ecg.c               ← ADS1293 driver
│   │   ├── imu.c               ← ICM-42688-P driver
│   │   ├── temperature.c       ← MLX90614 driver
│   │   ├── uv.c                ← VEML6075 driver
│   │   ├── semg.c              ← INA333 + ADC + TinyML
│   │   ├── tens.c              ← MAX14521E driver
│   │   └── bac.c               ← MQ-303A + CCS811 driver
│   ├── ble/
│   │   ├── ble_health.c        ← Custom health data BLE profile
│   │   ├── ble_hid.c           ← HID over BLE (gesture → keystrokes)
│   │   └── ble_dfu.c           ← OTA DFU service
│   ├── usb/
│   │   ├── usb_msc.c           ← Mass Storage Class (64 GB vault)
│   │   └── usb_hid.c           ← HID (real-time data streaming)
│   ├── ml/
│   │   └── gesture_model.tflite ← TinyML gesture classifier (INT8)
│   └── display/
│       └── oled.c              ← SSD1306 driver
├── ebuild.config               ← eBuild configuration
├── boards/
│   └── health-band-neuro-rev-a.h  ← Board-specific pin definitions
└── keys/
    └── .gitkeep                ← Signing keys go here (not committed)
```

---

*Patent Pending: U.S. App. No. 64/076,078 — Srikanth Patchava, EoS Foundation.*
