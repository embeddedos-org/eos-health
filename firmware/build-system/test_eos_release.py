"""Tests for eos_release.py (run: python3 -m unittest discover -s firmware/build-system)."""

from __future__ import annotations

import contextlib
import io
import os
import struct
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

with contextlib.redirect_stdout(io.StringIO()):
    import eos_release  # noqa: E402  (prints a warning if cryptography is absent)


def header_for(size, version="1.2.3"):
    """Run add_mcuboot_header on `size` bytes of 0xAA; return (header, payload)."""
    with tempfile.TemporaryDirectory() as tmp:
        fw = Path(tmp) / "fw.bin"
        fw.write_bytes(b"\xAA" * size)
        with contextlib.redirect_stdout(io.StringIO()):
            out = eos_release.add_mcuboot_header(fw, version, 0x72000)
        data = out.read_bytes()
    return data[:eos_release.IMG_HDR_SIZE], data[eos_release.IMG_HDR_SIZE:]


class McubootHeaderTest(unittest.TestCase):
    def test_field_offsets_match_image_header(self):
        hdr, payload = header_for(100)
        self.assertEqual(len(hdr), 32)
        self.assertEqual(payload, b"\xAA" * 100)
        magic, load_addr, hdr_size, tlv_size, img_size, flags = struct.unpack_from(
            "<IIHHII", hdr, 0
        )
        self.assertEqual(magic, eos_release.MCUBOOT_MAGIC)
        self.assertEqual(load_addr, 0)
        self.assertEqual(hdr_size, 32)
        self.assertEqual(tlv_size, 0)
        self.assertEqual(img_size, 100)
        self.assertEqual(flags, 0)

    def test_version_fields(self):
        hdr, _ = header_for(16, version="2.7.300")
        major, minor, revision = struct.unpack_from("<BBH", hdr, 20)
        self.assertEqual((major, minor, revision), (2, 7, 300))

    def test_image_over_64k(self):
        # A release slot is up to 0x72000 bytes; img_size must not be limited to 16 bits.
        hdr, payload = header_for(70000)
        self.assertEqual(struct.unpack_from("<I", hdr, 12)[0], 70000)
        self.assertEqual(len(payload), 70000)


if __name__ == "__main__":
    unittest.main()
