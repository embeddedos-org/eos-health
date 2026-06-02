# EoS Health Hub — Mobile App BLE Pairing Flow
**Version:** 1.0 | **Platform:** iOS 16+ / Android 10+ | **Framework:** React Native 0.74

---

## Overview

The Health Hub app supports all 4 EoS Health devices through a unified pairing flow. Each device has a device-specific onboarding experience after the common BLE pairing steps. The entire first-time setup takes under 90 seconds.

---

## Screen Flow Diagram

```
App Launch
    │
    ▼
[S1] Welcome / Splash
    │
    ▼
[S2] Sign In / Create Account  ←── OAuth (Apple/Google/Email)
    │
    ▼
[S3] Add Your First Device
    │
    ├──► [S4a] Device Selector  (which device do you have?)
    │         │
    │         ├── HEALTH-KEY ULTRA ──► [S5a] KEY ULTRA Setup
    │         ├── HEALTH-BAND Neuro ──► [S5b] BAND Neuro Setup
    │         ├── HEALTH-RING ──────► [S5c] RING Setup
    │         └── HEALTH-LAB ───────► [S5d] LAB Setup
    │
    ▼
[S6] Bluetooth Permission Request
    │
    ▼
[S7] Scanning for Device
    │
    ▼
[S8] Device Found — Tap to Pair
    │
    ▼
[S9] Pairing Confirmation (6-digit PIN)
    │
    ▼
[S10] Firmware Version Check
    │
    ├── Up to date ──────────────────► [S12] Health Profile Setup
    └── Update available ──► [S11] OTA Update Progress ──► [S12]
    │
    ▼
[S12] Health Profile (age, height, weight, sex, conditions)
    │
    ▼
[S13] Wear Position Guide (device-specific)
    │
    ▼
[S14] First Reading — Live Calibration
    │
    ▼
[S15] Dashboard — Home Screen
```

---

## Screen Specifications

### S1 — Welcome / Splash Screen

**Duration:** 2 seconds auto-advance

**Content:**
- EoS Health logo (animated pulse line)
- Tagline: "Your health. Understood."
- Background: Deep navy (#0A0F1E) with subtle particle animation

**Code reference:** `client/src/screens/SplashScreen.tsx`

---

### S2 — Sign In / Create Account

**Layout:** Full-screen with bottom sheet options

**Elements:**
- "Continue with Apple" (iOS only, white pill button)
- "Continue with Google" (white pill button)
- "Continue with Email" (outline pill button)
- "I already have an account" link
- Privacy policy and Terms of Service links

**Auth flow:** OAuth2 via EoS Health API (`POST /v1/auth/oauth`)

**Error states:**
- Network unavailable → "Check your connection and try again"
- Auth failed → "Sign in failed. Please try again."

---

### S3 — Add Your First Device

**Layout:** Full-screen with large illustration

**Content:**
- Illustration: All 4 devices floating in orbit
- Heading: "Let's set up your device"
- Body: "Open the box and make sure your device is charged."
- CTA: "Choose my device →"

---

### S4a — Device Selector

**Layout:** 2×2 grid of device cards

**Each card contains:**
- Device illustration (isometric render)
- Device name
- Tagline (e.g., "The ring that knows everything")
- "Select" button

| Device | Tagline |
|---|---|
| HEALTH-KEY ULTRA | "Plug in. Know everything." |
| HEALTH-BAND Neuro | "Feel your nervous system." |
| HEALTH-RING | "Wear your health data." |
| HEALTH-LAB | "Your skin is a laboratory." |

---

### S5a — HEALTH-KEY ULTRA Setup Instructions

**Steps shown:**
1. "Remove the cap and plug into your phone's USB-C port"
2. "The LED will pulse blue — that means it's ready"
3. "Tap Continue when you see the blue pulse"

**Illustration:** Animated USB-C insertion into phone

---

### S5b — HEALTH-BAND Neuro Setup Instructions

**Steps shown:**
1. "Wrap the band around your wrist — sensor side down"
2. "Press the side button for 3 seconds until the LED pulses"
3. "Keep your wrist still during pairing"

**Illustration:** Animated wrist wrap with LED pulse

---

### S5c — HEALTH-RING Setup Instructions

**Steps shown:**
1. "Place the ring on your index or middle finger"
2. "The flat sensor side should face your palm"
3. "Hold your hand still — the ring will wake up automatically"

**Illustration:** Animated finger ring placement with correct orientation

**Ring size guide link:** Opens bottom sheet with ring size chart

---

### S5d — HEALTH-LAB Setup Instructions

**Steps shown:**
1. "Clean the inside of your upper arm with the alcohol wipe"
2. "Peel the backing and press firmly for 30 seconds"
3. "The patch will warm up and begin calibrating"

**Illustration:** Animated patch application sequence

**Skin prep reminder:** "Avoid applying over hair, scars, or tattoos"

---

### S6 — Bluetooth Permission Request

**iOS:** System permission dialog (cannot be customized)
- Pre-dialog: Custom screen explaining why BLE is needed
- "EoS Health needs Bluetooth to connect to your device"
- "Allow" / "Don't Allow"

**Android:** Runtime permission request
- `BLUETOOTH_SCAN` + `BLUETOOTH_CONNECT` (Android 12+)
- `ACCESS_FINE_LOCATION` (Android 10–11)

**If denied:**
- Show "Bluetooth Required" screen
- Deep link to Settings → Privacy → Bluetooth
- "Open Settings" button

---

### S7 — Scanning for Device

**Layout:** Full-screen with animated radar/pulse

**Content:**
- Animated concentric circles (scanning animation)
- "Looking for your [DEVICE NAME]..."
- "Make sure your device is powered on and nearby"
- Timeout after 30 seconds → show "Device not found" state

**BLE scan parameters:**
```typescript
BleManager.scan(
  [EOS_SERVICE_UUID],     // Filter by EoS Health service UUID
  30,                      // 30 second timeout
  true,                    // Allow duplicates (for RSSI updates)
  { scanMode: ScanMode.LowLatency }
)
```

**"Device not found" state:**
- Troubleshooting tips (device charged? in range? powered on?)
- "Try again" button
- "Contact support" link

---

### S8 — Device Found — Tap to Pair

**Layout:** Card slides up from bottom

**Card content:**
- Device illustration
- Device name: "EoS RING 000001"
- Signal strength indicator (RSSI bars)
- BLE MAC address (last 4 digits): "...00:01"
- "Connect" button (primary)
- "Not my device" link (if multiple devices found, shows list)

**Multiple devices found:** Shows scrollable list of nearby EoS devices sorted by signal strength

---

### S9 — Pairing Confirmation (6-Digit PIN)

**Purpose:** Prevents accidental pairing with wrong device

**Layout:** PIN entry with numeric keypad

**Content:**
- "Check your device's display for the 6-digit code"
- For HEALTH-KEY ULTRA: "The code appears on your phone screen after plugging in"
- For HEALTH-RING/LAB (no display): "The code is printed on the box label: [QR scan option]"
- 6 large digit input boxes
- Auto-advance on 6th digit entry

**PIN generation:** Derived from device serial number (last 6 digits of SHA-256 hash)

**Error state:**
- Wrong PIN → "Incorrect code. [2 attempts remaining]"
- 3 wrong attempts → 30-second lockout with countdown

---

### S10 — Firmware Version Check

**Automatic, no user action required**

**Background process:**
1. Read firmware version from GATT characteristic `0x2A28`
2. Query EoS Health API: `GET /v1/devices/{id}/firmware/latest`
3. Compare versions

**If up to date:** Auto-advance to S12 after 1 second
**If update available:** Show S11

---

### S11 — OTA Firmware Update

**Layout:** Progress screen with device illustration

**Content:**
- "Updating your [DEVICE NAME]"
- "This takes about 2 minutes. Keep your device nearby."
- Progress bar (0–100%)
- "Do not close the app or move away from your device"

**Progress stages:**
```
0–5%    Preparing update package
5–85%   Transferring firmware (BLE, ~15 KB/s)
85–95%  Verifying signature (Ed25519)
95–99%  Device applying update
99–100% Reconnecting...
```

**Error states:**
- BLE disconnected mid-update → "Update interrupted. Your device is safe. Tap to retry."
- Signature invalid → "Update failed: security check. Contact support."
- Battery too low → "Charge your device to at least 20% before updating."

---

### S12 — Health Profile Setup

**Layout:** Multi-step form (4 steps, progress indicator)

**Step 1 — Basic Info:**
- Date of birth (date picker)
- Biological sex (Male / Female / Prefer not to say)
- Height (ft/in or cm toggle)
- Weight (lbs or kg toggle)

**Step 2 — Health Conditions (optional):**
- Checkboxes: Diabetes (Type 1 / Type 2), Hypertension, AFib, Sleep apnea, Asthma, None
- "This helps personalize your alerts and insights"

**Step 3 — Goals:**
- Primary goal selector: Sleep optimization / Fitness / Stress management / General health / Medical monitoring
- Activity level: Sedentary / Lightly active / Moderately active / Very active / Athlete

**Step 4 — Notifications:**
- AFib alert: ON (default)
- Low SpO₂ alert (<94%): ON (default)
- Low glucose alert (<70 mg/dL): ON (HEALTH-LAB only)
- Daily summary: ON (default, 8:00 AM)
- Weekly report: ON (default, Sunday)

---

### S13 — Wear Position Guide (Device-Specific)

**HEALTH-KEY ULTRA:**
- "For best results, keep plugged in for at least 60 seconds per reading"
- Illustration: Phone with KEY ULTRA plugged in, user sitting still

**HEALTH-BAND Neuro:**
- "Wear 2 finger-widths above your wrist bone"
- "Snug but not tight — you should fit one finger underneath"
- Illustration: Correct vs incorrect placement

**HEALTH-RING:**
- "Non-dominant hand, index or middle finger"
- "Sensor side faces palm (toward your heart)"
- Ring size guide: "Tap to check your fit"
- Illustration: Correct orientation with sensor highlighted

**HEALTH-LAB:**
- "Upper arm, 3 inches below shoulder"
- "Avoid the inner elbow and any bony areas"
- Illustration: Correct placement zones on body diagram

---

### S14 — First Reading — Live Calibration

**Duration:** 60–90 seconds

**Layout:** Animated vitals display

**Content:**
- Live waveform (ECG or PPG depending on device)
- "Hold still while we take your first readings..."
- Metrics appearing one by one as they stabilize:
  - Heart rate ✓
  - SpO₂ ✓
  - Skin temperature ✓
  - HRV ✓

**Completion:**
- All metrics shown with green checkmarks
- "Your baseline is set!"
- Confetti animation
- "Go to Dashboard →" button

---

### S15 — Dashboard (Home Screen)

**Layout:** Scrollable dashboard with sticky header

**Header:**
- User avatar + "Good morning, [Name]"
- Device battery indicator
- Notification bell

**Primary card — Recovery Score:**
- Large circular score (0–100)
- Color: Red (<33) / Yellow (33–66) / Green (>66)
- "Ready to perform" / "Moderate readiness" / "Rest today"

**Metric cards (2-column grid):**
- Heart Rate (last reading + 24h trend)
- SpO₂ (last reading + overnight low)
- HRV (RMSSD + trend arrow)
- Sleep Score (last night)
- Skin Temperature (deviation from baseline)
- Stress Level (EDA-derived, HEALTH-BAND only)

**Bottom navigation:**
- Home (dashboard)
- Trends (charts)
- Devices (manage devices)
- Profile (settings)

---

## Adding a Second Device

From the Devices tab:
1. Tap "+" → Device Selector (S4a)
2. Complete device-specific setup (S5a–S5d)
3. BLE scan (S7) — existing paired devices are excluded from scan
4. Complete pairing (S8–S9)
5. Device appears in Devices tab with its own metrics card

**Maximum devices:** 4 (one of each type)

---

## Error Recovery Flows

| Scenario | Screen | Recovery Action |
|---|---|---|
| BLE off | S6 | Deep link to Settings → Bluetooth |
| Device not found (30s) | S7 | Troubleshooting tips + retry |
| Wrong PIN (3 attempts) | S9 | 30s lockout, then retry |
| OTA interrupted | S11 | Safe retry (MCUboot dual-bank) |
| Device offline (>7 days) | Dashboard | "Reconnect" banner |
| Sensor error | Dashboard | "Sensor issue" card with support link |
| Low battery (<10%) | Dashboard | Persistent banner with charging instructions |

---

## Accessibility

- VoiceOver/TalkBack: All interactive elements have `accessibilityLabel`
- Dynamic Type: All text scales with system font size (iOS) / font scale (Android)
- High contrast: All metric colors have >4.5:1 contrast ratio
- Reduced motion: Animations disabled when `prefers-reduced-motion` is set
- Color blind safe: Never use color alone to convey status — always paired with icon or text

---

## React Native Implementation Notes

```typescript
// BLE pairing hook — wraps react-native-ble-plx
import { useBLEPairing } from '@/hooks/useBLEPairing';

const { scan, connect, pair, status } = useBLEPairing({
  serviceUUID: EOS_SERVICE_UUID,
  timeout: 30000,
  onDeviceFound: (device) => setFoundDevice(device),
  onPaired: (device) => navigation.navigate('FirmwareCheck', { device }),
  onError: (error) => setError(error),
});

// Start scanning when screen mounts
useEffect(() => {
  scan();
  return () => scan.stop();
}, []);
```

**Key libraries:**
- `react-native-ble-plx` — BLE scanning and GATT communication
- `react-native-keychain` — Secure storage for device credentials
- `@react-native-async-storage/async-storage` — Pairing state persistence
- `react-native-permissions` — Runtime permission handling
