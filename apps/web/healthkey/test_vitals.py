"""Tests for healthkey/vitals.py (run: python3 -m unittest apps/web/healthkey/test_vitals.py)."""

from __future__ import annotations

import math
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vitals import RespiratoryRateEstimator  # noqa: E402

FS = 50.0


def breathing(rate_bpm: float, seconds: float, *, offset: float, amplitude: float,
              integer: bool, phase: float = 0.0) -> list:
    """Z-axis chest movement: a sine at the breathing rate around a resting offset."""
    f = rate_bpm / 60.0
    samples = []
    for i in range(int(FS * seconds)):
        v = offset + amplitude * math.sin(2 * math.pi * f * i / FS + phase)
        samples.append(float(round(v)) if integer else v)
    return samples


class RespiratoryRateTest(unittest.TestCase):
    def setUp(self):
        self.est = RespiratoryRateEstimator()

    def test_float_signal(self):
        res = self.est.estimate(breathing(15, 20, offset=0.0, amplitude=0.05,
                                          integer=False, phase=0.3))
        self.assertTrue(res.is_valid)
        self.assertAlmostEqual(res.breaths_per_min, 15.0, delta=1.5)

    def test_integer_counts_crossing_through_the_mean(self):
        # Raw accelerometer counts are integers; when the mean is itself a
        # count, the signal passes through the mean on an exact sample.
        res = self.est.estimate(breathing(15, 20, offset=1000.0, amplitude=100.0,
                                          integer=True))
        self.assertTrue(res.is_valid, res)
        self.assertAlmostEqual(res.breaths_per_min, 15.0, delta=1.5)

    def test_flat_sample_at_the_mean_counts_once(self):
        # Mean exactly 0. -1, 0, 0, 1 is one crossing, not zero and not two.
        one_cycle = [-1.0] * 24 + [0.0, 0.0] + [1.0] * 48 + [0.0] + [-1.0] * 24
        signal = one_cycle * 8          # 8 cycles of 99 samples, about 30/min
        res = self.est.estimate(signal)
        self.assertTrue(res.is_valid, res)
        self.assertAlmostEqual(res.breaths_per_min, 30.0, delta=4.0)

    def test_still_signal_is_invalid(self):
        res = self.est.estimate([512.0] * 600)
        self.assertFalse(res.is_valid)
        self.assertEqual(res.breaths_per_min, 0.0)

    def test_too_short_is_invalid(self):
        self.assertFalse(self.est.estimate([0.0, 1.0] * 100).is_valid)


if __name__ == "__main__":
    unittest.main()
