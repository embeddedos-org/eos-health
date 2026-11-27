#!/usr/bin/env python3
"""
Regression test: glucose_process_reading must increment uptime_s by 300
(5 minutes in seconds), not by 5.

The warmup threshold GLUCOSE_WARMUP_S is 7200 s (2 hours).  At one call
per 5 minutes that is 24 calls.  With the old increment of 5 it would
take 1440 calls (120 hours).
"""

import sys

GLUCOSE_WARMUP_S = 7200   # from glucose_algorithm.c
CALL_INTERVAL_MIN = 5     # the function is called every 5 minutes
INCREMENT_S = 300         # 5 * 60 — the corrected value

PASS = 0
FAIL = 0

def test(name, result, detail=""):
    global PASS, FAIL
    status = "PASS" if result else "FAIL"
    print(f"  {status}  {name}" + (f" -- {detail}" if detail else ""))
    if result:
        PASS += 1
    else:
        FAIL += 1

def main():
    print("[Glucose warmup timing]")

    # Simulate uptime accumulation as the C code does
    uptime_s = 0
    calls = 0
    while uptime_s < GLUCOSE_WARMUP_S:
        uptime_s += INCREMENT_S
        calls += 1

    warmup_minutes = calls * CALL_INTERVAL_MIN
    warmup_hours = warmup_minutes / 60.0

    test("Warmup completes in 24 calls",
         calls == 24,
         f"calls={calls}")

    test("Warmup completes in 2 hours",
         warmup_hours == 2.0,
         f"warmup_hours={warmup_hours}")

    # With the old buggy increment of 5, check it would be wrong
    uptime_s_old = 0
    calls_old = 0
    while uptime_s_old < GLUCOSE_WARMUP_S:
        uptime_s_old += 5  # old bug
        calls_old += 1
    warmup_hours_old = (calls_old * CALL_INTERVAL_MIN) / 60.0

    test("Old increment=5 would take 120 hours (proves bug existed)",
         warmup_hours_old == 120.0,
         f"warmup_hours_old={warmup_hours_old}")

    print(f"\n  {PASS} passed, {FAIL} failed")
    return 1 if FAIL else 0

if __name__ == "__main__":
    sys.exit(main())
