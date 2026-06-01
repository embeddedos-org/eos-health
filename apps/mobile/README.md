# Single Health Hub — Mobile App

The **Single Health Hub** is a cross-platform React Native (Expo) application that connects to all four EoS Health devices simultaneously over BLE 5.3. It serves as the central intelligence layer for the entire EoS Health ecosystem.

---

## Supported Devices

| Device | Connection | Auto-detected |
|---|---|---|
| HEALTH-KEY ULTRA | BLE 5.3 + USB-C (wired) | ✅ |
| HEALTH-BAND Neuro | BLE 5.3 | ✅ |
| Smart Ring Pro | BLE 5.3 | ✅ |
| Smart Patch Pro | BLE 5.3 | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 51+) |
| Language | TypeScript |
| BLE | `react-native-ble-plx` |
| State | Zustand + React Query |
| Charts | Victory Native XL |
| Navigation | Expo Router (file-based) |
| Backend sync | tRPC + EoS Health web app |
| Local storage | SQLite (expo-sqlite) |
| Auth | Manus OAuth (same as web app) |

---

## Key Features

- **Multi-device dashboard** — all 4 devices on one screen, live BLE data
- **Digital Twin** — AI-generated health score combining all sensor streams
- **ECG viewer** — real-time 12-lead equivalent ECG with arrhythmia alerts
- **SpO₂ continuous** — 24-hour oxygen saturation trend
- **BAC breath analysis** — real-time blood alcohol from HEALTH-KEY ULTRA or HEALTH-BAND Neuro
- **Gesture control** — configure HEALTH-BAND Neuro gestures to control TV, phone, smart home
- **TENS therapy** — start/stop TENS sessions with protocol selection from the app
- **Sleep stages** — Smart Ring Pro HRV + movement → REM/NREM/Deep/Awake
- **CGM glucose** — Smart Patch Pro continuous glucose monitoring
- **AI food camera** — photograph meals for automatic nutrition tracking
- **Deficiency alerts** — AI-generated alerts when biomarkers fall outside optimal ranges
- **Doctor dashboard** — shareable PDF report of all health data
- **Offline-first** — all data stored locally in SQLite, synced to backend when online

---

## BLE GATT Profile

All four devices share the same base service UUID namespace:

```
EoS Health Base UUID: 0000XXXX-EOS1-2026-BLE5-HEALTHBAND00
```

| Service | UUID | Characteristics |
|---|---|---|
| Health Monitoring | `0000AA01-...` | HR, SpO₂, ECG, temp, UV |
| Breath Analysis | `0000AA02-...` | BAC, VOC, humidity |
| Neuromuscular | `0000AA03-...` | sEMG raw, gesture class, TENS control |
| IMU | `0000AA04-...` | Accel, gyro, step count |
| Device Info | `0000180A-...` | Firmware version, battery, device name |

---

## Getting Started

```bash
# Install dependencies
cd apps/mobile
npm install

# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Build production APK
eas build --platform android --profile production

# Build production IPA
eas build --platform ios --profile production
```

---

## Environment Variables

```env
EXPO_PUBLIC_API_URL=https://eos-health-app.manus.space
EXPO_PUBLIC_APP_ID=<manus-oauth-app-id>
```

---

## Folder Structure

```
apps/mobile/
├── src/
│   ├── app/                    ← Expo Router pages
│   │   ├── (tabs)/             ← Bottom tab navigation
│   │   │   ├── dashboard.tsx   ← Multi-device live dashboard
│   │   │   ├── history.tsx     ← 7/30/90-day trend charts
│   │   │   ├── devices.tsx     ← BLE device management
│   │   │   ├── therapy.tsx     ← TENS + gesture control
│   │   │   └── profile.tsx     ← User settings + doctor share
│   │   └── _layout.tsx
│   ├── components/             ← Reusable UI components
│   │   ├── DeviceCard.tsx      ← Per-device live data card
│   │   ├── ECGViewer.tsx       ← Real-time ECG chart
│   │   ├── GestureConfig.tsx   ← Gesture-to-action mapping
│   │   └── TENSControl.tsx     ← TENS session controller
│   ├── hooks/
│   │   ├── useBLE.ts           ← BLE scanning + connection
│   │   ├── useHealthData.ts    ← Sensor data aggregation
│   │   └── useGesture.ts       ← Gesture recognition hook
│   ├── services/
│   │   ├── ble/                ← BLE GATT service handlers
│   │   ├── storage/            ← SQLite local storage
│   │   └── sync/               ← Backend sync service
│   └── store/                  ← Zustand state stores
├── android/                    ← Android native config
├── ios/                        ← iOS native config
└── docs/                       ← Architecture + UI design docs
```

---

## Platform Support

| Platform | Status |
|---|---|
| Android 10+ | ✅ Supported |
| iOS 15+ | ✅ Supported |
| Web (PWA) | ✅ Via `apps/web/` |
| Desktop | 🔄 Planned (Electron) |
