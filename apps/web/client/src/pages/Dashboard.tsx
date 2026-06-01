import { useSimulation } from "@/hooks/useSimulation";
import {
  Activity, AlertTriangle, ArrowUpRight, Battery, Bluetooth,
  Brain, ChevronRight, Flame, Heart, Moon, Wind, Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

/* ── Radial Recovery Ring ── */
function RecoveryRing({ score }: { score: number }) {
  const size = 200, sw = 10, r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(score / 100, 1));
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Optimal" : score >= 50 ? "Moderate" : "Low";
  const color = score >= 85 ? "#00E5CC" : score >= 70 ? "#7C3AED" : score >= 50 ? "#F59E0B" : "#FF6B6B";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw} stroke="rgba(255,255,255,0.05)" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw + 6} stroke={color} fill="none"
          strokeOpacity="0.05" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw} stroke="url(#ring-grad)" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.23,1,0.32,1)", filter: `drop-shadow(0 0 8px ${color}88)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-bold text-white" style={{ fontSize: "3rem", lineHeight: 1 }}>{score}</span>
        <span className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

/* ── Mini Sparkline ── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <div style={{ height: 28 }} />;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const w = 72, h = 28;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h * 0.85 - h * 0.07}`
  ).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}66)` }} />
    </svg>
  );
}

/* ── ECG Canvas ── */
function ECGCanvas({ data }: { data: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c || !data.length) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(0,229,204,0.07)"; ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for (let y = 0; y < h; y += 10) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    const g = ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0, "rgba(0,229,204,0.3)"); g.addColorStop(1, "#00E5CC");
    ctx.strokeStyle = g; ctx.lineWidth = 1.5;
    ctx.shadowColor = "#00E5CC"; ctx.shadowBlur = 5;
    ctx.beginPath();
    const step = w / data.length;
    data.forEach((v, i) => {
      const x = i * step, y = h/2 - v * h * 0.42;
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();
  }, [data]);
  return <canvas ref={ref} width={600} height={64} style={{ width: "100%", height: 64 }} />;
}

/* ── Metric Card ── */
function MetricCard({ icon: Icon, label, value, unit, sub, color, spark, trend }: {
  icon: any; label: string; value: string | number; unit?: string;
  sub?: string; color: string; spark?: number[]; trend?: "up" | "down";
}) {
  return (
    <div className="metric-card glass-hover flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${color}10`, border: `1px solid ${color}1a` }}>
            <Icon size={13} style={{ color }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
        </div>
        {trend && (
          <ArrowUpRight size={12}
            style={{ color: trend === "up" ? "#00E5CC" : "#FF6B6B", transform: trend === "down" ? "rotate(90deg)" : undefined }} />
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="font-display font-bold text-white leading-none" style={{ fontSize: "1.75rem" }}>{value}</span>
        {unit && <span className="text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{unit}</span>}
      </div>
      {sub && <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</span>}
      {spark && <Sparkline data={spark} color={color} />}
    </div>
  );
}

/* ── Main ── */
export default function Dashboard() {
  const sim = useSimulation();
  const h = sim.health;

  const [hrSpark, setHrSpark] = useState<number[]>(() => Array.from({length:20}, () => 65 + Math.random()*10));
  const [spo2Spark, setSpo2Spark] = useState<number[]>(() => Array.from({length:20}, () => 97 + Math.random()*2));
  const [ecgBuf, setEcgBuf] = useState<number[]>([]);
  const prevTs = useRef(0);

  useEffect(() => {
    if (!h || h.timestamp === prevTs.current) return;
    prevTs.current = h.timestamp;
    setHrSpark(p => [...p.slice(-19), h.heartRate]);
    setSpo2Spark(p => [...p.slice(-19), h.spo2]);
  }, [h]);

  useEffect(() => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/api/ws/simulate`);
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.type === "ecg") setEcgBuf(p => [...p, ...d.samples].slice(-300));
      } catch {}
    };
    return () => ws.close();
  }, []);

  const recovery = h?.sleepScore ?? 87;
  const sleepH = Math.floor((h?.sleepScore ?? 82) * 0.07);
  const sleepM = Math.round(((h?.sleepScore ?? 82) * 0.07 - sleepH) * 60);

  return (

      <div className="p-4 sm:p-6 space-y-5 animate-fade-up">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="live-dot" style={{ opacity: sim.connected ? 1 : 0.3 }} />
              <span className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: sim.connected ? "#00E5CC" : "rgba(255,255,255,0.3)" }}>
                {sim.connected ? `Live · ${h?.deviceType ?? "EoS Device"}` : "Connecting…"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {h?.anomaly && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse"
                style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "#FF6B6B" }}>
                <AlertTriangle size={12} />
                {h.anomaly === "afib" ? "AFib Detected" : h.anomaly === "bradycardia" ? "Bradycardia" : "Tachycardia"}
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Battery size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span className="text-xs font-mono-data" style={{ color: "rgba(255,255,255,0.45)" }}>{h?.battery ?? 82}%</span>
            </div>
            <Link href="/app/devices"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.15)", color: "#00E5CC" }}>
              <Bluetooth size={12} /> Connected
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Recovery Ring */}
          <div className="metric-card flex flex-col items-center justify-center gap-4 py-6">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Recovery Score</span>
            <RecoveryRing score={recovery} />
            <div className="flex items-center gap-5 w-full justify-center">
              {[
                { label: "HRV", value: `${h ? Math.round(h.heartRate * 0.42) : 65}ms` },
                { label: "Strain", value: h ? (h.stressLevel * 0.21).toFixed(1) : "14.9" },
                { label: "Temp", value: `${h ? (36.4 + h.stressLevel * 0.02).toFixed(1) : "36.2"}°` },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-5">
                  {i > 0 && <div className="h-5 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />}
                  <div className="text-center">
                    <div className="text-base font-display font-bold text-white">{s.value}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="xl:col-span-2 space-y-4">

            {/* 4 metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard icon={Heart} label="HR" value={h?.heartRate ?? 68} unit="bpm"
                sub="Resting" color="#FF6B6B" spark={hrSpark} trend="up" />
              <MetricCard icon={Wind} label="SpO₂" value={h ? h.spo2.toFixed(1) : "98.0"} unit="%"
                sub="Optimal" color="#00E5CC" spark={spo2Spark} />
              <MetricCard icon={Activity} label="Steps" value={(h?.steps ?? 8420).toLocaleString()}
                sub="Goal: 10k" color="#7C3AED" trend="up" />
              <MetricCard icon={Flame} label="Calories" value={(h ? Math.round(h.steps * 0.04) : 2341).toLocaleString()}
                unit="kcal" sub="Active" color="#F59E0B" trend="up" />
            </div>

            {/* ECG Strip */}
            <div className="metric-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart size={13} style={{ color: "#00E5CC" }} />
                  <span className="text-sm font-semibold text-white">Live ECG</span>
                  <div className="live-dot" />
                </div>
                <Link href="/app/ecg"
                  className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#00E5CC" }}>
                  Full View <ChevronRight size={11} />
                </Link>
              </div>
              <ECGCanvas data={ecgBuf.slice(-200)} />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-mono-data" style={{ color: "rgba(255,255,255,0.25)" }}>25mm/s · 10mm/mV</span>
                <span className="pill-optimal">Sinus Rhythm</span>
              </div>
            </div>

            {/* Sleep + BAC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Moon size={13} style={{ color: "#7C3AED" }} />
                    <span className="text-sm font-semibold text-white">Sleep</span>
                  </div>
                  <span className="font-display font-bold text-xl" style={{ color: "#7C3AED" }}>{h?.sleepScore ?? 92}</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Total", value: `${sleepH}h ${sleepM}m`, pct: 78 },
                    { label: "Deep", value: "2h 15m", pct: 28 },
                    { label: "REM", value: "1h 50m", pct: 23 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
                        <span className="font-mono-data text-white">{s.value}</span>
                      </div>
                      <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${s.pct}%`, background: "linear-gradient(90deg, #7C3AED, #A78BFA)", transition: "width 1s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain size={13} style={{ color: "#00E5CC" }} />
                    <span className="text-sm font-semibold text-white">Breath Analysis</span>
                  </div>
                  <Link href="/app/breath-test" className="text-xs font-semibold" style={{ color: "#00E5CC" }}>Test →</Link>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="font-display font-bold text-white" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                    {(h?.bac ?? 0).toFixed(3)}
                  </span>
                  <span className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>BAC %</span>
                </div>
                <span className="pill-optimal">Sober</span>
                <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>VOC: Normal · Last test: Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/app/ecg", icon: Heart, label: "ECG Viewer", color: "#FF6B6B" },
            { href: "/app/breath-test", icon: Wind, label: "Breath Test", color: "#00E5CC" },
            { href: "/app/tens", icon: Zap, label: "TENS Control", color: "#7C3AED" },
            { href: "/app/gesture-trainer", icon: Brain, label: "Gesture Trainer", color: "#F59E0B" },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href}
              className="metric-card glass-hover flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}0d`, border: `1px solid ${color}1a` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <span className="text-sm font-medium text-white flex-1">{label}</span>
              <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
            </Link>
          ))}
        </div>

        {/* Anomaly log */}
        {sim.anomalyLog.length > 0 && (
          <div className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Anomaly Log</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sim.anomalyLog.length} events</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {[...sim.anomalyLog].reverse().map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: "#FF6B6B" }}>
                    <AlertTriangle size={11} />
                    {e.anomaly === "afib" ? "AFib" : e.anomaly === "bradycardia" ? "Bradycardia" : "Tachycardia"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

  );
}
