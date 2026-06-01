import { useState } from "react";
import { Link } from "wouter";

const FEATURES = [
  { category: "Biometric Sensing", features: [
    { name: "Heart Rate (HR)",          eos: true,  whoop: true,  oura: true,  fitbit: true,  apple: true  },
    { name: "SpO₂ Blood Oxygen",        eos: true,  whoop: true,  oura: true,  fitbit: true,  apple: true  },
    { name: "ECG / Electrocardiogram",  eos: true,  whoop: false, oura: false, fitbit: true,  apple: true  },
    { name: "BAC Breath Alcohol",       eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "VOC Volatile Organics",    eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Skin Temperature",         eos: true,  whoop: true,  oura: true,  fitbit: true,  apple: false },
    { name: "Stress / HRV",             eos: true,  whoop: true,  oura: true,  fitbit: true,  apple: true  },
  ]},
  { category: "Neuromodulation", features: [
    { name: "sEMG (8-Channel Muscle)",  eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "TENS Therapy",             eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Gesture Recognition",      eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Neuromuscular Feedback",   eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
  ]},
  { category: "Connectivity & Storage", features: [
    { name: "BLE 5.3",                  eos: true,  whoop: true,  oura: true,  fitbit: true,  apple: true  },
    { name: "Wi-Fi Sync",               eos: true,  whoop: true,  oura: false, fitbit: true,  apple: true  },
    { name: "USB-C Wired",              eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "64GB Onboard Flash",       eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "USB Mass Storage (Drive)", eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Pass-Through Charging",    eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
  ]},
  { category: "Display & Form Factor", features: [
    { name: "OLED Display",             eos: true,  whoop: false, oura: false, fitbit: true,  apple: true  },
    { name: "Zero-Hole Architecture",   eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Keychain Form Factor",     eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Flexible Wristband",       eos: true,  whoop: true,  oura: false, fitbit: true,  apple: true  },
  ]},
  { category: "Software & AI", features: [
    { name: "On-Device AI (CIP)",       eos: true,  whoop: false, oura: false, fitbit: false, apple: true  },
    { name: "Gesture Classifier",       eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Anomaly Detection",        eos: true,  whoop: true,  oura: true,  fitbit: false, apple: true  },
    { name: "Open-Source Firmware",     eos: true,  whoop: false, oura: false, fitbit: false, apple: false },
    { name: "Patent-Protected IP",      eos: true,  whoop: true,  oura: true,  fitbit: true,  apple: true  },
  ]},
];

const PRODUCTS = [
  { id: "eos",    name: "EoS Health",    sub: "HEALTH-KEY ULTRA + HEALTH-BAND Neuro", color: "#00E5CC", price: "TBD",    bg: "rgba(0,229,204,0.08)"  },
  { id: "whoop",  name: "Whoop",         sub: "Whoop 4.0",                            color: "#00C896", price: "$239",   bg: "rgba(0,200,150,0.05)"  },
  { id: "oura",   name: "Oura",          sub: "Oura Ring Gen 3",                      color: "#C8A96E", price: "$299",   bg: "rgba(200,169,110,0.05)" },
  { id: "fitbit", name: "Fitbit",        sub: "Charge 6",                             color: "#4285F4", price: "$159",   bg: "rgba(66,133,244,0.05)" },
  { id: "apple",  name: "Apple Watch",   sub: "Series 9",                             color: "#A0A0A0", price: "$399",   bg: "rgba(160,160,160,0.05)" },
];

function CheckIcon({ yes, color }: { yes: boolean; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {yes ? (
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: color + "18", border: `1px solid ${color}40`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color }}>✓</div>
      ) : (
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "rgba(255,255,255,0.15)" }}>—</div>
      )}
    </div>
  );
}

export default function Compare() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const eosScore = FEATURES.flatMap(c => c.features).filter(f => f.eos).length;
  const scores: Record<string, number> = {
    eos: eosScore,
    whoop: FEATURES.flatMap(c => c.features).filter(f => f.whoop).length,
    oura: FEATURES.flatMap(c => c.features).filter(f => f.oura).length,
    fitbit: FEATURES.flatMap(c => c.features).filter(f => f.fitbit).length,
    apple: FEATURES.flatMap(c => c.features).filter(f => f.apple).length,
  };
  const maxScore = Math.max(...Object.values(scores));

  return (
    <div style={{ minHeight: "100vh", background: "#050810", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,204,0.08) 0%, transparent 70%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,204,0.08)",
          border: "1px solid rgba(0,229,204,0.25)", borderRadius: 999, padding: "6px 18px", fontSize: 11,
          fontWeight: 700, color: "#00E5CC", letterSpacing: 0.5, marginBottom: 28 }}>
          ◈ COMPETITIVE ANALYSIS
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
          background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: "0 0 16px", letterSpacing: -1.5, lineHeight: 1.1 }}>
          EoS Health vs. The World
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
          A transparent, feature-by-feature comparison of EoS Health against the leading wearable health platforms.
        </p>

        {/* Score cards */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ background: p.bg, border: `1px solid ${p.color}25`, borderRadius: 16,
              padding: "20px 24px", minWidth: 140, textAlign: "center",
              boxShadow: p.id === "eos" ? `0 0 40px ${p.color}15` : "none",
              transform: p.id === "eos" ? "scale(1.05)" : "scale(1)", transition: "transform 0.2s" }}>
              {p.id === "eos" && (
                <div style={{ fontSize: 9, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  ★ WINNER
                </div>
              )}
              <div style={{ fontSize: 15, fontWeight: 800, color: p.id === "eos" ? p.color : "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2, marginBottom: 12 }}>{p.sub}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: p.color, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -1 }}>{scores[p.id]}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>of {eosScore} features</div>
              {/* Score bar */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(scores[p.id] / maxScore) * 100}%`, background: p.color, borderRadius: 2,
                  boxShadow: `0 0 8px ${p.color}60`, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "#0C1020", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(5, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#080C14" }}>
            <div style={{ padding: "14px 20px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1 }}>Feature</div>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ padding: "14px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: p.id === "eos" ? p.color : "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{p.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{p.price}</div>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {FEATURES.map((cat, ci) => (
            <div key={cat.category}>
              {/* Category header */}
              <div style={{ padding: "10px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1 }}>{cat.category}</span>
              </div>
              {cat.features.map((f, fi) => {
                const rowKey = `${ci}-${fi}`;
                const isHovered = hoveredRow === rowKey;
                return (
                  <div key={f.name}
                    onMouseEnter={() => setHoveredRow(rowKey)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ display: "grid", gridTemplateColumns: "2fr repeat(5, 1fr)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: isHovered ? "rgba(255,255,255,0.02)" : "transparent",
                      transition: "background 0.15s" }}>
                    <div style={{ padding: "12px 20px", fontSize: 12, color: f.eos ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)",
                      display: "flex", alignItems: "center", gap: 8 }}>
                      {f.eos && !f.whoop && !f.oura && !f.fitbit && !f.apple && (
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#00E5CC", background: "rgba(0,229,204,0.12)",
                          border: "1px solid rgba(0,229,204,0.25)", borderRadius: 4, padding: "1px 5px", letterSpacing: 0.5 }}>UNIQUE</span>
                      )}
                      {f.name}
                    </div>
                    {PRODUCTS.map(p => (
                      <div key={p.id} style={{ padding: "12px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckIcon yes={(f as any)[p.id]} color={p.color} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Unique features callout */}
        <div style={{ marginTop: 32, background: "rgba(0,229,204,0.05)", border: "1px solid rgba(0,229,204,0.15)", borderRadius: 16, padding: "24px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#00E5CC", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
            ★ EoS Health Exclusive Features — Not Available on Any Competitor
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["BAC Breath Alcohol Test", "VOC Volatile Organics", "sEMG 8-Channel Muscle Sensing", "TENS Therapy", "Gesture Recognition", "64GB Onboard Flash", "USB Mass Storage", "Zero-Hole Architecture", "Keychain Form Factor", "Pass-Through Charging", "Open-Source Firmware"].map(f => (
              <div key={f} style={{ background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.2)", borderRadius: 999,
                padding: "5px 14px", fontSize: 11, fontWeight: 600, color: "#00E5CC" }}>{f}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/app/dashboard">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#00E5CC",
              color: "#050810", borderRadius: 999, padding: "14px 36px", fontSize: 15, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 0 40px rgba(0,229,204,0.35)", textDecoration: "none" }}>
              Open EoS Health App →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
