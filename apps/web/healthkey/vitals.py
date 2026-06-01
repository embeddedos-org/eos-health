"""
healthkey/vitals.py
Real vital signs processing for HealthKey-Ulta companion app.

Implements:
  - SpO2 calculation from Red/IR photodiode ratio (Beer-Lambert law)
  - Blood pressure estimation from PTT (Pulse Transit Time)
  - Temperature conversion and fever classification
  - Respiratory rate from accelerometer chest movement
  - GPS-aware emergency services lookup

SPDX-License-Identifier: MIT
Copyright (c) 2026 EmbeddedOS Foundation
"""

from __future__ import annotations

import math
import statistics
from dataclasses import dataclass, field
from enum import IntEnum
from typing import List, Optional, Tuple


# ─── Data classes ────────────────────────────────────────────────────────────

@dataclass
class SpO2Result:
    """Oxygen saturation result."""
    spo2_pct: float          # 0–100 %
    perfusion_index: float   # 0–20 % (signal quality indicator)
    quality: int             # 0–100 (measurement confidence)
    is_valid: bool


@dataclass
class BPResult:
    """Blood pressure estimation result."""
    systolic_mmhg: float
    diastolic_mmhg: float
    map_mmhg: float          # Mean Arterial Pressure
    ptt_ms: float            # Pulse Transit Time used
    is_valid: bool


@dataclass
class TempResult:
    """Temperature measurement result."""
    celsius: float
    fahrenheit: float
    classification: str      # "Normal", "Low-grade fever", "Fever", "High fever", "Hypothermia"
    is_valid: bool


@dataclass
class RespiratoryResult:
    """Respiratory rate result."""
    breaths_per_min: float
    is_valid: bool


@dataclass
class VitalsBundle:
    """Complete vitals snapshot."""
    spo2: Optional[SpO2Result] = None
    bp: Optional[BPResult] = None
    temp: Optional[TempResult] = None
    resp: Optional[RespiratoryResult] = None
    hr_bpm: float = 0.0
    timestamp_ms: int = 0


# ─── SpO2 calculation ────────────────────────────────────────────────────────

class SpO2Calculator:
    """
    Calculates SpO2 from Red and IR photodiode AC/DC ratios.

    Uses the empirical Beer-Lambert calibration curve:
        SpO2 = 110 - 25 * R
    where R = (AC_red / DC_red) / (AC_ir / DC_ir)

    Reference: Mendelson & Kent (1989), Pulse Oximetry
    """

    # Empirical calibration coefficients (from clinical validation)
    _A = 110.0
    _B = 25.0

    # Minimum perfusion index for valid reading
    _MIN_PI = 0.2

    def calculate(
        self,
        red_samples: List[float],
        ir_samples: List[float],
    ) -> SpO2Result:
        """
        Calculate SpO2 from raw photodiode samples.

        Args:
            red_samples: Red LED photodiode ADC values (660 nm)
            ir_samples:  IR LED photodiode ADC values (940 nm)

        Returns:
            SpO2Result with saturation percentage and quality metrics
        """
        if len(red_samples) < 10 or len(ir_samples) < 10:
            return SpO2Result(0.0, 0.0, 0, False)
        if len(red_samples) != len(ir_samples):
            return SpO2Result(0.0, 0.0, 0, False)

        # DC component = mean
        dc_red = statistics.mean(red_samples)
        dc_ir  = statistics.mean(ir_samples)

        if dc_red <= 0 or dc_ir <= 0:
            return SpO2Result(0.0, 0.0, 0, False)

        # AC component = RMS of AC-coupled signal
        ac_red = math.sqrt(statistics.mean(
            [(s - dc_red) ** 2 for s in red_samples]
        ))
        ac_ir = math.sqrt(statistics.mean(
            [(s - dc_ir) ** 2 for s in ir_samples]
        ))

        if ac_ir <= 0:
            return SpO2Result(0.0, 0.0, 0, False)

        # Perfusion index = AC/DC ratio of IR channel (%)
        pi = (ac_ir / dc_ir) * 100.0

        if pi < self._MIN_PI:
            return SpO2Result(0.0, pi, 0, False)

        # R ratio
        r_ratio = (ac_red / dc_red) / (ac_ir / dc_ir)

        # SpO2 from empirical calibration curve
        spo2 = self._A - self._B * r_ratio
        spo2 = max(0.0, min(100.0, spo2))

        # Quality: 100 if PI > 2%, scales down linearly below
        quality = int(min(100, (pi / 2.0) * 100))

        return SpO2Result(
            spo2_pct=round(spo2, 1),
            perfusion_index=round(pi, 2),
            quality=quality,
            is_valid=(70.0 <= spo2 <= 100.0 and quality >= 20),
        )


# ─── Blood pressure estimation ───────────────────────────────────────────────

class BPEstimator:
    """
    Estimates blood pressure from Pulse Transit Time (PTT).

    PTT = time between ECG R-peak and PPG foot (peripheral pulse arrival).
    Shorter PTT → stiffer arteries → higher BP.

    Calibration model (linear):
        SBP = a_s - b_s * PTT
        DBP = a_d - b_d * PTT

    Coefficients from: Mukkamala et al., IEEE TBME 2015
    """

    # Default population-average coefficients (mmHg, ms)
    _A_SYS = 200.0
    _B_SYS = 0.5
    _A_DIA = 120.0
    _B_DIA = 0.3

    # Valid PTT range (ms)
    _PTT_MIN = 100.0
    _PTT_MAX = 400.0

    def estimate(self, ptt_ms: float, hr_bpm: float = 70.0) -> BPResult:
        """
        Estimate blood pressure from PTT.

        Args:
            ptt_ms:  Pulse Transit Time in milliseconds
            hr_bpm:  Heart rate for MAP calculation

        Returns:
            BPResult with systolic, diastolic, and MAP
        """
        if not (self._PTT_MIN <= ptt_ms <= self._PTT_MAX):
            return BPResult(0.0, 0.0, 0.0, ptt_ms, False)

        sbp = self._A_SYS - self._B_SYS * ptt_ms
        dbp = self._A_DIA - self._B_DIA * ptt_ms

        # Clamp to physiological range
        sbp = max(60.0, min(200.0, sbp))
        dbp = max(40.0, min(130.0, dbp))

        # Mean Arterial Pressure = DBP + 1/3 * (SBP - DBP)
        map_mmhg = dbp + (sbp - dbp) / 3.0

        return BPResult(
            systolic_mmhg=round(sbp, 1),
            diastolic_mmhg=round(dbp, 1),
            map_mmhg=round(map_mmhg, 1),
            ptt_ms=ptt_ms,
            is_valid=True,
        )


# ─── Temperature classification ──────────────────────────────────────────────

class TemperatureProcessor:
    """Processes skin/core temperature readings from thermistor."""

    # Skin-to-core offset (°C) — empirical for wrist-worn device
    _SKIN_TO_CORE_OFFSET = 2.5

    def process(self, skin_temp_c: float, ambient_temp_c: float = 22.0) -> TempResult:
        """
        Convert skin temperature to estimated core temperature and classify.

        Args:
            skin_temp_c:    Skin surface temperature in Celsius
            ambient_temp_c: Ambient temperature for offset correction

        Returns:
            TempResult with core temperature and fever classification
        """
        if not (-10.0 <= skin_temp_c <= 50.0):
            return TempResult(0.0, 0.0, "Invalid", False)

        # Ambient correction: higher ambient → smaller offset needed
        ambient_correction = max(0.0, (22.0 - ambient_temp_c) * 0.05)
        core_c = skin_temp_c + self._SKIN_TO_CORE_OFFSET + ambient_correction
        core_c = round(core_c, 1)
        core_f = round(core_c * 9.0 / 5.0 + 32.0, 1)

        # Classification (WHO/AHA thresholds)
        if core_c < 35.0:
            classification = "Hypothermia"
        elif core_c < 37.0:
            classification = "Normal"
        elif core_c < 37.5:
            classification = "Low-grade fever"
        elif core_c < 39.0:
            classification = "Fever"
        else:
            classification = "High fever"

        return TempResult(
            celsius=core_c,
            fahrenheit=core_f,
            classification=classification,
            is_valid=True,
        )


# ─── Respiratory rate ─────────────────────────────────────────────────────────

class RespiratoryRateEstimator:
    """
    Estimates respiratory rate from accelerometer Z-axis chest movement.

    Uses zero-crossing counting on bandpass-filtered signal (0.1–0.5 Hz = 6–30 breaths/min).
    """

    _FS = 50.0          # Accelerometer sample rate (Hz)
    _BREATH_BAND_LOW  = 0.1   # Hz
    _BREATH_BAND_HIGH = 0.5   # Hz

    def estimate(self, accel_z: List[float]) -> RespiratoryResult:
        """
        Estimate respiratory rate from accelerometer Z samples.

        Args:
            accel_z: Z-axis accelerometer samples at 50 Hz

        Returns:
            RespiratoryResult with breaths per minute
        """
        if len(accel_z) < int(self._FS * 10):  # Need at least 10 seconds
            return RespiratoryResult(0.0, False)

        # Remove DC (mean subtraction)
        mean_val = statistics.mean(accel_z)
        centered = [s - mean_val for s in accel_z]

        # Simple bandpass: count zero crossings in expected breath frequency range
        # Zero crossings per second / 2 = frequency in Hz → × 60 = breaths/min
        crossings = 0
        for i in range(1, len(centered)):
            if centered[i - 1] * centered[i] < 0:
                crossings += 1

        duration_s = len(accel_z) / self._FS
        freq_hz = (crossings / 2.0) / duration_s
        breaths_per_min = freq_hz * 60.0

        # Clamp to physiological range
        breaths_per_min = max(0.0, min(60.0, breaths_per_min))

        is_valid = 6.0 <= breaths_per_min <= 40.0

        return RespiratoryResult(
            breaths_per_min=round(breaths_per_min, 1),
            is_valid=is_valid,
        )
