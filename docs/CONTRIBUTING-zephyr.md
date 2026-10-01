# Contributing — Zephyr development environment

This guide gets a new contributor from a blank machine to building and
running eos-health firmware on the Zephyr RTOS, plus the companion web
and mobile apps. It is the onboarding companion to the repo's
[developer guide](./developer-guide/).

> **Scope note:** the firmware CMake trees are under active restructuring
> (see issues #2 and #3). This guide covers the standard Zephyr workflow;
> if a tree fails to configure, that is a known issue — file what you see
> rather than working around it.

## 1. Host prerequisites

| Tool | Minimum | Notes |
|---|---|---|
| OS | Ubuntu 22.04 LTS (or macOS 13+) | Windows: use WSL2 with Ubuntu 22.04 |
| Python | 3.10+ | Zephyr's `west` and build scripts run on it |
| `west` | latest | Zephyr's meta-tool: `pip install west` |
| Zephyr SDK | 0.16+ | Toolchains for ARM/RISC-V; see below |
| CMake | 3.20+ | `sudo apt install cmake` |
| Ninja | 1.10+ | `sudo apt install ninja-build` |
| DeviceTree compiler | 1.4.6+ | `sudo apt install device-tree-compiler` |
| Node.js | 20 LTS | For `apps/web/` |
| pnpm | 9.x | For `apps/web/` — `corepack enable && corepack prepare pnpm@9 --activate` |

Install the Zephyr host dependencies (Ubuntu):

```sh
sudo apt update
sudo apt install --no-install-recommends \
  git cmake ninja-build gperf ccache dfu-util device-tree-compiler wget \
  python3-dev python3-pip python3-setuptools python3-tk python3-wheel xz-utils \
  file make gcc gcc-multilib g++-multilib libsdl2-dev libmagic1
```

Install `west` and the Zephyr SDK:

```sh
pip install --user west
west --version   # sanity check

# SDK (adjust version to what west.yml pins; 0.16.x is current as of 2026)
wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.9/zephyr-sdk-0.16.9_linux-x86_64.tar.xz
tar xf zephyr-sdk-0.16.9_linux-x86_64.tar.xz
cd zephyr-sdk-0.16.9 && ./setup.sh -t arm-zephyr-eabi -h -c && cd ..
```

Initialize the workspace (from the repo root):

```sh
west init -l firmware/        # local manifest: uses firmware/west.yml
west update                   # pulls Zephyr + modules (takes a few minutes)
west zephyr-export            # registers Zephyr CMake package
pip install --user -r zephyr/scripts/requirements.txt
```

## 2. Hardware

| Item | Why |
|---|---|
| Nordic nRF52840 DK (PCA10056) | Primary reference board: BLE 5, USB, on-board J-Link |
| Medical sensor breakout(s) | e.g. MAX30102 (PPG) / MAX32664 — matches `firmware/health-band-neuro` |
| Logic analyzer | Saleae Logic 8 or compatible, for SPI/I2C bring-up traces |
| USB cables | One for the DK's J-Link USB, one for its USB-CDC UART |

No hardware yet? Everything below also runs on `native_sim` (Zephyr's
host-native simulator) — start there.

## 3. Hello world — build and run

Pick the firmware app closest to what you want to hack on; the layout is
`firmware/<device>/` (e.g. `firmware/health-band-neuro`).

### 3a. Software-in-the-loop (`native_sim`)

```sh
cd firmware/health-band-neuro
west build -b native_sim -- -DCONF_FILE=prj.conf
west build -t run        # runs the simulator on your host
```

You should see the Zephyr banner and the app's boot log on stdout.
`Ctrl-C` stops it.

### 3b. Flash to the nRF52840 DK

```sh
# Connect the DK via the J-Link USB port, then:
west build -b nrf52840dk/nrf52840
west flash               # via on-board J-Link / OpenOCD
west attach              # optional: attach a debugger
```

Serial output appears on the DK's USB-CDC port (115200 8N1):

```sh
# Linux
picocom -b 115200 /dev/ttyACM0
```

### 3c. Running the test suite

```sh
# Host-side unit tests (no hardware)
west test                # or: ctest --test-dir build

# Zephyr's Twister for on-target / simulated runs
west twister -T tests/ -p native_sim --device-testing --device-serial /dev/ttyACM0
```

## 4. Frontend apps

### Web (`apps/web/`)

```sh
cd apps/web
corepack enable
pnpm install
pnpm dev                 # dev server, default http://localhost:3000
pnpm build               # production build (what CI checks)
```

### Mobile (`apps/mobile/`, Expo)

```sh
cd apps/mobile
pnpm install
pnpm expo start          # scan the QR code with Expo Go, or:
pnpm expo start --android
pnpm expo start --ios
```

The mobile app talks to the firmware over BLE; pair with the nRF52840 DK
advertising the eos-health service UUID (see
`firmware/<device>/src/ble/`).

## 5. Before you open a PR

- [ ] `west build` passes for your target board **and** `native_sim`.
- [ ] New behavior has a test under the firmware tree's `tests/`.
- [ ] No secrets, keys, or patient data in the diff — ever. See
      [SECURITY-STANDARDS.md](../SECURITY-STANDARDS.md).
- [ ] Docs touched? Keep markdownlint clean (`npx markdownlint-cli '**/*.md'`).
- [ ] Link the issue your change resolves (`Closes #N`); one issue per PR.

## 6. Getting help

- `docs/developer-guide/` — architecture and module map.
- `docs/HIPAA_AND_FDA_COMPLIANCE.md` — the clinical-grade bar every change
  is held to; read before touching data paths.
- Open an issue with the `question` label if the guide led you astray —
  onboarding friction is a bug, and we fix it here.
