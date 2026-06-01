import { trpc } from "@/lib/trpc";
import { Activity, Brain, FileArchive, FileText, FlaskConical, HardDrive, Heart, Search, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const FILE_TYPES = ["ECG", "BreathTest", "HealthLog", "sEMG", "Other"] as const;
type FileType = typeof FILE_TYPES[number];

const TYPE_META: Record<FileType, { icon: any; color: string; glow: string; label: string }> = {
  ECG:        { icon: Heart,       color: "#FF6B6B", glow: "rgba(255,107,107,0.2)", label: "ECG Recording" },
  BreathTest: { icon: FlaskConical, color: "#00E5CC", glow: "rgba(0,229,204,0.2)",  label: "Breath Test" },
  HealthLog:  { icon: Activity,    color: "#60A5FA", glow: "rgba(96,165,250,0.2)",  label: "Health Log" },
  sEMG:       { icon: Brain,       color: "#A78BFA", glow: "rgba(167,139,250,0.2)", label: "sEMG Data" },
  Other:      { icon: FileText,    color: "rgba(255,255,255,0.4)", glow: "rgba(255,255,255,0.08)", label: "Other" },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function StorageRing({ used, total }: { used: number; total: number }) {
  const pct = Math.min(used / total, 1);
  const size = 120, sw = 8, r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct > 0.8 ? "#FF6B6B" : pct > 0.5 ? "#F59E0B" : "#00E5CC";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw} stroke="rgba(255,255,255,0.05)" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={sw} stroke={color} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.23,1,0.32,1)", filter: `drop-shadow(0 0 6px ${color}60)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-white" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
          {(pct * 100).toFixed(1)}%
        </span>
        <span className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>used</span>
      </div>
    </div>
  );
}

export default function DataVault() {
  const [filterDevice, setFilterDevice] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: devices = [] } = trpc.devices.list.useQuery();
  const { data: files = [], isLoading, refetch } = trpc.vault.getFiles.useQuery({
    deviceId: filterDevice !== "all" ? Number(filterDevice) : undefined,
  });

  const deleteFile = trpc.vault.deleteFile.useMutation({
    onSuccess: () => { toast.success("File removed from vault"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const addFile = trpc.vault.addFile.useMutation({
    onSuccess: () => { toast.success("File added to vault"); refetch(); },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const firstDevice = (devices as any[])[0];
    if (!firstDevice) { toast.error("Pair a device first to upload files."); e.target.value = ""; return; }
    addFile.mutate({ deviceId: firstDevice.id, fileName: file.name, fileType: "Other", fileSizeBytes: file.size });
    e.target.value = "";
  };

  const filtered = (files as any[]).filter(f => {
    if (filterType !== "all" && f.fileType !== filterType) return false;
    if (search && !f.fileName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalBytes = (files as any[]).reduce((acc: number, f: any) => acc + (f.fileSizeBytes ?? 0), 0);
  const maxBytes = 64 * 1024 * 1024 * 1024;

  const typeCounts = FILE_TYPES.reduce((acc, t) => {
    acc[t] = (files as any[]).filter(f => f.fileType === t).length;
    return acc;
  }, {} as Record<FileType, number>);

  return (

      <div className="p-4 sm:p-6 space-y-6 animate-fade-up">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">Data Vault</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              64GB onboard NAND flash — your health data travels with you, physically
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileInputRef.current?.click()}
              className="btn-primary flex items-center gap-2">
              <Upload size={14} /> Upload File
            </button>
          </div>
        </div>

        {/* Storage overview */}
        <div className="metric-card">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <StorageRing used={totalBytes} total={maxBytes} />
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive size={14} style={{ color: "#00E5CC" }} />
                  <span className="text-sm font-semibold text-white">Device Storage</span>
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {formatBytes(totalBytes)} / 64 GB
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(totalBytes / maxBytes) * 100}%`, background: "linear-gradient(90deg, #00E5CC, #7C3AED)", boxShadow: "0 0 10px rgba(0,229,204,0.3)" }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FILE_TYPES.map(t => {
                  const m = TYPE_META[t];
                  const Icon = m.icon;
                  return (
                    <button key={t} onClick={() => setFilterType(filterType === t ? "all" : t)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
                      style={{
                        background: filterType === t ? m.glow : "rgba(255,255,255,0.02)",
                        border: `1px solid ${filterType === t ? m.color + "30" : "rgba(255,255,255,0.05)"}`,
                      }}>
                      <Icon size={14} style={{ color: m.color }} />
                      <span className="text-xs font-semibold" style={{ color: filterType === t ? m.color : "rgba(255,255,255,0.5)" }}>
                        {typeCounts[t]}
                      </span>
                      <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.2 }}>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Search + device filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-white/25 outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
          </div>
          <select value={filterDevice} onChange={e => setFilterDevice(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
            <option value="all">All devices</option>
            {(devices as any[]).map((d: any) => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
          </select>
          <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{filtered.length} files</span>
        </div>

        {/* File list */}
        {isLoading ? (
          <div className="space-y-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 rounded-xl animate-shimmer" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="metric-card flex flex-col items-center justify-center py-16 gap-4">
            <FileArchive size={40} style={{ color: "rgba(255,255,255,0.1)" }} />
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                {search || filterType !== "all" ? "No files match your filters" : "Vault is empty"}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                Health data recorded by your device will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((file: any) => {
              const type = (file.fileType ?? "Other") as FileType;
              const m = TYPE_META[type] ?? TYPE_META.Other;
              const Icon = m.icon;
              return (
                <div key={file.id}
                  className="metric-card glass-hover flex items-center gap-4 px-4 py-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: m.glow, border: `1px solid ${m.color}20` }}>
                    <Icon size={16} style={{ color: m.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{file.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold" style={{ color: m.color }}>{m.label}</span>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}>·</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {file.fileSizeBytes ? formatBytes(file.fileSizeBytes) : "—"}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}>·</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteFile.mutate({ id: file.id })}
                    className="p-2 rounded-lg transition-all hover:bg-red-500/10 flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

  );
}
