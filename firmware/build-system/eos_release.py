#!/usr/bin/env python3
"""
EoS Health Firmware Release Pipeline
=====================================
Builds, signs, and packages firmware for all 4 EoS Health devices.

Usage:
    python3 eos_release.py --device health-ring --tier ultra --version 1.0.0
    python3 eos_release.py --all --version 1.0.0
    python3 eos_release.py --device health-lab --sign-only --bin firmware.bin

Requirements:
    pip install cryptography imgtool cbor2
    arm-none-eabi-gcc in PATH
    NRF5_SDK_PATH environment variable set
"""

import argparse
import hashlib
import json
import os
import shutil
import struct
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    from cryptography.hazmat.primitives import serialization
    CRYPTO_AVAILABLE = True
except ImportError:
    CRYPTO_AVAILABLE = False
    print("[WARN] cryptography not installed — signing will be skipped")

# ─── Device configurations ────────────────────────────────────────────────────
DEVICES = {
    "health-key-ultra": {
        "mcu": "nRF52840_xxAA",
        "softdevice": "s140",
        "tiers": ["default"],
        "flash_size": 0x100000,  # 1 MB
        "slot_size":  0x72000,   # ~460 KB per slot (dual-bank)
    },
    "health-band-neuro": {
        "mcu": "nRF52840_xxAA",
        "softdevice": "s140",
        "tiers": ["default"],
        "flash_size": 0x100000,
        "slot_size":  0x72000,
    },
    "health-ring": {
        "mcu": {"base": "nRF52833_xxAA", "ultra": "nRF52840_xxAA"},
        "softdevice": "s140",
        "tiers": ["base", "ultra"],
        "flash_size": {"base": 0x80000, "ultra": 0x100000},
        "slot_size":  {"base": 0x38000, "ultra": 0x72000},
    },
    "health-lab": {
        "mcu": {"base": "nRF52833_xxAA", "ultra": "nRF52840_xxAA"},
        "softdevice": "s140",
        "tiers": ["base", "ultra"],
        "flash_size": {"base": 0x80000, "ultra": 0x100000},
        "slot_size":  {"base": 0x38000, "ultra": 0x72000},
    },
}

REPO_ROOT = Path(__file__).parent.parent.parent
FIRMWARE_ROOT = REPO_ROOT / "firmware"
BUILD_DIR = FIRMWARE_ROOT / "build"
RELEASE_DIR = FIRMWARE_ROOT / "releases"
KEYS_DIR = FIRMWARE_ROOT / "build-system" / "keys"


# ─── Key management ───────────────────────────────────────────────────────────
def load_or_generate_signing_key(device: str) -> "Ed25519PrivateKey | None":
    """Load device signing key or generate a new one (dev only)."""
    if not CRYPTO_AVAILABLE:
        return None

    KEYS_DIR.mkdir(parents=True, exist_ok=True)
    key_path = KEYS_DIR / f"{device}_signing_key.pem"
    pub_path = KEYS_DIR / f"{device}_signing_key_pub.pem"

    if key_path.exists():
        with open(key_path, "rb") as f:
            key = serialization.load_pem_private_key(f.read(), password=None)
        print(f"  [KEY] Loaded existing signing key: {key_path}")
    else:
        print(f"  [KEY] Generating new Ed25519 signing key for {device}...")
        key = Ed25519PrivateKey.generate()
        with open(key_path, "wb") as f:
            f.write(key.private_bytes(
                serialization.Encoding.PEM,
                serialization.PrivateFormat.PKCS8,
                serialization.NoEncryption()
            ))
        pub_key = key.public_key()
        with open(pub_path, "wb") as f:
            f.write(pub_key.public_bytes(
                serialization.Encoding.PEM,
                serialization.PublicFormat.SubjectPublicKeyInfo
            ))
        print(f"  [KEY] Saved to {key_path}")
        print(f"  [KEY] Public key saved to {pub_path}")
        print(f"  [WARN] Store private key securely — never commit to git!")

    return key


def sign_firmware(binary_path: Path, key: "Ed25519PrivateKey") -> bytes:
    """Sign firmware binary with Ed25519 and return signature."""
    with open(binary_path, "rb") as f:
        data = f.read()
    signature = key.sign(data)
    print(f"  [SIGN] Signed {binary_path.name} ({len(data)} bytes)")
    return signature


# ─── MCUboot image header ─────────────────────────────────────────────────────
MCUBOOT_MAGIC = 0x96F3B83D
IMG_HDR_SIZE  = 32

def add_mcuboot_header(binary_path: Path, version: str, slot_size: int) -> Path:
    """Prepend MCUboot image header to firmware binary."""
    with open(binary_path, "rb") as f:
        firmware = f.read()

    major, minor, patch = (int(x) for x in version.split("."))
    build_num = int(time.time()) & 0xFFFFFFFF

    # MCUboot IMAGE_MAGIC header (simplified — real builds use imgtool)
    header = struct.pack("<IIIHHBBBBI",
        MCUBOOT_MAGIC,   # magic
        0,               # load_addr (0 = no load addr)
        IMG_HDR_SIZE,    # hdr_size
        0,               # protect_tlv_size
        len(firmware),   # img_size
        0,               # flags
        major, minor,    # ver.major, ver.minor
        patch,           # ver.revision (uint16 packed as byte here)
        build_num,       # ver.build_num
    )
    # Pad header to IMG_HDR_SIZE
    header = header[:IMG_HDR_SIZE].ljust(IMG_HDR_SIZE, b'\xff')

    out_path = binary_path.with_suffix(".mcuboot.bin")
    with open(out_path, "wb") as f:
        f.write(header + firmware)

    print(f"  [MCUboot] Header added → {out_path.name}")
    return out_path


# ─── OTA package (SUIT manifest) ─────────────────────────────────────────────
def create_ota_package(device: str, tier: str, version: str,
                       signed_bin: Path, signature: bytes | None) -> Path:
    """Create OTA update package with SUIT-style manifest."""
    pkg_dir = RELEASE_DIR / version / device
    if tier != "default":
        pkg_dir = pkg_dir / tier
    pkg_dir.mkdir(parents=True, exist_ok=True)

    # Compute SHA-256 of firmware
    with open(signed_bin, "rb") as f:
        fw_data = f.read()
    fw_sha256 = hashlib.sha256(fw_data).hexdigest()
    fw_size   = len(fw_data)

    # SUIT-style manifest (JSON representation)
    manifest = {
        "suit-manifest-version": 1,
        "suit-manifest-sequence-number": int(time.time()),
        "suit-common": {
            "suit-components": [
                {
                    "suit-component-identifier": f"eos/{device}/{tier}",
                    "suit-component-size": fw_size,
                    "suit-digest": {
                        "suit-digest-algorithm-id": "sha256",
                        "suit-digest-bytes": fw_sha256,
                    }
                }
            ]
        },
        "suit-install": {
            "suit-directive-override-parameters": {
                "suit-parameter-source-component": f"eos/{device}/{tier}",
            }
        },
        "suit-validate": {
            "suit-condition-image-match": True
        },
        "eos-metadata": {
            "device": device,
            "tier": tier,
            "version": version,
            "build-timestamp": datetime.now(timezone.utc).isoformat(),
            "min-battery-pct": 20,
            "rollback-on-failure": True,
        }
    }

    if signature:
        manifest["suit-authentication-wrapper"] = {
            "suit-digest-algorithm-id": "ed25519",
            "suit-signature": signature.hex(),
        }

    manifest_path = pkg_dir / f"{device}-{tier}-{version}.manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    # Copy firmware binary
    fw_dest = pkg_dir / f"{device}-{tier}-{version}.bin"
    shutil.copy2(signed_bin, fw_dest)

    # Create release bundle (zip)
    bundle_name = f"eos-{device}-{tier}-{version}-ota"
    bundle_path = RELEASE_DIR / version / bundle_name
    shutil.make_archive(str(bundle_path), "zip", pkg_dir)

    print(f"  [OTA] Package created: {bundle_path}.zip")
    print(f"  [OTA] Firmware SHA-256: {fw_sha256}")
    print(f"  [OTA] Firmware size:    {fw_size:,} bytes")

    return Path(str(bundle_path) + ".zip")


# ─── Build ────────────────────────────────────────────────────────────────────
def build_firmware(device: str, tier: str, version: str) -> Path | None:
    """Run CMake build for a device/tier combination."""
    build_path = BUILD_DIR / device / tier
    build_path.mkdir(parents=True, exist_ok=True)

    cmake_args = [
        "cmake",
        str(FIRMWARE_ROOT / "build-system"),
        f"-DEOS_DEVICE={device}",
        f"-DCMAKE_BUILD_TYPE=Release",
        f"-DNRF5_SDK_PATH={os.environ.get('NRF5_SDK_PATH', '/opt/nrf5-sdk')}",
    ]
    if tier not in ("default", "base"):
        cmake_args.append(f"-DEOS_RING_TIER={tier}")
        cmake_args.append(f"-DEOS_LAB_TIER={tier}")

    print(f"\n  [BUILD] Configuring {device} ({tier})...")
    result = subprocess.run(cmake_args, cwd=build_path, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  [ERROR] CMake configure failed:\n{result.stderr}")
        return None

    print(f"  [BUILD] Compiling {device} ({tier})...")
    result = subprocess.run(["cmake", "--build", ".", "--parallel", "4"],
                            cwd=build_path, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  [ERROR] Build failed:\n{result.stderr}")
        return None

    bin_path = build_path / f"{device}-{version}.bin"
    if not bin_path.exists():
        # Try to find the binary
        bins = list(build_path.glob("*.bin"))
        if bins:
            bin_path = bins[0]
        else:
            print(f"  [ERROR] No .bin found in {build_path}")
            return None

    print(f"  [BUILD] Success: {bin_path}")
    return bin_path


# ─── Release summary ─────────────────────────────────────────────────────────
def write_release_notes(version: str, packages: list[dict]) -> None:
    """Write RELEASE_NOTES.md for this version."""
    notes_path = RELEASE_DIR / version / "RELEASE_NOTES.md"
    with open(notes_path, "w") as f:
        f.write(f"# EoS Health Firmware Release {version}\n\n")
        f.write(f"**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}\n\n")
        f.write("## Packages\n\n")
        f.write("| Device | Tier | SHA-256 | Size |\n")
        f.write("|---|---|---|---|\n")
        for pkg in packages:
            f.write(f"| {pkg['device']} | {pkg['tier']} | `{pkg['sha256'][:16]}...` | {pkg['size']:,} B |\n")
        f.write("\n## Changelog\n\n")
        f.write("- Production release v1.0.0\n")
        f.write("- All 4 devices: OTA, power management, crash recovery, data buffering\n")
        f.write("- Health algorithms: ECG/AFib, SpO₂, HbA1c, glucose, HRV, VO₂max\n")
        f.write("- HEALTH-BAND Neuro: sEMG 8-channel, EDA, TENS controller\n")
        f.write("- HEALTH-LAB Ultra: SCBN Kalman self-calibration\n")
    print(f"\n  [NOTES] Release notes: {notes_path}")


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="EoS Health Firmware Release Pipeline")
    parser.add_argument("--device", choices=list(DEVICES.keys()), help="Target device")
    parser.add_argument("--tier", default="default", help="Device tier (base/ultra/default)")
    parser.add_argument("--version", required=True, help="Firmware version (e.g. 1.0.0)")
    parser.add_argument("--all", action="store_true", help="Build all devices and tiers")
    parser.add_argument("--sign-only", action="store_true", help="Sign existing binary only")
    parser.add_argument("--bin", help="Path to existing binary (for --sign-only)")
    parser.add_argument("--no-build", action="store_true", help="Skip build, use existing binary")
    args = parser.parse_args()

    print("=" * 60)
    print("  EoS Health Firmware Release Pipeline")
    print(f"  Version: {args.version}")
    print("=" * 60)

    RELEASE_DIR.mkdir(parents=True, exist_ok=True)

    packages = []

    # Determine what to build
    targets = []
    if args.all:
        for device, cfg in DEVICES.items():
            for tier in cfg["tiers"]:
                targets.append((device, tier))
    elif args.device:
        targets.append((args.device, args.tier))
    else:
        parser.error("Specify --device or --all")

    for device, tier in targets:
        print(f"\n{'─'*60}")
        print(f"  Processing: {device} ({tier})")
        print(f"{'─'*60}")

        # Load signing key
        key = load_or_generate_signing_key(device)

        if args.sign_only and args.bin:
            bin_path = Path(args.bin)
        elif args.no_build:
            # Look for existing binary
            build_path = BUILD_DIR / device / tier
            bins = list(build_path.glob("*.bin"))
            bin_path = bins[0] if bins else None
            if not bin_path:
                print(f"  [SKIP] No binary found for {device}/{tier}")
                continue
        else:
            bin_path = build_firmware(device, tier, args.version)
            if not bin_path:
                print(f"  [SKIP] Build failed for {device}/{tier}")
                continue

        # Add MCUboot header
        cfg = DEVICES[device]
        slot_size = cfg["slot_size"]
        if isinstance(slot_size, dict):
            slot_size = slot_size.get(tier, list(slot_size.values())[0])
        mcuboot_bin = add_mcuboot_header(bin_path, args.version, slot_size)

        # Sign
        signature = None
        if key:
            signature = sign_firmware(mcuboot_bin, key)

        # Create OTA package
        pkg_path = create_ota_package(device, tier, args.version, mcuboot_bin, signature)

        # Record
        with open(mcuboot_bin, "rb") as f:
            fw_data = f.read()
        packages.append({
            "device": device,
            "tier": tier,
            "sha256": hashlib.sha256(fw_data).hexdigest(),
            "size": len(fw_data),
            "package": str(pkg_path),
        })

    if packages:
        write_release_notes(args.version, packages)
        print(f"\n{'='*60}")
        print(f"  Release {args.version} complete — {len(packages)} package(s)")
        print(f"  Output: {RELEASE_DIR / args.version}")
        print(f"{'='*60}")
    else:
        print("\n[ERROR] No packages produced.")
        sys.exit(1)


if __name__ == "__main__":
    main()
