/**
 * useSimulation — connects to the EoS Health device simulation WebSocket
 * and exposes live biometric state to any component.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface HealthPayload {
  heartRate: number;
  spo2: number;
  bac: number;
  steps: number;
  battery: number;
  stressLevel: number;
  sleepScore: number;
  deviceType: "HEALTH-KEY ULTRA" | "HEALTH-BAND Neuro";
  connected: boolean;
  anomaly: "afib" | "bradycardia" | "tachycardia" | null;
  timestamp: number;
}

export interface EcgPayload {
  samples: number[];
  sampleRate: number;
  anomaly: "afib" | "bradycardia" | "tachycardia" | null;
  timestamp: number;
}

export interface StatusPayload {
  deviceType: string;
  firmwareVersion: string;
  connectionType: string;
  signalStrength: number;
  storageUsedMb: number;
  storageTotalMb: number;
  uptime: number;
  tensActive: boolean;
  tensFrequency: number;
  tensPulseWidth: number;
  tensAmplitude: number;
}

export interface BreathResult {
  bac: number;
  vocPpm: number;
  result: "Clear" | "Caution" | "Alert";
  timestamp: number;
}

const MAX_ECG_SAMPLES = 750; // ~3 seconds of display buffer at 250Hz

export function useSimulation() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [connected, setConnected] = useState(false);
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [ecgBuffer, setEcgBuffer] = useState<number[]>([]);
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [breathResult, setBreathResult] = useState<BreathResult | null>(null);
  const [anomalyLog, setAnomalyLog] = useState<Array<{ anomaly: string; timestamp: number }>>([]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws/simulate`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "health") {
          const payload = msg.payload as HealthPayload;
          setHealth(payload);

          // Log anomalies
          if (payload.anomaly) {
            setAnomalyLog((prev) => {
              const last = prev[prev.length - 1];
              if (last?.anomaly === payload.anomaly) return prev; // dedupe
              return [...prev.slice(-49), { anomaly: payload.anomaly!, timestamp: payload.timestamp }];
            });
          }
        }

        if (msg.type === "ecg") {
          const payload = msg.payload as EcgPayload;
          setEcgBuffer((prev) => {
            const next = [...prev, ...payload.samples];
            return next.length > MAX_ECG_SAMPLES ? next.slice(next.length - MAX_ECG_SAMPLES) : next;
          });
        }

        if (msg.type === "status") {
          setStatus(msg.payload as StatusPayload);
        }

        if (msg.type === "breathResult") {
          setBreathResult(msg.payload as BreathResult);
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 2 seconds
      reconnectTimer.current = setTimeout(connect, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendCommand = useCallback((type: string, payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  const triggerBreathTest = useCallback(() => {
    setBreathResult(null);
    sendCommand("triggerBreathTest", {});
  }, [sendCommand]);

  const setTENS = useCallback((params: {
    active?: boolean;
    frequency?: number;
    pulseWidth?: number;
    amplitude?: number;
  }) => {
    sendCommand("setTENS", params);
  }, [sendCommand]);

  const setDevice = useCallback((deviceType: "HEALTH-KEY ULTRA" | "HEALTH-BAND Neuro") => {
    sendCommand("setDevice", { deviceType });
  }, [sendCommand]);

  return {
    connected,
    health,
    ecgBuffer,
    status,
    breathResult,
    anomalyLog,
    triggerBreathTest,
    setTENS,
    setDevice,
  };
}
