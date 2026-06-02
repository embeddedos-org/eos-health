"""EoS Health Python SDK — Main Client"""

import time
from datetime import date, datetime
from typing import Optional, List
from urllib.parse import urlencode
import json

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

from .exceptions import (
    EosHealthError, AuthenticationError, RateLimitError,
    DeviceNotFoundError, InsufficientScopeError,
)

BASE_URL = "https://api.eoshealth.io/v1"
SANDBOX_URL = "https://sandbox.api.eoshealth.io/v1"


class HeartRateResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None, device_id=None,
            resolution="1min", limit=100):
        params = _date_params(start_date, end_date)
        if device_id: params["device_id"] = device_id
        params["resolution"] = resolution
        params["limit"] = limit
        return self._c._get("/heart-rate", params)

    def summary(self, start_date=None, end_date=None):
        return self._c._get("/heart-rate/summary", _date_params(start_date, end_date))


class HRVResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None, device_id=None):
        params = _date_params(start_date, end_date)
        if device_id: params["device_id"] = device_id
        return self._c._get("/hrv", params)


class SpO2Resource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None, device_id=None):
        params = _date_params(start_date, end_date)
        if device_id: params["device_id"] = device_id
        return self._c._get("/spo2", params)


class ECGResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None, device_id=None,
            include_waveform=False):
        params = _date_params(start_date, end_date)
        if device_id: params["device_id"] = device_id
        params["include_waveform"] = str(include_waveform).lower()
        return self._c._get("/ecg", params)

    def waveform(self, recording_id: str, fmt="json"):
        return self._c._get(f"/ecg/{recording_id}/waveform", {"format": fmt})


class BloodPressureResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None):
        return self._c._get("/blood-pressure", _date_params(start_date, end_date))


class HbA1cResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None):
        return self._c._get("/hba1c", _date_params(start_date, end_date))


class GlucoseResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None, include_alerts=True):
        params = _date_params(start_date, end_date)
        params["include_alerts"] = str(include_alerts).lower()
        return self._c._get("/glucose", params)


class BiomarkersResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None, analytes=None):
        params = _date_params(start_date, end_date)
        if analytes:
            params["analytes"] = ",".join(analytes)
        return self._c._get("/biomarkers", params)


class SleepResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None):
        return self._c._get("/sleep", _date_params(start_date, end_date))


class ActivityResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None):
        return self._c._get("/activity", _date_params(start_date, end_date))

    def workouts(self, start_date=None, end_date=None, include_semg=False):
        params = _date_params(start_date, end_date)
        params["include_semg"] = str(include_semg).lower()
        return self._c._get("/activity/workouts", params)


class RecoveryResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None):
        return self._c._get("/recovery", _date_params(start_date, end_date))


class StressResource:
    def __init__(self, client): self._c = client

    def get(self, start_date=None, end_date=None):
        return self._c._get("/stress", _date_params(start_date, end_date))


class DevicesResource:
    def __init__(self, client): self._c = client

    def list(self):
        return self._c._get("/devices", {})

    def get(self, device_id: str):
        return self._c._get(f"/devices/{device_id}", {})

    def battery(self, device_id: str):
        return self._c._get(f"/devices/{device_id}/battery", {})


class WebhooksResource:
    def __init__(self, client): self._c = client

    def list(self):
        return self._c._get("/webhooks", {})

    def create(self, url: str, events: List[str]):
        return self._c._post("/webhooks", {"url": url, "events": events})

    def delete(self, webhook_id: str):
        return self._c._delete(f"/webhooks/{webhook_id}")


# ─── Main client ──────────────────────────────────────────────────────────────
class EosHealthClient:
    """
    EoS Health API Client.

    Args:
        access_token: OAuth 2.0 Bearer token
        sandbox: Use sandbox environment (default: False)
        timeout: Request timeout in seconds (default: 30)

    Example:
        client = EosHealthClient(access_token="eos_at_abc123")
        recovery = client.recovery.get(start_date="2026-06-01")
        print(f"Today's recovery score: {recovery['days'][0]['score']}")
    """

    def __init__(self, access_token: str, sandbox: bool = False, timeout: int = 30):
        self.access_token = access_token
        self.base_url = SANDBOX_URL if sandbox else BASE_URL
        self.timeout = timeout
        self._rate_limit_remaining = None
        self._rate_limit_reset = None

        # Resource namespaces
        self.heart_rate    = HeartRateResource(self)
        self.hrv           = HRVResource(self)
        self.spo2          = SpO2Resource(self)
        self.ecg           = ECGResource(self)
        self.blood_pressure = BloodPressureResource(self)
        self.hba1c         = HbA1cResource(self)
        self.glucose       = GlucoseResource(self)
        self.biomarkers    = BiomarkersResource(self)
        self.sleep         = SleepResource(self)
        self.activity      = ActivityResource(self)
        self.recovery      = RecoveryResource(self)
        self.stress        = StressResource(self)
        self.devices       = DevicesResource(self)
        self.webhooks      = WebhooksResource(self)

    @property
    def user(self):
        return self._get("/user", {})

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "User-Agent": f"eos-health-python/1.0.0",
            "Accept": "application/json",
        }

    def _handle_response(self, response):
        # Track rate limits
        self._rate_limit_remaining = response.headers.get("X-RateLimit-Remaining")
        self._rate_limit_reset = response.headers.get("X-RateLimit-Reset")

        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        elif response.status_code == 204:
            return None
        elif response.status_code == 401:
            raise AuthenticationError("Invalid or expired access token")
        elif response.status_code == 403:
            raise InsufficientScopeError("Insufficient OAuth scope for this endpoint")
        elif response.status_code == 404:
            raise DeviceNotFoundError("Device not found")
        elif response.status_code == 429:
            reset = self._rate_limit_reset
            raise RateLimitError(f"Rate limit exceeded. Resets at: {reset}")
        else:
            try:
                err = response.json()
                raise EosHealthError(f"API error {response.status_code}: {err.get('message', '')}")
            except Exception:
                raise EosHealthError(f"API error {response.status_code}")

    def _get(self, path: str, params: dict):
        if not HAS_REQUESTS:
            raise ImportError("requests package required: pip install requests")
        url = self.base_url + path
        resp = requests.get(url, headers=self._headers(), params=params,
                           timeout=self.timeout)
        return self._handle_response(resp)

    def _post(self, path: str, body: dict):
        if not HAS_REQUESTS:
            raise ImportError("requests package required: pip install requests")
        url = self.base_url + path
        resp = requests.post(url, headers=self._headers(), json=body,
                            timeout=self.timeout)
        return self._handle_response(resp)

    def _delete(self, path: str):
        if not HAS_REQUESTS:
            raise ImportError("requests package required: pip install requests")
        url = self.base_url + path
        resp = requests.delete(url, headers=self._headers(), timeout=self.timeout)
        return self._handle_response(resp)

    @classmethod
    def from_oauth(cls, client_id: str, client_secret: str,
                   redirect_uri: str, code: str, **kwargs) -> "EosHealthClient":
        """Exchange authorization code for token and return authenticated client."""
        if not HAS_REQUESTS:
            raise ImportError("requests package required: pip install requests")
        resp = requests.post(f"{BASE_URL}/oauth/token", data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": client_id,
            "client_secret": client_secret,
        })
        if resp.status_code != 200:
            raise AuthenticationError(f"Token exchange failed: {resp.text}")
        token_data = resp.json()
        return cls(access_token=token_data["access_token"], **kwargs)


def _date_params(start_date=None, end_date=None) -> dict:
    params = {}
    if start_date:
        params["start_date"] = str(start_date)
    if end_date:
        params["end_date"] = str(end_date)
    return params
