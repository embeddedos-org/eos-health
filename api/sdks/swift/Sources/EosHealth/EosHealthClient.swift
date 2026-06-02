// EoS Health Swift SDK
// ====================
// Official Swift client for the EoS Health Developer API.
// Supports iOS 16+, macOS 13+, watchOS 9+
//
// Usage:
//   let client = EosHealthClient(accessToken: "your_token")
//   let recovery = try await client.recovery.get(startDate: "2026-06-01")
//   print("Recovery score: \(recovery.days.first?.score ?? 0)")

import Foundation

// MARK: - Client

public final class EosHealthClient: Sendable {
    private let accessToken: String
    private let baseURL: URL
    private let session: URLSession

    public let heartRate: HeartRateResource
    public let hrv: HRVResource
    public let spo2: SpO2Resource
    public let ecg: ECGResource
    public let bloodPressure: BloodPressureResource
    public let hba1c: HbA1cResource
    public let glucose: GlucoseResource
    public let biomarkers: BiomarkersResource
    public let sleep: SleepResource
    public let activity: ActivityResource
    public let recovery: RecoveryResource
    public let stress: StressResource
    public let devices: DevicesResource
    public let webhooks: WebhooksResource

    public init(accessToken: String, sandbox: Bool = false, timeout: TimeInterval = 30) {
        self.accessToken = accessToken
        self.baseURL = URL(string: sandbox
            ? "https://sandbox.api.eoshealth.io/v1"
            : "https://api.eoshealth.io/v1")!

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = timeout
        config.httpAdditionalHeaders = [
            "Authorization": "Bearer \(accessToken)",
            "Content-Type": "application/json",
            "User-Agent": "eos-health-swift/1.0.0",
            "Accept": "application/json",
        ]
        self.session = URLSession(configuration: config)

        self.heartRate    = HeartRateResource(baseURL: baseURL, session: session)
        self.hrv          = HRVResource(baseURL: baseURL, session: session)
        self.spo2         = SpO2Resource(baseURL: baseURL, session: session)
        self.ecg          = ECGResource(baseURL: baseURL, session: session)
        self.bloodPressure = BloodPressureResource(baseURL: baseURL, session: session)
        self.hba1c        = HbA1cResource(baseURL: baseURL, session: session)
        self.glucose      = GlucoseResource(baseURL: baseURL, session: session)
        self.biomarkers   = BiomarkersResource(baseURL: baseURL, session: session)
        self.sleep        = SleepResource(baseURL: baseURL, session: session)
        self.activity     = ActivityResource(baseURL: baseURL, session: session)
        self.recovery     = RecoveryResource(baseURL: baseURL, session: session)
        self.stress       = StressResource(baseURL: baseURL, session: session)
        self.devices      = DevicesResource(baseURL: baseURL, session: session)
        self.webhooks     = WebhooksResource(baseURL: baseURL, session: session)
    }

    public func getUser() async throws -> EosUser {
        return try await get("/user")
    }

    func get<T: Decodable>(_ path: String, params: [String: String] = [:]) async throws -> T {
        var components = URLComponents(url: baseURL.appendingPathComponent(path), resolvingAgainstBaseURL: false)!
        if !params.isEmpty {
            components.queryItems = params.map { URLQueryItem(name: $0.key, value: $0.value) }
        }
        let (data, response) = try await session.data(from: components.url!)
        try handleResponse(response, data: data)
        return try JSONDecoder.eosDecoder.decode(T.self, from: data)
    }

    func post<T: Decodable>(_ path: String, body: Encodable) async throws -> T {
        var request = URLRequest(url: baseURL.appendingPathComponent(path))
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(body)
        let (data, response) = try await session.data(for: request)
        try handleResponse(response, data: data)
        return try JSONDecoder.eosDecoder.decode(T.self, from: data)
    }

    func delete(_ path: String) async throws {
        var request = URLRequest(url: baseURL.appendingPathComponent(path))
        request.httpMethod = "DELETE"
        let (data, response) = try await session.data(for: request)
        if (response as? HTTPURLResponse)?.statusCode != 204 {
            try handleResponse(response, data: data)
        }
    }

    private func handleResponse(_ response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else { return }
        switch http.statusCode {
        case 200...299: return
        case 401: throw EosHealthError.authenticationError("Invalid or expired access token")
        case 429: throw EosHealthError.rateLimitExceeded
        case 404: throw EosHealthError.deviceNotFound
        case 403: throw EosHealthError.insufficientScope
        default:
            let msg = (try? JSONDecoder().decode(APIError.self, from: data))?.message ?? "Unknown error"
            throw EosHealthError.apiError(http.statusCode, msg)
        }
    }
}

// MARK: - Errors

public enum EosHealthError: Error, LocalizedError {
    case authenticationError(String)
    case rateLimitExceeded
    case deviceNotFound
    case insufficientScope
    case apiError(Int, String)
    case decodingError(Error)

    public var errorDescription: String? {
        switch self {
        case .authenticationError(let msg): return "Authentication error: \(msg)"
        case .rateLimitExceeded: return "Rate limit exceeded"
        case .deviceNotFound: return "Device not found"
        case .insufficientScope: return "Insufficient OAuth scope"
        case .apiError(let code, let msg): return "API error \(code): \(msg)"
        case .decodingError(let err): return "Decoding error: \(err.localizedDescription)"
        }
    }
}

private struct APIError: Decodable {
    let message: String
}

// MARK: - JSON Decoder

extension JSONDecoder {
    static let eosDecoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        d.dateDecodingStrategy = .iso8601
        return d
    }()
}

// MARK: - Resource Base

class BaseResource {
    let baseURL: URL
    let session: URLSession
    init(baseURL: URL, session: URLSession) {
        self.baseURL = baseURL
        self.session = session
    }
    func get<T: Decodable>(_ path: String, params: [String: String] = [:]) async throws -> T {
        var components = URLComponents(url: baseURL.appendingPathComponent(path), resolvingAgainstBaseURL: false)!
        if !params.isEmpty {
            components.queryItems = params.map { URLQueryItem(name: $0.key, value: $0.value) }
        }
        let (data, _) = try await session.data(from: components.url!)
        return try JSONDecoder.eosDecoder.decode(T.self, from: data)
    }
}

// MARK: - Resources

public final class HeartRateResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> HeartRateResponse {
        try await get("/heart-rate", params: dateParams(startDate, endDate))
    }
    public func summary(startDate: String? = nil, endDate: String? = nil) async throws -> [HeartRateSummary] {
        try await get("/heart-rate/summary", params: dateParams(startDate, endDate))
    }
}

public final class HRVResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> HRVResponse {
        try await get("/hrv", params: dateParams(startDate, endDate))
    }
}

public final class SpO2Resource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> SpO2Response {
        try await get("/spo2", params: dateParams(startDate, endDate))
    }
}

public final class ECGResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil, includeWaveform: Bool = false) async throws -> ECGResponse {
        var p = dateParams(startDate, endDate)
        p["include_waveform"] = includeWaveform ? "true" : "false"
        return try await get("/ecg", params: p)
    }
}

public final class BloodPressureResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> BloodPressureResponse {
        try await get("/blood-pressure", params: dateParams(startDate, endDate))
    }
}

public final class HbA1cResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> HbA1cResponse {
        try await get("/hba1c", params: dateParams(startDate, endDate))
    }
}

public final class GlucoseResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> GlucoseResponse {
        try await get("/glucose", params: dateParams(startDate, endDate))
    }
}

public final class BiomarkersResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil, analytes: [String]? = nil) async throws -> BiomarkerResponse {
        var p = dateParams(startDate, endDate)
        if let a = analytes { p["analytes"] = a.joined(separator: ",") }
        return try await get("/biomarkers", params: p)
    }
}

public final class SleepResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> SleepResponse {
        try await get("/sleep", params: dateParams(startDate, endDate))
    }
}

public final class ActivityResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> ActivityResponse {
        try await get("/activity", params: dateParams(startDate, endDate))
    }
    public func workouts(startDate: String? = nil, endDate: String? = nil, includeSemg: Bool = false) async throws -> WorkoutResponse {
        var p = dateParams(startDate, endDate)
        p["include_semg"] = includeSemg ? "true" : "false"
        return try await get("/activity/workouts", params: p)
    }
}

public final class RecoveryResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> RecoveryResponse {
        try await get("/recovery", params: dateParams(startDate, endDate))
    }
}

public final class StressResource: BaseResource {
    public func get(startDate: String? = nil, endDate: String? = nil) async throws -> StressResponse {
        try await get("/stress", params: dateParams(startDate, endDate))
    }
}

public final class DevicesResource: BaseResource {
    public func list() async throws -> DeviceListResponse { try await get("/devices") }
    public func get(deviceId: String) async throws -> EosDevice { try await get("/devices/\(deviceId)") }
    public func battery(deviceId: String) async throws -> BatteryStatus { try await get("/devices/\(deviceId)/battery") }
}

public final class WebhooksResource: BaseResource {
    public func list() async throws -> WebhookListResponse { try await get("/webhooks") }
}

// MARK: - Helpers

private func dateParams(_ start: String?, _ end: String?) -> [String: String] {
    var p: [String: String] = [:]
    if let s = start { p["start_date"] = s }
    if let e = end { p["end_date"] = e }
    return p
}
