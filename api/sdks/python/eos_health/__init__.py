"""
EoS Health Python SDK
=====================
Official Python client for the EoS Health Developer API.

Install:
    pip install eos-health

Quick start:
    from eos_health import EosHealthClient

    client = EosHealthClient(access_token="your_token")
    hr = client.heart_rate.get(start_date="2026-06-01", end_date="2026-06-07")
    for reading in hr.data:
        print(f"{reading.timestamp}: {reading.bpm} bpm")
"""

from .client import EosHealthClient
from .models import (
    HeartRateReading, HRVReading, SpO2Reading, ECGRecording,
    BloodPressureReading, HbA1cReading, GlucoseReading,
    BiomarkerReading, SleepSession, ActivityDay, RecoveryDay,
    Device, User, Webhook,
)
from .exceptions import (
    EosHealthError, AuthenticationError, RateLimitError,
    DeviceNotFoundError, InsufficientScopeError,
)

__version__ = "1.0.0"
__all__ = [
    "EosHealthClient",
    "HeartRateReading", "HRVReading", "SpO2Reading", "ECGRecording",
    "BloodPressureReading", "HbA1cReading", "GlucoseReading",
    "BiomarkerReading", "SleepSession", "ActivityDay", "RecoveryDay",
    "Device", "User", "Webhook",
    "EosHealthError", "AuthenticationError", "RateLimitError",
    "DeviceNotFoundError", "InsufficientScopeError",
]
