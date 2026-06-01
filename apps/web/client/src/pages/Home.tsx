import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

/* ── Animated counter hook ─────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

/* ── Competitor comparison data ────────────────────────── */
const COMPETITORS = [
  {
    name: "EoS Health",
    tag: "SUPERIOR",
    accent: "teal",
    price: "$399",
    priceNote: "one-time",
    features: {
      ecg: { v: true, label: "Clinical-Grade, On-Demand" },
      semg: { v: true, label: "Integrated sEMG + TENS" },
      storage: { v: true, label: "64GB Built-In Flash" },
      bac: { v: true, label: "Built-In BAC Sensor" },
      holo: { v: true, label: "Holographic Display (CIP)" },
      usbc: { v: true, label: "Dual USB-C (Male + Female)" },
    },
  },
  {
    name: "WHOOP 4.0",
    tag: null,
    accent: "gray",
    price: "$359/yr",
    priceNote: "subscription",
    features: {
      ecg: { v: false, label: "Not Available" },
      semg: { v: false, label: "Not Available" },
      storage: { v: false, label: "Not Available" },
      bac: { v: false, label: "Not Available" },
      holo: { v: false, label: "Not Available" },
      usbc: { v: false, label: "Proprietary Charger" },
    },
  },
  {
    name: "Oura Ring 4",
    tag: null,
    accent: "gray",
    price: "$349",
    priceNote: "+ $5.99/mo",
    features: {
      ecg: { v: false, label: "Not Available" },
      semg: { v: false, label: "Not Available" },
      storage: { v: false, label: "Not Available" },
      bac: { v: false, label: "Not Available" },
      holo: { v: false, label: "Not Available" },
      usbc: { v: false, label: "Not Available" },
    },
  },
  {
    name: "Fitbit Sense 2",
    tag: null,
    accent: "gray",
    price: "$249",
    priceNote: "+ Premium",
    features: {
      ecg: { v: false, label: "Limited" },
      semg: { v: false, label: "Not Available" },
      storage: { v: false, label: "Not Available" },
      bac: { v: false, label: "Not Available" },
      holo: { v: false, label: "Not Available" },
      usbc: { v: false, label: "Proprietary Charger" },
    },
  },
];

const FEATURE_ROWS = [
  { key: "ecg", label: "ECG", icon: "♥" },
  { key: "semg", label: "sEMG / TENS", icon: "⚡" },
  { key: "storage", label: "64GB Storage", icon: "💾" },
  { key: "bac", label: "BAC Sensor", icon: "🫁" },
  { key: "holo", label: "Holographic Display", icon: "✦" },
  { key: "usbc", label: "USB-C", icon: "🔌" },
];

/* ── Bento feature items ───────────────────────────────── */
const BENTO = [
  {
    col: "col-span-12 md:col-span-7",
    accent: "teal",
    icon: "♥",
    title: "Clinical-Grade ECG",
    body: "Medical-quality electrocardiogram on demand. P-QRS-T waveform with anomaly detection — AFib, bradycardia, tachycardia — streamed live to your phone.",
    tag: "HEALTH-KEY ULTRA + HEALTH-BAND Neuro",
  },
  {
    col: "col-span-12 md:col-span-5",
    accent: "violet",
    icon: "⚡",
    title: "sEMG + TENS",
    body: "Bidirectional neuromuscular interface. Read muscle signals, train gesture classifiers, deliver therapeutic TENS stimulation.",
    tag: "HEALTH-BAND Neuro Exclusive",
  },
  {
    col: "col-span-12 md:col-span-4",
    accent: "teal",
    icon: "💾",
    title: "64GB Data Vault",
    body: "Your health data travels with you. Plug into any computer — it appears as a 64GB drive with ECG recordings, BAC history, and sleep logs.",
    tag: "Offline-First",
  },
  {
    col: "col-span-12 md:col-span-4",
    accent: "teal",
    icon: "🫁",
    title: "Breath Analysis",
    body: "BAC and VOC detection via electrochemical sensor. Blow once — get a precise reading in under 3 seconds.",
    tag: "Patent Pending",
  },
  {
    col: "col-span-12 md:col-span-4",
    accent: "violet",
    icon: "✦",
    title: "Holographic Display",
    body: "Micro-LED array behind a holographic diffuser film. Iridescent floating-text effect. CIP patent filed — the future of wearable displays.",
    tag: "CIP Patent",
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [compVisible, setCompVisible] = useState(false);

  const sensors = useCounter(12, 1600, statsVisible);
  const hz = useCounter(250, 1400, statsVisible);
  const storage = useCounter(64, 1200, statsVisible);
  const patents = useCounter(2, 1000, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const statsEl = document.getElementById("stats-section");
    if (statsEl) obs.observe(statsEl);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCompVisible(true); },
      { threshold: 0.1 }
    );
    const compEl = document.getElementById("compare-section");
    if (compEl) obs.observe(compEl);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(5% 0.02 240)" }}>
      {/* ── Ambient Orbs ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="orb-teal animate-orb-drift" style={{ width: 600, height: 600, top: "-10%", left: "-5%", opacity: 0.6 }} />
        <div className="orb-violet animate-orb-drift delay-500" style={{ width: 500, height: 500, bottom: "10%", right: "-5%", opacity: 0.5 }} />
        <div className="orb-teal" style={{ width: 300, height: 300, top: "40%", right: "20%", opacity: 0.3 }} />
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b" style={{ borderColor: "oklch(100% 0 0 / 6%)" }}>
        <div className="container flex items-center justify-between h-16 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, oklch(82% 0.18 185), oklch(55% 0.28 295))", color: "oklch(5% 0.02 240)" }}>
              E
            </div>
            <span className="font-display font-bold text-lg tracking-tight" style={{ color: "oklch(92% 0.008 240)" }}>
              EoS Health
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {["Products", "Compare", "Patents", "Research"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
                style={{ color: "oklch(65% 0.035 240)" }}>
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/app/dashboard"
                className="btn-primary text-sm py-2 px-5">
                Open App →
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()} className="btn-ghost text-sm py-2 px-4">Sign In</a>
                <a href={getLoginUrl()} className="btn-primary text-sm py-2 px-5">Get Started →</a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="container text-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass-teal animate-fade-in"
            style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", color: "oklch(82% 0.18 185)" }}>
            <span className="live-dot" />
            NOW LIVE — NEURAL EDITION V1.0 · 2 PATENTS FILED
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold mb-6 animate-fade-up"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            <span style={{ color: "oklch(92% 0.008 240)" }}>Health Intelligence</span>
            <br />
            <span className="text-gradient-dual">Beyond Human Limits</span>
          </h1>

          <p className="mx-auto mb-10 animate-fade-up delay-200"
            style={{ maxWidth: 600, fontSize: "1.125rem", color: "oklch(65% 0.035 240)", lineHeight: 1.7 }}>
            Two patent-protected devices. One unified platform. Real-time biometrics, neural interfaces,
            and medical-grade ECG — in your wrist and your keychain.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up delay-300">
            <Link href="/app/dashboard" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
              Launch App →
            </Link>
            <a href="#compare" className="btn-ghost" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
              Compare vs Competitors
            </a>
          </div>

          {/* Stats row */}
          <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto animate-fade-up delay-400">
            {[
              { val: sensors, suffix: "+", label: "SENSORS" },
              { val: hz, suffix: "Hz", label: "SAMPLE RATE" },
              { val: storage, suffix: "GB", label: "DATA VAULT" },
              { val: patents, suffix: "", label: "PATENTS FILED" },
            ].map(({ val, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-gradient-teal"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {val}{suffix}
                </div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "oklch(50% 0.035 240)", marginTop: "0.25rem" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 max-w-5xl mx-auto animate-fade-up delay-500">
          <div className="glass rounded-2xl overflow-hidden border" style={{ borderColor: "oklch(82% 0.18 185 / 15%)", boxShadow: "0 40px 120px oklch(82% 0.18 185 / 10%), 0 0 0 1px oklch(82% 0.18 185 / 8%)" }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663397835904/F8ReaDLne62oUKZ3YQNdJQ/eos_mobile_screens-hbfp26oBHD3JW8YzEmzxDt.png"
              alt="EoS Health App — Dashboard, ECG, and TENS screens"
              className="w-full"
              style={{ display: "block" }}
            />
          </div>
          {/* Floating metric pills */}
          <div className="absolute -top-4 -left-4 glass-teal rounded-xl px-4 py-2 animate-float hidden md:flex items-center gap-2">
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "oklch(82% 0.18 185)" }}>72</span>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "oklch(82% 0.18 185 / 70%)" }}>BPM</div>
              <div style={{ fontSize: "0.65rem", color: "oklch(65% 0.035 240)" }}>Heart Rate</div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 glass-violet rounded-xl px-4 py-2 animate-float delay-300 hidden md:flex items-center gap-2">
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "oklch(65% 0.25 295)" }}>98%</span>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "oklch(65% 0.25 295 / 70%)" }}>SpO₂</div>
              <div style={{ fontSize: "0.65rem", color: "oklch(65% 0.035 240)" }}>Oxygen</div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-teal rounded-xl px-5 py-2 animate-float delay-200 hidden md:flex items-center gap-3">
            <span className="live-dot" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "oklch(82% 0.18 185)" }}>LIVE STREAMING · HEALTH-BAND Neuro</span>
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────── */}
      <section id="products" className="py-24 px-4 relative" style={{ zIndex: 1 }}>
        <div className="container">
          <div className="text-center mb-16">
            <div className="status-badge status-badge-teal inline-flex mb-4">Two Devices. One Platform.</div>
            <h2 className="font-display font-bold mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "oklch(92% 0.008 240)" }}>
              Patent-Protected Hardware
            </h2>
            <p style={{ color: "oklch(65% 0.035 240)", maxWidth: 500, margin: "0 auto" }}>
              Both devices share the same nRF52840 MCU, BLE 5.3, and dual USB-C architecture.
              Different form factors. Identical intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* HEALTH-KEY ULTRA */}
            <div className="glass rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: "oklch(82% 0.18 185 / 15%)", boxShadow: "0 20px 60px oklch(0% 0 0 / 30%)" }}>
              <div className="relative h-64 overflow-hidden" style={{ background: "oklch(8% 0.025 240)" }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663397835904/F8ReaDLne62oUKZ3YQNdJQ/eos_healthkey_hero-Jp98XayGjW4upjjBwAabgQ.png"
                  alt="HEALTH-KEY ULTRA"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 status-badge status-badge-teal">Patent Pending</div>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl mb-1" style={{ color: "oklch(92% 0.008 240)" }}>
                  HEALTH-KEY ULTRA
                </h3>
                <p className="text-sm mb-4" style={{ color: "oklch(65% 0.035 240)" }}>
                  USB-C keychain dongle. Plug into your phone — instant ECG, BAC, SpO₂, and 64GB health data vault.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {["ECG On-Demand", "64GB Vault", "BAC Sensor", "BLE 5.3"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "oklch(65% 0.035 240)" }}>
                      <span style={{ color: "oklch(82% 0.18 185)" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <Link href="/app/products" className="btn-primary w-full justify-center" style={{ fontSize: "0.875rem" }}>
                  View Specs & Patent →
                </Link>
              </div>
            </div>

            {/* HEALTH-BAND Neuro */}
            <div className="glass rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: "oklch(55% 0.28 295 / 15%)", boxShadow: "0 20px 60px oklch(0% 0 0 / 30%)" }}>
              <div className="relative h-64 overflow-hidden" style={{ background: "oklch(8% 0.025 240)" }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663397835904/F8ReaDLne62oUKZ3YQNdJQ/eos_healthband_hero-m6hRBwUaTSvGxvsVZhdjAL.png"
                  alt="HEALTH-BAND Neuro"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 status-badge status-badge-violet">Patent Pending</div>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl mb-1" style={{ color: "oklch(92% 0.008 240)" }}>
                  HEALTH-BAND Neuro
                </h3>
                <p className="text-sm mb-4" style={{ color: "oklch(65% 0.035 240)" }}>
                  Flexible wristband with OLED display, sEMG, TENS therapy, ECG, and 64GB onboard storage. Zero-Hole Architecture.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {["sEMG + TENS", "0.49″ OLED", "ECG + SpO₂", "64GB Vault"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "oklch(65% 0.035 240)" }}>
                      <span style={{ color: "oklch(65% 0.25 295)" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <Link href="/app/products" className="btn-ghost w-full justify-center"
                  style={{ fontSize: "0.875rem", borderColor: "oklch(55% 0.28 295 / 30%)", color: "oklch(65% 0.25 295)" }}>
                  View Specs & Patent →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento Features ───────────────────────────────── */}
      <section className="py-24 px-4 relative" style={{ zIndex: 1 }}>
        <div className="container">
          <div className="text-center mb-16">
            <div className="status-badge status-badge-violet inline-flex mb-4">Feature Set</div>
            <h2 className="font-display font-bold mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "oklch(92% 0.008 240)" }}>
              Everything No Competitor Has
            </h2>
          </div>

          <div className="bento-grid">
            {BENTO.map((item, i) => (
              <div key={i}
                className={`${item.col} glass rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 animate-fade-up`}
                style={{
                  borderColor: item.accent === "teal" ? "oklch(82% 0.18 185 / 12%)" : "oklch(55% 0.28 295 / 12%)",
                  animationDelay: `${i * 80}ms`
                }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{
                      background: item.accent === "teal" ? "oklch(82% 0.18 185 / 12%)" : "oklch(55% 0.28 295 / 12%)",
                      border: `1px solid ${item.accent === "teal" ? "oklch(82% 0.18 185 / 20%)" : "oklch(55% 0.28 295 / 20%)"}`
                    }}>
                    {item.icon}
                  </div>
                  <span className={`status-badge ${item.accent === "teal" ? "status-badge-teal" : "status-badge-violet"}`}
                    style={{ fontSize: "0.65rem" }}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2" style={{ color: "oklch(92% 0.008 240)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(65% 0.035 240)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitor Comparison ────────────────────────── */}
      <section id="compare" className="py-24 px-4 relative" style={{ zIndex: 1 }}>
        <div className="container">
          <div className="text-center mb-16">
            <div className="status-badge status-badge-teal inline-flex mb-4">Competitive Analysis</div>
            <h2 className="font-display font-bold mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "oklch(92% 0.008 240)" }}>
              The Clear Leader
            </h2>
            <p style={{ color: "oklch(65% 0.035 240)" }}>
              EoS Health outperforms every competitor on every dimension that matters.
            </p>
          </div>

          {/* Comparison image */}
          <div className="glass rounded-2xl overflow-hidden border mb-12"
            style={{ borderColor: "oklch(82% 0.18 185 / 15%)" }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663397835904/F8ReaDLne62oUKZ3YQNdJQ/eos_competitor_comparison-DEq3gwWyzXrL5NuK5kS3Lh.png"
              alt="EoS Health vs Whoop vs Oura vs Fitbit vs Apple Health"
              className="w-full"
            />
          </div>

          {/* Interactive comparison table */}
          <div id="compare-section" className="glass rounded-2xl overflow-hidden border"
            style={{ borderColor: "oklch(100% 0 0 / 6%)" }}>
            {/* Header */}
            <div className="grid overflow-x-auto" style={{ gridTemplateColumns: "1fr repeat(4, 1fr)" }}>
              <div className="p-4 border-b" style={{ borderColor: "oklch(100% 0 0 / 6%)" }} />
              {COMPETITORS.map((c, ci) => (
                <div key={ci} className="p-4 border-b border-l text-center"
                  style={{
                    borderColor: "oklch(100% 0 0 / 6%)",
                    background: ci === 0 ? "oklch(82% 0.18 185 / 6%)" : "transparent"
                  }}>
                  {c.tag && (
                    <div className="status-badge status-badge-teal mx-auto mb-2" style={{ fontSize: "0.6rem", justifyContent: "center" }}>
                      {c.tag}
                    </div>
                  )}
                  <div className="font-display font-bold text-sm" style={{ color: ci === 0 ? "oklch(82% 0.18 185)" : "oklch(65% 0.035 240)" }}>
                    {c.name}
                  </div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: ci === 0 ? "oklch(82% 0.18 185)" : "oklch(50% 0.035 240)" }}>
                    {c.price}
                  </div>
                  <div className="text-xs" style={{ color: "oklch(45% 0.03 240)" }}>{c.priceNote}</div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {FEATURE_ROWS.map((row, ri) => (
              <div key={ri} className="grid" style={{ gridTemplateColumns: "1fr repeat(4, 1fr)" }}>
                <div className="p-4 flex items-center gap-2 border-b" style={{ borderColor: "oklch(100% 0 0 / 6%)" }}>
                  <span>{row.icon}</span>
                  <span className="text-sm font-medium" style={{ color: "oklch(80% 0.015 240)" }}>{row.label}</span>
                </div>
                {COMPETITORS.map((c, ci) => {
                  const feat = c.features[row.key as keyof typeof c.features];
                  return (
                    <div key={ci} className="p-4 border-b border-l text-center flex flex-col items-center justify-center gap-1"
                      style={{
                        borderColor: "oklch(100% 0 0 / 6%)",
                        background: ci === 0 ? "oklch(82% 0.18 185 / 4%)" : "transparent"
                      }}>
                      <span style={{
                        fontSize: "1rem",
                        color: feat.v ? "oklch(82% 0.18 185)" : "oklch(40% 0.02 240)"
                      }}>
                        {feat.v ? "✓" : "✗"}
                      </span>
                      <span className="text-xs" style={{ color: feat.v ? "oklch(65% 0.035 240)" : "oklch(40% 0.02 240)" }}>
                        {feat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 relative" style={{ zIndex: 1 }}>
        <div className="container text-center">
          <div className="glass rounded-3xl p-12 border relative overflow-hidden"
            style={{ borderColor: "oklch(82% 0.18 185 / 15%)", maxWidth: 700, margin: "0 auto" }}>
            <div className="orb-teal" style={{ width: 400, height: 400, top: "-50%", left: "50%", transform: "translateX(-50%)", opacity: 0.4 }} />
            <div className="relative">
              <h2 className="font-display font-bold mb-4"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "oklch(92% 0.008 240)" }}>
                Health Intelligence,<br />
                <span className="text-gradient-dual">Starting Now</span>
              </h2>
              <p className="mb-8" style={{ color: "oklch(65% 0.035 240)" }}>
                Join the platform that outperforms every wearable on the market.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {isAuthenticated ? (
                  <Link href="/app/dashboard" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                    Open Dashboard →
                  </Link>
                ) : (
                  <a href={getLoginUrl()} className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                    Get Started Free →
                  </a>
                )}
                <Link href="/app/products" className="btn-ghost" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                  View Patents
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "oklch(100% 0 0 / 6%)", zIndex: 1, position: "relative" }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, oklch(82% 0.18 185), oklch(55% 0.28 295))", color: "oklch(5% 0.02 240)" }}>
              E
            </div>
            <span className="font-display font-semibold" style={{ color: "oklch(65% 0.035 240)" }}>EoS Health</span>
          </div>
          <div className="flex items-center gap-6">
            {["GitHub", "Research", "Patents", "Contact"].map(l => (
              <a key={l} href="#" className="text-sm transition-colors hover:text-white"
                style={{ color: "oklch(50% 0.03 240)" }}>{l}</a>
            ))}
          </div>
          <p className="text-xs" style={{ color: "oklch(40% 0.02 240)" }}>
            © 2025 EoS Health · US Provisional Patent 64/073,334
          </p>
        </div>
      </footer>
    </div>
  );
}
