// EoS Health Swift SDK — Model Types

import Foundation

public struct EosUser: Decodable {
    public let id: String
    public let email: String
    public let displayName: String
    public let createdAt: String
    public let devices: [String]
}

public struct EosDevice: Decodable {
    public let id: String
    public let model: String
    public let serial: String
    public let firmwareVersion: String
    public let hardwareRevision: String
    public let lastSync: String
    public let connected: Bool
}

public struct DeviceListResponse: Decodable {
    public let devices: [EosDevice]
}

public struct BatteryStatus: Decodable {
    public let level: Int
    public let charging: Bool
    public let estimatedDaysRemaining: Double
    public let timestamp: String
}

public struct HeartRateReading: Decodable {
    public let timestamp: String
    public let bpm: Int
    public let confidence: Double
    public let deviceId: String
}

public struct HeartRateResponse: Decodable {
    public let data: [HeartRateReading]
    public let nextToken: String?
}

public struct HeartRateSummary: Decodable {
    public let date: String
    public let restingHr: Int
    public let maxHr: Int
    public let minHr: Int
    public let avgHr: Int
}

public struct HRVReading: Decodable {
    public let timestamp: String
    public let rmssd: Double
    public let sdnn: Double
    public let pnn50: Double
    public let lfHfRatio: Double
}

public struct HRVResponse: Decodable {
    public let data: [HRVReading]
}

public struct SpO2Reading: Decodable {
    public let timestamp: String
    public let spo2: Double
    public let confidence: Double
    public let deviceId: String
}

public struct SpO2Response: Decodable {
    public let data: [SpO2Reading]
}

public struct ECGRecording: Decodable {
    public let id: String
    public let timestamp: String
    public let durationSec: Int
    public let hr: Int
    public let hrvRmssd: Double
    public let afibDetected: Bool
    public let afibConfidence: Double
    public let qrsDurationMs: Double
    public let qtIntervalMs: Double
    public let prIntervalMs: Double
    public let deviceId: String
}

public struct ECGResponse: Decodable {
    public let recordings: [ECGRecording]
}

public struct BloodPressureReading: Decodable {
    public let timestamp: String
    public let systolic: Int
    public let diastolic: Int
    public let map: Double
    public let confidence: Double
    public let deviceId: String
}

public struct BloodPressureResponse: Decodable {
    public let data: [BloodPressureReading]
}

public struct HbA1cReading: Decodable {
    public let timestamp: String
    public let hba1cPct: Double
    public let hba1cMmol: Double
    public let confidence: Double
    public let disclaimer: String
}

public struct HbA1cResponse: Decodable {
    public let data: [HbA1cReading]
}

public struct GlucoseReading: Decodable {
    public let timestamp: String
    public let glucoseMgdl: Double
    public let glucoseMmol: Double
    public let trend: String
    public let alert: String?
}

public struct GlucoseResponse: Decodable {
    public let data: [GlucoseReading]
}

public struct BiomarkerReading: Decodable {
    public let timestamp: String
    public let glucoseMgdl: Double?
    public let lactateMmol: Double?
    public let sodiumMmol: Double?
    public let ph: Double?
    public let cortisolNgml: Double?
    public let potassiumMmol: Double?
    public let uricAcidMmol: Double?
}

public struct BiomarkerResponse: Decodable {
    public let data: [BiomarkerReading]
}

public struct SleepStages: Decodable {
    public let awakeMins: Int
    public let lightMins: Int
    public let deepMins: Int
    public let remMins: Int
}

public struct SleepSession: Decodable {
    public let date: String
    public let bedtime: String
    public let wakeTime: String
    public let totalSleepMins: Int
    public let efficiencyPct: Double
    public let stages: SleepStages
    public let avgHr: Int
    public let avgSpo2: Double
    public let avgHrvRmssd: Double
    public let respiratoryRate: Double
}

public struct SleepResponse: Decodable {
    public let sessions: [SleepSession]
}

public struct ActivityDay: Decodable {
    public let date: String
    public let steps: Int
    public let caloriesKcal: Int
    public let activeMins: Int
    public let distanceKm: Double
    public let vo2max: Double?
}

public struct ActivityResponse: Decodable {
    public let days: [ActivityDay]
}

public struct SemgChannel: Decodable {
    public let channel: Int
    public let muscle: String
    public let avgActivationPct: Double
    public let fatigueIndex: Double
}

public struct WorkoutSession: Decodable {
    public let id: String
    public let startTime: String
    public let endTime: String
    public let sport: String
    public let avgHr: Int
    public let maxHr: Int
    public let caloriesKcal: Int
    public let semgChannels: [SemgChannel]?
}

public struct WorkoutResponse: Decodable {
    public let workouts: [WorkoutSession]
}

public struct RecoveryDay: Decodable {
    public let date: String
    public let score: Int
    public let category: String
    public let hrvRmssd: Double
    public let restingHr: Int
    public let sleepScore: Int
    public let bodyTempDelta: Double
}

public struct RecoveryResponse: Decodable {
    public let days: [RecoveryDay]
}

public struct StressReading: Decodable {
    public let timestamp: String
    public let stressIndex: Int
    public let edaUs: Double
    public let hrvRmssd: Double
}

public struct StressResponse: Decodable {
    public let data: [StressReading]
}

public struct Webhook: Decodable {
    public let id: String
    public let url: String
    public let events: [String]
    public let secret: String
    public let active: Bool
    public let createdAt: String
}

public struct WebhookListResponse: Decodable {
    public let webhooks: [Webhook]
}
