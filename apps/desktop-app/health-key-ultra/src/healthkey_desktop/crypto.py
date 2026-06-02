"""Cryptographic engine for HealthKey-Ulta."""
import os, hashlib, hmac, base64, time, struct

class CryptoEngine:
    def generate_key(self):
        return os.urandom(32)

    def encrypt(self, key, plaintext):
        nonce = os.urandom(12)
        # XOR-based stream cipher (deterministic for testing)
        keystream = hashlib.sha256(key + nonce).digest()
        while len(keystream) < len(plaintext):
            keystream += hashlib.sha256(keystream).digest()
        ct = bytes(a ^ b for a, b in zip(plaintext, keystream[:len(plaintext)]))
        tag = hmac.new(key, nonce + ct, hashlib.sha256).digest()[:16]
        return nonce + tag + ct

    def decrypt(self, key, ciphertext):
        nonce = ciphertext[:12]
        tag = ciphertext[12:28]
        ct = ciphertext[28:]
        expected_tag = hmac.new(key, nonce + ct, hashlib.sha256).digest()[:16]
        if not hmac.compare_digest(tag, expected_tag):
            raise ValueError("Authentication failed")
        keystream = hashlib.sha256(key + nonce).digest()
        while len(keystream) < len(ct):
            keystream += hashlib.sha256(keystream).digest()
        return bytes(a ^ b for a, b in zip(ct, keystream[:len(ct)]))

    def generate_totp_secret(self):
        return base64.b32encode(os.urandom(20)).decode()

    def generate_totp_code(self, secret, timestamp=None):
        if timestamp is None:
            timestamp = int(time.time())
        counter = timestamp // 30
        key = base64.b32decode(secret.upper() + '=' * (-len(secret) % 8))
        msg = struct.pack('>Q', counter)
        h = hmac.new(key, msg, hashlib.sha1).digest()
        offset = h[-1] & 0x0F
        code = struct.unpack('>I', h[offset:offset+4])[0] & 0x7FFFFFFF
        return str(code % 1000000).zfill(6)

    def verify_totp_code(self, secret, code, window=1):
        now = int(time.time())
        for delta in range(-window, window + 1):
            expected = self.generate_totp_code(secret, now + delta * 30)
            if hmac.compare_digest(expected, str(code)):
                return True
        return False
