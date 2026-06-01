import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/hooks/useSimulation";
import {
  Battery, Bluetooth, Check, Plus, Radio, Signal,
  Trash2, Usb, Wifi, X, Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const connectionIcons = { BLE: Bluetooth, "USB-C": Usb, "Wi-Fi": Wifi };
const connectionColors = {
  BLE: "text-blue-400",
  "USB-C": "text-amber-400",
  "Wi-Fi": "text-green-400",
};

// Simulated nearby devices that appear during a BLE scan
const SCAN_RESULTS = [
  { id: "scan-1", name: "HEALTH-BAND Neuro #A3F2", deviceType: "HEALTH-BAND Neuro" as const, rssi: -52, serial: "HBN-2024-A3F2" },
  { id: "scan-2", name: "HEALTH-KEY ULTRA #7B1C", deviceType: "HEALTH-KEY ULTRA" as const, rssi: -68, serial: "HKU-2024-7B1C" },
  { id: "scan-3", name: "HEALTH-BAND Neuro #C9D4", deviceType: "HEALTH-BAND Neuro" as const, rssi: -74, serial: "HBN-2024-C9D4" },
];

type ScanState = "idle" | "scanning" | "found" | "pairing" | "done";

function BLEScanPanel({ onPaired }: { onPaired: () => void }) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [visibleDevices, setVisibleDevices] = useState<typeof SCAN_RESULTS>([]);
  const [pairingId, setPairingId] = useState<string | null>(null);

  const sim = useSimulation();
  const pair = trpc.devices.pair.useMutation({
    onSuccess: (device) => {
      setScanState("done");
      toast.success("Device paired and streaming");
      // Switch simulation to the paired device type
      sim.setDevice(device.deviceType as "HEALTH-KEY ULTRA" | "HEALTH-BAND Neuro");
      onPaired();
    },
    onError: (e) => toast.error(e.message),
  });

  const startScan = () => {
    setScanState("scanning");
    setScanProgress(0);
    setVisibleDevices([]);

    // Progressively reveal scanned devices
    const interval = setInterval(() => {
      setScanProgress(p => {
        const next = p + 4;
        if (next >= 100) {
          clearInterval(interval);
          setScanState("found");
        }
        return Math.min(next, 100);
      });
    }, 100);

    // Stagger device appearances
    SCAN_RESULTS.forEach((device, i) => {
      setTimeout(() => {
        setVisibleDevices(prev => [...prev, device]);
      }, 800 + i * 700);
    });
  };

  const pairDevice = (device: typeof SCAN_RESULTS[0]) => {
    setPairingId(device.id);
    setScanState("pairing");
    setTimeout(() => {
      pair.mutate({
        deviceType: device.deviceType,
        name: device.name,
        serialNumber: device.serial,
        connectionType: "BLE",
      });
    }, 1800);
  };

  const reset = () => {
    setScanState("idle");
    setScanProgress(0);
    setVisibleDevices([]);
    setPairingId(null);
  };

  return (
    <div className="metric-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            scanState === "scanning" ? "bg-blue-500/15 border border-blue-500/30" : "bg-muted/30 border border-border"
          )}>
            <Radio className={cn("w-4 h-4", scanState === "scanning" ? "text-blue-400 animate-pulse" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-sm font-medium">Bluetooth Scan</p>
            <p className="text-xs text-muted-foreground">nRF52840 BLE 5.0</p>
          </div>
        </div>
        {scanState === "idle" && (
          <Button size="sm" variant="outline" className="gap-2 text-xs" onClick={startScan}>
            <Bluetooth className="w-3.5 h-3.5" /> Scan for Devices
          </Button>
        )}
        {(scanState === "found" || scanState === "done") && (
          <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      {scanState === "scanning" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Scanning for EoS devices…</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-1" />
          <div className="space-y-2">
            {visibleDevices.map((d) => (
              <div key={d.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20 border border-border/50 animate-fade-up">
                <Bluetooth className="w-3.5 h-3.5 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground">{d.rssi} dBm</p>
                </div>
                <Signal className="w-3 h-3 text-muted-foreground/50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {scanState === "found" && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{visibleDevices.length} device{visibleDevices.length !== 1 ? "s" : ""} found — tap to pair</p>
          {visibleDevices.map((d) => (
            <button
              key={d.id}
              onClick={() => pairDevice(d)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                {d.deviceType === "HEALTH-BAND Neuro"
                  ? <Zap className="w-4 h-4 text-primary" />
                  : <Usb className="w-4 h-4 text-amber-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{d.name}</p>
                <p className="text-[10px] text-muted-foreground">{d.deviceType} · {d.rssi} dBm · S/N {d.serial}</p>
              </div>
              <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {scanState === "pairing" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center animate-pulse">
            <Bluetooth className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium">Pairing…</p>
          <p className="text-xs text-muted-foreground">Exchanging keys with device</p>
        </div>
      )}

      {scanState === "done" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm font-medium text-green-400">Paired & Streaming</p>
          <p className="text-xs text-muted-foreground">Device is now sending live data</p>
        </div>
      )}

      {scanState === "idle" && (
        <p className="text-xs text-muted-foreground/60 text-center py-2">
          Make sure your device is powered on and within 10m
        </p>
      )}
    </div>
  );
}

function PairDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    deviceType: "HEALTH-BAND Neuro" as "HEALTH-KEY ULTRA" | "HEALTH-BAND Neuro",
    name: "",
    serialNumber: "",
    connectionType: "BLE" as "BLE" | "USB-C" | "Wi-Fi",
  });
  const pair = trpc.devices.pair.useMutation({
    onSuccess: () => {
      toast.success("Device paired successfully");
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-3.5 h-3.5" /> Manual Pair
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Pair a New Device</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Device Type</Label>
            <Select
              value={form.deviceType}
              onValueChange={(v) => setForm(f => ({ ...f, deviceType: v as typeof form.deviceType }))}
            >
              <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="HEALTH-KEY ULTRA">HEALTH-KEY ULTRA</SelectItem>
                <SelectItem value="HEALTH-BAND Neuro">HEALTH-BAND Neuro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Device Name</Label>
            <Input
              placeholder="My HEALTH-BAND Neuro"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Serial Number (optional)</Label>
            <Input
              placeholder="HBN-2024-XXXX"
              value={form.serialNumber}
              onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value }))}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Connection Type</Label>
            <Select
              value={form.connectionType}
              onValueChange={(v) => setForm(f => ({ ...f, connectionType: v as typeof form.connectionType }))}
            >
              <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="BLE">Bluetooth (BLE)</SelectItem>
                <SelectItem value="USB-C">USB-C Wired</SelectItem>
                <SelectItem value="Wi-Fi">Wi-Fi Sync</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            disabled={!form.name || pair.isPending}
            onClick={() => pair.mutate(form)}
          >
            {pair.isPending ? "Pairing…" : "Pair Device"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Devices() {
  const utils = trpc.useUtils();
  const sim = useSimulation();
  const { data: devices = [], isLoading } = trpc.devices.list.useQuery();
  const deleteDevice = trpc.devices.delete.useMutation({
    onSuccess: () => { toast.success("Device removed"); utils.devices.list.invalidate(); },
  });
  const updateDevice = trpc.devices.update.useMutation({
    onSuccess: () => utils.devices.list.invalidate(),
  });

  // Sync simulation battery/signal to connected device record
  useEffect(() => {
    if (!sim.health || devices.length === 0) return;
    const active = devices.find(d => d.isConnected);
    if (!active) return;
    updateDevice.mutate({ id: active.id, batteryLevel: sim.health.battery });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.health?.battery]);

  const connected = devices.filter(d => d.isConnected);
  const disconnected = devices.filter(d => !d.isConnected);

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold">Connectivity Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your HEALTH-KEY ULTRA and HEALTH-BAND Neuro devices
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sim.connected && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400">
              <Bluetooth className="w-3 h-3" />
              <span>Simulation Active</span>
            </div>
          )}
          <PairDialog onSuccess={() => utils.devices.list.invalidate()} />
        </div>
      </div>

      {/* BLE Scan panel */}
      <BLEScanPanel onPaired={() => utils.devices.list.invalidate()} />

      {/* Connection type legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        {(["BLE", "USB-C", "Wi-Fi"] as const).map((type) => {
          const Icon = connectionIcons[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <Icon className={cn("w-3.5 h-3.5", connectionColors[type])} />
              <span>{type}</span>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-muted/30 border border-border">
          <TabsTrigger value="all">All ({devices.length})</TabsTrigger>
          <TabsTrigger value="connected">Connected ({connected.length})</TabsTrigger>
          <TabsTrigger value="disconnected">Offline ({disconnected.length})</TabsTrigger>
        </TabsList>

        {["all", "connected", "disconnected"].map((tab) => {
          const list = tab === "all" ? devices : tab === "connected" ? connected : disconnected;
          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              {isLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map(i => <div key={i} className="h-36 rounded-xl animate-shimmer" />)}
                </div>
              ) : list.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Bluetooth className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    No devices {tab !== "all" ? tab : "paired"} yet
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Use the BLE scan above or "Manual Pair" to add a device
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {list.map((device) => {
                    const ConnIcon = connectionIcons[device.connectionType ?? "BLE"];
                    const connColor = connectionColors[device.connectionType ?? "BLE"];
                    const isSimActive = sim.connected && device.isConnected;
                    return (
                      <div key={device.id} className={cn(
                        "metric-card p-5 space-y-4 transition-all",
                        isSimActive && "border-primary/20 bg-primary/3"
                      )}>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                device.isConnected ? "bg-green-400 pulse-dot" : "bg-muted-foreground/40"
                              )} />
                              <span className="text-xs text-muted-foreground">
                                {device.isConnected ? (isSimActive ? "Streaming live" : "Connected") : "Offline"}
                              </span>
                            </div>
                            <h3 className="font-display font-semibold text-sm">{device.name}</h3>
                            <p className="text-xs text-muted-foreground">{device.deviceType}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateDevice.mutate({ id: device.id, isConnected: !device.isConnected })}
                              className="p-1.5 rounded-md hover:bg-muted/30 transition-colors"
                              title={device.isConnected ? "Disconnect" : "Connect"}
                            >
                              {device.isConnected
                                ? <X className="w-3.5 h-3.5 text-muted-foreground" />
                                : <Check className="w-3.5 h-3.5 text-green-400" />
                              }
                            </button>
                            <button
                              onClick={() => deleteDevice.mutate({ id: device.id })}
                              className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <ConnIcon className={cn("w-3.5 h-3.5", connColor)} />
                            <span>{device.connectionType}</span>
                          </div>
                          {device.batteryLevel !== null && device.batteryLevel !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Battery className="w-3.5 h-3.5" />
                              <span>{device.batteryLevel}%</span>
                            </div>
                          )}
                          {isSimActive && sim.status && (
                            <div className="flex items-center gap-1.5 text-blue-400">
                              <Signal className="w-3.5 h-3.5" />
                              <span>{sim.status.signalStrength} dBm</span>
                            </div>
                          )}
                          {device.firmwareVersion && (
                            <span className="text-muted-foreground/60">v{device.firmwareVersion}</span>
                          )}
                        </div>
                        {device.serialNumber && (
                          <p className="text-[10px] text-muted-foreground/50 font-mono">
                            S/N: {device.serialNumber}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
