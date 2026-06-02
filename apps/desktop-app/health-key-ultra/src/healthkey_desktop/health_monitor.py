"""Health monitoring for HealthKey-Ulta."""

class HealthMonitor:
    HR_NORMAL = (60, 100)
    SPO2_NORMAL = (95, 100)
    TEMP_NORMAL = (36.1, 37.2)

    def __init__(self):
        self._readings = []

    def add_reading(self, hr, spo2, temp):
        self._readings.append({"hr": hr, "spo2": spo2, "temp": temp})

    def get_latest(self):
        return self._readings[-1] if self._readings else None

    def get_history(self):
        return list(self._readings)

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
