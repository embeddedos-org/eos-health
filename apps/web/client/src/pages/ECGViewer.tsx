import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/hooks/useSimulation";
import { AlertTriangle, CheckCircle, Clock, Heart, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CANVAS_H = 200;

function drawECG(
  canvas: HTMLCanvasElement,
  points: number[],
  anomaly: string | null,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx || points.length < 2) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Baseline
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
  ctx.setLineDash([]);

  // Waveform — map points array across full canvas width
  const step = W / (points.length - 1);
  ctx.beginPath();
  ctx.strokeStyle = anomaly ? "#f87171" : "#2dd4bf";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = anomaly ? "#f87171" : "#2dd4bf";
  ctx.shadowBlur = anomaly ? 10 : 6;

  points.forEach((v, i) => {
    const x = i * step;
    const y = H / 2 - v * (H * 0.38);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Anomaly overlay banner
  if (anomaly) {
    ctx.fillStyle = "rgba(248,113,113,0.06)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f87171";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillText(`⚠ ${anomaly.toUpperCase()} DETECTED`, 10, 16);
  }
}

export default function ECGViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sim = useSimulation();
  const { data: sessions = [] } = trpc.ecg.getSessions.useQuery({ limit: 10 });
  const { data: devices = [] } = trpc.devices.list.useQuery();
  const activeDevice = devices.find(d => d.isConnected) ?? devices[0];

  const saveSession = trpc.ecg.saveSession.useMutation({
    onSuccess: () => toast.success("ECG session saved"),
    onError: (e) => toast.error(e.message),
  });

  // Draw ECG from live WebSocket buffer
  useEffect(() => {
    if (!recording) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loop = () => {
      if (sim.ecgBuffer.length > 10) {
        drawECG(canvas, sim.ecgBuffer, sim.health?.anomaly ?? null);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [recording, sim.ecgBuffer, sim.health?.anomaly]);

  // Draw static preview when not recording
  useEffect(() => {
    if (recording) return;
    const canvas = canvasRef.current;
    if (!canvas || sim.ecgBuffer.length < 10) return;
    drawECG(canvas, sim.ecgBuffer, null);
  }, [sim.ecgBuffer, recording]);

  // Timer
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  const handleStop = () => {
    setRecording(false);
    cancelAnimationFrame(animRef.current);
    const anomalyTypes = sim.anomalyLog.map(a => a.anomaly);
    if (activeDevice) {
      saveSession.mutate({
        deviceId: activeDevice.id,
        durationSeconds: elapsed,
        anomalyCount: sim.anomalyLog.length,
        hasAfib: anomalyTypes.includes("afib"),
        hasBradycardia: anomalyTypes.includes("bradycardia"),
        hasTachycardia: anomalyTypes.includes("tachycardia"),
      });
    }
    setElapsed(0);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const currentAnomaly = sim.health?.anomaly ?? null;
  const hasAfib = sim.anomalyLog.some(a => a.anomaly === "afib");
  const hasBradycardia = sim.anomalyLog.some(a => a.anomaly === "bradycardia");
  const hasTachycardia = sim.anomalyLog.some(a => a.anomaly === "tachycardia");

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold">ECG Viewer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Single-lead electrocardiogram · live from simulation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {recording ? (
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleStop}>
              <Square className="w-3.5 h-3.5" /> Stop & Save
            </Button>
          ) : (
            <Button size="sm" className="gap-2" onClick={() => { setRecording(true); setElapsed(0); }}>
              <Play className="w-3.5 h-3.5" /> Start Recording
            </Button>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border",
          recording ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-border text-muted-foreground"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", recording ? "bg-red-400 pulse-dot" : "bg-muted-foreground/40")} />
          {recording ? "Recording" : "Idle"}
        </div>
        {recording && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{fmt(elapsed)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Heart className="w-3.5 h-3.5 text-red-400" />
          <span>{sim.health?.heartRate ?? "—"} bpm</span>
        </div>
        {currentAnomaly && (
          <div className="flex items-center gap-1.5 text-red-400 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="uppercase font-semibold">{currentAnomaly}</span>
          </div>
        )}
        {!sim.connected && (
          <div className="flex items-center gap-1.5 text-muted-foreground/50">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 inline-block" />
            Connecting…
          </div>
        )}
      </div>

      {/* Waveform canvas */}
      <div className="metric-card p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Lead I — 25mm/s · 10mm/mV</span>
          <span className="font-mono">250 Hz · {sim.ecgBuffer.length} samples</span>
        </div>
        <canvas
          ref={canvasRef}
          width={900}
          height={CANVAS_H}
          className="w-full rounded-lg bg-[oklch(0.08_0.01_260)]"
          style={{ height: CANVAS_H }}
        />
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-teal-400 inline-block" /> Normal trace
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-400 inline-block" /> Anomaly trace
          </span>
        </div>
      </div>

      {/* Anomaly summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "AFib", value: hasAfib, color: "text-red-400" },
          { label: "Bradycardia", value: hasBradycardia, color: "text-amber-400" },
          { label: "Tachycardia", value: hasTachycardia, color: "text-orange-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="metric-card p-4 flex items-center gap-3">
            {value
              ? <AlertTriangle className={cn("w-4 h-4", color)} />
              : <CheckCircle className="w-4 h-4 text-green-400" />
            }
            <div>
              <p className="text-xs font-medium">{label}</p>
              <p className={cn("text-xs", value ? color : "text-green-400")}>
                {value ? "Detected" : "Normal"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Session history */}
      <div className="space-y-3">
        <h2 className="text-sm font-display font-semibold">Recent Sessions</h2>
        {sessions.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            No ECG sessions recorded yet — start a recording above
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div key={s.id} className="metric-card px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="text-xs font-medium">{new Date(s.recordedAt).toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{s.durationSeconds}s · {s.anomalyCount} anomalies</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.hasAfib && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">AFib</span>}
                  {s.hasBradycardia && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Brady</span>}
                  {s.hasTachycardia && <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Tachy</span>}
                  {!s.hasAfib && !s.hasBradycardia && !s.hasTachycardia && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Normal</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
