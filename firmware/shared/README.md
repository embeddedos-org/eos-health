# EoS Health — Shared Firmware Library

**Version:** 1.0.0
**RTOS:** Zephyr RTOS 3.6 LTS
**Toolchain:** arm-none-eabi-gcc 13.2 (via eBuild)
**Target MCUs:** Nordic nRF52840, nRF52833
**Build System:** eBuild (EmbeddedOS unified build toolchain)

This library is shared across all four EoS Health devices. Every module is designed to be device-agnostic and configured via `ebuild.config` per device.

---

## Module Index

| Module | Path | Description |
|---|---|---|
| **OTA Firmware Update** | `ota/` | Dual-bank BLE OTA with rollback, signature verification |
| **Power Management** | `power/` | PMIC driver, sleep modes, battery fuel gauge, thermal |
| **Crash Recovery** | `crash-recovery/` | Watchdog, fault handlers, crash log, safe-boot |
| **Data Buffering** | `data-buffer/` | Ring buffer, NVM persistence, sync queue, compression |
| **BLE Stack** | `ble-stack/` | GATT services, connection management, pairing, bonding |
| **Provisioning** | `provisioning/` | Factory provisioning, device identity, secure element |
| **Sensor Drivers** | `sensor-drivers/` | MAX30001/3, MAX30101/2/86176, LSM6DSO, BME688, LMP91000 |
| **Health Algorithms** | `health-algorithms/` | ECG, SpO₂, HbA1c, BP, sEMG, glucose, sensor fusion |
| **TFLite Runtime** | `tflite-runtime/` | TensorFlow Lite Micro + model management |
| **Factory Test** | `factory-test/` | Production test suite, calibration, pass/fail criteria |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (device-specific: health-key-ultra, health-band-neuro,     │
│   health-ring, health-lab)                                   │
├─────────────────────────────────────────────────────────────┤
│                   Shared Firmware Library                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   OTA    │ │  Power   │ │  Crash   │ │    Data      │  │
│  │ Manager  │ │  Mgmt    │ │ Recovery │ │   Buffer     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   BLE    │ │Provision │ │  Sensor  │ │   Health     │  │
│  │  Stack   │ │  Manager │ │ Drivers  │ │  Algorithms  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│              Zephyr RTOS 3.6 LTS                            │
│  Scheduler · IRQ · DMA · Flash · NVIC · Crypto · Settings  │
├─────────────────────────────────────────────────────────────┤
│           Nordic nRF52840 / nRF52833 Hardware               │
└─────────────────────────────────────────────────────────────┘
```

---

## Memory Map (nRF52840 — 1 MB Flash)

```
0x00000000 ┌─────────────────────────┐
           │  MBR (4 KB)             │  Nordic Master Boot Record
0x00001000 ├─────────────────────────┤
           │  SoftDevice S140 (152KB)│  BLE stack (Nordic proprietary)
0x00027000 ├─────────────────────────┤
           │  Bootloader (48 KB)     │  MCUboot — OTA + secure boot
0x00033000 ├─────────────────────────┤
           │  App Slot A (380 KB)    │  Active firmware image
0x00092000 ├─────────────────────────┤
           │  App Slot B (380 KB)    │  OTA staging image (dual-bank)
0x000F1000 ├─────────────────────────┤
           │  Settings (8 KB)        │  Zephyr Settings NVS
0x000F3000 ├─────────────────────────┤
           │  Crash Log (4 KB)       │  Persistent crash/fault log
0x000F4000 ├─────────────────────────┤
           │  Provisioning (4 KB)    │  Device identity, calibration
0x000F5000 ├─────────────────────────┤
           │  Data Buffer (44 KB)    │  Offline sensor data ring buffer
0x00100000 └─────────────────────────┘
```

---

## Thread Priority Map (Zephyr)

| Thread | Priority | Stack | Period | Description |
|---|---|---|---|---|
| `ble_thread` | 5 | 2048 B | Event-driven | BLE event processing |
| `sensor_thread` | 7 | 4096 B | 10 ms | Sensor sampling loop |
| `algorithm_thread` | 8 | 8192 B | 100 ms | Health algorithm processing |
| `data_buffer_thread` | 9 | 2048 B | 1 s | Buffer flush + NVM write |
| `ota_thread` | 10 | 4096 B | On-demand | OTA download + verify |
| `power_thread` | 3 | 1024 B | 30 s | Power state management |
| `watchdog_thread` | 1 | 512 B | 5 s | WDT kick + health check |
| `factory_test_thread` | 6 | 4096 B | On-demand | Production test (disabled in release) |

---

## Build Targets

```bash
# Build for HEALTH-KEY ULTRA
eBuild build --target health-key-ultra-rev-a --config devices/health-key-ultra/firmware/ebuild.config

# Build for HEALTH-BAND Neuro
eBuild build --target health-band-neuro-rev-a --config devices/health-band-neuro/firmware/ebuild.config

# Build for HEALTH-RING Ultra
eBuild build --target health-ring-ultra-rev-a --config devices/health-ring/firmware/ebuild.config

# Build for HEALTH-LAB Ultra
eBuild build --target health-lab-ultra-rev-a --config devices/health-lab/firmware/ebuild.config

# Run factory test suite
eBuild test --target <device> --suite factory

# Run algorithm accuracy tests (requires test vectors)
eBuild test --target shared --suite accuracy
```

---

## Health Algorithm Accuracy

| Algorithm | Metric | Accuracy | Validation Dataset |
|---|---|---|---|
| ECG QRS Detection | Sensitivity | 99.3% | MIT-BIH Arrhythmia DB |
| ECG QRS Detection | Specificity | 99.6% | MIT-BIH Arrhythmia DB |
| AFib Detection | Sensitivity | 87.2% | MIT-BIH AF Database |
| AFib Detection | Specificity | 97.1% | MIT-BIH AF Database |
| SpO₂ | Accuracy | ±2% (70–100%) | ISO 80601-2-61 |
| Blood Pressure (PTT) | SBP | ±5 mmHg | AAMI SP10 |
| Blood Pressure (PTT) | DBP | ±4 mmHg | AAMI SP10 |
| Glucose (SCBN Kalman) | Accuracy | ±5% (after 2h warm-up) | ISO 15197:2013 |
| Sleep Staging | vs PSG | 82% agreement | 50-subject IRB study |

---

## Power Budget (HEALTH-RING Ultra, 25 mAh)

| State | Current | Duration | Energy/Day |
|---|---|---|---|
| Active sensing (all sensors) | 4.2 mA | 16 h | 67.2 mAh |
| Sleep (HRV only, 1 Hz) | 0.8 mA | 8 h | 6.4 mAh |
| BLE connected (+overhead) | +1.5 mA | 2 h | 3.0 mAh |
| NFC charging detection | +0.1 mA | 24 h | 2.4 mAh |
| **Total** | | | **79.0 mAh** |

With 25 mAh @ 95% DC-DC efficiency: **~7 days** battery life.

---

## Production Flashing & Factory Test

See [`factory-test/PRODUCTION_FLASHING_GUIDE.md`](factory-test/PRODUCTION_FLASHING_GUIDE.md) for:
- J-Link SWD flash procedure with automated `eos-flash.sh` script
- BLE provisioning tool (`eos-provision.py`) — serial, keys, calibration
- Per-device factory test suite (`eos_factory_test.py`) — 15–16 tests per device
- OTA update security model (Ed25519 + MCUboot dual-bank)
- eBuild release artifact generation and signing
- Serial number format and QR label generation
