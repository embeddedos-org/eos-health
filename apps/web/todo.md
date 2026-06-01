# EoS Health App — TODO

## Phase 1: Design System & Schema
- [x] Global CSS design tokens (dark luxury theme, color palette, typography)
- [x] Google Fonts: Inter + Space Grotesk loaded in index.html
- [x] Database schema: devices, health_readings, ecg_sessions, breath_tests, tens_sessions, semg_gestures, vault_files, firmware_versions
- [x] Drizzle migration generated and applied

## Phase 2: Backend (tRPC Routers)
- [x] devices router: pair, list, update, delete, getLatestFirmware
- [x] healthData router: create reading, list readings, getLiveData mock
- [x] ecg router: start session, save recording, list sessions, getMockWaveform
- [x] breathTest router: submit result, list results
- [x] tens router: save session config, list sessions (getHistory, saveSession)
- [x] semg router: save gesture, list gestures, update gesture, delete gesture
- [x] vault router: list files, add file, delete file
- [x] firmware router: get latest version per device type

## Phase 3: App Shell
- [x] Landing / Home page (marketing, device selector, CTA)
- [x] App layout with sidebar navigation (dark luxury)
- [x] Device Pairing Hub (BLE / USB-C / Wi-Fi tabs, device cards)
- [x] Route wiring in App.tsx (all 10 screens)

## Phase 4: Dashboard, ECG, Breath Test
- [x] Live Health Dashboard (HR, SpO2, BAC, steps, sleep — animated charts)
- [x] ECG Viewer (scrolling waveform, anomaly markers)
- [x] Breath Test Flow (step-by-step UI + result history)

## Phase 5: TENS, sEMG, Data Vault
- [x] TENS Control Panel (pulse width, frequency, amplitude sliders + session timer) [HEALTH-BAND Neuro only]
- [x] sEMG Gesture Trainer (record, label, train classifier UI) [HEALTH-BAND Neuro only]
- [x] 64GB Data Vault / File Browser

## Phase 6: Info & Settings
- [x] Patent & Product Info — HEALTH-KEY ULTRA page
- [x] Patent & Product Info — HEALTH-BAND Neuro page
- [x] Settings & Firmware Update screen

## Phase 7: Polish & Tests
- [x] Smooth page transitions (animate-fade-up utility)
- [x] Empty states for all data-driven screens
- [x] Loading skeletons (animate-shimmer utility)
- [x] Vitest unit tests: auth.logout, auth.me, ecg.getMockWaveform, healthData.getLiveData (6 tests passing)
- [x] TypeScript: zero errors
- [x] Final checkpoint

## Phase 8: Live Device Simulation
- [x] WebSocket server endpoint for live health data stream (/api/ws/simulate)
- [x] Simulated BLE device state: HR, SpO2, BAC, steps, battery, connection status
- [x] ECG waveform generator (realistic P-QRS-T morphology with occasional anomalies)
- [x] Dashboard live charts wired to WebSocket stream
- [x] ECG Viewer live waveform scrolling via WebSocket
- [x] Mobile-responsive layout polish for all screens
- [x] Simulated device connection flow (BLE scan → pair → stream)

## Phase 9: Simulation Gaps & Mobile Polish
- [x] Mobile-responsive polish: Home, BreathTest, TENSControl, GestureTrainer, DataVault, ProductInfo, Settings
- [x] BLE pair → auto-connect → sim.setDevice binding in Devices.tsx

## Phase 10: Multi-Platform Apps
- [x] React Native mobile app scaffold (Expo, TypeScript, navigation)
- [x] Mobile: Home/Landing, Device Pairing, Dashboard screens
- [x] Mobile: ECG Viewer, Breath Test, TENS Control screens
- [x] Mobile: sEMG Gesture Trainer, Data Vault, Product Info screens
- [x] Mobile: Settings & Firmware Update screen
- [x] Mobile: shared API client pointing to EoS backend
- [x] Electron desktop app scaffold (main process, tray, window chrome)
- [x] Desktop: all screens mirrored from web app
- [x] Desktop: native menu bar, system tray, auto-updater stub
- [x] Web app: PWA manifest, mobile viewport meta, service worker stub
- [x] Git push all three apps to HealthKey-Ulta and HEALTH-BAND-Neuro repos

## Phase 11: World-Class UI Redesign (All Platforms)

### Web App
- [x] Premium design system v2: OKLCH colors, Clash Display, glassmorphism, ambient orbs
- [x] Landing page v2: cinematic hero, competitor comparison section, animated bento grid
- [x] Dashboard v2: recovery ring, live ECG strip, sleep arc, animated metric cards
- [x] ECG Viewer v2: full-width scrolling waveform, anomaly timeline, export controls
- [x] Breath Test v2: animated breath guide circle, live BAC gauge, result history table
- [x] TENS Control v2: radial frequency dial, waveform preview, session timer ring
- [x] sEMG Gesture Trainer v2: live signal canvas, gesture library grid, training progress
- [x] Data Vault v2: storage donut, file type grid, file browser with preview
- [x] Product Info v2: cinematic device hero, spec comparison vs competitors, patent timeline
- [x] Settings v2: OTA progress ring, connection status cards, preference toggles
- [x] Competitor comparison page: EoS vs Whoop vs Oura vs Fitbit vs Apple Health

### Mobile App (React Native)
- [x] Premium mobile design system: dark luxury tokens, custom fonts, shared components
- [x] All 10 mobile screens redesigned with world-class premium UI

### Desktop App (Electron)
- [x] Premium desktop design system: sidebar, window chrome, all screens

### Both GitHub Repos
- [x] Push all three redesigned apps to HealthKey-Ulta and HEALTH-BAND-Neuro
