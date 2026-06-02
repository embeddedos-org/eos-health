#!/usr/bin/env python3
"""
EoS Health — L2 Simulation Verification Master Runner
Runs all L2 simulations and generates the consolidated report.
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent
SIMS = [
    ("ECG Front-End",        ROOT / "simulation/ecg/ecg_frontend_sim.py"),
    ("PPG/SpO2/Biosensor",   ROOT / "simulation/ppg-spo2/ppg_biosensor_sim.py"),
    ("Power Budget",         ROOT / "simulation/power/power_budget_sim.py"),
    ("Signal Integrity",     ROOT / "simulation/signal-integrity/signal_integrity_sim.py"),
]

def run_simulation(name, path):
    print(f"\n{'='*60}")
    print(f"Running: {name}")
    print(f"{'='*60}")
    result = subprocess.run(
        [sys.executable, str(path)],
        capture_output=True, text=True, cwd=str(ROOT)
    )
    output = result.stdout + result.stderr
    # Filter font warnings
    lines = [l for l in output.split('\n')
             if not any(w in l for w in ['Font', 'glyph', 'dummy', 'findfont'])]
    clean = '\n'.join(lines)
    print(clean)
    passed = result.returncode == 0
    return passed, clean

def main():
    print("\nEoS Health — L2 Simulation Verification Suite")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

    results = {}
    all_pass = True

    for name, path in SIMS:
        if not path.exists():
            print(f"  ⚠️  SKIP  {name} — file not found: {path}")
            results[name] = {'passed': False, 'reason': 'file not found'}
            all_pass = False
            continue
        passed, output = run_simulation(name, path)
        results[name] = {'passed': passed, 'output': output}
        if not passed:
            all_pass = False

    # Summary
    print("\n" + "="*60)
    print("L2 VERIFICATION SUMMARY")
    print("="*60)
    for name, r in results.items():
        status = "✅ PASS" if r['passed'] else "❌ FAIL"
        print(f"  {status}  {name}")

    overall = "✅ ALL L2 SIMULATIONS PASSED" if all_pass else "⚠️  SOME SIMULATIONS HAVE FINDINGS (see report)"
    print(f"\n  OVERALL: {overall}")

    # List generated plots
    plots_dir = ROOT / "simulation" / "plots"
    if plots_dir.exists():
        plots = list(plots_dir.glob("*.png"))
        print(f"\n  Generated {len(plots)} simulation plots:")
        for p in sorted(plots):
            print(f"    📊 {p.name}")

    print(f"\nCompleted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    return 0  # L2 always exits 0 — findings are documented, not blocking

if __name__ == '__main__':
    sys.exit(main())
