#!/usr/bin/env python3
"""
EoS Health — BLE Commissioning Tool
====================================
Automated BLE scanner, GATT profile validator, and connection stability tester.
Runs on the host PC during L3 prototype verification.

Requirements:
    pip install bleak asyncio

Usage:
    python3 ble_commissioning.py scan              # Scan for EoS devices
    python3 ble_commissioning.py validate <addr>   # Validate GATT profile
    python3 ble_commissioning.py stability <addr>  # Run 1-hour stability test
    python3 ble_commissioning.py commission <addr> # Full commissioning flow
    python3 ble_commissioning.py all               # Scan + validate all found
"""

import asyncio
import json
import time
import sys
import struct
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    from bleak import BleakScanner, BleakClient
    from bleak.backends.characteristic import BleakGATTCharacteristic
    BLEAK_AVAILABLE = True
except ImportError:
    BLEAK_AVAILABLE = False

# ── EoS Health GATT UUIDs ─────────────────────────────────────────────────────
EOS_SERVICE_UUID         = "12345678-1234-1234-1234-123456789ABC"
EOS_DEVICE_INFO_UUID     = "12345678-1234-1234-1234-123456789AB0"
EOS_ECG_UUID             = "12345678-1234-1234-1234-123456789AB1"
EOS_PPG_UUID             = "12345678-1234-1234-1234-123456789AB2"
EOS_SPO2_UUID            = "12345678-1234-1234-1234-123456789AB3"
EOS_TEMPERATURE_UUID     = "12345678-1234-1234-1234-123456789AB4"
EOS_ACCELEROMETER_UUID   = "12345678-1234-1234-1234-123456789AB5"
EOS_BATTERY_UUID         = "12345678-1234-1234-1234-123456789AB6"
EOS_SEMG_UUID            = "12345678-1234-1234-1234-123456789AB7"
EOS_EDA_UUID             = "12345678-1234-1234-1234-123456789AB8"
EOS_TENS_CTRL_UUID       = "12345678-1234-1234-1234-123456789AB9"
EOS_GLUCOSE_UUID         = "12345678-1234-1234-1234-123456789ABA"
EOS_LACTATE_UUID         = "12345678-1234-1234-1234-123456789ABB"
EOS_OTA_CTRL_UUID        = "12345678-1234-1234-1234-123456789ABF"

# Standard BLE UUIDs
BATTERY_SERVICE_UUID     = "0000180F-0000-1000-8000-00805F9B34FB"
BATTERY_LEVEL_UUID       = "00002A19-0000-1000-8000-00805F9B34FB"
DEVICE_INFO_SERVICE_UUID = "0000180A-0000-1000-8000-00805F9B34FB"
MANUFACTURER_NAME_UUID   = "00002A29-0000-1000-8000-00805F9B34FB"
MODEL_NUMBER_UUID        = "00002A24-0000-1000-8000-00805F9B34FB"
FIRMWARE_REV_UUID        = "00002A26-0000-1000-8000-00805F9B34FB"
SERIAL_NUMBER_UUID       = "00002A25-0000-1000-8000-00805F9B34FB"

# ── Device Profiles ───────────────────────────────────────────────────────────
DEVICE_PROFILES = {
    "EoS KEY ULTRA": {
        "type": "health-key-ultra",
        "required_services": [EOS_SERVICE_UUID, BATTERY_SERVICE_UUID, DEVICE_INFO_SERVICE_UUID],
        "required_chars": [EOS_ECG_UUID, EOS_PPG_UUID, EOS_SPO2_UUID, EOS_BATTERY_UUID, EOS_OTA_CTRL_UUID],
        "optional_chars": [EOS_TEMPERATURE_UUID, EOS_ACCELEROMETER_UUID],
        "min_rssi": -80,
        "expected_adv_interval_ms": 100,
    },
    "EoS BAND Neuro": {
        "type": "health-band-neuro",
        "required_services": [EOS_SERVICE_UUID, BATTERY_SERVICE_UUID, DEVICE_INFO_SERVICE_UUID],
        "required_chars": [EOS_SEMG_UUID, EOS_EDA_UUID, EOS_TENS_CTRL_UUID, EOS_ECG_UUID, EOS_BATTERY_UUID, EOS_OTA_CTRL_UUID],
        "optional_chars": [EOS_TEMPERATURE_UUID, EOS_ACCELEROMETER_UUID],
        "min_rssi": -80,
        "expected_adv_interval_ms": 100,
    },
    "EoS RING": {
        "type": "health-ring",
        "required_services": [EOS_SERVICE_UUID, BATTERY_SERVICE_UUID, DEVICE_INFO_SERVICE_UUID],
        "required_chars": [EOS_PPG_UUID, EOS_SPO2_UUID, EOS_ECG_UUID, EOS_TEMPERATURE_UUID, EOS_BATTERY_UUID, EOS_OTA_CTRL_UUID],
        "optional_chars": [EOS_ACCELEROMETER_UUID],
        "min_rssi": -75,
        "expected_adv_interval_ms": 200,
    },
    "EoS LAB": {
        "type": "health-lab",
        "required_services": [EOS_SERVICE_UUID, BATTERY_SERVICE_UUID, DEVICE_INFO_SERVICE_UUID],
        "required_chars": [EOS_GLUCOSE_UUID, EOS_LACTATE_UUID, EOS_BATTERY_UUID, EOS_OTA_CTRL_UUID],
        "optional_chars": [EOS_TEMPERATURE_UUID],
        "min_rssi": -80,
        "expected_adv_interval_ms": 500,
    },
}

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN  = "\033[92m"; RED    = "\033[91m"; YELLOW = "\033[93m"
BLUE   = "\033[94m"; BOLD   = "\033[1m";  NC     = "\033[0m"

def ok(msg):    print(f"{GREEN}  ✅ {msg}{NC}")
def fail(msg):  print(f"{RED}  ❌ {msg}{NC}")
def warn(msg):  print(f"{YELLOW}  ⚠️  {msg}{NC}")
def info(msg):  print(f"{BLUE}  ℹ️  {msg}{NC}")
def header(msg): print(f"\n{BOLD}{'═'*60}\n  {msg}\n{'═'*60}{NC}")

# ── BLE Scanner ───────────────────────────────────────────────────────────────
async def scan_for_eos_devices(timeout: float = 10.0) -> list:
    """Scan for EoS Health BLE devices."""
    header("Scanning for EoS Health Devices")
    info(f"Scanning for {timeout}s...")

    devices_found = []

    def detection_callback(device, advertisement_data):
        name = device.name or ""
        if any(name.startswith(prefix) for prefix in ["EoS KEY", "EoS BAND", "EoS RING", "EoS LAB"]):
            devices_found.append({
                "address": device.address,
                "name": device.name,
                "rssi": advertisement_data.rssi,
                "tx_power": advertisement_data.tx_power,
                "services": list(advertisement_data.service_uuids),
            })
            print(f"  📡 Found: {device.name} | {device.address} | RSSI: {advertisement_data.rssi} dBm")

    scanner = BleakScanner(detection_callback=detection_callback)
    await scanner.start()
    await asyncio.sleep(timeout)
    await scanner.stop()

    print(f"\n  Found {len(devices_found)} EoS device(s)")
    return devices_found

# ── GATT Profile Validator ────────────────────────────────────────────────────
async def validate_gatt_profile(address: str) -> dict:
    """Connect to device and validate its GATT profile against the expected spec."""
    header(f"GATT Profile Validation: {address}")

    results = {
        "address": address,
        "timestamp": datetime.now().isoformat(),
        "passed": False,
        "device_name": None,
        "device_type": None,
        "firmware_version": None,
        "serial_number": None,
        "battery_level": None,
        "checks": [],
    }

    def add_check(name, passed, detail=""):
        results["checks"].append({"name": name, "passed": passed, "detail": detail})
        if passed:
            ok(f"{name}: {detail}")
        else:
            fail(f"{name}: {detail}")

    try:
        async with BleakClient(address, timeout=15.0) as client:
            info(f"Connected to {address}")
            add_check("BLE Connection", True, f"Connected in <15s")

            # Get device name
            device_name = None
            for service in client.services:
                if DEVICE_INFO_SERVICE_UUID.lower() in service.uuid.lower():
                    for char in service.characteristics:
                        if MANUFACTURER_NAME_UUID.lower() in char.uuid.lower():
                            val = await client.read_gatt_char(char.uuid)
                            results["device_name"] = val.decode("utf-8", errors="ignore")
                        elif MODEL_NUMBER_UUID.lower() in char.uuid.lower():
                            val = await client.read_gatt_char(char.uuid)
                            device_name = val.decode("utf-8", errors="ignore")
                            results["device_type"] = device_name
                        elif FIRMWARE_REV_UUID.lower() in char.uuid.lower():
                            val = await client.read_gatt_char(char.uuid)
                            results["firmware_version"] = val.decode("utf-8", errors="ignore")
                        elif SERIAL_NUMBER_UUID.lower() in char.uuid.lower():
                            val = await client.read_gatt_char(char.uuid)
                            results["serial_number"] = val.decode("utf-8", errors="ignore")

            add_check("Device Info Service", results["firmware_version"] is not None,
                      f"FW: {results['firmware_version']}, SN: {results['serial_number']}")

            # Determine expected profile
            profile = None
            for prefix, p in DEVICE_PROFILES.items():
                if device_name and prefix.lower() in device_name.lower():
                    profile = p
                    break

            if profile is None:
                add_check("Profile Detection", False, f"Unknown device type: {device_name}")
                return results

            # Check required services
            service_uuids = [s.uuid.lower() for s in client.services]
            for svc_uuid in profile["required_services"]:
                present = any(svc_uuid.lower() in u for u in service_uuids)
                add_check(f"Service {svc_uuid[:8]}...", present,
                          "Present" if present else "MISSING")

            # Check required characteristics
            char_uuids = []
            for service in client.services:
                for char in service.characteristics:
                    char_uuids.append(char.uuid.lower())

            for char_uuid in profile["required_chars"]:
                present = any(char_uuid.lower() in u for u in char_uuids)
                add_check(f"Char {char_uuid[:8]}...", present,
                          "Present" if present else "MISSING")

            # Read battery level
            try:
                battery_val = await client.read_gatt_char(BATTERY_LEVEL_UUID)
                results["battery_level"] = battery_val[0]
                add_check("Battery Level", True, f"{battery_val[0]}%")
            except Exception as e:
                add_check("Battery Level", False, str(e))

            # Test notification subscription on ECG
            ecg_data_received = []
            def ecg_handler(sender, data):
                ecg_data_received.append(data)

            try:
                await client.start_notify(EOS_ECG_UUID, ecg_handler)
                await asyncio.sleep(3.0)
                await client.stop_notify(EOS_ECG_UUID)
                add_check("ECG Notifications", len(ecg_data_received) > 0,
                          f"Received {len(ecg_data_received)} packets in 3s")
            except Exception as e:
                add_check("ECG Notifications", False, str(e))

            # Check MTU negotiation
            try:
                mtu = client.mtu_size
                add_check("MTU Negotiation", mtu >= 247, f"MTU={mtu} (target ≥247)")
            except Exception:
                add_check("MTU Negotiation", False, "MTU info unavailable")

            # All checks done
            passed_count = sum(1 for c in results["checks"] if c["passed"])
            total_count = len(results["checks"])
            results["passed"] = passed_count == total_count
            results["summary"] = f"{passed_count}/{total_count} checks passed"

    except Exception as e:
        add_check("BLE Connection", False, str(e))
        results["error"] = str(e)

    return results

# ── Connection Stability Tester ───────────────────────────────────────────────
async def test_connection_stability(address: str, duration_minutes: int = 60) -> dict:
    """Run a connection stability test for the specified duration."""
    header(f"Connection Stability Test: {address} ({duration_minutes} min)")

    results = {
        "address": address,
        "duration_minutes": duration_minutes,
        "start_time": datetime.now().isoformat(),
        "reconnections": 0,
        "data_packets_received": 0,
        "data_packets_expected": 0,
        "packet_loss_pct": 0.0,
        "max_gap_seconds": 0.0,
        "passed": False,
    }

    start_time = time.time()
    end_time = start_time + (duration_minutes * 60)
    last_packet_time = start_time
    reconnections = 0
    packets_received = 0

    info(f"Running stability test for {duration_minutes} minutes...")
    info("Press Ctrl+C to stop early")

    while time.time() < end_time:
        try:
            async with BleakClient(address, timeout=10.0) as client:
                if reconnections > 0:
                    info(f"Reconnected (attempt #{reconnections})")

                def data_handler(sender, data):
                    nonlocal packets_received, last_packet_time
                    packets_received += 1
                    last_packet_time = time.time()

                await client.start_notify(EOS_PPG_UUID, data_handler)

                # Monitor until disconnection or end of test
                while time.time() < end_time and client.is_connected:
                    elapsed = time.time() - start_time
                    remaining = (end_time - time.time()) / 60
                    gap = time.time() - last_packet_time

                    if gap > results["max_gap_seconds"]:
                        results["max_gap_seconds"] = gap

                    if int(elapsed) % 60 == 0:  # Print every minute
                        info(f"  {elapsed/60:.0f}/{duration_minutes} min | "
                             f"Packets: {packets_received} | "
                             f"Reconnections: {reconnections} | "
                             f"Max gap: {results['max_gap_seconds']:.1f}s")

                    await asyncio.sleep(1.0)

        except Exception as e:
            reconnections += 1
            warn(f"Disconnected: {e} — reconnecting...")
            await asyncio.sleep(2.0)

    # Calculate results
    elapsed_seconds = time.time() - start_time
    # PPG at 25 Hz = 25 packets/second
    expected_packets = int(elapsed_seconds * 25)
    results["reconnections"] = reconnections
    results["data_packets_received"] = packets_received
    results["data_packets_expected"] = expected_packets
    results["packet_loss_pct"] = max(0, (1 - packets_received / max(expected_packets, 1)) * 100)
    results["end_time"] = datetime.now().isoformat()

    # Pass criteria
    results["passed"] = (
        reconnections <= 3 and                    # Max 3 reconnections per hour
        results["packet_loss_pct"] <= 1.0 and     # Max 1% packet loss
        results["max_gap_seconds"] <= 5.0          # Max 5s gap
    )

    print(f"\n{'='*60}")
    print(f"Stability Test Results:")
    print(f"  Duration:        {elapsed_seconds/60:.1f} minutes")
    print(f"  Reconnections:   {reconnections} (spec: ≤3)")
    print(f"  Packet loss:     {results['packet_loss_pct']:.2f}% (spec: ≤1%)")
    print(f"  Max gap:         {results['max_gap_seconds']:.1f}s (spec: ≤5s)")
    print(f"  Status:          {'✅ PASS' if results['passed'] else '❌ FAIL'}")

    return results

# ── VNA Tuning Guide ──────────────────────────────────────────────────────────
def print_vna_tuning_guide():
    """Print the VNA antenna tuning procedure."""
    header("VNA Antenna Tuning Procedure")
    print("""
  Equipment required:
    - Vector Network Analyzer (VNA): NanoVNA V2 ($50) or Keysight E5063A
    - SMA to U.FL adapter cable
    - Soldering station + 0402 capacitors (0.5–3.3 pF range)

  Target: S11 < -10 dB at 2.44 GHz (BLE center frequency)

  Step 1: Connect VNA
    - Calibrate VNA with SOLT (Short-Open-Load-Thru) at 2.4–2.5 GHz
    - Connect U.FL probe to antenna feed point on PCB
    - Power the device (BLE transmitter must be active)

  Step 2: Measure baseline S11
    - Sweep 2.0–2.6 GHz
    - Note S11 at 2.44 GHz (expected: -5 to -8 dB from simulation)
    - Note resonant frequency (where S11 is minimum)

  Step 3: Tune matching network
    If resonant frequency is TOO LOW (< 2.44 GHz):
      → Decrease shunt capacitor C2 (replace with smaller value)
      → Try: 2.7 pF → 2.2 pF → 1.8 pF → 1.5 pF

    If resonant frequency is TOO HIGH (> 2.44 GHz):
      → Increase shunt capacitor C2
      → Try: 2.7 pF → 3.3 pF → 3.9 pF

    If S11 minimum is correct frequency but not deep enough:
      → Adjust series inductor L1 (±0.3 nH)
      → Try: 3.3 nH → 3.0 nH → 2.7 nH (if resonance is correct)

  Step 4: Verify
    - S11 at 2.44 GHz: < -10 dB ✅
    - S11 at 2.402 GHz (BLE ch 0): < -8 dB ✅
    - S11 at 2.480 GHz (BLE ch 39): < -8 dB ✅

  Step 5: Record final component values
    - Document in hardware/pcb/ANTENNA_TUNING_LOG.md
    - Update schematic with tuned values
    - Repeat for all 10 prototype boards (values may vary ±0.5 pF)

  Reference: nRF52840 Product Specification, Section 7.3 (RF)
  Johanson 2450AT18A100E datasheet, Application Note AN-2450-001
""")

# ── Main ──────────────────────────────────────────────────────────────────────
async def main_async():
    if not BLEAK_AVAILABLE:
        print("⚠️  bleak not installed. Running in documentation mode.")
        print("   Install: pip install bleak")
        print_vna_tuning_guide()
        return

    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"
    addr = sys.argv[2] if len(sys.argv) > 2 else None

    if cmd == "scan":
        devices = await scan_for_eos_devices(timeout=10.0)
        if not devices:
            print("\n  No EoS devices found. Ensure device is powered and advertising.")

    elif cmd == "validate" and addr:
        results = await validate_gatt_profile(addr)
        print(f"\n  Result: {'✅ PASS' if results['passed'] else '❌ FAIL'}")
        print(f"  Summary: {results.get('summary', 'N/A')}")
        # Save report
        report_path = Path("prototype/test-runner/reports") / f"gatt_validation_{addr.replace(':', '')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_path.parent.mkdir(parents=True, exist_ok=True)
        with open(report_path, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"  Report: {report_path}")

    elif cmd == "stability" and addr:
        duration = int(sys.argv[3]) if len(sys.argv) > 3 else 60
        results = await test_connection_stability(addr, duration)

    elif cmd == "vna":
        print_vna_tuning_guide()

    elif cmd == "all":
        devices = await scan_for_eos_devices(timeout=10.0)
        for device in devices:
            results = await validate_gatt_profile(device["address"])
            print(f"\n  {device['name']}: {'✅ PASS' if results['passed'] else '❌ FAIL'}")

    else:
        print(f"""
{BOLD}EoS Health — BLE Commissioning Tool{NC}

Usage:
  python3 ble_commissioning.py scan              Scan for EoS devices
  python3 ble_commissioning.py validate <addr>   Validate GATT profile
  python3 ble_commissioning.py stability <addr> [minutes]  Stability test
  python3 ble_commissioning.py vna               VNA tuning guide
  python3 ble_commissioning.py all               Scan + validate all
""")

def main():
    asyncio.run(main_async())

if __name__ == "__main__":
    main()
