import {
  Activity, ArrowRight, Battery, Bluetooth, Brain, CheckCircle, ChevronRight,
  FileText, FlaskConical, Heart, Layers, Shield, Usb, Waves, Wifi, Zap, Star,
  Clock, Award, TrendingUp
} from "lucide-react";
import { useParams } from "wouter";
import { useState } from "react";
import { Link } from "wouter";

/* ─── HEALTH-KEY ULTRA ─── */
const hku = {
  id: "health-key-ultra",
  name: "HEALTH-KEY ULTRA",
  tagline: "Clinical-grade biometrics in your keychain.",
  desc: "A dual USB-C health monitoring dongle that plugs directly into your phone or laptop. The USB-C Male plug acts as both a clasp and a direct data/power connection, while the USB-C Female port houses the Venturi breath channel and sensor array.",
  accent: "#00E5CC",
  accentSoft: "rgba(0,229,204,0.08)",
  accentBorder: "rgba(0,229,204,0.2)",
  gradient: "linear-gradient(135deg, rgba(0,229,204,0.12) 0%, rgba(0,229,204,0.02) 100%)",
  specs: [
    { label: "MCU", value: "Nordic nRF52840 · 64MHz Cortex-M4F" },
    { label: "ECG", value: "ADS1292R · 24-bit · 500 SPS · Lead I" },
    { label: "SpO₂ / HR", value: "MAX30102 reflective PPG" },
    { label: "BAC Sensor", value: "Electrochemical ethanol cell (Venturi channel)" },
    { label: "Storage", value: "64GB NAND flash (USB Mass Storage Class)" },
    { label: "Connectivity", value: "BLE 5.0 · USB-C wired · Wi-Fi 802.11n" },
    { label: "Form Factor", value: "Dual USB-C keychain dongle" },
    { label: "Power", value: "Bus-powered via USB-C Male plug" },
    { label: "AI", value: "TinyML on-device arrhythmia detection" },
  ],
  sensors: ["ECG (Lead I)", "SpO₂", "Heart Rate", "BAC", "VOC", "Temperature"],
  sensorIcons: [Waves, Activity, Heart, FlaskConical, Brain, Zap],
  patent: {
    number: "64/073,334",
    filed: "May 23, 2024",
    title: "Provisional Patent — USB-C Health Monitoring Dongle",
    claims: [
      "USB-C Male plug as analog sensor shield and structural clasp",
      "Venturi breath channel integrated into USB-C Female port geometry",
      "Dual-port pass-through architecture for simultaneous charging and sensing",
      "On-device TinyML arrhythmia classification with <200ms latency",
    ],
    cip: {
      title: "CIP — Wireless Charging + Edge AI + BLE Mesh",
      deadline: "May 23, 2027",
      claims: [
        "Qi wireless charging coil integrated into keychain housing",
        "On-device neural network inference for continuous health scoring",
        "BLE Mesh networking for multi-device health data aggregation",
        "Federated learning protocol for privacy-preserving model updates",
      ],
    },
  },
  roadmap: [
    { phase: "V1", period: "Now", items: ["ECG + SpO₂ + BAC", "64GB local storage", "BLE + USB-C", "TinyML arrhythmia"] },
    { phase: "V2", period: "2025", items: ["Qi wireless charging", "Wi-Fi sync", "Edge AI health scoring", "OTA firmware"] },
    { phase: "V3", period: "2026", items: ["BLE Mesh networking", "Federated learning", "Clinical validation", "FDA 510(k)"] },
  ],
};

/* ─── HEALTH-BAND Neuro ─── */
const hbn = {
  id: "health-band-neuro",
  name: "HEALTH-BAND Neuro",
  tagline: "The world's first bidirectional neuromuscular wristband.",
  desc: "A flexible wristband with Zero-Hole Architecture — the only openings are the two USB-C ports. The Male end clasps the band and passes through charging to your phone. The Female end houses the Venturi breath channel. A flush 0.49\" Micro OLED display shows live health metrics.",
  accent: "#7C3AED",
  accentSoft: "rgba(124,58,237,0.08)",
  accentBorder: "rgba(124,58,237,0.2)",
  gradient: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.02) 100%)",
  specs: [
    { label: "MCU", value: "Nordic nRF52840 · 64MHz Cortex-M4F" },
    { label: "ECG", value: "ADS1292R · 24-bit · 500 SPS · Lead I" },
    { label: "SpO₂ / HR", value: "MAX30102 reflective PPG" },
    { label: "BAC Sensor", value: "Electrochemical ethanol cell (Venturi channel)" },
    { label: "sEMG", value: "8-channel surface EMG · 2kHz · 24-bit ADC" },
    { label: "TENS", value: "Biphasic waveform · 1–150Hz · 0–80mA · 50–500μs" },
    { label: "Display", value: "0.49\" Micro OLED · 128×64 · flush-mounted" },
    { label: "Storage", value: "64GB NAND flash (USB Mass Storage Class)" },
    { label: "Battery", value: "200mAh Li-Po · pass-through charging" },
    { label: "Connectivity", value: "BLE 5.0 · USB-C wired · Wi-Fi 802.11n" },
    { label: "Architecture", value: "Zero-Hole Architecture™" },
  ],
  sensors: ["ECG (Lead I)", "SpO₂", "Heart Rate", "BAC", "VOC", "sEMG (8ch)", "TENS", "Temperature", "Accelerometer"],
  sensorIcons: [Waves, Activity, Heart, FlaskConical, Brain, Zap, Battery, Layers, TrendingUp],
  patent: {
    number: "64/073,335",
    filed: "May 23, 2024",
    title: "Provisional Patent — Zero-Hole Neuromuscular Wristband",
    claims: [
      "Zero-Hole Architecture: wristband with no openings except two USB-C ports",
      "USB-C Male plug as structural clasp and pass-through charging conduit",
      "Bidirectional neuromuscular interface combining sEMG sensing and TENS therapy",
      "Venturi breath channel integrated into USB-C Female port geometry",
      "Flush-mounted Micro OLED display in flexible wristband substrate",
    ],
    cip: {
      title: "CIP — Holographic Micro-LED Diffuser Display",
      deadline: "May 23, 2027",
      claims: [
        "Micro-LED array behind holographic diffuser film embedded in band surface",
        "Iridescent floating-text visual effect without conventional flat-panel substrate",
        "Holographic diffuser film bonded to flexible TPU wristband material",
        "Multiplexed micro-LED addressing for health metric overlay display",
      ],
    },
  },
  roadmap: [
    { phase: "V1", period: "Now", items: ["ECG + SpO₂ + BAC + sEMG + TENS", "Micro OLED display", "64GB storage", "Zero-Hole Architecture"] },
    { phase: "V2", period: "2025", items: ["Holographic Micro-LED display (CIP)", "Advanced gesture classifier", "Clinical TENS programs", "OTA firmware"] },
    { phase: "V3", period: "2026", items: ["FDA 510(k) submission", "Clinical sEMG prosthetics API", "Federated health model", "Enterprise SDK"] },
  ],
};

const products = { "health-key-ultra": hku, "health-band-neuro": hbn };

type Tab = "specs" | "patent" | "cip" | "roadmap";

function ProductCard({ product, active, onClick }: { product: typeof hku; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200"
      style={{
        background: active ? product.gradient : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? product.accentBorder : "rgba(255,255,255,0.06)"}`,
        boxShadow: active ? `0 0 30px ${product.accentSoft}` : "none",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: product.accentSoft, border: `1px solid ${product.accentBorder}` }}>
          <Shield size={14} style={{ color: product.accent }} />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{product.name}</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{product.tagline}</div>
        </div>
      </div>
    </button>
  );
}

export default function ProductInfo() {
  const params = useParams<{ device?: string }>();
  const deviceKey = params.device ?? "health-key-ultra";
  const product = products[deviceKey as keyof typeof products] ?? hku;
  const [activeTab, setActiveTab] = useState<Tab>("specs");
  const [selectedProduct, setSelectedProduct] = useState<typeof hku>(product);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "specs", label: "Specifications", icon: Layers },
    { id: "patent", label: "Patent", icon: FileText },
    { id: "cip", label: "CIP Strategy", icon: Award },
    { id: "roadmap", label: "Roadmap", icon: TrendingUp },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-up">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Products & Patents
          </span>
        </div>
        <h1 className="text-2xl font-display font-bold text-white">Product Intelligence</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Patent documentation, technical specifications, and roadmap for both EoS Health devices.
        </p>
      </div>

      {/* Product selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ProductCard product={hku} active={selectedProduct.id === "health-key-ultra"}
          onClick={() => setSelectedProduct(hku)} />
        <ProductCard product={hbn} active={selectedProduct.id === "health-band-neuro"}
          onClick={() => setSelectedProduct(hbn)} />
      </div>

      {/* Selected product detail */}
      <div className="metric-card overflow-hidden">
        {/* Product hero */}
        <div className="relative p-6 rounded-xl mb-6 overflow-hidden"
          style={{ background: selectedProduct.gradient, border: `1px solid ${selectedProduct.accentBorder}` }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 80% 50%, ${selectedProduct.accentSoft} 0%, transparent 70%)` }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="pill-optimal" style={{
                background: `${selectedProduct.accentSoft}`,
                borderColor: selectedProduct.accentBorder,
                color: selectedProduct.accent,
              }}>
                Patent Filed
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                App. No. {selectedProduct.patent.number}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-1">{selectedProduct.name}</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{selectedProduct.tagline}</p>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", maxWidth: "600px" }}>
              {selectedProduct.desc}
            </p>
          </div>
        </div>

        {/* Sensor badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedProduct.sensors.map((s, i) => {
            const Icon = selectedProduct.sensorIcons[i] ?? Activity;
            return (
              <div key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{ background: selectedProduct.accentSoft, border: `1px solid ${selectedProduct.accentBorder}`, color: selectedProduct.accent }}>
                <Icon size={10} />
                {s}
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: activeTab === id ? selectedProduct.accentSoft : "transparent",
                border: activeTab === id ? `1px solid ${selectedProduct.accentBorder}` : "1px solid transparent",
                color: activeTab === id ? selectedProduct.accent : "rgba(255,255,255,0.35)",
              }}>
              <Icon size={11} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "specs" && (
          <div className="space-y-1 animate-fade-in">
            {selectedProduct.specs.map(({ label, value }, i) => (
              <div key={label} className="flex items-start gap-4 py-3 animate-fade-up"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", animationDelay: `${i * 30}ms` }}>
                <span className="text-xs font-semibold uppercase tracking-wider w-28 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                <span className="text-sm text-white font-medium flex-1">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "patent" && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-xl p-5" style={{ background: selectedProduct.accentSoft, border: `1px solid ${selectedProduct.accentBorder}` }}>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} style={{ color: selectedProduct.accent }} />
                <span className="text-sm font-bold text-white">{selectedProduct.patent.title}</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Clock size={10} className="inline mr-1" />Filed: {selectedProduct.patent.filed}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  App. No. {selectedProduct.patent.number}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                Independent Claims
              </h3>
              <div className="space-y-2.5">
                {selectedProduct.patent.claims.map((claim, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                      style={{ background: selectedProduct.accentSoft, color: selectedProduct.accent }}>
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{claim}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                Patent Process Timeline
              </h3>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Provisional Filed", status: "done", date: "May 2024" },
                  { step: "2", label: "Non-Provisional (Utility)", status: "active", date: "Due May 2025" },
                  { step: "3", label: "USPTO Examination", status: "pending", date: "2025–2026" },
                  { step: "4", label: "Office Action Response", status: "pending", date: "2026" },
                  { step: "5", label: "Patent Grant", status: "pending", date: "Est. 2027" },
                ].map(({ step, label, status, date }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: status === "done" ? selectedProduct.accentSoft : status === "active" ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${status === "done" ? selectedProduct.accentBorder : status === "active" ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                        color: status === "done" ? selectedProduct.accent : status === "active" ? "#F59E0B" : "rgba(255,255,255,0.3)",
                      }}>
                      {status === "done" ? "✓" : step}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cip" && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-xl p-5" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Award size={14} style={{ color: "#A78BFA" }} />
                <span className="text-sm font-bold text-white">{selectedProduct.patent.cip.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Clock size={10} className="inline mr-1" />CIP Filing Deadline: {selectedProduct.patent.cip.deadline}
                </span>
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                A Continuation-in-Part (CIP) patent application allows you to add new subject matter to the original patent while retaining the priority date for the original claims. This protects next-generation innovations under the same patent family.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                CIP Claims
              </h3>
              <div className="space-y-2.5">
                {selectedProduct.patent.cip.claims.map((claim, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                      style={{ background: "rgba(124,58,237,0.1)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.25)" }}>
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{claim}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                Why File a CIP?
              </h3>
              <div className="space-y-2">
                {[
                  "Protects next-generation features under the original patent family",
                  "Retains the May 2024 priority date for all original claims",
                  "Blocks competitors from patenting the CIP innovations independently",
                  "Strengthens the overall IP portfolio for licensing and fundraising",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#A78BFA" }} />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-4 animate-fade-in">
            {selectedProduct.roadmap.map(({ phase, period, items }, phaseIdx) => (
              <div key={phase} className="animate-fade-up" style={{ animationDelay: `${phaseIdx * 100}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: phaseIdx === 0 ? selectedProduct.accentSoft : "rgba(255,255,255,0.04)",
                      border: `1px solid ${phaseIdx === 0 ? selectedProduct.accentBorder : "rgba(255,255,255,0.08)"}`,
                      color: phaseIdx === 0 ? selectedProduct.accent : "rgba(255,255,255,0.4)",
                    }}>
                    {phase}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">{phase}</span>
                    <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{period}</span>
                  </div>
                  {phaseIdx === 0 && (
                    <span className="ml-auto pill-optimal" style={{
                      background: selectedProduct.accentSoft,
                      borderColor: selectedProduct.accentBorder,
                      color: selectedProduct.accent,
                    }}>Current</span>
                  )}
                </div>
                <div className="ml-11 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <ChevronRight size={12} style={{ color: selectedProduct.accent, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
                {phaseIdx < selectedProduct.roadmap.length - 1 && (
                  <div className="ml-4 mt-3 w-px h-4" style={{ background: "rgba(255,255,255,0.06)" }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare both devices CTA */}
      <div className="metric-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Compare Both Devices</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              HEALTH-KEY ULTRA vs HEALTH-BAND Neuro — side by side.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/app/products/health-key-ultra"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.15)", color: "#00E5CC" }}>
              HEALTH-KEY ULTRA <ArrowRight size={11} />
            </Link>
            <Link href="/app/products/health-band-neuro"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", color: "#A78BFA" }}>
              HEALTH-BAND Neuro <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
