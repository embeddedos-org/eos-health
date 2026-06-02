/**
 * EoS Health TypeScript SDK — Main Client
 */

import {
  HeartRateResponse, HRVResponse, SpO2Response, ECGResponse,
  BloodPressureResponse, HbA1cResponse, GlucoseResponse,
  BiomarkerResponse, SleepResponse, ActivityResponse, WorkoutResponse,
  RecoveryResponse, StressResponse, DeviceListResponse, Device,
  BatteryStatus, User, WebhookListResponse, Webhook,
  DateRangeParams, EosApiResponse,
} from './types';
import { EosHealthError, AuthenticationError, RateLimitError } from './errors';

const BASE_URL = 'https://api.eoshealth.io/v1';
const SANDBOX_URL = 'https://sandbox.api.eoshealth.io/v1';

export interface EosHealthClientOptions {
  accessToken: string;
  sandbox?: boolean;
  timeout?: number;
  fetch?: typeof fetch;
}

export class EosHealthClient {
  private accessToken: string;
  private baseUrl: string;
  private timeout: number;
  private _fetch: typeof fetch;

  public readonly heartRate: HeartRateResource;
  public readonly hrv: HRVResource;
  public readonly spo2: SpO2Resource;
  public readonly ecg: ECGResource;
  public readonly bloodPressure: BloodPressureResource;
  public readonly hba1c: HbA1cResource;
  public readonly glucose: GlucoseResource;
  public readonly biomarkers: BiomarkersResource;
  public readonly sleep: SleepResource;
  public readonly activity: ActivityResource;
  public readonly recovery: RecoveryResource;
  public readonly stress: StressResource;
  public readonly devices: DevicesResource;
  public readonly webhooks: WebhooksResource;

  constructor(options: EosHealthClientOptions) {
    this.accessToken = options.accessToken;
    this.baseUrl = options.sandbox ? SANDBOX_URL : BASE_URL;
    this.timeout = options.timeout ?? 30000;
    this._fetch = options.fetch ?? globalThis.fetch;

    this.heartRate    = new HeartRateResource(this);
    this.hrv          = new HRVResource(this);
    this.spo2         = new SpO2Resource(this);
    this.ecg          = new ECGResource(this);
    this.bloodPressure = new BloodPressureResource(this);
    this.hba1c        = new HbA1cResource(this);
    this.glucose      = new GlucoseResource(this);
    this.biomarkers   = new BiomarkersResource(this);
    this.sleep        = new SleepResource(this);
    this.activity     = new ActivityResource(this);
    this.recovery     = new RecoveryResource(this);
    this.stress       = new StressResource(this);
    this.devices      = new DevicesResource(this);
    this.webhooks     = new WebhooksResource(this);
  }

  async getUser(): Promise<User> {
    return this._get<User>('/user');
  }

  async _get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const resp = await this._fetch(url.toString(), {
        headers: this._headers(),
        signal: controller.signal,
      });
      return this._handleResponse<T>(resp);
    } finally {
      clearTimeout(timer);
    }
  }

  async _post<T>(path: string, body: unknown): Promise<T> {
    const url = this.baseUrl + path;
    const resp = await this._fetch(url, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    });
    return this._handleResponse<T>(resp);
  }

  async _delete(path: string): Promise<void> {
    const url = this.baseUrl + path;
    const resp = await this._fetch(url, {
      method: 'DELETE',
      headers: this._headers(),
    });
    if (resp.status !== 204) await this._handleResponse(resp);
  }

  private _headers(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'eos-health-js/1.0.0',
      'Accept': 'application/json',
    };
  }

  private async _handleResponse<T>(resp: Response): Promise<T> {
    if (resp.ok) return resp.json() as Promise<T>;
    const body = await resp.json().catch(() => ({})) as Record<string, unknown>;
    if (resp.status === 401) throw new AuthenticationError('Invalid or expired access token');
    if (resp.status === 429) throw new RateLimitError('Rate limit exceeded');
    throw new EosHealthError(`API error ${resp.status}: ${body['message'] ?? ''}`);
  }
}

// ─── Resource classes ─────────────────────────────────────────────────────────

class HeartRateResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams & { deviceId?: string; resolution?: string; limit?: number }) {
    return this.c._get<HeartRateResponse>('/heart-rate', params as Record<string, string>);
  }
  summary(params?: DateRangeParams) {
    return this.c._get('/heart-rate/summary', params as Record<string, string>);
  }
}

class HRVResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<HRVResponse>('/hrv', params as Record<string, string>);
  }
}

class SpO2Resource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<SpO2Response>('/spo2', params as Record<string, string>);
  }
}

class ECGResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams & { includeWaveform?: boolean }) {
    return this.c._get<ECGResponse>('/ecg', params as Record<string, string>);
  }
  waveform(recordingId: string, format: 'json' | 'csv' | 'edf' = 'json') {
    return this.c._get(`/ecg/${recordingId}/waveform`, { format });
  }
}

class BloodPressureResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<BloodPressureResponse>('/blood-pressure', params as Record<string, string>);
  }
}

class HbA1cResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<HbA1cResponse>('/hba1c', params as Record<string, string>);
  }
}

class GlucoseResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams & { includeAlerts?: boolean }) {
    return this.c._get<GlucoseResponse>('/glucose', params as Record<string, string>);
  }
}

class BiomarkersResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams & { analytes?: string[] }) {
    const p: Record<string, string> = {};
    if (params?.startDate) p['start_date'] = params.startDate;
    if (params?.endDate) p['end_date'] = params.endDate;
    if (params?.analytes) p['analytes'] = params.analytes.join(',');
    return this.c._get<BiomarkerResponse>('/biomarkers', p);
  }
}

class SleepResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<SleepResponse>('/sleep', params as Record<string, string>);
  }
}

class ActivityResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<ActivityResponse>('/activity', params as Record<string, string>);
  }
  workouts(params?: DateRangeParams & { includeSemg?: boolean }) {
    return this.c._get<WorkoutResponse>('/activity/workouts', params as Record<string, string>);
  }
}

class RecoveryResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<RecoveryResponse>('/recovery', params as Record<string, string>);
  }
}

class StressResource {
  constructor(private c: EosHealthClient) {}
  get(params?: DateRangeParams) {
    return this.c._get<StressResponse>('/stress', params as Record<string, string>);
  }
}

class DevicesResource {
  constructor(private c: EosHealthClient) {}
  list() { return this.c._get<DeviceListResponse>('/devices'); }
  get(deviceId: string) { return this.c._get<Device>(`/devices/${deviceId}`); }
  battery(deviceId: string) { return this.c._get<BatteryStatus>(`/devices/${deviceId}/battery`); }
}

class WebhooksResource {
  constructor(private c: EosHealthClient) {}
  list() { return this.c._get<WebhookListResponse>('/webhooks'); }
  create(url: string, events: string[]) {
    return this.c._post<Webhook>('/webhooks', { url, events });
  }
  delete(webhookId: string) { return this.c._delete(`/webhooks/${webhookId}`); }
}
