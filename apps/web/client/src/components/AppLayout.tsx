import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Activity, Battery, Bluetooth, Brain, ChevronRight,
  Database, FileText, FlaskConical, Heart,
  LogOut, Menu, Settings, Waves, X, Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/app/dashboard", icon: Activity, label: "Dashboard" },
    ],
  },
  {
    label: "Health Data",
    items: [
      { href: "/app/ecg", icon: Heart, label: "ECG Viewer" },
      { href: "/app/breath-test", icon: FlaskConical, label: "Breath Test" },
    ],
  },
  {
    label: "HEALTH-BAND Neuro",
    items: [
      { href: "/app/tens", icon: Zap, label: "TENS Control", badge: "Neuro" },
      { href: "/app/gesture-trainer", icon: Brain, label: "Gesture Trainer", badge: "Neuro" },
    ],
  },
  {
    label: "Device & Data",
    items: [
      { href: "/app/vault", icon: Database, label: "Data Vault" },
      { href: "/app/devices", icon: Bluetooth, label: "Connectivity" },
    ],
  },
  {
    label: "Info",
    items: [
      { href: "/app/products", icon: FileText, label: "Products & Patents" },
      { href: "/app/settings", icon: Settings, label: "Settings" },
    ],
  },
];

function LiveStatusBar() {
  const [hr, setHr] = useState(68);
  const [connected, setConnected] = useState(false);
  const [battery, setBattery] = useState(82);
  const [deviceName, setDeviceName] = useState("EoS Device");

  useEffect(() => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/api/ws/simulate`);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.type === "vitals") { setHr(d.hr); setBattery(d.battery ?? 82); }
        if (d.type === "health" && d.deviceType) setDeviceName(d.deviceType);
      } catch {}
    };
    return () => ws.close();
  }, []);

  return (
    <div className="mx-3 mb-3 rounded-2xl p-3 relative overflow-hidden"
      style={{ background: "rgba(0,229,204,0.04)", border: "1px solid rgba(0,229,204,0.1)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,229,204,0.06) 0%, transparent 70%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="live-dot" style={{ opacity: connected ? 1 : 0.25 }} />
            <span className="text-xs font-bold tracking-widest uppercase"
              style={{ color: connected ? "#00E5CC" : "rgba(255,255,255,0.25)" }}>
              {connected ? "Live" : "Offline"}
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Battery size={10} />
            <span className="text-xs font-mono-data">{battery}%</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Heart size={12} className="animate-heartbeat" style={{ color: "#FF6B6B" }} />
            <span className="font-mono-data text-base font-bold text-white">{hr}</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>bpm</span>
          </div>
          <div className="h-3 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{deviceName}</span>
        </div>
      </div>
    </div>
  );
}

function EoSLogo() {
  return (
    <div className="flex items-center gap-3 px-4 py-5 mb-1">
      <div className="relative w-9 h-9 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,204,0.15), rgba(124,58,237,0.15))",
            border: "1px solid rgba(0,229,204,0.2)",
            boxShadow: "0 0 20px rgba(0,229,204,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}>
          <Activity size={17} style={{ color: "#00E5CC", filter: "drop-shadow(0 0 4px rgba(0,229,204,0.6))" }} />
        </div>
      </div>
      <div>
        <div className="text-sm font-bold text-white leading-tight tracking-tight">EoS Health</div>
        <div className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.6rem" }}>Neural Edition</div>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, badge, isActive }: {
  href: string; icon: any; label: string; badge?: string; isActive: boolean;
}) {
  return (
    <Link href={href}
      className={`sidebar-item ${isActive ? "active" : ""}`}
      style={isActive ? {
        background: "rgba(0,229,204,0.07)",
        borderColor: "rgba(0,229,204,0.15)",
        color: "#00E5CC",
        boxShadow: "0 0 16px rgba(0,229,204,0.04)",
      } : {}}>
      <Icon size={15} className="sidebar-icon flex-shrink-0"
        style={isActive ? { color: "#00E5CC", filter: "drop-shadow(0 0 5px rgba(0,229,204,0.5))" } : {}} />
      <span className="flex-1 truncate text-sm">{label}</span>
      {badge && !isActive && (
        <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
          style={{
            background: "rgba(124,58,237,0.1)",
            color: "#A78BFA",
            border: "1px solid rgba(124,58,237,0.2)",
            fontSize: "0.58rem",
            letterSpacing: "0.05em",
          }}>
          {badge}
        </span>
      )}
      {isActive && (
        <div className="w-1 h-4 rounded-full flex-shrink-0"
          style={{ background: "#00E5CC", boxShadow: "0 0 8px rgba(0,229,204,0.7)" }} />
      )}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
  });

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050810" }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 56 56" className="w-full h-full" style={{ animation: "spin 2s linear infinite" }}>
              <defs>
                <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5CC" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle cx="28" cy="28" r="24" strokeWidth="2" stroke="rgba(255,255,255,0.06)" fill="none" />
              <circle cx="28" cy="28" r="24" strokeWidth="2" stroke="url(#spin-grad)" fill="none"
                strokeDasharray="75 75" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: "#00E5CC" }}>EoS</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Initializing…</p>
        </div>
      </div>
    );
  }

  /* Unauthenticated */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050810" }}>
        <div className="orb-teal w-[600px] h-[600px]" style={{ top: "-150px", left: "-150px", position: "absolute" }} />
        <div className="orb-violet w-[500px] h-[500px]" style={{ bottom: "-100px", right: "-100px", position: "absolute" }} />
        <div className="relative z-10 text-center animate-fade-up max-w-sm px-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, rgba(0,229,204,0.12), rgba(124,58,237,0.12))",
              border: "1px solid rgba(0,229,204,0.2)",
              boxShadow: "0 0 40px rgba(0,229,204,0.12)",
            }}>
            <Activity size={36} style={{ color: "#00E5CC", filter: "drop-shadow(0 0 8px rgba(0,229,204,0.6))" }} />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">EoS Health</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sign in to access your health dashboard
          </p>
          <a href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "linear-gradient(135deg, #00E5CC, #00BFA8)",
              color: "#050810",
              boxShadow: "0 4px 24px rgba(0,229,204,0.35)",
            }}>
            Sign In <ChevronRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <>
      <EoSLogo />
      <LiveStatusBar />
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-1.5 text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.6rem" }}>
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map(({ href, icon, label, badge }: any) => {
                const isActive = location === href || (href !== "/app" && location.startsWith(href));
                return (
                  <NavItem key={href} href={href} icon={icon} label={label} badge={badge} isActive={isActive} />
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      {/* User footer */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3 px-3 py-3 mt-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #00E5CC, #7C3AED)",
              color: "#050810",
              boxShadow: "0 0 12px rgba(0,229,204,0.25)",
            }}>
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.name ?? "User"}</div>
            <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem" }}>
              {user?.email ?? ""}
            </div>
          </div>
          <button onClick={() => logoutMutation.mutate()}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            title="Sign out">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#050810" }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 fixed top-0 left-0 h-full z-40"
        style={{
          background: "rgba(5,8,16,0.98)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(32px)",
        }}>
        {sidebarContent}
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(5,8,16,0.97)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
        }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.18)" }}>
            <Activity size={14} style={{ color: "#00E5CC" }} />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">EoS Health</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="live-dot" />
            <span className="text-xs font-bold tracking-widest" style={{ color: "#00E5CC" }}>LIVE</span>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex flex-col w-64 h-full animate-slide-left"
            style={{
              background: "rgba(5,8,16,0.99)",
              borderRight: "1px solid rgba(255,255,255,0.07)",
            }}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              <X size={16} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{
          background: "rgba(5,8,16,0.97)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
        }}>
        {[
          { href: "/app/dashboard", icon: Activity, label: "Live" },
          { href: "/app/ecg", icon: Heart, label: "ECG" },
          { href: "/app/breath-test", icon: Waves, label: "Breath" },
          { href: "/app/vault", icon: Database, label: "Vault" },
          { href: "/app/settings", icon: Settings, label: "More" },
        ].map(({ href, icon: Icon, label }) => {
          const isActive = location.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{
                color: isActive ? "#00E5CC" : "rgba(255,255,255,0.3)",
                background: isActive ? "rgba(0,229,204,0.07)" : "transparent",
              }}>
              <Icon size={18} style={isActive ? { filter: "drop-shadow(0 0 4px rgba(0,229,204,0.5))" } : {}} />
              <span className="text-xs font-semibold" style={{ fontSize: "0.6rem", letterSpacing: "0.05em" }}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
