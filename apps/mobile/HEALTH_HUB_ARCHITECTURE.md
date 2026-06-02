# EoS Health Hub — Mobile App Architecture

**Version:** 1.0 | **Platform:** React Native 0.74 (iOS 16+ / Android 13+)
**Stack:** React Native + TypeScript + react-native-ble-plx + SQLCipher + TanStack Query

The Health Hub is the single companion app for all four EoS Health devices. It is designed to be better than every competitor app — Oura, Whoop, Apple Health, Garmin Connect, and Samsung Health — in data depth, UI quality, and privacy.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Health Hub App                              │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Presentation   │   Business Logic  │      Data Layer           │
│                  │                   │                           │
│  React Native    │  Health Engine    │  SQLCipher (local PHI)    │
│  Screens/UI      │  (algorithms)     │  React Query (cache)      │
│  Reanimated 3    │  Alert System     │  BLE Manager              │
│  Skia (charts)   │  Recovery Score   │  EoS API Client           │
│                  │  Insights AI      │  Secure Storage           │
└──────────────────┴──────────────────┴───────────────────────────┘
         ↕ BLE 5.0 (2M PHY, MTU=247)        ↕ TLS 1.3
┌──────────────────────────────┐  ┌──────────────────────────────┐
│     EoS Health Devices       │  │     EoS Health Backend        │
│  HEALTH-KEY ULTRA            │  │  Node.js + tRPC               │
│  HEALTH-BAND Neuro           │  │  PostgreSQL (PHI encrypted)   │
│  HEALTH-RING                 │  │  AWS S3 (waveform storage)    │
│  HEALTH-LAB                  │  │  AWS KMS (key management)     │
└──────────────────────────────┘  └──────────────────────────────┘
```

---

## Screen Architecture

### Tab Navigation

```
Home (Dashboard)
├── Today's Health Score (0–100, animated ring)
├── Recovery Score (Whoop-style, color-coded)
├── Live Metrics (HR, SpO₂, HRV, Temp)
├── Active Alerts (AFib, low SpO₂, glucose)
└── Quick Actions (Start workout, TENS session, ECG recording)

Vitals
├── ECG Live View (512Hz real-time waveform, Skia canvas)
├── Heart Rate + HRV (24h trend, 7-day chart)
├── SpO₂ (24h trend, sleep dips highlighted)
├── Blood Pressure (PTT-based, trend + calibration)
├── Respiratory Rate (trend)
└── Body Temperature (core temp, circadian overlay)

Sleep
├── Sleep Stages (REM/Deep/Light/Awake, Hypnogram)
├── Sleep Score (0–100, breakdown)
├── HRV During Sleep (RMSSD trend)
├── Respiratory Rate During Sleep
├── Temperature During Sleep
└── Sleep Debt Tracker (7-day rolling)

Activity
├── Daily Steps + Distance
├── Active Calories
├── VO2max Trend
├── Workout Detection (auto + manual)
├── Strain Score (0–21, Whoop-style)
└── Recovery vs Strain Balance

Lab (HEALTH-LAB only)
├── Glucose Real-Time (mg/dL, trend line, target range)
├── Glucose 24h Chart (meals, exercise overlay)
├── Glucose Alerts (high/low thresholds)
├── Lactate (exercise intensity marker)
├── Cortisol Proxy (stress biomarker)
├── Electrolytes (Na⁺, K⁺)
└── pH Level

Neural (HEALTH-BAND Neuro only)
├── sEMG Live View (8-channel, waterfall display)
├── Muscle Activation Map (body diagram)
├── Muscle Fatigue Score
├── Tremor Detection (Parkinson's / Essential)
├── Nerve Conduction Velocity
├── TENS Therapy (mode, intensity, duration, timer)
└── EDA / Stress (real-time + trend)

Insights
├── AI Health Coach (LLM-powered, personalized)
├── Weekly Health Report (PDF export)
├── Trends & Patterns (anomaly detection)
├── Menstrual Cycle Tracking (female users)
├── Medication Reminders
└── Share with Doctor (HIPAA-compliant export)

Devices
├── Connected Devices (all paired EoS devices)
├── Device Status (battery, firmware version, signal)
├── Firmware OTA Update
├── Calibration Wizard (BP, HbA1c, Glucose)
└── Device Settings (notifications, sampling rate)

Profile
├── Personal Info (age, sex, weight, height)
├── Health Goals
├── Notification Settings
├── Privacy & Data (export, delete, HIPAA rights)
├── Subscription (EoS Health+)
└── Account Settings
```

---

## BLE GATT Profiles — All 4 Devices

### Service UUIDs

```typescript
export const EOS_SERVICES = {
  HEALTH_DATA:    '12345678-0001-0000-0000-EOS000000000',
  FACTORY_TEST:   '12345678-0002-0000-0000-EOS000000000',
  SENSOR_DATA:    '12345678-0003-0000-0000-EOS000000000',
  PROVISIONING:   '12345678-0004-0000-0000-EOS000000000',
  DEVICE_INFO:    '12345678-0005-0000-0000-EOS000000000',
  OTA:            '12345678-0006-0000-0000-EOS000000000',
  NEURAL:         '12345678-0010-0000-0000-EOS000000000', // HEALTH-BAND Neuro only
  BIOSENSOR:      '12345678-0011-0000-0000-EOS000000000', // HEALTH-LAB only
} as const;

export const EOS_CHARACTERISTICS = {
  // Health Data Service
  ECG_STREAM:       '12345678-0001-0001-0000-EOS000000000', // Notify, 512Hz, 16-bit
  PPG_STREAM:       '12345678-0001-0002-0000-EOS000000000', // Notify, 100Hz, 32-bit
  HEALTH_RESULT:    '12345678-0001-0003-0000-EOS000000000', // Notify, 30s, struct
  ALERT:            '12345678-0001-0004-0000-EOS000000000', // Notify, on-event
  BATTERY:          '12345678-0001-0005-0000-EOS000000000', // Read/Notify, uint8 %
  
  // OTA Service
  OTA_CONTROL:      '12345678-0006-0001-0000-EOS000000000', // Write
  OTA_DATA:         '12345678-0006-0002-0000-EOS000000000', // Write Without Response
  OTA_STATUS:       '12345678-0006-0003-0000-EOS000000000', // Notify
  
  // Neural Service (HEALTH-BAND Neuro)
  SEMG_STREAM:      '12345678-0010-0001-0000-EOS000000000', // Notify, 2000Hz, 8ch
  EDA_RESULT:       '12345678-0010-0002-0000-EOS000000000', // Notify, 8Hz
  TENS_COMMAND:     '12345678-0010-0003-0000-EOS000000000', // Write
  TENS_STATUS:      '12345678-0010-0004-0000-EOS000000000', // Notify
  
  // Biosensor Service (HEALTH-LAB)
  GLUCOSE_RESULT:   '12345678-0011-0001-0000-EOS000000000', // Notify, 5min
  ANALYTE_RESULT:   '12345678-0011-0002-0000-EOS000000000', // Notify, 5min, all analytes
  PATCH_STATUS:     '12345678-0011-0003-0000-EOS000000000', // Notify, patch lifetime
} as const;
```

### BLE Manager (React Native)

```typescript
// apps/mobile/src/ble/EosBleManager.ts
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export class EosBleManager {
  private manager: BleManager;
  private connectedDevices: Map<string, Device> = new Map();

  constructor() {
    this.manager = new BleManager({
      restoreStateIdentifier: 'EosHealthBLE',
      restoreStateFunction: this.handleStateRestore,
    });
  }

  async scanAndConnect(deviceType: EosDeviceType): Promise<Device> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.manager.stopDeviceScan();
        reject(new Error('Scan timeout — no device found'));
      }, 30000);

      this.manager.startDeviceScan(
        [EOS_SERVICES.HEALTH_DATA],
        { allowDuplicates: false, scanMode: 2 }, // High power scan
        (error, device) => {
          if (error) { clearTimeout(timeout); reject(error); return; }
          if (!device) return;

          // Match device type from advertisement name
          if (this.isMatchingDevice(device, deviceType)) {
            clearTimeout(timeout);
            this.manager.stopDeviceScan();
            this.connectDevice(device).then(resolve).catch(reject);
          }
        }
      );
    });
  }

  async connectDevice(device: Device): Promise<Device> {
    const connected = await device.connect({
      requestMTU: 247,
      autoConnect: false,
    });
    await connected.discoverAllServicesAndCharacteristics();
    
    // Request 2M PHY for higher throughput
    await connected.requestConnectionPriority('high');
    
    this.connectedDevices.set(device.id, connected);
    this.setupDisconnectHandler(connected);
    return connected;
  }

  // Stream ECG at 512Hz — 16-bit samples, 50 samples per packet
  subscribeEcg(deviceId: string, callback: (samples: Int16Array) => void) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    device.monitorCharacteristicForService(
      EOS_SERVICES.HEALTH_DATA,
      EOS_CHARACTERISTICS.ECG_STREAM,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;
        const bytes = Buffer.from(characteristic.value, 'base64');
        const samples = new Int16Array(bytes.buffer);
        callback(samples);
      }
    );
  }

  // Stream sEMG at 2000Hz — 8 channels × 50 samples per packet
  subscribeSemg(deviceId: string, callback: (samples: Int32Array[][]) => void) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    device.monitorCharacteristicForService(
      EOS_SERVICES.NEURAL,
      EOS_CHARACTERISTICS.SEMG_STREAM,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;
        const bytes = Buffer.from(characteristic.value, 'base64');
        // 8 channels × 50 samples × 4 bytes = 1600 bytes per packet
        const channels: Int32Array[] = [];
        for (let ch = 0; ch < 8; ch++) {
          channels.push(new Int32Array(bytes.buffer, ch * 200, 50));
        }
        callback(channels);
      }
    );
  }

  // Send TENS command
  async sendTensCommand(deviceId: string, cmd: TensCommand): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    const payload = Buffer.alloc(8);
    payload.writeUInt8(cmd.mode, 0);
    payload.writeUInt8(cmd.frequency_hz, 1);
    payload.writeUInt8(cmd.intensity_ma, 2);
    payload.writeUInt16LE(cmd.duration_s, 3);
    payload.writeUInt8(0, 5); // reserved
    payload.writeUInt16LE(crc16(payload.slice(0, 5)), 6);

    await device.writeCharacteristicWithResponseForService(
      EOS_SERVICES.NEURAL,
      EOS_CHARACTERISTICS.TENS_COMMAND,
      payload.toString('base64')
    );
  }

  // OTA firmware update
  async startOtaUpdate(deviceId: string, firmwareBuffer: ArrayBuffer,
                        onProgress: (pct: number) => void): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) throw new Error('Device not connected');

    const CHUNK_SIZE = 244; // MTU 247 - 3 bytes ATT header
    const totalChunks = Math.ceil(firmwareBuffer.byteLength / CHUNK_SIZE);

    // Send OTA start command
    const startCmd = Buffer.alloc(9);
    startCmd.writeUInt8(0x01, 0); // OTA_CMD_START
    startCmd.writeUInt32LE(firmwareBuffer.byteLength, 1);
    startCmd.writeUInt32LE(crc32(firmwareBuffer), 5);
    await device.writeCharacteristicWithResponseForService(
      EOS_SERVICES.OTA, EOS_CHARACTERISTICS.OTA_CONTROL,
      startCmd.toString('base64')
    );

    // Send chunks
    for (let i = 0; i < totalChunks; i++) {
      const offset = i * CHUNK_SIZE;
      const chunk = firmwareBuffer.slice(offset, offset + CHUNK_SIZE);
      await device.writeCharacteristicWithoutResponseForService(
        EOS_SERVICES.OTA, EOS_CHARACTERISTICS.OTA_DATA,
        Buffer.from(chunk).toString('base64')
      );
      onProgress(Math.round((i + 1) / totalChunks * 100));
      // Small delay to avoid overwhelming the device
      if (i % 10 === 9) await sleep(10);
    }

    // Send OTA finish command
    const finishCmd = Buffer.from([0x03]); // OTA_CMD_FINISH
    await device.writeCharacteristicWithResponseForService(
      EOS_SERVICES.OTA, EOS_CHARACTERISTICS.OTA_CONTROL,
      finishCmd.toString('base64')
    );
  }

  private setupDisconnectHandler(device: Device) {
    device.onDisconnected((error, disconnectedDevice) => {
      console.log(`Device ${disconnectedDevice?.id} disconnected`);
      this.connectedDevices.delete(device.id);
      // Auto-reconnect after 3 seconds
      setTimeout(() => this.reconnect(device.id), 3000);
    });
  }

  private async reconnect(deviceId: string): Promise<void> {
    try {
      const device = await this.manager.connectToDevice(deviceId, {
        requestMTU: 247,
        autoConnect: true,
      });
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevices.set(deviceId, device);
      this.setupDisconnectHandler(device);
    } catch (e) {
      // Retry after 10 seconds
      setTimeout(() => this.reconnect(deviceId), 10000);
    }
  }
}
```

---

## HIPAA-Compliant Local Storage

```typescript
// apps/mobile/src/storage/SecureHealthStorage.ts
import SQLite from 'react-native-sqlite-storage';
import * as Keychain from 'react-native-keychain';
import { randomBytes } from 'react-native-crypto';

export class SecureHealthStorage {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    // Get or generate encryption key from Secure Enclave / Android Keystore
    let key = await Keychain.getGenericPassword({ service: 'eos-health-db-key' });
    if (!key) {
      const newKey = (await randomBytes(32)).toString('hex');
      await Keychain.setGenericPassword('eos-health', newKey, {
        service: 'eos-health-db-key',
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      key = { username: 'eos-health', password: newKey };
    }

    // Open SQLCipher-encrypted database
    this.db = await SQLite.openDatabase({
      name: 'eos-health.db',
      key: key.password, // AES-256 encryption key
      location: 'default',
    });

    await this.createTables();
  }

  private async createTables(): Promise<void> {
    await this.db!.executeSql(`
      CREATE TABLE IF NOT EXISTS health_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        timestamp_utc INTEGER NOT NULL,
        reading_type TEXT NOT NULL,
        value_json TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      )
    `);

    await this.db!.executeSql(`
      CREATE TABLE IF NOT EXISTS ecg_waveforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        start_timestamp_utc INTEGER NOT NULL,
        duration_s INTEGER NOT NULL,
        sample_rate INTEGER NOT NULL,
        samples_b64 TEXT NOT NULL,
        afib_flag INTEGER DEFAULT 0,
        synced INTEGER DEFAULT 0
      )
    `);

    await this.db!.executeSql(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp_utc INTEGER NOT NULL,
        action TEXT NOT NULL,
        data_type TEXT,
        user_id TEXT
      )
    `);
  }

  async saveHealthReading(reading: HealthReading): Promise<void> {
    await this.db!.executeSql(
      `INSERT INTO health_readings (device_id, timestamp_utc, reading_type, value_json)
       VALUES (?, ?, ?, ?)`,
      [reading.deviceId, reading.timestampUtc, reading.type, JSON.stringify(reading.value)]
    );
    await this.auditLog('write', reading.type);
  }

  async getReadings(type: string, startUtc: number, endUtc: number): Promise<HealthReading[]> {
    await this.auditLog('read', type);
    const [result] = await this.db!.executeSql(
      `SELECT * FROM health_readings WHERE reading_type = ? AND timestamp_utc BETWEEN ? AND ?
       ORDER BY timestamp_utc DESC`,
      [type, startUtc, endUtc]
    );
    return Array.from({ length: result.rows.length }, (_, i) => result.rows.item(i));
  }

  private async auditLog(action: string, dataType: string): Promise<void> {
    await this.db!.executeSql(
      `INSERT INTO audit_log (timestamp_utc, action, data_type) VALUES (?, ?, ?)`,
      [Date.now(), action, dataType]
    );
  }
}
```

---

## Competitive Feature Comparison

| Feature | Apple Watch Ultra 2 | Oura Ring 4 | Whoop 5.0 | Garmin Fenix 8 | **EoS HEALTH-RING** | **EoS HEALTH-BAND** |
|---|---|---|---|---|---|---|
| ECG | ✅ Single-lead | ❌ | ❌ | ❌ | ✅ Single-lead (ring) | ✅ Single-lead |
| AFib detection | ✅ FDA cleared | ❌ | ❌ | ❌ | ✅ (510k pending) | ✅ (510k pending) |
| SpO₂ | ✅ | ✅ | ✅ | ✅ | ✅ 5-wavelength | ✅ |
| HbA1c | ❌ | ❌ | ❌ | ❌ | **✅ 1300nm NIR** | ❌ |
| Cuffless BP | ❌ | ❌ | ❌ | ❌ | **✅ PTT-based** | ❌ |
| sEMG | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ 8-channel** |
| TENS therapy | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| EDA/Stress | ✅ | ❌ | ❌ | ❌ | ❌ | **✅** |
| HRV | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sleep staging | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| VO2max | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Recovery score | ❌ | ✅ | ✅ | ✅ | **✅ (multi-modal)** | **✅ (multi-modal)** |
| Menstrual cycle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Open source HW | ❌ | ❌ | ❌ | ❌ | **✅ CERN OHL** | **✅ CERN OHL** |
| Subscription | ❌ | $5.99/mo | $30/mo | ❌ | **❌ (free)** | **❌ (free)** |
| IP rating | IP6X | IP68 | IP68 | 10ATM | **IP68 (200m)** | IP68 |
| Battery | 36h | 7 days | 4–5 days | 16 days | **7 days** | **5 days** |
| Wireless charging | ✅ | ✅ | ✅ | ✅ | **✅ NFC** | ✅ |
| Open hardware | ❌ | ❌ | ❌ | ❌ | **✅** | **✅** |

| Feature | Oura Ring 4 | RingConn Gen 2 | Ultrahuman Ring | Samsung Galaxy Ring | **EoS HEALTH-RING** |
|---|---|---|---|---|---|
| ECG | ❌ | ❌ | ❌ | ❌ | **✅** |
| HbA1c | ❌ | ❌ | ❌ | ❌ | **✅** |
| Cuffless BP | ❌ | ❌ | ❌ | ❌ | **✅** |
| SpO₂ wavelengths | 2 | 2 | 2 | 2 | **5** |
| Subscription | $5.99/mo | ❌ | ❌ | ❌ | **❌** |
| IP rating | IP68 | IP68 | IP68 | IP68 | **IP68 (200m)** |
| Open source | ❌ | ❌ | ❌ | ❌ | **✅** |
| Thickness | 2.55mm | 2.6mm | 2.4mm | 2.6mm | **2.0mm (nano) / 2.8mm (ultra)** |

---

## App Design Language

The Health Hub app uses a dark-first design with a deep navy/black background, neon accent colors for health metrics (green for good, amber for caution, red for alert), and Skia-powered real-time charts for ECG and sEMG waveforms.

**Color Palette:**
- Background: `#0A0E1A` (deep navy)
- Surface: `#141926` (card background)
- Primary: `#00D4FF` (EoS cyan)
- Success: `#00E676` (health green)
- Warning: `#FFB300` (amber)
- Danger: `#FF3D57` (alert red)
- Text Primary: `#FFFFFF`
- Text Secondary: `#8892A4`

**Typography:** Inter (body), Space Grotesk (headings), JetBrains Mono (metrics/numbers)

**Animations:** Reanimated 3 with spring physics for all transitions. ECG waveform uses Skia canvas at 60fps. Health score ring uses SVG path animation.
