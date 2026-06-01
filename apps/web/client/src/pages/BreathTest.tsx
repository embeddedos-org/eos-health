import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/hooks/useSimulation";
import { AlertTriangle, CheckCircle, ChevronRight, FlaskConical, Wind, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Step = "idle" | "ready" | "inhale" | "blow" | "analyzing" | "result";
type TestResult = { bac: number; voc: number; status: "Clear" | "Caution" | "Alert" };

const statusConfig = {
  Clear: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle },
  Caution: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
  Alert: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
};

function classifyBAC(bac: number): "Clear" | "Caution" | "Alert" {
  if (bac < 0.04) return "Clear";
  if (bac < 0.08) return "Caution";
  return "Alert";
}

const steps: { id: Step; label: string; desc: string; duration?: number }[] = [
  { id: "ready", label: "Get Ready", desc: "Hold the device's USB-C port near your mouth. Make sure you haven't eaten or drunk anything for 15 minutes." },
  { id: "inhale", label: "Deep Inhale", desc: "Take a slow, deep breath in through your nose. Fill your lungs completely.", duration: 4 },
  { id: "blow", label: "Blow Steadily", desc: "Blow a slow, steady breath into the Venturi channel for 5 seconds.", duration: 5 },
  { id: "analyzing", label: "Analyzing", desc: "Processing your breath sample through the electrochemical sensor…", duration: 3 },
];

export default function BreathTest() {
  const [step, setStep] = useState<Step>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const { data: devices = [] } = trpc.devices.list.useQuery();
  const { data: history = [], refetch } = trpc.breathTest.getHistory.useQuery({ limit: 20 });
  const activeDevice = devices.find(d => d.isConnected) ?? devices[0];

  const submitTest = trpc.breathTest.submit.useMutation({
    onSuccess: () => { refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const runStep = (stepId: Step, duration?: number) => {
    setStep(stepId);
    setProgress(0);
    if (!duration) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + (100 / (duration * 10));
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
    }, duration * 1000);
    return interval;
  };

  const sim = useSimulation();

  // When simulation returns a breath result, capture it
  useEffect(() => {
    if (!sim.breathResult || step !== "analyzing") return;
    const bac = sim.breathResult.bac;
    const voc = sim.breathResult.vocPpm;
    const status = classifyBAC(bac);
    const testResult = { bac, voc, status };
    setResult(testResult);
    setStep("result");
    if (activeDevice) {
      submitTest.mutate({
        deviceId: activeDevice.id,
        testType: "Both",
        bacValue: bac,
        vocPpm: voc,
        result: status,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.breathResult]);

  const startTest = async () => {
    runStep("ready");
    await new Promise(r => setTimeout(r, 2500));
    runStep("inhale", 4);
    await new Promise(r => setTimeout(r, 4200));
    runStep("blow", 5);
    await new Promise(r => setTimeout(r, 5200));
    runStep("analyzing", 3);
    // Trigger the simulation engine to produce a breath result
    sim.triggerBreathTest();
    // Fallback: if no WS result arrives in 4s, generate locally
    await new Promise(r => setTimeout(r, 4000));
    if (step === "analyzing") {
      const bac = Math.random() * 0.03;
      const voc = 15 + Math.random() * 20;
      const status = classifyBAC(bac);
      setResult({ bac, voc, status });
      setStep("result");
      if (activeDevice) {
        submitTest.mutate({
          deviceId: activeDevice.id,
          testType: "Both",
          bacValue: bac,
          vocPpm: voc,
          result: status,
        });
      }
    }
  };

  const reset = () => { setStep("idle"); setResult(null); setProgress(0); };

  const currentStepInfo = steps.find(s => s.id === step);

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-semibold">Breath Test</h1>
        <p className="text-sm text-muted-foreground mt-1">BAC and VOC analysis via the Venturi breath channel</p>
      </div>

      {/* Test flow */}
      <div className="metric-card p-8 text-center space-y-6">
        {step === "idle" && (
          <div className="space-y-5">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto">
              <FlaskConical className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-semibold">Ready to Test</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                The Breath Test uses the Venturi channel in your device's USB-C port to measure Blood Alcohol Content (BAC) and Volatile Organic Compounds (VOC).
              </p>
            </div>
            <Button size="lg" className="gap-2 px-8" onClick={startTest}>
              <Wind className="w-4 h-4" /> Begin Breath Test
            </Button>
          </div>
        )}

        {step !== "idle" && step !== "result" && currentStepInfo && (
          <div className="space-y-5">
            <div className={cn(
              "w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto transition-all",
              step === "analyzing" ? "border-primary/40 bg-primary/10 animate-pulse" : "border-teal-500/40 bg-teal-500/10"
            )}>
              <Wind className={cn("w-8 h-8", step === "analyzing" ? "text-primary" : "text-teal-400")} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display font-semibold">{currentStepInfo.label}</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">{currentStepInfo.desc}</p>
            </div>
            {currentStepInfo.duration && (
              <div className="space-y-2 max-w-xs mx-auto">
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
              </div>
            )}
          </div>
        )}

        {step === "result" && result && (
          <div className="space-y-5">
            {(() => {
              const cfg = statusConfig[result.status];
              const Icon = cfg.icon;
              return (
                <>
                  <div className={cn("w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto", cfg.bg)}>
                    <Icon className={cn("w-8 h-8", cfg.color)} />
                  </div>
                  <div className="space-y-1">
                    <h2 className={cn("text-2xl font-display font-bold", cfg.color)}>{result.status}</h2>
                    <p className="text-sm text-muted-foreground">Breath analysis complete</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className={cn("p-4 rounded-xl border", cfg.bg)}>
                      <p className="text-xs text-muted-foreground">BAC</p>
                      <p className={cn("text-2xl font-display font-bold", cfg.color)}>{result.bac.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground">g/dL</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-muted/10">
                      <p className="text-xs text-muted-foreground">VOC</p>
                      <p className="text-2xl font-display font-bold text-foreground">{result.voc.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">ppm</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={reset}>Test Again</Button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Step indicator */}
      {step !== "idle" && step !== "result" && (
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-semibold",
                s.id === step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
              )}>{i + 1}</div>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
            </div>
          ))}
        </div>
      )}

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-sm font-display font-semibold">Test History</h2>
        {history.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">No breath tests recorded yet</div>
        ) : (
          <div className="space-y-2">
            {history.map((test) => {
              const cfg = statusConfig[test.result ?? "Clear"];
              const Icon = cfg.icon;
              return (
                <div key={test.id} className="metric-card px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", cfg.color)} />
                    <div>
                      <p className="text-xs font-medium">{new Date(test.recordedAt).toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">
                        BAC: {test.bacValue?.toFixed(3) ?? "—"} g/dL · VOC: {test.vocPpm?.toFixed(1) ?? "—"} ppm
                      </p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-semibold", cfg.bg, cfg.color)}>
                    {test.result}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
