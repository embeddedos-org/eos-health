#!/usr/bin/env python3
"""
EoS Health — Factory Test Suite
File: firmware/shared/factory-test/eos_factory_test.py

Automated factory test runner for all EoS Health devices.
Connects via BLE (bleak), runs all tests, and writes JSON result.

Usage:
    python3 eos_factory_test.py --device health-ring-ultra --serial EHR-2026-000001
    python3 eos_factory_test.py --device health-lab-ultra  --serial EHL-2026-000001

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


# ── Entry point ──────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="EoS Health Factory Test")
    parser.add_argument("--device",  required=True,
                        choices=["health-key-ultra", "health-band-neuro",
                                 "health-ring-base", "health-ring-ultra",
                                 "health-lab-base",  "health-lab-ultra"])
    parser.add_argument("--serial",  required=True, help="Device serial number")
    parser.add_argument("--station", default="FACTORY-LINE-01")
    args = parser.parse_args()

    runner = EosFactoryTest(args.device, args.serial, args.station)
    passed = asyncio.run(runner.run_all())
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
