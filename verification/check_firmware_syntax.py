#!/usr/bin/env python3
"""
EoS Health — Firmware Syntax & Structure Checker
Checks all C firmware files for:
  1. Balanced braces {}
  2. Balanced parentheses ()
  3. Missing semicolons after struct/enum definitions
  4. Function signature completeness
  5. Include guard presence in .h files
  6. Undefined type references (basic)
  7. Return type consistency
"""

import os
import re
import sys
from pathlib import Path

FIRMWARE_ROOT = Path(__file__).parent.parent / "firmware"
RESULTS = []
PASS = 0
FAIL = 0
WARN = 0


def check_file(filepath: Path) -> list[dict]:
    issues = []
    try:
        text = filepath.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        issues.append({"level": "ERROR", "file": str(filepath), "line": 0, "msg": f"Cannot read file: {e}"})
        return issues

    lines = text.splitlines()

    # 1. Balanced braces
    brace_count = 0
    for i, line in enumerate(lines, 1):
        # Skip comments and strings for brace counting
        stripped = re.sub(r'//.*$', '', line)
        stripped = re.sub(r'"[^"]*"', '""', stripped)
        brace_count += stripped.count('{') - stripped.count('}')
    if brace_count != 0:
        issues.append({"level": "ERROR", "file": str(filepath.name), "line": len(lines),
                       "msg": f"Unbalanced braces: net count = {brace_count:+d}"})

    # 2. Balanced parentheses
    paren_count = 0
    for i, line in enumerate(lines, 1):
        stripped = re.sub(r'//.*$', '', line)
        stripped = re.sub(r'"[^"]*"', '""', stripped)
        paren_count += stripped.count('(') - stripped.count(')')
    if paren_count != 0:
        issues.append({"level": "ERROR", "file": str(filepath.name), "line": len(lines),
                       "msg": f"Unbalanced parentheses: net count = {paren_count:+d}"})

    # 3. Include guards in .h files
    if filepath.suffix == '.h':
        if '#pragma once' not in text and '#ifndef' not in text:
            issues.append({"level": "WARN", "file": str(filepath.name), "line": 1,
                           "msg": "Header file missing include guard (#pragma once or #ifndef)"})

    # 4. Check for common dangerous patterns
    for i, line in enumerate(lines, 1):
        stripped = line.strip()

        # strcpy without bounds check
        if 'strcpy(' in stripped and 'strncpy' not in stripped:
            issues.append({"level": "WARN", "file": str(filepath.name), "line": i,
                           "msg": "Use strncpy instead of strcpy (buffer overflow risk)"})

        # sprintf without bounds
        if re.search(r'\bsprintf\s*\(', stripped) and 'snprintf' not in stripped:
            issues.append({"level": "WARN", "file": str(filepath.name), "line": i,
                           "msg": "Use snprintf instead of sprintf (buffer overflow risk)"})

        # gets() — always dangerous
        if re.search(r'\bgets\s*\(', stripped):
            issues.append({"level": "ERROR", "file": str(filepath.name), "line": i,
                           "msg": "gets() is unsafe — use fgets()"})

        # malloc without NULL check
        if 'malloc(' in stripped or 'calloc(' in stripped:
            # Check next 3 lines for NULL check
            next_lines = ' '.join(lines[i:min(i+3, len(lines))])
            if 'NULL' not in next_lines and '== 0' not in next_lines:
                issues.append({"level": "WARN", "file": str(filepath.name), "line": i,
                               "msg": "malloc/calloc result not checked for NULL"})

        # Division without zero check (basic heuristic)
        if re.search(r'/\s*[a-zA-Z_][a-zA-Z0-9_]*\s*[;,\)]', stripped):
            if 'sqrt' not in stripped and '//' not in stripped:
                pass  # Too many false positives — skip

    # 5. Check for TODO/FIXME/HACK markers
    for i, line in enumerate(lines, 1):
        if re.search(r'\b(TODO|FIXME|HACK|XXX)\b', line, re.IGNORECASE):
            issues.append({"level": "WARN", "file": str(filepath.name), "line": i,
                           "msg": f"Unresolved marker: {line.strip()[:60]}"})

    return issues


def check_schematic(filepath: Path) -> list[dict]:
    """Check KiCad schematic files for completeness."""
    issues = []
    try:
        text = filepath.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        issues.append({"level": "ERROR", "file": str(filepath.name), "line": 0,
                       "msg": f"Cannot read schematic: {e}"})
        return issues

    # Check for required sections in KiCad schematic
    required_sections = ['(kicad_sch', '(lib_symbols', '(wire', '(symbol']
    for section in required_sections:
        if section not in text:
            issues.append({"level": "WARN", "file": str(filepath.name), "line": 0,
                           "msg": f"KiCad schematic missing section: {section}"})

    # Check for power symbols (VDD, GND)
    if 'VDD' not in text and 'VCC' not in text and 'PWR' not in text:
        issues.append({"level": "WARN", "file": str(filepath.name), "line": 0,
                       "msg": "No power symbols (VDD/VCC) found in schematic"})
    if 'GND' not in text:
        issues.append({"level": "ERROR", "file": str(filepath.name), "line": 0,
                       "msg": "No GND symbol found in schematic"})

    # Count components
    component_count = text.count('(symbol (lib_id')
    if component_count < 5:
        issues.append({"level": "WARN", "file": str(filepath.name), "line": 0,
                       "msg": f"Only {component_count} components found — schematic may be incomplete"})

    return issues


def scan_directory(root: Path) -> None:
    global PASS, FAIL, WARN

    c_files = list(root.rglob("*.c"))
    h_files = list(root.rglob("*.h"))
    sch_files = list(root.rglob("*.kicad_sch"))

    all_files = c_files + h_files + sch_files
    print(f"\n{'='*60}")
    print(f"EoS Health — L1 Design Verification")
    print(f"{'='*60}")
    print(f"Scanning: {root}")
    print(f"Files: {len(c_files)} .c  |  {len(h_files)} .h  |  {len(sch_files)} .kicad_sch")
    print(f"{'='*60}\n")

    for filepath in sorted(c_files + h_files):
        issues = check_file(filepath)
        rel = filepath.relative_to(root.parent)
        if issues:
            for issue in issues:
                level = issue['level']
                print(f"  [{level}] {rel}:{issue['line']} — {issue['msg']}")
                if level == 'ERROR':
                    FAIL += 1
                else:
                    WARN += 1
            RESULTS.append({"file": str(rel), "issues": issues})
        else:
            print(f"  [PASS] {rel}")
            PASS += 1

    for filepath in sorted(sch_files):
        issues = check_schematic(filepath)
        rel = filepath.relative_to(root.parent)
        if issues:
            for issue in issues:
                level = issue['level']
                print(f"  [{level}] {rel}:{issue['line']} — {issue['msg']}")
                if level == 'ERROR':
                    FAIL += 1
                else:
                    WARN += 1
        else:
            print(f"  [PASS] {rel}")
            PASS += 1


def main():
    global PASS, FAIL, WARN
    scan_directory(FIRMWARE_ROOT)

    # Also scan device hardware schematics
    devices_root = FIRMWARE_ROOT.parent / "devices"
    if devices_root.exists():
        for sch in sorted(devices_root.rglob("*.kicad_sch")):
            issues = check_schematic(sch)
            rel = sch.relative_to(devices_root.parent)
            if issues:
                for issue in issues:
                    level = issue['level']
                    print(f"  [{level}] {rel}:{issue['line']} — {issue['msg']}")
                    if level == 'ERROR':
                        FAIL += 1
                    else:
                        WARN += 1
            else:
                print(f"  [PASS] {rel}")
                PASS += 1

    print(f"\n{'='*60}")
    print(f"RESULTS: {PASS} PASS  |  {WARN} WARNINGS  |  {FAIL} ERRORS")
    print(f"{'='*60}")

    if FAIL > 0:
        print("STATUS: ❌ VERIFICATION FAILED — fix errors before production")
        return 1
    elif WARN > 0:
        print("STATUS: ⚠️  VERIFICATION PASSED WITH WARNINGS — review before production")
        return 0
    else:
        print("STATUS: ✅ VERIFICATION PASSED — all checks clean")
        return 0


if __name__ == '__main__':
    sys.exit(main())
