"""ECG signal processing for HEALTH-BAND-Neuro."""
import math

class ECGProcessor:
    SAMPLE_RATE = 250  # Hz

    def __init__(self):
        self._samples = []
        self._r_peaks = []

    def add_samples(self, samples):
        if not all(isinstance(s, (int, float)) for s in samples):
            raise TypeError("Samples must be numeric")
        self._samples.extend(float(s) for s in samples)
        self._r_peaks = []  # invalidate cache

    def get_stats(self):
        if not self._samples:
            return {"count": 0, "mean": 0.0, "std": 0.0, "min": 0.0, "max": 0.0}
        n = len(self._samples)
        mean = sum(self._samples) / n
        std = math.sqrt(sum((x - mean) ** 2 for x in self._samples) / n)
        return {"count": n, "mean": round(mean, 4), "std": round(std, 4),
                "min": round(min(self._samples), 4), "max": round(max(self._samples), 4)}

    def detect_r_peaks(self, threshold=0.3):
        if self._r_peaks:
            return self._r_peaks
        peaks = []
        s = self._samples
        # Refractory period: 200ms minimum between peaks
        refractory = int(self.SAMPLE_RATE * 0.2)
        for i in range(1, len(s) - 1):
            if s[i] > threshold and s[i] >= s[i-1] and s[i] >= s[i+1]:
                if not peaks or (i - peaks[-1]) > refractory:
                    peaks.append(i)
        self._r_peaks = peaks
        return peaks

    def compute_heart_rate(self):
        peaks = self.detect_r_peaks()
        if len(peaks) < 2:
            return 0.0
        rr_intervals = [(peaks[i+1] - peaks[i]) / self.SAMPLE_RATE for i in range(len(peaks)-1)]
        mean_rr = sum(rr_intervals) / len(rr_intervals)
        return round(60.0 / mean_rr, 1) if mean_rr > 0 else 0.0

    def compute_rmssd(self):
        peaks = self.detect_r_peaks()
        if len(peaks) < 3:
            return 0.0
        rr = [(peaks[i+1] - peaks[i]) / self.SAMPLE_RATE * 1000 for i in range(len(peaks)-1)]
        diffs = [(rr[i+1] - rr[i]) ** 2 for i in range(len(rr)-1)]
        return round(math.sqrt(sum(diffs) / len(diffs)), 2) if diffs else 0.0

    def compute_qrs_duration(self):
        peaks = self.detect_r_peaks()
        if not peaks:
            return 0.0
        durations = []
        for p in peaks:
            start = max(0, p - int(0.06 * self.SAMPLE_RATE))
            end = min(len(self._samples)-1, p + int(0.06 * self.SAMPLE_RATE))
            durations.append((end - start) / self.SAMPLE_RATE * 1000)
        return round(sum(durations) / len(durations), 1)

    def detect_arrhythmia(self):
        peaks = self.detect_r_peaks()
        if len(peaks) < 4:
            return {"type": "insufficient_data", "confidence": 0.0}
        rr = [(peaks[i+1] - peaks[i]) / self.SAMPLE_RATE * 1000 for i in range(len(peaks)-1)]
        mean_rr = sum(rr) / len(rr)
        cv = math.sqrt(sum((r - mean_rr)**2 for r in rr) / len(rr)) / mean_rr
        hr = self.compute_heart_rate()
        if hr > 100:
            return {"type": "tachycardia", "confidence": min(0.95, cv * 3 + 0.6)}
        if hr < 60:
            return {"type": "bradycardia", "confidence": min(0.95, 0.7)}
        if cv > 0.15:
            return {"type": "atrial_fibrillation", "confidence": min(0.90, cv * 2)}
        return {"type": "normal_sinus_rhythm", "confidence": 0.95}

    def clear(self):
        self._samples = []
        self._r_peaks = []
