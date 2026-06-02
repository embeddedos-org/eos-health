"""EEG signal processing for HEALTH-BAND-Neuro."""
import math

class EEGProcessor:
    SAMPLE_RATE = 256  # Hz
    BANDS = {"delta":(0.5,4),"theta":(4,8),"alpha":(8,13),"beta":(13,30),"gamma":(30,100)}

    def __init__(self):
        self._channels = {}

    def add_channel(self, name, samples):
        if not all(isinstance(s, (int, float)) for s in samples):
            raise TypeError("Samples must be numeric")
        self._channels[name] = list(samples)

    def get_channels(self):
        return list(self._channels.keys())

    def compute_band_power(self, channel, band):
        if channel not in self._channels:
            raise ValueError(f"Unknown channel: {channel}")
        if band not in self.BANDS:
            raise ValueError(f"Unknown band: {band}")
        samples = self._channels[channel]
        if len(samples) < 2:
            return 0.0
        # Simple DFT-based band power estimation
        n = len(samples)
        low, high = self.BANDS[band]
        power = 0.0
        for k in range(1, n // 2):
            freq = k * self.SAMPLE_RATE / n
            if low <= freq <= high:
                re = sum(samples[t] * math.cos(2*math.pi*k*t/n) for t in range(n)) / n
                im = sum(samples[t] * math.sin(2*math.pi*k*t/n) for t in range(n)) / n
                power += re**2 + im**2
        return round(power, 6)

    def get_all_band_powers(self, channel):
        return {band: self.compute_band_power(channel, band) for band in self.BANDS}

    def detect_mental_state(self, channel):
        if channel not in self._channels:
            raise ValueError(f"Unknown channel: {channel}")
        powers = self.get_all_band_powers(channel)
        total = sum(powers.values()) or 1.0
        ratios = {b: p/total for b, p in powers.items()}
        if ratios["alpha"] > 0.35:
            return {"state": "relaxed", "confidence": min(0.9, ratios["alpha"] * 2)}
        if ratios["beta"] > 0.30:
            return {"state": "focused", "confidence": min(0.9, ratios["beta"] * 2)}
        if ratios["theta"] > 0.30:
            return {"state": "drowsy", "confidence": min(0.9, ratios["theta"] * 2)}
        if ratios["delta"] > 0.40:
            return {"state": "deep_sleep", "confidence": min(0.9, ratios["delta"] * 1.5)}
        return {"state": "neutral", "confidence": 0.6}
