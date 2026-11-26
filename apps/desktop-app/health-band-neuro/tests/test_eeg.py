"""Tests for healthband_desktop/eeg.py
(run: python3 -m unittest discover -s apps/desktop-app/health-band-neuro/tests)."""

from __future__ import annotations

import math
import os
import sys
import unittest

sys.path.insert(
    0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src")
)

from healthband_desktop.eeg import EEGProcessor


def tone(freq, n=256, rate=EEGProcessor.SAMPLE_RATE):
    """One second of a unit sine at `freq` Hz; at 256 samples every bin is a whole Hz."""
    return [math.sin(2 * math.pi * freq * t / rate) for t in range(n)]


def powers_of(freq):
    eeg = EEGProcessor()
    eeg.add_channel("c", tone(freq))
    return eeg, eeg.get_all_band_powers("c")


class BandEdgeTest(unittest.TestCase):
    # A unit sine puts 0.25 into its positive-frequency bin.
    TONE_POWER = 0.25

    def test_shared_edge_counted_in_one_band(self):
        # 4, 8, 13 and 30 Hz are each the top of one band and the bottom of the next.
        for freq, band in ((4, "theta"), (8, "alpha"), (13, "beta"), (30, "gamma")):
            with self.subTest(freq=freq):
                _, powers = powers_of(freq)
                self.assertEqual(
                    {b: p for b, p in powers.items() if p}, {band: self.TONE_POWER}
                )

    def test_top_edge_of_gamma_still_counted(self):
        _, powers = powers_of(100)
        self.assertEqual(powers["gamma"], self.TONE_POWER)

    def test_inner_bins_unchanged(self):
        for freq, band in ((2, "delta"), (6, "theta"), (10, "alpha"), (20, "beta"), (50, "gamma")):
            with self.subTest(freq=freq):
                _, powers = powers_of(freq)
                self.assertEqual(powers[band], self.TONE_POWER)

    def test_13hz_tone_is_beta_not_relaxed(self):
        eeg, _ = powers_of(13)
        self.assertEqual(eeg.detect_mental_state("c")["state"], "focused")


if __name__ == "__main__":
    unittest.main()
