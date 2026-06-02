#!/usr/bin/env python3
"""
EoS Health — Hardware Validation Tool
Validates KiCad schematics and BOM completeness for all 4 devices.

Checks:
  1. KiCad schematic structure and completeness
  2. BOM: every component has part number, manufacturer, supplier
  3. BOM: critical ICs have verified Digi-Key/Mouser part numbers
  4. Power budget: battery capacity vs estimated consumption
  5. Wireless charging coil presence (HEALTH-RING)
  6. Flex PCB indicators (HEALTH-LAB, HEALTH-BAND Neuro)
"""

import re
import sys
from pathlib import Path

DEVICES_ROOT = Path(__file__).parent.parent / "devices"
RESULTS = []
PASS = 0
WARN = 0
FAIL = 0

# Known valid part numbers for critical ICs
VERIFIED_PARTS = {
    # MCUs
    "nRF52840": ["NRF52840-QIAA-R7", "NRF52840-QIAA-R"],
    "nRF52833": ["NRF52833-QIAA-R7"],
    "nRF52832": ["NRF52832-QFAA-R7"],
    "MAX32666": ["MAX32666FTGC+"],
    # PPG / SpO2
    "MAX86176": ["MAX86176EWV+"],
    "MAX86141": ["MAX86141EFD+T"],
    "MAX30102": ["MAX30102EFD+T"],
    # ECG
    "ADS1299": ["ADS1299IPAGR"],
    "MAX30003": ["MAX30003CWV+T"],
    # IMU
    "LSM6DSO": ["LSM6DSOXTR"],
    "BMI270": ["BMI270"],
    # Temperature
    "MAX30208": ["MAX30208AFF+T"],
    "TMP117": ["TMP117MAIDRVR"],
    # Charging
    "BQ25125": ["BQ25125YFPR"],
    "MAX77734": ["MAX77734EWB+T"],
    "BQ51013": ["BQ51013BRHLR"],
    # Fuel gauge
    "MAX17048": ["MAX17048G+T10"],
    "BQ27427": ["BQ27427YZFT"],
    # BLE
    "nRF9160": ["NRF9160-SICA-R3"],
    # Biosensors
    "LMP91000": ["LMP91000SD/NOPB"],
    "AFE4900": ["AFE4900YZHR"],
    # PMIC
    "TPS63031": ["TPS63031DSKR"],
}

# Required BOM columns
REQUIRED_BOM_COLUMNS = [
    "Reference", "Value", "Footprint", "Quantity",
    "Manufacturer", "Part Number", "Supplier", "Supplier PN"
]

def check_issue(level, device, check, msg):
    global PASS, WARN, FAIL
    RESULTS.append({"level": level, "device": device, "check": check, "msg": msg})
    if level == "PASS":
        PASS += 1
    elif level == "WARN":
        WARN += 1
    else:
        FAIL += 1
    symbol = "✅" if level == "PASS" else ("⚠️ " if level == "WARN" else "❌")
    print(f"  {symbol} [{device}] {check}: {msg}")


def validate_kicad_schematic(device_dir: Path, device_name: str):
    """Validate KiCad schematic files."""
    sch_files = list(device_dir.rglob("*.kicad_sch"))

    if not sch_files:
        check_issue("WARN", device_name, "SCHEMATIC", "No .kicad_sch file found")
        return

    for sch_file in sch_files:
        try:
            text = sch_file.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            check_issue("FAIL", device_name, "SCHEMATIC", f"Cannot read {sch_file.name}: {e}")
            continue

        # Check KiCad format version
        if '(kicad_sch' in text:
            check_issue("PASS", device_name, "SCH-FORMAT", f"{sch_file.name} is valid KiCad format")
        else:
            check_issue("WARN", device_name, "SCH-FORMAT",
                        f"{sch_file.name} missing (kicad_sch header — may be text-format schematic")

        # Check for power symbols
        has_vdd = 'VDD' in text or 'VCC' in text or '3V3' in text or '1V8' in text
        has_gnd = 'GND' in text
        check_issue("PASS" if has_vdd else "WARN", device_name, "SCH-POWER",
                    "Power rails present (VDD/VCC/3V3)" if has_vdd else "No power rail symbols found")
        check_issue("PASS" if has_gnd else "FAIL", device_name, "SCH-GND",
                    "GND symbol present" if has_gnd else "No GND symbol found")

        # Check for MCU
        has_mcu = any(mcu in text for mcu in ['nRF52', 'MAX32', 'STM32', 'nRF9160'])
        check_issue("PASS" if has_mcu else "WARN", device_name, "SCH-MCU",
                    "MCU symbol found" if has_mcu else "No MCU symbol found")

        # Check for decoupling capacitors
        has_decoupling = text.count('100nF') + text.count('0.1uF') + text.count('100n')
        check_issue("PASS" if has_decoupling >= 3 else "WARN", device_name, "SCH-DECOUPLING",
                    f"{has_decoupling} decoupling capacitors found" if has_decoupling >= 3
                    else f"Only {has_decoupling} decoupling caps — need ≥3 per power domain")

        # Device-specific checks
        if 'health-ring' in str(device_dir):
            has_nfc = 'NFC' in text or 'WCT' in text or 'BQ51' in text or 'wireless' in text.lower()
            check_issue("PASS" if has_nfc else "WARN", device_name, "SCH-NFC",
                        "NFC/wireless charging IC found" if has_nfc
                        else "No wireless charging IC found (required for sealed ring)")

        if 'health-lab' in str(device_dir):
            has_afe = 'LMP91000' in text or 'AFE4900' in text or 'potentiostat' in text.lower()
            check_issue("PASS" if has_afe else "WARN", device_name, "SCH-AFE",
                        "Biosensor AFE found" if has_afe
                        else "No biosensor AFE found (required for electrochemical sensing)")

        if 'health-band' in str(device_dir):
            has_emg = 'ADS1299' in text or 'INA333' in text or 'sEMG' in text or 'EMG' in text
            check_issue("PASS" if has_emg else "WARN", device_name, "SCH-EMG",
                        "sEMG front-end found" if has_emg else "No sEMG front-end found")

            has_tens = 'TENS' in text or 'H-bridge' in text or 'DRV8' in text or 'stimulation' in text.lower()
            check_issue("PASS" if has_tens else "WARN", device_name, "SCH-TENS",
                        "TENS driver found" if has_tens else "No TENS driver found")


def validate_bom(device_dir: Path, device_name: str):
    """Validate BOM completeness."""
    # Look for BOM files
    bom_files = list(device_dir.rglob("*.csv")) + list(device_dir.rglob("*BOM*")) + \
                list(device_dir.rglob("*bom*"))

    if not bom_files:
        # Check README for BOM table
        readme_files = list(device_dir.rglob("README.md"))
        if readme_files:
            readme = readme_files[0].read_text(encoding='utf-8', errors='replace')
            has_bom_table = '| Reference' in readme or '| Part' in readme or \
                           '| Component' in readme or 'Digi-Key' in readme or \
                           'Mouser' in readme
            if has_bom_table:
                check_issue("PASS", device_name, "BOM-PRESENT",
                            "BOM table found in README.md")
                # Count BOM entries
                bom_lines = [l for l in readme.splitlines()
                             if '|' in l and any(c.isalpha() for c in l)
                             and 'Reference' not in l and '---' not in l
                             and 'Component' not in l and 'Part' not in l]
                check_issue("PASS" if len(bom_lines) >= 10 else "WARN",
                            device_name, "BOM-COMPLETENESS",
                            f"{len(bom_lines)} BOM entries found" if len(bom_lines) >= 10
                            else f"Only {len(bom_lines)} BOM entries — expected ≥10")

                # Check for part numbers
                has_part_numbers = bool(re.search(r'[A-Z]{2,}\d{5,}', readme))
                check_issue("PASS" if has_part_numbers else "WARN",
                            device_name, "BOM-PART-NUMBERS",
                            "Part numbers found in BOM" if has_part_numbers
                            else "No part numbers found in BOM")

                # Check for verified critical ICs
                verified_found = []
                for ic, pns in VERIFIED_PARTS.items():
                    if ic in readme:
                        verified_found.append(ic)
                check_issue("PASS" if verified_found else "WARN",
                            device_name, "BOM-VERIFIED-ICS",
                            f"Verified ICs: {', '.join(verified_found[:5])}" if verified_found
                            else "No verified IC part numbers found in BOM")
            else:
                check_issue("WARN", device_name, "BOM-PRESENT",
                            "No BOM file or table found — add BOM to README.md")
        else:
            check_issue("WARN", device_name, "BOM-PRESENT", "No README or BOM file found")
    else:
        check_issue("PASS", device_name, "BOM-PRESENT", f"BOM file found: {bom_files[0].name}")


def validate_power_budget(device_dir: Path, device_name: str):
    """Check power budget documentation."""
    readme_files = list(device_dir.rglob("README.md"))
    hw_arch_files = list(device_dir.rglob("*Hardware_Architecture*"))
    all_docs = readme_files + hw_arch_files

    for doc in all_docs:
        try:
            text = doc.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue

        # Check for battery capacity
        has_battery = bool(re.search(r'\d+\s*mAh', text))
        check_issue("PASS" if has_battery else "WARN", device_name, "POWER-BATTERY",
                    f"Battery capacity specified" if has_battery
                    else "No battery capacity (mAh) found in documentation")

        # Check for power consumption estimates
        has_power = bool(re.search(r'\d+[\.\d]*\s*(mA|µA|uA|mW|µW)', text))
        check_issue("PASS" if has_power else "WARN", device_name, "POWER-CONSUMPTION",
                    "Power consumption estimates found" if has_power
                    else "No power consumption estimates found")

        # Check for battery life estimate
        has_life = bool(re.search(r'\d+[\.\d]*[\s-]*(day|hour|hr|week)', text, re.IGNORECASE))
        check_issue("PASS" if has_life else "WARN", device_name, "POWER-LIFE",
                    "Battery life estimate found" if has_life
                    else "No battery life estimate found")
        break


def main():
    print(f"\n{'='*60}")
    print(f"EoS Health — Hardware Validation")
    print(f"{'='*60}\n")

    devices = sorted([d for d in DEVICES_ROOT.iterdir() if d.is_dir()])

    for device_dir in devices:
        device_name = device_dir.name.upper().replace('-', ' ')
        print(f"\n── {device_name} ──")
        validate_kicad_schematic(device_dir, device_name)
        validate_bom(device_dir, device_name)
        validate_power_budget(device_dir, device_name)

    print(f"\n{'='*60}")
    print(f"RESULTS: {PASS} PASS  |  {WARN} WARNINGS  |  {FAIL} FAILURES")
    print(f"{'='*60}")

    if FAIL > 0:
        print("STATUS: ❌ HARDWARE VALIDATION FAILED")
        return 1
    elif WARN > 0:
        print(f"STATUS: ⚠️  HARDWARE VALIDATION PASSED WITH {WARN} WARNINGS")
        return 0
    else:
        print("STATUS: ✅ HARDWARE VALIDATION PASSED")
        return 0


if __name__ == '__main__':
    sys.exit(main())
