/**
 * EoS Health — Device Simulation Engine
 *
 * Streams realistic biometric data over WebSocket to simulate a connected
 * HEALTH-KEY ULTRA or HEALTH-BAND Neuro device. Clients connect to:
 *   ws://localhost:3000/api/ws/simulate
 *
 * Message format (server → client):
 *   { type: "health" | "ecg" | "status", payload: {...} }
 */

import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

// ─── ECG Waveform Generator ────────────────────────────────────────────────

/** Generate one cardiac cycle of a realistic P-QRS-T waveform */
function generateCardiacCycle(
  heartRate: number,
  anomaly?: "afib" | "bradycardia" | "tachycardia" | null
): number[] {
  const samplesPerCycle = Math.round(250 * (60 / heartRate)); // 250 Hz sample rate
  const samples: number[] = new Array(samplesPerCycle).fill(0);

  const baseline = 0;
  const noise = () => (Math.random() - 0.5) * 0.04;

  // Timing ratios within a cycle
  const pStart = Math.floor(samplesPerCycle * 0.05);
  const pEnd = Math.floor(samplesPerCycle * 0.18);
  const qStart = Math.floor(samplesPerCycle * 0.20);
  const rPeak = Math.floor(samplesPerCycle * 0.25);
  const sEnd = Math.floor(samplesPerCycle * 0.30);
  const tStart = Math.floor(samplesPerCycle * 0.35);
  const tEnd = Math.floor(samplesPerCycle * 0.55);

  for (let i = 0; i < samplesPerCycle; i++) {
    let v = baseline + noise();

    // P wave (atrial depolarisation)
    if (anomaly !== "afib" && i >= pStart && i < pEnd) {
      const t = (i - pStart) / (pEnd - pStart);
      v += 0.25 * Math.sin(Math.PI * t);
    }

    // Q dip
    if (i >= qStart && i < rPeak) {
      const t = (i - qStart) / (rPeak - qStart);
      v -= 0.15 * Math.sin(Math.PI * t);
    }

    // R spike
    if (i >= rPeak - 3 && i < rPeak + 3) {
      const dist = Math.abs(i - rPeak);
      v += (1.2 - dist * 0.2) * (anomaly === "afib" ? 0.85 : 1.0);
    }

    // S dip
    if (i >= rPeak && i < sEnd) {
      const t = (i - rPeak) / (sEnd - rPeak);
      v -= 0.3 * Math.sin(Math.PI * t);
    }

    // T wave (ventricular repolarisation)
    if (i >= tStart && i < tEnd) {
      const t = (i - tStart) / (tEnd - tStart);
      v += 0.35 * Math.sin(Math.PI * t);
    }

    // AFib: add fibrillatory baseline noise between beats
    if (anomaly === "afib" && (i < pStart || i > tEnd)) {
      v += (Math.random() - 0.5) * 0.18;
    }

    samples[i] = parseFloat(v.toFixed(4));
  }

  return samples;
}

// ─── Biometric State Machine ───────────────────────────────────────────────

interface DeviceState {
  heartRate: number;
  spo2: number;
  bac: number;
  steps: number;
  battery: number;
  connected: boolean;
  deviceType: "HEALTH-KEY ULTRA" | "HEALTH-BAND Neuro";
  anomaly: "afib" | "bradycardia" | "tachycardia" | null;
  anomalyCountdown: number;
  breathTestActive: boolean;
  tensActive: boolean;
  tensFrequency: number;
  tensPulseWidth: number;
  tensAmplitude: number;
  sleepScore: number;
  stressLevel: number;
}

function createInitialState(): DeviceState {
  return {
    heartRate: 68,
    spo2: 98,
    bac: 0.00,
    steps: 4231,
    battery: 87,
    connected: true,
    deviceType: "HEALTH-BAND Neuro",
    anomaly: null,
    anomalyCountdown: 0,
    breathTestActive: false,
    tensActive: false,
    tensFrequency: 80,
    tensPulseWidth: 200,
    tensAmplitude: 15,
    sleepScore: 82,
    stressLevel: 32,
  };
}

function evolveState(state: DeviceState): DeviceState {
  const next = { ...state };

  // Heart rate: gentle random walk, 55–105 bpm
  next.heartRate = Math.max(55, Math.min(105,
    state.heartRate + (Math.random() - 0.5) * 3
  ));
  next.heartRate = parseFloat(next.heartRate.toFixed(0));

  // SpO2: 95–100%
  next.spo2 = Math.max(95, Math.min(100,
    state.spo2 + (Math.random() - 0.5) * 0.4
  ));
  next.spo2 = parseFloat(next.spo2.toFixed(1));

  // BAC: slowly decays, occasional small spike (simulating a sip)
  if (Math.random() < 0.005) {
    next.bac = Math.min(0.08, state.bac + 0.01);
  } else {
    next.bac = Math.max(0, state.bac - 0.0002);
  }
  next.bac = parseFloat(next.bac.toFixed(3));

  // Steps: increment ~1–3 per tick (simulating walking)
  next.steps = state.steps + Math.floor(Math.random() * 3);

  // Battery: very slowly drains
  if (Math.random() < 0.01) {
    next.battery = Math.max(0, state.battery - 1);
  }

  // Stress level: random walk 10–90
  next.stressLevel = Math.max(10, Math.min(90,
    state.stressLevel + (Math.random() - 0.5) * 4
  ));
  next.stressLevel = parseFloat(next.stressLevel.toFixed(0));

  // Anomaly injection: ~2% chance per tick, lasts 5 ticks
  if (state.anomalyCountdown > 0) {
    next.anomalyCountdown = state.anomalyCountdown - 1;
    if (next.anomalyCountdown === 0) next.anomaly = null;
  } else if (Math.random() < 0.02) {
    const types: Array<"afib" | "bradycardia" | "tachycardia"> = ["afib", "bradycardia", "tachycardia"];
    next.anomaly = types[Math.floor(Math.random() * types.length)];
    next.anomalyCountdown = 5;

    // Adjust HR to match anomaly
    if (next.anomaly === "bradycardia") next.heartRate = 42 + Math.random() * 10;
    if (next.anomaly === "tachycardia") next.heartRate = 115 + Math.random() * 20;
  }

  return next;
}

// ─── WebSocket Server Registration ────────────────────────────────────────

export function registerSimulationWS(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/ws/simulate" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("[Simulation] Client connected");
    let state = createInitialState();
    let ecgBuffer: number[] = [];
    let ecgIndex = 0;
    let tickCount = 0;

    // Health metrics tick: every 1 second
    const healthInterval = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return;
      state = evolveState(state);
      tickCount++;

      // Regenerate ECG buffer every cycle
      if (ecgBuffer.length === 0 || ecgIndex >= ecgBuffer.length) {
        ecgBuffer = generateCardiacCycle(state.heartRate, state.anomaly);
        ecgIndex = 0;
      }

      ws.send(JSON.stringify({
        type: "health",
        payload: {
          heartRate: Math.round(state.heartRate),
          spo2: state.spo2,
          bac: state.bac,
          steps: state.steps,
          battery: state.battery,
          stressLevel: state.stressLevel,
          sleepScore: state.sleepScore,
          deviceType: state.deviceType,
          connected: state.connected,
          anomaly: state.anomaly,
          timestamp: Date.now(),
        },
      }));
    }, 1000);

    // ECG waveform tick: every 50ms (20 samples/sec burst of ~12 samples)
    const ecgInterval = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return;
      if (ecgBuffer.length === 0) return;

      // Send a chunk of 12 samples per tick (simulates 250Hz @ 20 ticks/sec)
      const chunk: number[] = [];
      for (let i = 0; i < 12; i++) {
        chunk.push(ecgBuffer[ecgIndex % ecgBuffer.length]);
        ecgIndex++;
      }

      ws.send(JSON.stringify({
        type: "ecg",
        payload: {
          samples: chunk,
          sampleRate: 250,
          anomaly: state.anomaly,
          timestamp: Date.now(),
        },
      }));
    }, 50);

    // Status ping: every 5 seconds
    const statusInterval = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({
        type: "status",
        payload: {
          deviceType: state.deviceType,
          firmwareVersion: "1.1.0",
          connectionType: "BLE",
          signalStrength: -55 + Math.floor(Math.random() * 10),
          storageUsedMb: 1240 + Math.floor(Math.random() * 10),
          storageTotalMb: 65536,
          uptime: tickCount,
          tensActive: state.tensActive,
          tensFrequency: state.tensFrequency,
          tensPulseWidth: state.tensPulseWidth,
          tensAmplitude: state.tensAmplitude,
        },
      }));
    }, 5000);

    // Handle client messages (e.g., change device type, trigger breath test)
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "setDevice") {
          state = { ...state, deviceType: msg.payload.deviceType };
        }
        if (msg.type === "triggerBreathTest") {
          state = { ...state, breathTestActive: true };
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "breathResult",
                payload: {
                  bac: parseFloat((Math.random() * 0.04).toFixed(3)),
                  vocPpm: parseFloat((120 + Math.random() * 80).toFixed(1)),
                  result: "Clear",
                  timestamp: Date.now(),
                },
              }));
            }
            state = { ...state, breathTestActive: false };
          }, 3000);
        }
        if (msg.type === "setTENS") {
          state = {
            ...state,
            tensActive: msg.payload.active ?? state.tensActive,
            tensFrequency: msg.payload.frequency ?? state.tensFrequency,
            tensPulseWidth: msg.payload.pulseWidth ?? state.tensPulseWidth,
            tensAmplitude: msg.payload.amplitude ?? state.tensAmplitude,
          };
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on("close", () => {
      console.log("[Simulation] Client disconnected");
      clearInterval(healthInterval);
      clearInterval(ecgInterval);
      clearInterval(statusInterval);
    });

    ws.on("error", () => {
      clearInterval(healthInterval);
      clearInterval(ecgInterval);
      clearInterval(statusInterval);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: "connected",
      payload: {
        deviceType: state.deviceType,
        firmwareVersion: "1.1.0",
        message: "EoS Health simulation engine active",
      },
    }));
  });

  console.log("[Simulation] WebSocket server registered at /api/ws/simulate");
}
