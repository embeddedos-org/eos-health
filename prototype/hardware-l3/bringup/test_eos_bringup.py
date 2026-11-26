"""Tests for eos_bringup.py
(run: python3 -m unittest discover -s prototype/hardware-l3/bringup)."""

from __future__ import annotations

import contextlib
import io
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import eos_bringup  # noqa: E402


def final_qc(*steps):
    """Run step_final_qc after the given (name, passed) steps; return the result."""
    result = eos_bringup.BringUpResult("health-ring", 1)
    result.serial_number = "EOS-RNG-TEST-0001"
    with contextlib.redirect_stdout(io.StringIO()):
        for name, passed in steps:
            result.add_step(name, passed)
        eos_bringup.step_final_qc(result)
    return result


class FinalQcTest(unittest.TestCase):
    def test_failed_step_fails_final_qc(self):
        result = final_qc(("J-Link SWD Connect", False), ("Flash Firmware", True))
        last = result.steps[-1]
        self.assertEqual(last["name"], "All Steps Passed")
        self.assertFalse(last["passed"])
        self.assertNotIn("ready for shipment", last["detail"])
        self.assertFalse(result.passed)

    def test_all_steps_passed(self):
        result = final_qc(("J-Link SWD Connect", True), ("Flash Firmware", True))
        last = result.steps[-1]
        self.assertTrue(last["passed"])
        self.assertIn("ready for shipment", last["detail"])
        self.assertTrue(result.passed)

    def test_saved_log_agrees_with_result(self):
        result = final_qc(("Power-On Check", False))
        data = result.to_dict()
        self.assertFalse(data["passed"])
        self.assertTrue(all(s["passed"] is False for s in data["steps"]))


if __name__ == "__main__":
    unittest.main()
