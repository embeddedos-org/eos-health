# EoS Health — Documentation

This directory contains cross-cutting documentation for the entire EoS Health ecosystem.

---

## Contents

| Directory | Description |
|---|---|
| `api/` | REST and tRPC API reference for the EoS Health web app |
| `developer-guide/` | Getting started guide for firmware, hardware, and app development |
| `user-guide/` | End-user documentation for all four devices and the mobile app |
| `architecture/` | System architecture diagrams and design decisions |

---

## Quick Links

| Document | Location |
|---|---|
| Unified README | [/README.md](../README.md) |
| HEALTH-KEY ULTRA | [/devices/health-key-ultra/README.md](../devices/health-key-ultra/README.md) |
| HEALTH-BAND Neuro | [/devices/health-band-neuro/README.md](../devices/health-band-neuro/README.md) |
| Smart Ring Pro | [/devices/smart-ring-pro/README.md](../devices/smart-ring-pro/README.md) |
| Smart Patch Pro | [/devices/smart-patch-pro/README.md](../devices/smart-patch-pro/README.md) |
| Mobile App | [/apps/mobile/README.md](../apps/mobile/README.md) |
| Ecosystem Roadmap | [/roadmap/README.md](../roadmap/README.md) |
| Patent Portfolio | [/patent/](../patent/) |
| EB-1A Portfolio | [/eb1a/README.md](../eb1a/README.md) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     EoS Health Ecosystem                        │
├─────────────┬──────────────┬──────────────┬────────────────────┤
│ HEALTH-KEY  │ HEALTH-BAND  │ Smart Ring   │ Smart Patch        │
│ ULTRA       │ Neuro        │ Pro          │ Pro                │
│ (nRF52840)  │ (nRF52840)   │ (nRF52840)   │ (nRF52840)         │
├─────────────┴──────────────┴──────────────┴────────────────────┤
│              BLE 5.3 / USB-C Transport Layer                    │
├─────────────────────────────────────────────────────────────────┤
│              Single Health Hub Mobile App                       │
│              (React Native + Expo + react-native-ble-plx)       │
├─────────────────────────────────────────────────────────────────┤
│              EoS Health Web App                                 │
│              (React 19 + tRPC 11 + Express 4 + MySQL)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Contributing

All contributions must follow the EoS Foundation coding standards. See `developer-guide/` for setup instructions.

**Author:** Srikanth Patchava, Embedded Operating Systems Research Foundation
