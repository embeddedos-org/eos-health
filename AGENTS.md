# Repository Guidance for Agents

## Scope and architecture

eos-health is a four-device wearable-health monorepo. Device-specific hardware,
firmware, patent, academic, and roadmap material lives under `devices/` for
HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, and HEALTH-LAB. Shared firmware
is under `firmware/`, applications under `apps/`, and cross-device clinical,
regulatory, verification, academic, legal, patent, and EB-1A material is kept in
the corresponding top-level directories.

Keep device boundaries and shared contracts explicit. A change to a sensor,
BLE service, measurement unit, calibration rule, firmware interface, or health
claim may require coordinated updates, but do not update unrelated devices by
analogy. Follow the specialist role briefs in [`.ai/`](./.ai/) and the handoff
protocol in [`HANDOFF.md`](./HANDOFF.md). The implementer must not act as the
approving reviewer.

## Validation

Use the nearest checked-in manifest and documentation for the affected surface.

- For `apps/web/`, its `package.json` defines `pnpm check`, `pnpm test`, and
  `pnpm build`.
- The root [`README.md`](./README.md) documents `npm install` plus
  `npx expo start` for `apps/mobile/`, and `pnpm install` plus `pnpm dev` for
  `apps/web/`.
- Firmware CMake trees are device-specific. Follow the nearest `CMakeLists.txt`
  and flashing guide, and record missing vendor SDKs, hardware, or source files
  rather than treating an unconfigured tree as passing.
- For simulations and verification scripts, preserve their inputs and units and
  compare results with the associated report or protocol. A simulation is not
  a substitute for bench, clinical, regulatory, or production validation.
- Documentation-only governance changes do not validate firmware, sensing
  accuracy, medical claims, safety, security, or regulatory compliance.

## Hardware, medical, and evidence discipline

Preserve component identifiers, units, electrode and sensor assumptions, BLE
characteristics, calibration data, power constraints, and BOM-to-schematic
traceability. Treat medical, diagnostic, clinical, patent, regulatory, and
submission-ready statements as evidence-backed claims. Do not broaden intended
use, supported metrics, filing status, or compliance status without authoritative
source evidence and appropriate review.

Do not commit patient or participant data, credentials, signing keys, generated
build output, downloaded SDKs, or private filing material. Use synthetic or
approved de-identified fixtures and follow [`SECURITY-STANDARDS.md`](./SECURITY-STANDARDS.md)
for security-sensitive changes.

Every human-authored pull request must use a GitHub-recognized closing keyword
for an issue in this repository, for example `Fixes #123`. Cross-repository
issues and plain issue mentions do not satisfy the linked-issue policy. Follow
[`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md), and
keep the published Wiki snapshot in [`docs/wiki/`](./docs/wiki/) synchronized
when Wiki content changes.
