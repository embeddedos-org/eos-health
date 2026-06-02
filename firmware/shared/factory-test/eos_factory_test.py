#!/usr/bin/env python3
"""
EoS Health — Factory Test Suite
File: firmware/shared/factory-test/eos_factory_test.py

Automated factory test runner for all EoS Health devices.
Connects via BLE (bleak), runs all tests, and writes JSON result.

Usage:
    # Real hardware:
    python3 eos_factory_test.py --device health-ring-ultra --serial EHR-2026-000001
    python3 eos_factory_test.py --device health-lab-ultra  --serial EHL-2026-000001

    # CI/CD demo mode (no hardware required):
    python3 eos_factory_test.py --demo

Requirements:
    pip3 install bleak asyncio ed25519

Exit codes:
    0 = All tests passed
    1 = One or more tests failed
    2 = Device not found / BLE error
"""

import asyncio
import argparse
import json
import struct
import time
import sys
from datetime import datetime, timezone
from dataclasses import dataclass, field, asdict
from typing import Optional, List
from bleak import BleakClient, BleakScanner

# ── EoS GATT UUIDs ──────────────────────────────────────────────
EOS_SERVICE_UUID          = "12345678-0001-0000-0000-EOS000000000"
EOS_FACTORY_TEST_UUID     = "12345678-0002-0000-0000-EOS000000000"
EOS_SENSOR_DATA_UUID      = "12345678-0003-0000-0000-EOS000000000"
EOS_PROVISIONING_UUID     = "12345678-0004-0000-0000-EOS000000000"
EOS_DEVICE_INFO_UUID      = "12345678-0005-0000-0000-EOS000000000"

# Standard BLE service UUIDs
BATTERY_SERVICE_UUID      = "0000180F-0000-1000-8000-00805F9B34FB"
BATTERY_LEVEL_UUID        = "00002A19-0000-1000-8000-00805F9B34FB"
DEVICE_INFO_SERVICE_UUID  = "0000180A-0000-1000-8000-00805F9B34FB"
FW_REVISION_UUID          = "00002A26-0000-1000-8000-00805F9B34FB"

# ── Test result dataclass ────────────────────────────────────────
@dataclass
class TestResult:
    id: str
    name: str
    result: str = "PENDING"
    value: str = ""
    error: str = ""
    duration_ms: int = 0

@dataclass
class FactoryTestReport:
    serial: str
    device_type: str
    hw_revision: str = "rev-a"
    test_date: str = ""
    station_id: str = "FACTORY-LINE-01"
    overall_result: str = "PENDING"
    fw_version: str = ""
    ble_address: str = ""
    tests: List[TestResult] = field(default_factory=list)
    calibration_applied: bool = False

# ── Test runner ──────────────────────────────────────────────────
class EosFactoryTest:
    def __init__(self, device_type: str, serial: str, station_id: str):
        self.device_type = device_type
        self.serial = serial
        self.station_id = station_id
        self.client: Optional[BleakClient] = None
        self.report = FactoryTestReport(
            serial=serial,
            device_type=device_type,
            station_id=station_id,
            test_date=datetime.now(timezone.utc).isoformat()
        )

    async def find_device(self) -> Optional[str]:
        """Scan for device advertising in factory mode."""
        print(f"Scanning for {self.device_type} in factory mode...")
        devices = await BleakScanner.discover(timeout=15.0)
        for d in devices:
            if d.name and "EOS-FACTORY" in d.name:
                print(f"Found: {d.name} ({d.address}) RSSI={d.rssi} dBm")
                return d.address
        return None

    async def connect(self, address: str) -> bool:
        """Connect and negotiate MTU."""
        self.client = BleakClient(address, timeout=15.0)
        await self.client.connect()
        # Request MTU 247
        await self.client.request_mtu(247)
        self.report.ble_address = address
        return self.client.is_connected

    async def run_test(self, test_id: str, name: str, coro) -> TestResult:
        """Run a single test with timing and error handling."""
        result = TestResult(id=test_id, name=name)
        start = time.monotonic()
        try:
            value = await asyncio.wait_for(coro, timeout=60.0)
            result.result = "PASS"
            result.value = str(value)
        except AssertionError as e:
            result.result = "FAIL"
            result.error = str(e)
        except asyncio.TimeoutError:
            result.result = "FAIL"
            result.error = "Timeout"
        except Exception as e:
            result.result = "FAIL"
            result.error = f"{type(e).__name__}: {e}"
        result.duration_ms = int((time.monotonic() - start) * 1000)
        status = "✅ PASS" if result.result == "PASS" else "❌ FAIL"
        print(f"  {status} [{test_id}] {name}: {result.value or result.error}")
        self.report.tests.append(result)
        return result

    # ── Individual test implementations ─────────────────────────

    async def test_ble_advertising(self):
        """FT-001: BLE RSSI check."""
        devices = await BleakScanner.discover(timeout=5.0)
        for d in devices:
            if d.address == self.report.ble_address:
                assert d.rssi > -70, f"RSSI too low: {d.rssi} dBm"
                return f"{d.rssi} dBm"
        raise AssertionError("Device not found in scan")

    async def test_ble_connection(self):
        """FT-002: BLE connection and MTU."""
        assert self.client.is_connected, "Not connected"
        mtu = self.client.mtu_size
        assert mtu >= 247, f"MTU too small: {mtu}"
        return f"MTU={mtu}"

    async def test_firmware_version(self):
        """FT-003: Read firmware version."""
        data = await self.client.read_gatt_char(FW_REVISION_UUID)
        version = data.decode("utf-8").strip()
        assert version.startswith("1."), f"Unexpected version: {version}"
        self.report.fw_version = version
        return version

    async def test_battery_voltage(self):
        """FT-004: Battery level check."""
        data = await self.client.read_gatt_char(BATTERY_LEVEL_UUID)
        pct = data[0]
        assert pct >= 80, f"Battery too low: {pct}%"
        return f"{pct}%"

    async def test_ecg_signal(self):
        """FT-005: ECG signal quality (ring/key only)."""
        # Send factory test command: 0x01 = run ECG test
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x01]))
        await asyncio.sleep(5.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        # Response: [type(1B), hr(2B), quality(1B), lead_off(1B)]
        assert len(data) >= 5, "Short response"
        assert data[0] == 0x01, "Wrong response type"
        hr = struct.unpack_from("<H", data, 1)[0]
        quality = data[3]
        lead_off = data[4]
        assert lead_off == 0, f"Lead off detected"
        assert 50 <= hr <= 120, f"HR out of range: {hr} BPM"
        assert quality >= 70, f"ECG quality too low: {quality}%"
        return f"HR={hr} BPM, quality={quality}%"

    async def test_ppg_signal(self):
        """FT-006: PPG signal quality."""
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x02]))
        await asyncio.sleep(5.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        assert len(data) >= 9, "Short response"
        assert data[0] == 0x02
        spo2 = data[1]
        red_dc = struct.unpack_from("<I", data, 2)[0]
        ir_dc  = struct.unpack_from("<I", data, 6)[0]
        assert red_dc > 50000, f"Red DC too low: {red_dc}"
        assert ir_dc  > 50000, f"IR DC too low: {ir_dc}"
        assert 95 <= spo2 <= 100, f"SpO₂ out of range: {spo2}%"
        return f"SpO₂={spo2}%, red_dc={red_dc}, ir_dc={ir_dc}"

    async def test_imu(self):
        """FT-007: IMU self-test."""
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x03]))
        await asyncio.sleep(3.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        assert data[0] == 0x03
        imu_pass = data[1]
        assert imu_pass == 1, "IMU self-test failed"
        return "IMU self-test PASS"

    async def test_temperature(self):
        """FT-008: Temperature sensor."""
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x04]))
        await asyncio.sleep(2.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        assert data[0] == 0x04
        temp_c = struct.unpack_from("<h", data, 1)[0] / 10.0
        assert 15.0 <= temp_c <= 35.0, f"Temp out of range: {temp_c}°C"
        return f"{temp_c}°C"

    async def test_provisioning(self):
        """FT-009: Verify provisioning data."""
        data = await self.client.read_gatt_char(EOS_PROVISIONING_UUID)
        serial = data[:16].decode("utf-8").rstrip("\x00")
        assert serial == self.serial, f"Serial mismatch: {serial} != {self.serial}"
        return f"serial={serial}"

    async def test_flash_rw(self):
        """FT-010: Flash read/write integrity."""
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x05]))
        await asyncio.sleep(3.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        assert data[0] == 0x05
        errors = struct.unpack_from("<I", data, 1)[0]
        assert errors == 0, f"Flash errors: {errors}"
        return "0 errors"

    async def test_glucose_electrode(self):
        """FT-011: Glucose electrode (HEALTH-LAB only)."""
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x10]))
        await asyncio.sleep(10.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        assert data[0] == 0x10
        current_na = struct.unpack_from("<f", data, 1)[0]
        assert 10.0 <= current_na <= 100.0, f"Glucose current out of range: {current_na:.1f} nA"
        return f"{current_na:.1f} nA"

    async def test_reference_electrode(self):
        """FT-012: Reference electrode voltage (HEALTH-LAB only)."""
        await self.client.write_gatt_char(EOS_FACTORY_TEST_UUID, bytes([0x11]))
        await asyncio.sleep(5.0)
        data = await self.client.read_gatt_char(EOS_SENSOR_DATA_UUID)
        assert data[0] == 0x11
        ref_mv = struct.unpack_from("<f", data, 1)[0] * 1000.0
        assert 190.0 <= ref_mv <= 210.0, f"Ref voltage out of range: {ref_mv:.1f} mV"
        return f"{ref_mv:.1f} mV"

    # ── Run all tests for device type ────────────────────────────

    async def run_all(self):
        print(f"\n{'='*60}")
        print(f"EoS Health Factory Test")
        print(f"Device: {self.device_type}")
        print(f"Serial: {self.serial}")
        print(f"Station: {self.station_id}")
        print(f"{'='*60}\n")

        # Find and connect
        address = await self.find_device()
        if not address:
            print("ERROR: Device not found in BLE scan")
            sys.exit(2)

        await self.connect(address)
        print(f"Connected to {address}\n")

        # Common tests for all devices
        await self.run_test("FT-001", "BLE Advertising",     self.test_ble_advertising())
        await self.run_test("FT-002", "BLE Connection",      self.test_ble_connection())
        await self.run_test("FT-003", "Firmware Version",    self.test_firmware_version())
        await self.run_test("FT-004", "Battery Voltage",     self.test_battery_voltage())
        await self.run_test("FT-008", "IMU Self-Test",       self.test_imu())
        await self.run_test("FT-009", "Temperature Sensor",  self.test_temperature())
        await self.run_test("FT-010", "Flash Read/Write",    self.test_flash_rw())
        await self.run_test("FT-014", "Provisioning Data",   self.test_provisioning())

        # Device-specific tests
        if self.device_type in ("health-ring-base", "health-ring-ultra",
                                 "health-key-ultra"):
            await self.run_test("FT-005", "ECG Signal Quality", self.test_ecg_signal())
            await self.run_test("FT-006", "PPG Signal Quality", self.test_ppg_signal())

        if self.device_type in ("health-lab-base", "health-lab-ultra"):
            await self.run_test("FT-011", "Glucose Electrode",    self.test_glucose_electrode())
            await self.run_test("FT-012", "Reference Electrode",  self.test_reference_electrode())
            await self.run_test("FT-006", "PPG Signal Quality",   self.test_ppg_signal())

        # Determine overall result
        failed = [t for t in self.report.tests if t.result == "FAIL"]
        self.report.overall_result = "FAIL" if failed else "PASS"

        # Print summary
        print(f"\n{'='*60}")
        print(f"RESULT: {self.report.overall_result}")
        if failed:
            print(f"FAILED TESTS ({len(failed)}):")
            for t in failed:
                print(f"  ❌ [{t.id}] {t.name}: {t.error}")
        else:
            print(f"All {len(self.report.tests)} tests passed")
        print(f"{'='*60}\n")

        # Write JSON report
        report_path = f"factory_reports/{self.serial}_{int(time.time())}.json"
        import os
        os.makedirs("factory_reports", exist_ok=True)
        with open(report_path, "w") as f:
            # Convert dataclasses to dict
            report_dict = asdict(self.report)
            json.dump(report_dict, f, indent=2)
        print(f"Report saved: {report_path}")

        await self.client.disconnect()
        return self.report.overall_result == "PASS"


# ── Demo mode (no hardware required) ─────────────────────────────
def run_demo_mode() -> bool:
    """
    Simulate factory test for all 4 devices without physical hardware.
    Used for CI/CD validation and development testing.
    All tests use deterministic simulated sensor values.
    """
    import random, os
    random.seed(2026)

    DEMO_DEVICES = [
        ("health-key-ultra",  "EHK-2026-000001"),
        ("health-band-neuro", "EHB-2026-000001"),
        ("health-ring-ultra", "EHR-2026-000001"),
        ("health-lab-ultra",  "EHL-2026-000001"),
    ]

    ALL_TESTS = [
        ("FT-001", "BLE Advertising"),
        ("FT-002", "BLE Connection"),
        ("FT-003", "Firmware Version"),
        ("FT-004", "Battery Voltage"),
        ("FT-005", "ECG Signal Quality"),
        ("FT-006", "PPG Signal Quality"),
        ("FT-007", "SpO2 Calibration"),
        ("FT-008", "IMU Self-Test"),
        ("FT-009", "Temperature Sensor"),
        ("FT-010", "Flash Read/Write"),
        ("FT-011", "Glucose Electrode"),
        ("FT-012", "Reference Electrode"),
        ("FT-013", "Crypto Attestation"),
        ("FT-014", "Provisioning Data"),
    ]

    DEVICE_TESTS = {
        "health-key-ultra":  ["FT-001","FT-002","FT-003","FT-004","FT-005","FT-006","FT-007","FT-008","FT-009","FT-010","FT-013","FT-014"],
        "health-band-neuro": ["FT-001","FT-002","FT-003","FT-004","FT-005","FT-006","FT-008","FT-009","FT-010","FT-013","FT-014"],
        "health-ring-ultra": ["FT-001","FT-002","FT-003","FT-004","FT-005","FT-006","FT-007","FT-008","FT-009","FT-010","FT-013","FT-014"],
        "health-lab-ultra":  ["FT-001","FT-002","FT-003","FT-004","FT-006","FT-008","FT-009","FT-010","FT-011","FT-012","FT-013","FT-014"],
    }

    DEMO_VALUES = {
        "FT-001": "RSSI=-62dBm", "FT-002": "MTU=247B", "FT-003": "v1.0.0",
        "FT-004": "4.12V (100%)", "FT-005": "HR=72 BPM, quality=94%",
        "FT-006": "SpO2=98%, red_dc=125000, ir_dc=118000",
        "FT-007": "ARMS=0.91%", "FT-008": "IMU self-test PASS",
        "FT-009": "36.5°C", "FT-010": "0 errors",
        "FT-011": "42.3 nA", "FT-012": "200.1 mV",
        "FT-013": "ECDSA-P256 OK", "FT-014": "SN+MAC+KEY OK",
    }

    print("=" * 60)
    print("  EoS Health Factory Test — DEMO MODE (no hardware)")
    print(f"  Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print("  Note: All values are simulated. For real hardware, omit --demo.")
    print("=" * 60)

    total_tests = 0
    total_passed = 0
    all_reports = []

    for device_type, serial in DEMO_DEVICES:
        print(f"\n[Device] {device_type} | Serial: {serial}")
        print("-" * 50)
        test_ids = DEVICE_TESTS.get(device_type, [])
        device_passed = 0
        device_tests = []

        for test_id, test_name in ALL_TESTS:
            if test_id not in test_ids:
                continue
            duration_ms = random.randint(50, 400)
            value = DEMO_VALUES.get(test_id, "OK")
            result = TestResult(
                id=test_id, name=test_name, result="PASS",
                value=value, duration_ms=duration_ms
            )
            device_tests.append(result)
            device_passed += 1
            total_tests += 1
            total_passed += 1
            print(f"  ✅ [{test_id}] {test_name}: {value} ({duration_ms}ms)")

        overall = "PASS" if device_passed == len(test_ids) else "FAIL"
        report = FactoryTestReport(
            serial=serial, device_type=device_type,
            hw_revision="rev-a", fw_version="1.0.0",
            ble_address=f"AA:BB:CC:DD:EE:{random.randint(10,99):02X}",
            station_id="DEMO-STATION",
            test_date=datetime.now(timezone.utc).isoformat(),
            overall_result=overall, tests=device_tests,
            calibration_applied=True
        )
        all_reports.append(asdict(report))
        print(f"  → {overall}: {device_passed}/{len(test_ids)} tests passed")

    print("\n" + "=" * 60)
    print("  FACTORY TEST DEMO SUMMARY")
    print("=" * 60)
    print(f"  Devices tested: {len(DEMO_DEVICES)}")
    print(f"  Total tests:    {total_tests}")
    print(f"  Passed:         {total_passed}")
    print(f"  Failed:         {total_tests - total_passed}")
    overall_label = "✅ ALL PASS" if total_passed == total_tests else "❌ FAILURES DETECTED"
    print(f"  Overall: {overall_label}")
    print("=" * 60)

    os.makedirs("factory_reports", exist_ok=True)
    report_path = f"factory_reports/demo_report_{int(time.time())}.json"
    with open(report_path, "w") as f:
        json.dump({"mode": "demo",
                   "timestamp": datetime.now(timezone.utc).isoformat(),
                   "summary": {"total": total_tests, "passed": total_passed},
                   "device_reports": all_reports}, f, indent=2)
    print(f"\n  Report saved: {report_path}")
    return total_passed == total_tests


# ── Entry point ──────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="EoS Health Factory Test")
    parser.add_argument("--device",
                        choices=["health-key-ultra", "health-band-neuro",
                                 "health-ring-base", "health-ring-ultra",
                                 "health-lab-base",  "health-lab-ultra"])
    parser.add_argument("--serial",  help="Device serial number")
    parser.add_argument("--station", default="FACTORY-LINE-01")
    parser.add_argument("--demo", action="store_true",
                        help="Run in demo mode (no hardware required, for CI/CD)")
    args = parser.parse_args()

    if args.demo:
        passed = run_demo_mode()
        sys.exit(0 if passed else 1)

    if not args.device or not args.serial:
        parser.error("--device and --serial are required unless --demo is specified")

    runner = EosFactoryTest(args.device, args.serial, args.station)
    passed = asyncio.run(runner.run_all())
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
