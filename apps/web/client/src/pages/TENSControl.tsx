import { useSimulation } from "@/hooks/useSimulation";
import { trpc } from "@/lib/trpc";
import { Activity, ChevronRight, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const PRESETS = [
  { id: "pain-relief",   name: "Pain Relief",    desc: "Low-freq deep tissue",   freq: 4,   pw: 250, amp: 12, dur: 20, color: "#00E5CC" },
  { id: "muscle-stim",   name: "Muscle Stim",    desc: "High-freq activation",   freq: 80,  pw: 150, amp: 20, dur: 15, color: "#7C3AED" },
  { id: "recovery",      name: "Recovery",       desc: "Gentle post-workout",    freq: 35,  pw: 200, amp: 15, dur: 30, color: "#A78BFA" },
  { id: "endorphin",     name: "Endorphin",      desc: "Burst mode release",     freq: 2,   pw: 300, amp: 18, dur: 25, color: "#F59E0B" },
  { id: "acupuncture",   name: "Acupuncture",    desc: "Needle-free points",     freq: 80,  pw: 100, amp: 8,  dur: 20, color: "#FF6B6B" },
  { id: "custom",        name: "Custom",         desc: "Your own settings",      freq: 50,  pw: 200, amp: 10, dur: 20, color: "#00E5CC" },
];

function WaveformPreview({ freq, pw, amp }: { freq: number; pw: number; amp: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    // Grid
    ctx.strokeStyle = "rgba(0,229,204,0.06)"; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 10) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5;
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
    ctx.setLineDash([]);
    // Biphasic square wave
    const period = Math.max(12, Math.round(W / (freq * 0.06)));
    const pulseW = Math.max(3, Math.round((pw / 500) * period * 0.8));
    const amplitude = (amp / 80) * (H * 0.36);
    ctx.strokeStyle = "#00E5CC"; ctx.lineWidth = 1.5;
    ctx.shadowColor = "#00E5CC"; ctx.shadowBlur = 6;
    ctx.beginPath();
    let x = 4;
    while (x < W - period) {
      ctx.moveTo(x, H/2);
      ctx.lineTo(x, H/2 - amplitude);
      ctx.lineTo(x + pulseW, H/2 - amplitude);
      ctx.lineTo(x + pulseW, H/2);
      const gap = Math.max(2, Math.round(period * 0.1));
      ctx.moveTo(x + pulseW + gap, H/2);
      ctx.lineTo(x + pulseW + gap, H/2 + amplitude * 0.85);
      ctx.lineTo(x + pulseW * 2 + gap, H/2 + amplitude * 0.85);
      ctx.lineTo(x + pulseW * 2 + gap, H/2);
      x += period;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [freq, pw, amp]);
  return <canvas ref={canvasRef} width={500} height={64} style={{ width: "100%", height: 64 }} />;
}

function PremiumSlider({ label, value, min, max, unit, color, onChange }: {
  label: string; value: number; min: number; max: number; unit: string; color: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{label}</span>
        <div className="flex items-end gap-1">
          <span className="font-display font-bold text-white" style={{ fontSize: "1.4rem", lineHeight: 1 }}>{value}</span>
          <span className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{unit}</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, boxShadow: `0 0 10px ${color}50`, transition: "width 80ms" }} />
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 pointer-events-none"
          style={{ left: `calc(${pct}% - 10px)`, background: color, borderColor: "rgba(5,8,16,0.9)", boxShadow: `0 0 14px ${color}80`, transition: "left 80ms" }} />
      </div>
      <div className="flex justify-between" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function TENSControl() {
  const sim = useSimulation();
  const [freq, setFreq] = useState(80);
  const [pw, setPw] = useState(200);
  const [amp, setAmp] = useState(10);
  const [duration, setDuration] = useState(600); // seconds
  const [activePreset, setActivePreset] = useState("custom");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: devices = [] } = trpc.devices.list.useQuery();
  const { data: history = [], refetch } = trpc.tens.getHistory.useQuery({ limit: 5 });
  const activeDevice = devices.find((d: any) => d.deviceType === "HEALTH-BAND Neuro" && d.isConnected) ?? devices.find((d: any) => d.deviceType === "HEALTH-BAND Neuro");

  const saveSession = trpc.tens.saveSession.useMutation({
    onSuccess: () => { toast.success("TENS session saved to Data Vault"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    sim.setTENS({ active: running, frequency: freq, pulseWidth: pw, amplitude: amp });
  }, [running, freq, pw, amp]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= duration) { setRunning(false); toast.success("TENS session complete!"); return 0; }
          return e + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, duration]);

  const handleStop = () => {
    setRunning(false);
    if (elapsed > 0) {
      const deviceId = (activeDevice as any)?.id ?? 1;
      saveSession.mutate({ deviceId, pulseWidthUs: pw, frequencyHz: freq, amplitudeMa: amp, durationSeconds: elapsed });
    }
    setElapsed(0);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setActivePreset(p.id);
    setFreq(p.freq); setPw(p.pw); setAmp(p.amp); setDuration(p.dur * 60);
    toast.success(`"${p.name}" program loaded`);
  };

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const progress = duration > 0 ? elapsed / duration : 0;

  return (

      <div className="p-4 sm:p-6 space-y-6 animate-fade-up">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="pill-violet">HEALTH-BAND Neuro Exclusive</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">TENS Control</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Transcutaneous Electrical Nerve Stimulation · Biphasic symmetric waveform
            </p>
          </div>
          <div className="flex items-center gap-2">
            {running ? (
              <>
                <button onClick={() => setRunning(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                  <Pause size={14} /> Pause
                </button>
                <button onClick={handleStop}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>
                  Stop & Save
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setElapsed(0)}
                  className="p-2 rounded-xl transition-all hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => { setElapsed(0); setRunning(true); }}
                  className="btn-primary flex items-center gap-2">
                  <Play size={14} /> Start Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Session progress bar */}
        {running && (
          <div className="metric-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-2.5 h-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#00E5CC", boxShadow: "0 0 8px #00E5CC" }} />
                  <div className="pulse-ring" />
                </div>
                <span className="text-sm font-semibold text-white">Session Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl text-white">{fmt(elapsed)}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>/ {fmt(duration)}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, #7C3AED, #00E5CC)", boxShadow: "0 0 10px rgba(0,229,204,0.4)" }} />
            </div>
            <div className="flex justify-between text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span>{Math.round(progress * 100)}% complete</span>
              <span>{fmt(duration - elapsed)} remaining</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Preset programs */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Therapy Programs</h2>
            <div className="space-y-1.5">
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => applyPreset(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: activePreset === p.id ? `${p.color}0c` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activePreset === p.id ? `${p.color}28` : "rgba(255,255,255,0.05)"}`,
                  }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${p.color}12`, border: `1px solid ${p.color}20` }}>
                    <Zap size={13} style={{ color: p.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{p.name}</div>
                    <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{p.desc}</div>
                  </div>
                  {activePreset === p.id && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="xl:col-span-2 space-y-5">

            {/* Waveform */}
            <div className="metric-card p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <Activity size={13} style={{ color: "#00E5CC" }} />
                <span className="text-sm font-semibold text-white">Waveform Preview</span>
                <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>Biphasic symmetric</span>
              </div>
              <div className="px-5 py-4" style={{ background: "rgba(5,8,16,0.6)" }}>
                <WaveformPreview freq={freq} pw={pw} amp={amp} />
              </div>
            </div>

            {/* Sliders */}
            <div className="metric-card space-y-6">
              <PremiumSlider label="Frequency" value={freq} min={1} max={150} unit="Hz" color="#00E5CC" onChange={setFreq} />
              <PremiumSlider label="Pulse Width" value={pw} min={50} max={500} unit="μs" color="#7C3AED" onChange={setPw} />
              <PremiumSlider label="Amplitude" value={amp} min={0} max={80} unit="mA" color="#F59E0B" onChange={setAmp} />
              <PremiumSlider label="Session Duration" value={Math.round(duration/60)} min={1} max={60} unit="min" color="#A78BFA"
                onChange={v => setDuration(v * 60)} />
            </div>

            {/* Param summary */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "FREQ", value: freq, unit: "Hz", color: "#00E5CC" },
                { label: "PULSE W", value: pw, unit: "μs", color: "#7C3AED" },
                { label: "AMP", value: amp, unit: "mA", color: "#F59E0B" },
                { label: "DURATION", value: Math.round(duration/60), unit: "min", color: "#A78BFA" },
              ].map(s => (
                <div key={s.label} className="metric-card flex flex-col items-center text-center py-3 gap-1">
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{s.label}</span>
                  <span className="font-display font-bold text-white text-xl leading-none">{s.value}</span>
                  <span className="text-xs" style={{ color: s.color }}>{s.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session history */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Sessions</h2>
            <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
          </div>
          {(history as any[]).length === 0 ? (
            <div className="metric-card flex flex-col items-center justify-center py-10 gap-3">
              <Zap size={28} style={{ color: "rgba(255,255,255,0.15)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>No sessions yet — start your first TENS session above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(history as any[]).map((s) => (
                <div key={s.id} className="metric-card flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                      <Zap size={13} style={{ color: "#7C3AED" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{new Date(s.recordedAt).toLocaleString()}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {s.frequencyHz}Hz · {s.pulseWidthUs}μs · {s.amplitudeMa}mA · {Math.round((s.durationSeconds ?? 0)/60)}min
                      </p>
                    </div>
                  </div>
                  <span className="pill-violet">Complete</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

  );
}
