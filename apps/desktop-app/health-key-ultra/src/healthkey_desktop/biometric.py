"""Biometric authentication for HealthKey-Ulta."""
import hashlib, os

class BiometricAuth:
    def __init__(self):
        self._templates = {}
        self._nfc_keys = {}

    def enroll_fingerprint(self, user_id, template):
        h = hashlib.sha256(template).hexdigest()
        self._templates[user_id] = h
        return {"status": "enrolled", "user_id": user_id, "template_hash": h}

    def verify_fingerprint(self, user_id, sample):
        if user_id not in self._templates:
            return {"match": False, "confidence": 0.0, "reason": "user_not_enrolled"}
        h = hashlib.sha256(sample).hexdigest()
        match = h == self._templates[user_id]
        return {"match": match, "confidence": 0.98 if match else 0.0, "user_id": user_id}

    def read_nfc_tag(self, tag_data):
        if len(tag_data) < 4:
            return {"valid": False, "uid": None}
        uid = tag_data[:4].hex().upper()
        return {"valid": True, "uid": uid, "raw_length": len(tag_data)}

    def list_enrolled_users(self):
        return list(self._templates.keys())

    def revoke_fingerprint(self, user_id):
        if user_id in self._templates:
            del self._templates[user_id]
            return True
        return False
