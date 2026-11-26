"""Tests for healthkey_desktop/crypto.py
(run: python3 -m unittest discover -s apps/desktop-app/health-key-ultra/tests)."""

from __future__ import annotations

import os
import sys
import unittest
from unittest import mock

sys.path.insert(
    0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src")
)

from healthkey_desktop.crypto import CryptoEngine

# RFC 6238 Appendix B SHA-1 seed ("12345678901234567890"), base32-encoded.
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
# At t=900 this seed's 6-digit code starts with a zero.
T_LEADING_ZERO = 900
CODE_LEADING_ZERO = "026920"


class TotpTest(unittest.TestCase):
    def setUp(self):
        self.crypto = CryptoEngine()

    def test_rfc6238_vector(self):
        # RFC 6238 gives 94287082 at T=59; the low six digits are 287082.
        self.assertEqual(self.crypto.generate_totp_code(SECRET, 59), "287082")

    def test_generated_code_has_leading_zero(self):
        self.assertEqual(
            self.crypto.generate_totp_code(SECRET, T_LEADING_ZERO), CODE_LEADING_ZERO
        )

    def verify_at(self, t, code):
        with mock.patch("time.time", return_value=t):
            return self.crypto.verify_totp_code(SECRET, code)

    def test_str_code_with_leading_zero(self):
        self.assertTrue(self.verify_at(T_LEADING_ZERO, CODE_LEADING_ZERO))

    def test_int_code_with_leading_zero(self):
        self.assertTrue(self.verify_at(T_LEADING_ZERO, int(CODE_LEADING_ZERO)))

    def test_int_code_without_leading_zero(self):
        self.assertTrue(self.verify_at(59, 287082))

    def test_wrong_codes_rejected(self):
        self.assertFalse(self.verify_at(T_LEADING_ZERO, 26921))
        # A str is not padded: five digits stay five digits.
        self.assertFalse(self.verify_at(T_LEADING_ZERO, "26920"))


if __name__ == "__main__":
    unittest.main()
