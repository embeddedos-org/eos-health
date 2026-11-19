"""Tests for healthband_desktop/ecg.py
(run: python3 -m unittest discover -s apps/desktop-app/health-band-neuro/tests)."""

from __future__ import annotations

import os
import sys
import unittest

sys.path.insert(
    0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src")
)

from healthband_desktop.ecg import ECGProcessor


def beats(heights, spacing=250):
    """One R spike of each given height, `spacing` samples apart, on a flat baseline."""
    samples = []
    for h in heights:
        cycle = [0.0] * spacing
        cycle[spacing // 2] = h
        samples.extend(cycle)
    return samples


class DetectRPeaksThresholdTest(unittest.TestCase):
    def setUp(self):
        self.ecg = ECGProcessor()
        # Four tall R waves (1.0) and four small ones (0.5), alternating.
        self.ecg.add_samples(beats([1.0, 0.5] * 4))

    def test_each_threshold_gives_its_own_peaks(self):
        low = self.ecg.detect_r_peaks(threshold=0.3)
        self.assertEqual(len(low), 8)
        high = self.ecg.detect_r_peaks(threshold=0.8)
        self.assertEqual(len(high), 4)
        self.assertEqual(len(self.ecg.detect_r_peaks(threshold=0.3)), 8)

    def test_higher_threshold_after_heart_rate(self):
        # compute_heart_rate() runs detection at the default threshold first.
        self.assertEqual(self.ecg.compute_heart_rate(), 60.0)
        self.assertEqual(len(self.ecg.detect_r_peaks(threshold=0.8)), 4)

    def test_repeat_call_returns_same_peaks(self):
        first = self.ecg.detect_r_peaks()
        self.assertEqual(self.ecg.detect_r_peaks(), first)

    def test_new_samples_invalidate_peaks(self):
        self.assertEqual(len(self.ecg.detect_r_peaks(threshold=0.8)), 4)
        self.ecg.add_samples(beats([1.0]))
        self.assertEqual(len(self.ecg.detect_r_peaks(threshold=0.8)), 5)


if __name__ == "__main__":
    unittest.main()
