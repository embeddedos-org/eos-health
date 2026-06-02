/** EoS Health TypeScript SDK — Type Definitions */

export interface DateRangeParams {
  startDate?: string;  // ISO date: "2026-06-01"
  endDate?: string;    // ISO date: "2026-06-07"
}

export type DeviceModel =
  | 'health-key-ultra'
  | 'health-band-neuro'
  | 'health-ring-base'
  | 'health-ring-ultra'
  | 'health-lab-base'
  | 'health-lab-ultra';

export interface Device {
  id: string;
  model: DeviceModel;
  serial: string;
  firmwareVersion: string;
  hardwareRevision: string;
  lastSync: string;
  connected: boolean;
}

export interface DeviceListResponse {
  devices: Device[];
}

export interface BatteryStatus {
  level: number;
  charging: boolean;
  estimatedDaysRemaining: number;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  devices: string[];
}

export interface HeartRateReading {
  timestamp: string;
  bpm: number;
  confidence: number;
  deviceId: string;
}

export interface HeartRateResponse {
  data: HeartRateReading[];
  nextToken?: string;
}

export interface HRVReading {
  timestamp: string;
  rmssd: number;
  sdnn: number;
  pnn50: number;
  lfHfRatio: number;
}

export interface HRVResponse {
  data: HRVReading[];
}

export interface SpO2Reading {
  timestamp: string;
  spo2: number;
  confidence: number;
  deviceId: string;
}

export interface SpO2Response {
  data: SpO2Reading[];
}

export interface ECGRecording {
  id: string;
  timestamp: string;
  durationSec: number;
  hr: number;
  hrvRmssd: number;
  afibDetected: boolean;
  afibConfidence: number;
  qrsDurationMs: number;
  qtIntervalMs: number;
  prIntervalMs: number;
  deviceId: string;
}

export interface ECGResponse {
  recordings: ECGRecording[];
}

export interface BloodPressureReading {
  timestamp: string;
  systolic: number;
  diastolic: number;
  map: number;
  confidence: number;
  deviceId: string;
}

export interface BloodPressureResponse {
  data: BloodPressureReading[];
}

export interface HbA1cReading {
  timestamp: string;
  hba1cPct: number;
  hba1cMmol: number;
  confidence: number;
  disclaimer: string;
}

export interface HbA1cResponse {
  data: HbA1cReading[];
}

export type GlucoseTrend = 'rising_fast' | 'rising' | 'stable' | 'falling' | 'falling_fast';
export type GlucoseAlert = 'none' | 'low' | 'high' | 'critical_low' | 'critical_high' | null;

export interface GlucoseReading {
  timestamp: string;
  glucoseMgdl: number;
  glucoseMmol: number;
  trend: GlucoseTrend;
  alert: GlucoseAlert;
}

export interface GlucoseResponse {
  data: GlucoseReading[];
}

export interface BiomarkerReading {
  timestamp: string;
  glucoseMgdl?: number;
  lactateMmol?: number;
  sodiumMmol?: number;
  ph?: number;
  cortisolNgml?: number;    // Ultra only
  potassiumMmol?: number;   // Ultra only
  uricAcidMmol?: number;    // Ultra only
}

export interface BiomarkerResponse {
  data: BiomarkerReading[];
}

export interface SleepStages {
  awakeMins: number;
  lightMins: number;
  deepMins: number;
  remMins: number;
}

export interface SleepSession {
  date: string;
  bedtime: string;
  wakeTime: string;
  totalSleepMins: number;
  efficiencyPct: number;
  stages: SleepStages;
  avgHr: number;
  avgSpo2: number;
  avgHrvRmssd: number;
  respiratoryRate: number;
}

export interface SleepResponse {
  sessions: SleepSession[];
}

export interface ActivityDay {
  date: string;
  steps: number;
  caloriesKcal: number;
  activeMins: number;
  distanceKm: number;
  vo2max?: number;
}

export interface ActivityResponse {
  days: ActivityDay[];
}

export interface SemgChannel {
  channel: number;
  muscle: string;
  avgActivationPct: number;
  fatigueIndex: number;
}

export interface WorkoutSession {
  id: string;
  startTime: string;
  endTime: string;
  sport: string;
  avgHr: number;
  maxHr: number;
  caloriesKcal: number;
  semgChannels?: SemgChannel[];
}

export interface WorkoutResponse {
  workouts: WorkoutSession[];
}

export type RecoveryCategory = 'peak' | 'good' | 'moderate' | 'poor';

export interface RecoveryDay {
  date: string;
  score: number;
  category: RecoveryCategory;
  hrvRmssd: number;
  restingHr: number;
  sleepScore: number;
  bodyTempDelta: number;
}

export interface RecoveryResponse {
  days: RecoveryDay[];
}

export interface StressReading {
  timestamp: string;
  stressIndex: number;
  edaUs: number;
  hrvRmssd: number;
}

export interface StressResponse {
  data: StressReading[];
}

export type WebhookEvent =
  | 'heart_rate.alert'
  | 'spo2.alert'
  | 'afib.detected'
  | 'glucose.alert'
  | 'glucose.critical'
  | 'blood_pressure.alert'
  | 'device.sync'
  | 'device.low_battery'
  | 'device.ota_available';

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  createdAt: string;
}

export interface WebhookListResponse {
  webhooks: Webhook[];
}

export interface EosApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    nextToken?: string;
  };
}
