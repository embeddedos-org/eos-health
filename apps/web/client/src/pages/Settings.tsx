import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Activity, ArrowUpCircle, Battery, Bluetooth, CheckCircle, ChevronRight, Download, Info, Loader2, LogOut, Moon, Shield, User, Wifi } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

type FWState = "idle" | "checking" | "downloading" | "installing" | "done";

function FirmwareCard({ device }: { device: any }) {
  const [fwState, setFwState] = useState<FWState>("idle");
  const [progress, setProgress] = useState(0);
  const { data: latest } = trpc.devices.getLatestFirmware.useQuery({ deviceType: device.deviceType });
  const updateDevice = trpc.devices.update.useMutation({ onSuccess: () => toast.success("Firmware updated successfully") });
  const isUpToDate = latest && device.firmwareVersion === (latest as any).version;
  const isNeuro = device.deviceType === "HEALTH-BAND Neuro";
  const accentColor = isNeuro ? "#A78BFA" : "#00E5CC";

  const runUpdate = async () => {
    setFwState("checking"); await new Promise(r => setTimeout(r, 1200));
    setFwState("downloading");
    for (let i = 0; i <= 100; i += 3) { await new Promise(r => setTimeout(r, 70)); setProgress(i); }
    setFwState("installing"); await new Promise(r => setTimeout(r, 2000));
    setFwState("done");
    if (latest) updateDevice.mutate({ id: device.id, firmwareVersion: (latest as any).version });
    setTimeout(() => { setFwState("idle"); setProgress(0); }, 3000);
  };

  return (
    <div className="metric-card space-y-4" style={{ borderColor: fwState !== "idle" ? `${accentColor}20` : undefined }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
            <Activity size={16} style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{device.name}</h3>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{device.deviceType}</p>
          </div>
        </div>
        {isUpToDate ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.2)" }}>
            <CheckCircle size={10} style={{ color: "#00E5CC" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#00E5CC" }}>Up to date</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <ArrowUpCircle size={10} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#F59E0B" }}>Update available</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Current</p>
          <p className="font-mono text-sm font-semibold text-white mt-0.5">{device.firmwareVersion ?? "Unknown"}</p>
        </div>
        {latest && (
          <div>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Latest</p>
            <p className="font-mono text-sm font-semibold text-white mt-0.5">{(latest as any).version}</p>
          </div>
        )}
      </div>

      {(latest as any)?.releaseNotes && (
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>Release Notes</p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{(latest as any).releaseNotes}</p>
        </div>
      )}

      {fwState !== "idle" && fwState !== "done" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2" style={{ color: accentColor }}>
              <Loader2 size={12} className="animate-spin" />
              <span className="capitalize font-semibold">{fwState}…</span>
            </div>
            {fwState === "downloading" && <span className="font-mono text-white">{progress}%</span>}
          </div>
          {fwState === "downloading" && (
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`, boxShadow: `0 0 8px ${accentColor}50` }} />
            </div>
          )}
        </div>
      )}

      {fwState === "done" && (
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#00E5CC" }}>
          <CheckCircle size={14} /> Firmware updated successfully
        </div>
      )}

      {fwState === "idle" && !isUpToDate && (
        <button onClick={runUpdate} className="btn-primary w-full flex items-center justify-center gap-2">
          <Download size={14} /> Install Update
        </button>
      )}
    </div>
  );
}

function SettingsRow({ icon: Icon, label, desc, color = "rgba(255,255,255,0.35)", children }: {
  icon: any; label: string; desc?: string; color?: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Icon size={15} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{ background: checked ? "rgba(0,229,204,0.25)" : "rgba(255,255,255,0.08)", border: `1px solid ${checked ? "rgba(0,229,204,0.4)" : "rgba(255,255,255,0.1)"}` }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
        style={{ left: checked ? "calc(100% - 22px)" : 2, background: checked ? "#00E5CC" : "rgba(255,255,255,0.4)", boxShadow: checked ? "0 0 8px rgba(0,229,204,0.5)" : "none" }} />
    </button>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { data: devices = [] } = trpc.devices.list.useQuery();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [bleAlways, setBleAlways] = useState(true);

  return (

      <div className="p-4 sm:p-6 space-y-8 animate-fade-up">

        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">Settings</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Device management, preferences, and firmware updates
          </p>
        </div>

        {/* Profile card */}
        <div className="metric-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #00E5CC)", boxShadow: "0 0 20px rgba(0,229,204,0.2)" }}>
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">{user?.name ?? "User"}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{user?.email ?? "Signed in via EoS OAuth"}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00E5CC", boxShadow: "0 0 4px #00E5CC" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#00E5CC" }}>Active session</span>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Preferences */}
        <div className="space-y-2">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Preferences</p>
          <div className="metric-card p-0 overflow-hidden">
            <SettingsRow icon={Moon} label="Dark Mode" desc="Optimized for low-light health monitoring" color="#A78BFA">
              <Toggle checked={true} onChange={() => {}} />
            </SettingsRow>
            <SettingsRow icon={Activity} label="Health Alerts" desc="Notify on HR, SpO₂, and BAC anomalies" color="#FF6B6B">
              <Toggle checked={notifications} onChange={setNotifications} />
            </SettingsRow>
            <SettingsRow icon={Wifi} label="Auto Cloud Sync" desc="Sync health data to EoS Cloud on Wi-Fi" color="#60A5FA">
              <Toggle checked={autoSync} onChange={setAutoSync} />
            </SettingsRow>
          </div>
        </div>

        {/* Connectivity */}
        <div className="space-y-2">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Connectivity</p>
          <div className="metric-card p-0 overflow-hidden">
            <SettingsRow icon={Bluetooth} label="Bluetooth BLE 5.0" desc="nRF52840 — always scanning for devices" color="#60A5FA">
              <Toggle checked={bleAlways} onChange={setBleAlways} />
            </SettingsRow>
            <SettingsRow icon={Wifi} label="Wi-Fi Sync" desc="802.11n — sync when on home network" color="#00E5CC">
              <span className="text-xs font-semibold" style={{ color: "#00E5CC" }}>Connected</span>
            </SettingsRow>
            <SettingsRow icon={Battery} label="USB-C Wired" desc="Direct connection via USB-C Male plug" color="#F59E0B">
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>Not connected</span>
            </SettingsRow>
          </div>
        </div>

        {/* Firmware */}
        <div className="space-y-3">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Firmware Updates</p>
          {(devices as any[]).length === 0 ? (
            <div className="metric-card flex flex-col items-center justify-center py-10 gap-3">
              <Download size={28} style={{ color: "rgba(255,255,255,0.1)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                No devices paired.{" "}
                <Link href="/app/devices" className="text-sm font-semibold" style={{ color: "#00E5CC" }}>Pair a device</Link>
                {" "}to manage firmware.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {(devices as any[]).map((d: any) => <FirmwareCard key={d.id} device={d} />)}
            </div>
          )}
        </div>

        {/* Security */}
        <div className="space-y-2">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Security & Legal</p>
          <div className="metric-card p-0 overflow-hidden">
            <SettingsRow icon={Shield} label="Security" desc="OAuth 2.0 · AES-256 · TLS 1.3 end-to-end" color="#00E5CC">
              <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
            </SettingsRow>
            <SettingsRow icon={Info} label="EoS Health v1.0.0" desc="EmbeddedOS Research Foundation · MIT License" color="rgba(255,255,255,0.35)">
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>v1.0.0</span>
            </SettingsRow>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

  );
}
