"""Tests for run_l3_verification.py
(run: python3 -m unittest discover -s prototype/test-runner)."""

from __future__ import annotations

import contextlib
import io
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import run_l3_verification as l3  # noqa: E402

BLE_OK = (True, [{"passed": True}])
REL_OK = (True, {"simulated_passed": 1, "hardware_required": 0, "note": ""})


class SuiteChoiceTest(unittest.TestCase):
    """--suite selection. Reports go to a temp tree; no suite script or HIL check really runs."""

    def run_main(self, suite):
        with tempfile.TemporaryDirectory() as tmp:
            fake_file = Path(tmp) / "prototype" / "test-runner" / "run_l3_verification.py"
            cwd = os.getcwd()
            os.chdir(tmp)
            try:
                with mock.patch.object(l3, "__file__", str(fake_file)), \
                     mock.patch.object(l3, "run_hil_ble_test", return_value=BLE_OK) as ble, \
                     mock.patch.object(l3, "run_hil_reliability_checklist",
                                       return_value=REL_OK) as rel, \
                     mock.patch.object(l3, "generate_l3_report", return_value="report\n"), \
                     mock.patch.object(l3.subprocess, "run") as run, \
                     mock.patch.object(sys, "argv", ["run_l3_verification.py", "--suite", suite]), \
                     contextlib.redirect_stdout(io.StringIO()), \
                     contextlib.redirect_stderr(io.StringIO()):
                    code = l3.main()
            finally:
                os.chdir(cwd)
        return code, ble, rel, run

    def test_ble_suite_accepted(self):
        code, ble, rel, run = self.run_main("ble")
        self.assertEqual(code, 0)
        ble.assert_called_once()
        rel.assert_not_called()
        run.assert_not_called()

    def test_reliability_suite_accepted(self):
        code, ble, rel, run = self.run_main("reliability")
        self.assertEqual(code, 0)
        rel.assert_called_once()
        ble.assert_not_called()
        run.assert_not_called()

    def test_script_suite_runs_only_itself(self):
        # The script is not found in the temp tree, so the suite fails; only
        # which checks were selected matters here.
        code, ble, rel, _ = self.run_main("firmware")
        self.assertEqual(code, 1)
        ble.assert_not_called()
        rel.assert_not_called()

    def test_unknown_suite_rejected(self):
        with self.assertRaises(SystemExit) as cm:
            self.run_main("nope")
        self.assertEqual(cm.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
