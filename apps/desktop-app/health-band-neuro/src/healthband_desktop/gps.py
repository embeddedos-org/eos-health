"""GPS tracker for HEALTH-BAND-Neuro."""
import math

class GPSTracker:
    EARTH_RADIUS_M = 6371000

    def __init__(self):
        self._waypoints = []

    def add_waypoint(self, lat, lon, alt=0.0, speed=0.0):
        if not (-90 <= lat <= 90):
            raise ValueError(f"Invalid latitude: {lat}")
        if not (-180 <= lon <= 180):
            raise ValueError(f"Invalid longitude: {lon}")
        self._waypoints.append({"lat": lat, "lon": lon, "alt": alt, "speed": speed})

    def get_waypoints(self):
        return list(self._waypoints)

    def get_current_position(self):
        return self._waypoints[-1] if self._waypoints else None

    def compute_distance(self):
        if len(self._waypoints) < 2:
            return 0.0
        total = 0.0
        for i in range(len(self._waypoints) - 1):
            a, b = self._waypoints[i], self._waypoints[i+1]
            dlat = math.radians(b["lat"] - a["lat"])
            dlon = math.radians(b["lon"] - a["lon"])
            x = math.sin(dlat/2)**2 + math.cos(math.radians(a["lat"])) * math.cos(math.radians(b["lat"])) * math.sin(dlon/2)**2
            total += 2 * self.EARTH_RADIUS_M * math.asin(math.sqrt(x))
        return round(total, 2)

    def compute_elevation_gain(self):
        if len(self._waypoints) < 2:
            return 0.0
        gain = sum(max(0, self._waypoints[i+1]["alt"] - self._waypoints[i]["alt"])
                   for i in range(len(self._waypoints)-1))
        return round(gain, 2)

    def get_bounding_box(self):
        if not self._waypoints:
            return None
        lats = [w["lat"] for w in self._waypoints]
        lons = [w["lon"] for w in self._waypoints]
        return {"min_lat": min(lats), "max_lat": max(lats),
                "min_lon": min(lons), "max_lon": max(lons)}

    def clear(self):
        self._waypoints = []
