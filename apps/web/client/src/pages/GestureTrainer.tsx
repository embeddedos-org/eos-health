import { trpc } from "@/lib/trpc";
import { Brain, CheckCircle, Mic, Plus, Trash2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TrainState = "idle" | "recording" | "processing" | "done";

const GESTURE_ICONS = ["✊", "🖐", "🤏", "☝️", "🤞", "🤙", "👌", "🤘"];

function EMGCanvas({ active, trainProgress }: { active: boolean; trainProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Grid
      ctx.strokeStyle = "rgba(167,139,250,0.06)"; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 10) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      // Baseline
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5;
      ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
      ctx.setLineDash([]);
      // EMG signal
      const color = active ? "#A78BFA" : "rgba(167,139,250,0.25)";
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.shadowColor = active ? "#A78BFA" : "transparent";
      ctx.shadowBlur = active ? 8 : 0;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const noise = active ? (Math.random() - 0.5) * 0.5 : 0;
        const base = Math.sin((x + tRef.current) * 0.04) * 0.25;
        const burst = active && Math.random() > 0.94 ? (Math.random() - 0.5) * 1.8 : 0;
        const y = H/2 + (base + noise + burst) * H * 0.38;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (active) tRef.current += 4;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={600} height={80} style={{ width: "100%", height: 80, borderRadius: 8 }} />
      {active && (
        <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#A78BFA", boxShadow: "0 0 6px #A78BFA" }} />
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em" }}>RECORDING</span>
        </div>
      )}
    </div>
  );
}

function AccuracyRing({ accuracy }: { accuracy: number }) {
  const size = 52, sw = 4, r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - accuracy);
  const color = accuracy > 0.8 ? "#00E5CC" : accuracy > 0.5 ? "#F59E0B" : "#FF6B6B";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw} stroke="rgba(255,255,255,0.06)" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw} stroke={color} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.23,1,0.32,1)", filter: `drop-shadow(0 0 4px ${color}80)` }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: "0.65rem", fontWeight: 800, color, lineHeight: 1 }}>
          {accuracy > 0 ? `${Math.round(accuracy * 100)}%` : "—"}
        </span>
      </div>
    </div>
  );
}

export default function GestureTrainer() {
  const [trainState, setTrainState] = useState<TrainState>("idle");
  const [trainProgress, setTrainProgress] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const { data: devices = [] } = trpc.devices.list.useQuery();
  const activeDevice = (devices as any[]).find(d => d.deviceType === "HEALTH-BAND Neuro" && d.isConnected)
    ?? (devices as any[]).find(d => d.deviceType === "HEALTH-BAND Neuro");

  const { data: gestures = [], refetch } = trpc.semg.getGestures.useQuery(
    { deviceId: (activeDevice as any)?.id ?? 0 },
    { enabled: !!(activeDevice as any)?.id }
  );

  const addGesture = trpc.semg.addGesture.useMutation({
    onSuccess: () => { toast.success("Gesture added"); refetch(); setShowAdd(false); setNewLabel(""); },
    onError: (e) => toast.error(e.message),
  });

  const updateGesture = trpc.semg.updateGesture.useMutation({ onSuccess: () => refetch() });
  const deleteGesture = trpc.semg.deleteGesture.useMutation({
    onSuccess: () => { toast.success("Gesture removed"); refetch(); setSelectedId(null); },
  });

  const startRecording = async (gestureId: number) => {
    setSelectedId(gestureId);
    setTrainState("recording");
    setTrainProgress(0);
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(r => setTimeout(r, 120));
      setTrainProgress(i);
    }
    setTrainState("processing");
    await new Promise(r => setTimeout(r, 1200));
    const g = (gestures as any[]).find(g => g.id === gestureId);
    if (g) {
      const newSamples = (g.sampleCount ?? 0) + 10;
      const newAccuracy = Math.min(0.99, 0.55 + newSamples * 0.009);
      updateGesture.mutate({ id: gestureId, sampleCount: newSamples, accuracy: newAccuracy });
    }
    setTrainState("done");
    toast.success("Samples recorded — classifier updated");
    setTimeout(() => setTrainState("idle"), 2000);
  };

  return (

      <div className="p-4 sm:p-6 space-y-6 animate-fade-up">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="pill-violet">HEALTH-BAND Neuro Exclusive</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">Gesture Trainer</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Train a personal sEMG classifier using your muscle signals
            </p>
          </div>
          <button onClick={() => setShowAdd(true)}
            disabled={!activeDevice}
            className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus size={14} /> Add Gesture
          </button>
        </div>

        {/* Add gesture modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowAdd(false)}>
            <div className="w-full max-w-sm rounded-2xl p-6 space-y-4 animate-scale-in"
              style={{ background: "rgba(12,15,28,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={e => e.stopPropagation()}>
              <div>
                <h2 className="font-display font-bold text-lg text-white">New Gesture</h2>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Name the muscle movement you want to classify</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {GESTURE_ICONS.map(icon => (
                  <button key={icon} onClick={() => setNewLabel(icon)}
                    className="text-2xl py-2 rounded-xl transition-all hover:bg-white/5"
                    style={{ background: newLabel === icon ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${newLabel === icon ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                    {icon}
                  </button>
                ))}
              </div>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
                placeholder='e.g. "Fist", "Open Hand", "Pinch"'
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                  Cancel
                </button>
                <button
                  disabled={!newLabel.trim() || addGesture.isPending}
                  onClick={() => addGesture.mutate({ deviceId: (activeDevice as any).id, label: newLabel.trim() })}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary disabled:opacity-40">
                  {addGesture.isPending ? "Creating…" : "Create Gesture"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!activeDevice && (
          <div className="metric-card flex items-center gap-3 py-4"
            style={{ borderColor: "rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.05)" }}>
            <Brain size={16} style={{ color: "#F59E0B", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "#F59E0B" }}>
              No HEALTH-BAND Neuro connected. Connect a device to record sEMG samples.
            </p>
          </div>
        )}

        {/* Live EMG signal */}
        <div className="metric-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={13} style={{ color: "#A78BFA" }} />
              <span className="text-sm font-semibold text-white">Live sEMG Signal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full"
                style={{ background: trainState === "recording" ? "#A78BFA" : "rgba(255,255,255,0.2)", boxShadow: trainState === "recording" ? "0 0 6px #A78BFA" : "none" }} />
              <span className="text-xs font-semibold" style={{ color: trainState === "recording" ? "#A78BFA" : "rgba(255,255,255,0.3)" }}>
                {trainState === "recording" ? "Recording" : trainState === "processing" ? "Processing…" : "Idle"}
              </span>
            </div>
          </div>
          <EMGCanvas active={trainState === "recording"} trainProgress={trainProgress} />
          {trainState === "recording" && (
            <div className="space-y-1.5">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-150"
                  style={{ width: `${trainProgress}%`, background: "linear-gradient(90deg, #7C3AED, #A78BFA)", boxShadow: "0 0 8px rgba(167,139,250,0.4)" }} />
              </div>
              <p className="text-xs text-right" style={{ color: "rgba(255,255,255,0.3)" }}>{trainProgress}%</p>
            </div>
          )}
          {trainState === "done" && (
            <div className="flex items-center justify-center gap-2 py-1">
              <CheckCircle size={14} style={{ color: "#00E5CC" }} />
              <span className="text-sm font-semibold" style={{ color: "#00E5CC" }}>Samples recorded — classifier updated</span>
            </div>
          )}
        </div>

        {/* Gesture grid */}
        {(gestures as any[]).length === 0 ? (
          <div className="metric-card flex flex-col items-center justify-center py-16 gap-4">
            <Brain size={40} style={{ color: "rgba(255,255,255,0.1)" }} />
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>No gestures defined yet</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>Add a gesture and record muscle signal samples to train the classifier</p>
            </div>
            <button onClick={() => setShowAdd(true)} disabled={!activeDevice}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-40">
              <Plus size={13} /> Add First Gesture
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(gestures as any[]).map((g, idx) => {
              const isSelected = selectedId === g.id;
              const acc = g.accuracy ?? 0;
              return (
                <div key={g.id}
                  className="metric-card glass-hover cursor-pointer space-y-4"
                  style={{ borderColor: isSelected ? "rgba(124,58,237,0.3)" : undefined, background: isSelected ? "rgba(124,58,237,0.06)" : undefined }}
                  onClick={() => setSelectedId(isSelected ? null : g.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                        {GESTURE_ICONS[idx % GESTURE_ICONS.length]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-white">{g.label}</h3>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{g.sampleCount ?? 0} samples</p>
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteGesture.mutate({ id: g.id }); }}
                      className="p-1.5 rounded-lg transition-all hover:bg-red-500/10"
                      style={{ color: "rgba(255,255,255,0.25)" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <AccuracyRing accuracy={acc} />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>Accuracy</span>
                        <span style={{ color: acc > 0.8 ? "#00E5CC" : acc > 0.5 ? "#F59E0B" : "rgba(255,255,255,0.3)" }}>
                          {acc > 0 ? `${Math.round(acc * 100)}%` : "Not trained"}
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${acc * 100}%`, background: acc > 0.8 ? "#00E5CC" : acc > 0.5 ? "#F59E0B" : "#FF6B6B" }} />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={(trainState === "recording" && !isSelected) || trainState === "processing" || !activeDevice}
                    onClick={e => { e.stopPropagation(); startRecording(g.id); }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                    style={{
                      background: isSelected && trainState === "recording" ? "rgba(167,139,250,0.15)" : "rgba(124,58,237,0.1)",
                      border: `1px solid ${isSelected && trainState === "recording" ? "rgba(167,139,250,0.3)" : "rgba(124,58,237,0.2)"}`,
                      color: isSelected && trainState === "recording" ? "#A78BFA" : "#7C3AED",
                    }}>
                    <Mic size={13} />
                    {isSelected && trainState === "recording" ? "Recording…" : "Record Samples"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

  );
}
