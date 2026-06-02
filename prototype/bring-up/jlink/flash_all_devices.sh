#!/bin/bash
# =============================================================================
# EoS Health — J-Link Flash Script (All 4 Devices)
# =============================================================================
# Usage: ./flash_all_devices.sh <device> [firmware.hex] [serial_number]
#
# Examples:
#   ./flash_all_devices.sh health-key-ultra
#   ./flash_all_devices.sh health-ring build/health-ring-v1.0.0.hex EOS-RING-001
#   ./flash_all_devices.sh all   # Flash all connected devices
#
# Requirements:
#   - J-Link Software (SEGGER) installed: https://www.segger.com/downloads/jlink/
#   - nRF Command Line Tools: https://www.nordicsemi.com/Products/Development-tools
#   - Device connected via J-Link EDU Mini or J-Link BASE
#
# Supported devices:
#   health-key-ultra    nRF52840 (USB-C key)
#   health-band-neuro   nRF52840 (wristband)
#   health-ring         nRF52840 (ring)
#   health-lab          nRF52833 (patch)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
BUILD_DIR="$REPO_ROOT/firmware/build"
LOG_DIR="$REPO_ROOT/prototype/bring-up/logs"
mkdir -p "$LOG_DIR"

# ── Device Configuration ──────────────────────────────────────────────────────
declare -A DEVICE_MCU=(
    ["health-key-ultra"]="NRF52840_XXAA"
    ["health-band-neuro"]="NRF52840_XXAA"
    ["health-ring"]="NRF52840_XXAA"
    ["health-lab"]="NRF52833_XXAA"
)

declare -A DEVICE_CLOCK=(
    ["health-key-ultra"]="4000"
    ["health-band-neuro"]="4000"
    ["health-ring"]="4000"
    ["health-lab"]="4000"
)

declare -A DEVICE_SOFTDEVICE=(
    ["health-key-ultra"]="s140"
    ["health-band-neuro"]="s140"
    ["health-ring"]="s140"
    ["health-lab"]="s140"
)

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'; BOLD='\033[1m'

log()   { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
ok()    { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅ $*${NC}"; }
warn()  { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠️  $*${NC}"; }
error() { echo -e "${RED}[$(date '+%H:%M:%S')] ❌ $*${NC}"; exit 1; }

# ── Check Dependencies ────────────────────────────────────────────────────────
check_deps() {
    local missing=0
    for cmd in JLinkExe nrfjprog; do
        if ! command -v "$cmd" &>/dev/null; then
            warn "Missing: $cmd"
            missing=1
        fi
    done
    if [[ $missing -eq 1 ]]; then
        error "Install SEGGER J-Link tools and nRF Command Line Tools first"
    fi
    ok "All dependencies found"
}

# ── Detect Connected J-Link ───────────────────────────────────────────────────
detect_jlink() {
    log "Detecting connected J-Link..."
    local sn
    sn=$(JLinkExe -CommanderScript /dev/stdin <<'EOF' 2>&1 | grep "Serial number" | head -1 | awk '{print $NF}'
ShowEmuList
Exit
EOF
    )
    if [[ -z "$sn" ]]; then
        error "No J-Link detected. Check USB connection."
    fi
    echo "$sn"
}

# ── Erase Device ─────────────────────────────────────────────────────────────
erase_device() {
    local device="$1"
    local mcu="${DEVICE_MCU[$device]}"
    log "Erasing $device ($mcu)..."
    nrfjprog --eraseall -f NRF52 2>&1 | tee -a "$LOG_DIR/flash_$(date '+%Y%m%d').log"
    ok "Erase complete"
}

# ── Flash SoftDevice ──────────────────────────────────────────────────────────
flash_softdevice() {
    local device="$1"
    local sd="${DEVICE_SOFTDEVICE[$device]}"
    local sd_hex="$REPO_ROOT/firmware/softdevice/${sd}_nrf52_7.3.0_softdevice.hex"

    if [[ ! -f "$sd_hex" ]]; then
        warn "SoftDevice not found: $sd_hex"
        warn "Download from: https://www.nordicsemi.com/Products/Development-software/nRF5-SDK"
        warn "Skipping SoftDevice flash (required for BLE)"
        return 1
    fi

    log "Flashing SoftDevice: $sd..."
    nrfjprog --program "$sd_hex" -f NRF52 --sectorerase 2>&1 | \
        tee -a "$LOG_DIR/flash_$(date '+%Y%m%d').log"
    ok "SoftDevice flashed"
}

# ── Flash Application ─────────────────────────────────────────────────────────
flash_application() {
    local device="$1"
    local hex_file="$2"
    local mcu="${DEVICE_MCU[$device]}"

    if [[ ! -f "$hex_file" ]]; then
        # Look for latest build
        hex_file=$(find "$BUILD_DIR" -name "${device}*.hex" | sort -V | tail -1)
        if [[ -z "$hex_file" ]]; then
            error "No firmware found for $device. Build first: cd firmware && make $device"
        fi
    fi

    log "Flashing application: $(basename "$hex_file")"
    log "Target: $device ($mcu)"

    nrfjprog --program "$hex_file" -f NRF52 --sectorerase --verify 2>&1 | \
        tee -a "$LOG_DIR/flash_$(date '+%Y%m%d').log"
    ok "Application flashed and verified"
}

# ── Flash Bootloader (MCUboot) ────────────────────────────────────────────────
flash_bootloader() {
    local device="$1"
    local bl_hex="$REPO_ROOT/firmware/bootloader/mcuboot_${device}.hex"

    if [[ ! -f "$bl_hex" ]]; then
        warn "Bootloader not found: $bl_hex"
        warn "Build with: cd firmware/bootloader && make $device"
        return 1
    fi

    log "Flashing MCUboot bootloader..."
    nrfjprog --program "$bl_hex" -f NRF52 --sectoranduicrerase 2>&1 | \
        tee -a "$LOG_DIR/flash_$(date '+%Y%m%d').log"
    ok "Bootloader flashed"
}

# ── Write UICR (Device Configuration) ────────────────────────────────────────
write_uicr() {
    local device="$1"
    local serial="$2"

    log "Writing UICR device configuration..."

    # UICR customer registers (0x10001080 - 0x100010FC)
    # [0x00]: Device type ID
    # [0x04]: Hardware revision
    # [0x08]: Serial number (lower 32 bits)
    # [0x0C]: Serial number (upper 32 bits)

    declare -A DEVICE_TYPE_ID=(
        ["health-key-ultra"]="0x454B5501"   # EKU\x01
        ["health-band-neuro"]="0x454E4E01"  # ENN\x01
        ["health-ring"]="0x45524701"        # ERG\x01
        ["health-lab"]="0x454C4201"         # ELB\x01
    )

    local type_id="${DEVICE_TYPE_ID[$device]}"
    local hw_rev="0x00010000"  # v1.0.0

    # Convert serial string to 64-bit integer
    local sn_hash
    sn_hash=$(echo -n "$serial" | sha256sum | cut -c1-16)
    local sn_lo="0x${sn_hash:8:8}"
    local sn_hi="0x${sn_hash:0:8}"

    JLinkExe -device "${DEVICE_MCU[$device]}" -if SWD -speed 4000 \
        -CommanderScript /dev/stdin <<EOF 2>&1 | tee -a "$LOG_DIR/flash_$(date '+%Y%m%d').log"
w4 0x10001080 $type_id
w4 0x10001084 $hw_rev
w4 0x10001088 $sn_lo
w4 0x1000108C $sn_hi
Exit
EOF
    ok "UICR written: type=$type_id, serial=$serial"
}

# ── Reset and Verify ──────────────────────────────────────────────────────────
reset_and_verify() {
    local device="$1"
    log "Resetting device and verifying boot..."
    nrfjprog --reset -f NRF52 2>&1 | tee -a "$LOG_DIR/flash_$(date '+%Y%m%d').log"
    sleep 2

    # Check if device is advertising via BLE (requires nRF Connect or similar)
    log "Waiting for BLE advertisement (10s timeout)..."
    if command -v bluetoothctl &>/dev/null; then
        local found=0
        timeout 10 bluetoothctl scan on 2>/dev/null | while read -r line; do
            if echo "$line" | grep -qi "eos\|health"; then
                ok "Device advertising: $line"
                found=1
                break
            fi
        done
        if [[ $found -eq 0 ]]; then
            warn "BLE advertisement not detected (may need BLE enabled on host)"
        fi
    else
        warn "bluetoothctl not available — skip BLE advertisement check"
    fi

    ok "Device reset complete"
}

# ── Full Flash Sequence ───────────────────────────────────────────────────────
flash_device() {
    local device="$1"
    local hex_file="${2:-}"
    local serial="${3:-EOS-$(echo "$device" | tr '[:lower:]-' '[:upper:]_')-$(date '+%Y%m%d')-001}"

    echo ""
    echo -e "${BOLD}════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}  Flashing: $device${NC}"
    echo -e "${BOLD}  Serial:   $serial${NC}"
    echo -e "${BOLD}════════════════════════════════════════════════════${NC}"

    erase_device "$device"
    flash_softdevice "$device" || true
    flash_bootloader "$device" || true
    flash_application "$device" "$hex_file"
    write_uicr "$device" "$serial"
    reset_and_verify "$device"

    echo ""
    ok "═══ $device FLASH COMPLETE ═══"
    echo "  Serial:   $serial"
    echo "  Log:      $LOG_DIR/flash_$(date '+%Y%m%d').log"
    echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
    local target="${1:-}"
    local hex_file="${2:-}"
    local serial="${3:-}"

    echo ""
    echo -e "${BOLD}EoS Health — J-Link Flash Tool${NC}"
    echo -e "$(date '+%Y-%m-%d %H:%M:%S')"
    echo ""

    if [[ -z "$target" ]]; then
        echo "Usage: $0 <device|all> [firmware.hex] [serial_number]"
        echo ""
        echo "Devices:"
        for d in "${!DEVICE_MCU[@]}"; do
            echo "  $d (${DEVICE_MCU[$d]})"
        done
        exit 1
    fi

    check_deps

    if [[ "$target" == "all" ]]; then
        for device in health-key-ultra health-band-neuro health-ring health-lab; do
            flash_device "$device" "$hex_file" "$serial"
        done
    else
        if [[ -z "${DEVICE_MCU[$target]:-}" ]]; then
            error "Unknown device: $target"
        fi
        flash_device "$target" "$hex_file" "$serial"
    fi

    ok "All flash operations complete"
}

main "$@"
