"""Vital signs monitor for HEALTH-BAND-Neuro."""

class VitalsMonitor:
    HR_NORMAL = (60, 100)
    SPO2_NORMAL = (95, 100)
    TEMP_NORMAL = (36.1, 37.2)

    def __init__(self):
        self._readings = []

    def add_reading(self, hr, spo2, temp, hrv=None):
        if not (20 <= hr <= 300):
            raise ValueError(f"HR out of range: {hr}")
        if not (50 <= spo2 <= 100):
            raise ValueError(f"SpO2 out of range: {spo2}")
        if not (30.0 <= temp <= 45.0):
            raise ValueError(f"Temp out of range: {temp}")
        self._readings.append({"hr": hr, "spo2": spo2, "temp": temp, "hrv": hrv})

    def get_latest(self):
        return self._readings[-1] if self._readings else None

    def get_history(self):
        return list(self._readings)

    def get_averages(self):
        if not self._readings:
            return {}
        n = len(self._readings)
        return {
            "hr": round(sum(r["hr"] for r in self._readings) / n, 1),
            "spo2": round(sum(r["spo2"] for r in self._readings) / n, 1),
            "temp": round(sum(r["temp"] for r in self._readings) / n, 2),
        }

    def check_alerts(self):
        latest = self.get_latest()
        if not latest:
            return []
        alerts = []
        if latest["hr"] > self.HR_NORMAL[1]:
            alerts.append({"type": "tachycardia", "value": latest["hr"], "severity": "warning"})
        elif latest["hr"] < self.HR_NORMAL[0]:
            alerts.append({"type": "bradycardia", "value": latest["hr"], "severity": "warning"})
        if latest["spo2"] < self.SPO2_NORMAL[0]:
            sev = "critical" if latest["spo2"] < 90 else "warning"
            alerts.append({"type": "hypoxia", "value": latest["spo2"], "severity": sev})
        if latest["temp"] > self.TEMP_NORMAL[1]:
            alerts.append({"type": "fever", "value": latest["temp"], "severity": "warning"})
        return alerts

    def compute_wellness_score(self):
        if not self._readings:
            return 0
        avgs = self.get_averages()
        score = 100
        hr_dev = abs(avgs["hr"] - 72) / 28
        spo2_dev = max(0, (98 - avgs["spo2"]) / 8)
        temp_dev = abs(avgs["temp"] - 36.6) / 1.1
        score -= int(hr_dev * 20 + spo2_dev * 30 + temp_dev * 15)
        return max(0, min(100, score))
