"""Tests for validate_hardware.py (run: python3 -m unittest verification/test_validate_hardware.py)."""

from __future__ import annotations

import contextlib
import io
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import validate_hardware as vh  # noqa: E402


def decoupling_result(schematic_body):
    """Validate a one-file schematic; return the SCH-DECOUPLING result."""
    before = len(vh.RESULTS)
    with tempfile.TemporaryDirectory() as tmp:
        # A neutral directory name, so no device-specific check runs.
        dev = Path(tmp) / "dev"
        dev.mkdir()
        (dev / "board.kicad_sch").write_text(
            f"(kicad_sch GND VDD nRF52 {schematic_body})", encoding="utf-8"
        )
        with contextlib.redirect_stdout(io.StringIO()):
            vh.validate_kicad_schematic(dev, "DEV")
    (result,) = [r for r in vh.RESULTS[before:] if r["check"] == "SCH-DECOUPLING"]
    return result


class DecouplingCountTest(unittest.TestCase):
    def test_each_100nF_counted_once(self):
        result = decoupling_result('(value "100nF") (value "100nF")')
        self.assertEqual(result["level"], "WARN")
        self.assertIn("Only 2 decoupling caps", result["msg"])

    def test_three_caps_pass(self):
        result = decoupling_result('(value "100nF") (value "100n") (value "0.1uF")')
        self.assertEqual(result["level"], "PASS")
        self.assertIn("3 decoupling capacitors", result["msg"])

    def test_wavelength_and_inductor_not_counted(self):
        result = decoupling_result('"Broadband 400-1100nm" (value "100nH") (value "100nF")')
        self.assertIn("Only 1 decoupling caps", result["msg"])


if __name__ == "__main__":
    unittest.main()
