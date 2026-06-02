"""Session management for HealthKey-Ulta."""
import os, hashlib, time

class SessionManager:
    def __init__(self, ttl=3600):
        self._sessions = {}
        self._ttl = ttl

    def create_session(self, user_id, device_id):
        token = hashlib.sha256(os.urandom(32) + user_id.encode()).hexdigest()
        self._sessions[token] = {
            "user_id": user_id, "device_id": device_id,
            "created": time.time(), "expires": time.time() + self._ttl
        }
        return token

    def validate_session(self, token):
        if token not in self._sessions:
            return False
        return time.time() < self._sessions[token]["expires"]

    def revoke_session(self, token):
        self._sessions.pop(token, None)

    def get_session_info(self, token):
        return self._sessions.get(token)

    def cleanup_expired(self):
        now = time.time()
        expired = [t for t, s in self._sessions.items() if now >= s["expires"]]
        for t in expired:
            del self._sessions[t]
        return len(expired)
