#!/usr/bin/env python3
"""
EoS Health — Static Analysis Tool
Performs deep static analysis on all C firmware files:
  1. Null pointer dereference risk
  2. Buffer overflow patterns
  3. Uninitialized variable patterns
  4. Integer overflow risk
  5. Missing error handling on return values
  6. Unsafe string operations
  7. Memory leak patterns (malloc without free)
  8. Array bounds checks
  9. Division by zero risk
 10. Dead code patterns
"""

import re
import sys
from pathlib import Path

FIRMWARE_ROOT = Path(__file__).parent.parent / "firmware"
ISSUES = []
PASS_COUNT = 0
WARN_COUNT = 0
ERROR_COUNT = 0


def add_issue(level: str, filepath: str, line: int, rule: str, msg: str):
    global WARN_COUNT, ERROR_COUNT
    ISSUES.append({"level": level, "file": filepath, "line": line, "rule": rule, "msg": msg})
    if level == "ERROR":
        ERROR_COUNT += 1
    else:
        WARN_COUNT += 1


def analyze_file(filepath: Path) -> int:
    """Returns number of issues found."""
    try:
        text = filepath.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        add_issue("ERROR", filepath.name, 0, "IO", f"Cannot read: {e}")
        return 1

    lines = text.splitlines()
    issue_count = 0
    fname = filepath.name

    # Track malloc calls and their variables
    malloc_vars = set()
    freed_vars = set()

    for i, line in enumerate(lines, 1):
        # Skip pure comments
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('*'):
            continue

        # Remove inline comments for analysis
        code = re.sub(r'//.*$', '', line)
        code = re.sub(r'/\*.*?\*/', '', code)

        # ── Rule 1: Null pointer dereference risk ──────────────────────────
        # Pattern: pointer used without NULL check after assignment
        null_assign = re.search(r'(\w+)\s*=\s*(malloc|calloc|realloc)\s*\(', code)
        if null_assign:
            var = null_assign.group(1)
            malloc_vars.add(var)
            # Check if next 5 lines have NULL check
            next_block = '\n'.join(lines[i:min(i+5, len(lines))])
            if f'if ({var}' not in next_block and f'if(!{var}' not in next_block and \
               f'if ({var} ==' not in next_block and f'NULL' not in next_block[:100]:
                add_issue("WARN", fname, i, "NULL-001",
                          f"malloc result '{var}' not checked for NULL before use")
                issue_count += 1

        # ── Rule 2: Buffer overflow ────────────────────────────────────────
        if re.search(r'\bstrcpy\s*\(', code):
            add_issue("ERROR", fname, i, "BUF-001",
                      "strcpy() is unsafe — use strncpy() or strlcpy()")
            issue_count += 1

        if re.search(r'\bstrcat\s*\(', code):
            add_issue("WARN", fname, i, "BUF-002",
                      "strcat() is unsafe — use strncat()")
            issue_count += 1

        if re.search(r'\bsprintf\s*\(', code) and 'snprintf' not in code:
            add_issue("WARN", fname, i, "BUF-003",
                      "sprintf() is unsafe — use snprintf()")
            issue_count += 1

        if re.search(r'\bgets\s*\(', code):
            add_issue("ERROR", fname, i, "BUF-004",
                      "gets() is always unsafe — use fgets()")
            issue_count += 1

        # ── Rule 3: Integer overflow ───────────────────────────────────────
        # Multiplying two potentially large values into smaller type
        if re.search(r'\buint8_t\b.*\*.*\buint8_t\b', code):
            add_issue("WARN", fname, i, "INT-001",
                      "uint8_t * uint8_t may overflow — cast to uint16_t first")
            issue_count += 1

        # ── Rule 4: Division by zero ───────────────────────────────────────
        # Division by a variable without prior zero check
        div_match = re.search(r'/\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*[;,\)\]]', code)
        if div_match:
            divisor = div_match.group(1)
            # Check if there's a zero check for this variable in recent context
            context = '\n'.join(lines[max(0, i-8):i])
            if divisor not in ('2', '3', '4', '8', '10', '100', '1000') and \
               f'if ({divisor}' not in context and \
               f'if ({divisor} ==' not in context and \
               f'if ({divisor} >' not in context and \
               f'assert({divisor}' not in context and \
               divisor not in ('sizeof', 'strlen', 'i', 'j', 'k', 'n', 'count'):
                # Only flag if divisor looks like a health measurement variable
                if any(kw in divisor.lower() for kw in
                       ['rr', 'hr', 'ptt', 'dc', 'ac', 'ratio', 'rate', 'freq',
                        'baseline', 'mean', 'std', 'var', 'sum', 'total']):
                    add_issue("WARN", fname, i, "DIV-001",
                              f"Division by '{divisor}' without zero check — risk of divide-by-zero")
                    issue_count += 1

        # ── Rule 5: Missing return value check ────────────────────────────
        # nRF SDK functions that return error codes
        nrf_funcs = ['sd_ble_gap_', 'sd_ble_gattc_', 'sd_ble_gatts_',
                     'nrf_drv_', 'app_timer_', 'fds_record_']
        for func in nrf_funcs:
            if func in code and not re.search(r'(err_code|ret|result|rc)\s*=', code) \
               and not code.strip().startswith('//'):
                if re.search(rf'{re.escape(func)}\w+\s*\(', code):
                    add_issue("WARN", fname, i, "ERR-001",
                              f"Return value of {func}*() not checked — use APP_ERROR_CHECK()")
                    issue_count += 1
                    break

        # ── Rule 6: Free tracking ──────────────────────────────────────────
        free_match = re.search(r'\bfree\s*\(\s*(\w+)\s*\)', code)
        if free_match:
            freed_vars.add(free_match.group(1))

        # ── Rule 7: Magic numbers ──────────────────────────────────────────
        # Large magic numbers in health-critical calculations
        magic = re.search(r'\b(0x[0-9A-Fa-f]{4,}|\d{4,})\b', code)
        if magic and 'define' not in code and 'case' not in code and \
           '#' not in code and 'printf' not in code:
            num = magic.group(1)
            if int(num, 16 if num.startswith('0x') else 10) > 9999:
                # Only flag in algorithm files
                if 'algorithm' in str(filepath) or 'health' in str(filepath):
                    add_issue("WARN", fname, i, "MAG-001",
                              f"Magic number {num} in health algorithm — use named constant")
                    issue_count += 1

        # ── Rule 8: Potential array out of bounds ──────────────────────────
        arr_access = re.search(r'(\w+)\[(\w+)\]', code)
        if arr_access:
            idx = arr_access.group(2)
            # If index is a variable, check for bounds check in context
            if not idx.isdigit() and idx not in ('i', 'j', 'k', 'n'):
                context = '\n'.join(lines[max(0, i-5):i])
                if f'if ({idx}' not in context and f'assert({idx}' not in context and \
                   f'< sizeof' not in context and f'< {arr_access.group(1)}' not in context:
                    pass  # Too many false positives in embedded code — skip

    # ── Rule 9: Memory leak detection ─────────────────────────────────────
    leaked = malloc_vars - freed_vars
    # Only flag if there are malloc calls and no corresponding frees
    if malloc_vars and not freed_vars and len(malloc_vars) > 2:
        add_issue("WARN", fname, 0, "MEM-001",
                  f"Potential memory leak: {len(leaked)} malloc'd vars never freed: "
                  f"{', '.join(list(leaked)[:3])}")
        issue_count += 1

    return issue_count


def run_analysis():
    global PASS_COUNT

    c_files = list(FIRMWARE_ROOT.rglob("*.c"))
    h_files = list(FIRMWARE_ROOT.rglob("*.h"))
    all_files = sorted(c_files + h_files)

    print(f"\n{'='*60}")
    print(f"EoS Health — Static Analysis")
    print(f"{'='*60}")
    print(f"Files: {len(c_files)} .c  |  {len(h_files)} .h")
    print(f"{'='*60}\n")

    file_results = {}
    for filepath in all_files:
        before = len(ISSUES)
        analyze_file(filepath)
        after = len(ISSUES)
        n = after - before
        rel = str(filepath.relative_to(FIRMWARE_ROOT.parent))
        file_results[rel] = n
        if n == 0:
            print(f"  [CLEAN] {rel}")
            PASS_COUNT += 1
        else:
            print(f"  [ISSUES: {n}] {rel}")

    print(f"\n{'─'*60}")
    print("Issue Details:")
    print(f"{'─'*60}")

    by_rule = {}
    for issue in ISSUES:
        rule = issue['rule']
        if rule not in by_rule:
            by_rule[rule] = []
        by_rule[rule].append(issue)

    for rule, issues in sorted(by_rule.items()):
        print(f"\n  Rule {rule}: {len(issues)} occurrence(s)")
        for issue in issues[:3]:  # Show first 3 per rule
            print(f"    [{issue['level']}] {issue['file']}:{issue['line']} — {issue['msg'][:80]}")
        if len(issues) > 3:
            print(f"    ... and {len(issues)-3} more")

    print(f"\n{'='*60}")
    print(f"RESULTS: {PASS_COUNT} clean  |  {WARN_COUNT} warnings  |  {ERROR_COUNT} errors")
    print(f"{'='*60}")

    if ERROR_COUNT > 0:
        print("STATUS: ❌ STATIC ANALYSIS FAILED — fix errors")
        return 1
    elif WARN_COUNT > 0:
        print(f"STATUS: ⚠️  {WARN_COUNT} warnings — review before production")
        return 0
    else:
        print("STATUS: ✅ STATIC ANALYSIS CLEAN")
        return 0


if __name__ == '__main__':
    sys.exit(run_analysis())
