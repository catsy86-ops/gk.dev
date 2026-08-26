import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bot,
  HardDrive,
} from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess, hapticSelection } from "@/lib/haptics";
import { architecturePresets, type ArchitecturePreset } from "@/lib/architecture-presets";

export const ArchitectureSimulator = () => {
  const [selectedPreset, setSelectedPreset] = useState<ArchitecturePreset>(architecturePresets[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [trafficSpike, setTrafficSpike] = useState(false);
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [logs, setLogs] = useState<{ id: string; time: string; message: string; type: "info" | "success" | "warn" }[]>([
    { id: "1", time: "00:00:01", message: "Inicjalizacja topologii: system w stanie gotowości.", type: "info" },
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string, type: "info" | "success" | "warn" = "info") => {
    const time = new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [...prev.slice(-15), { id: Math.random().toString(), time, message, type }]);
  };

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    soundEngine.playPop(750, 0.04);
    hapticLight();
    addLog(`Uruchomiono pakiet żądań do [${selectedPreset.name}]...`, "info");

    const totalSteps = selectedPreset.nodes.length;
    let step = 0;

    const interval = setInterval(() => {
      if (step < totalSteps) {
        setActiveStep(step);
        const node = selectedPreset.nodes[step];
        soundEngine.playPop(850 + step * 40, 0.02);
        addLog(`Żądanie przeprocesowane przez węzeł: [${node.label}] (${node.latency})`, "info");
        step++;
      } else {
        clearInterval(interval);
        setActiveStep(-1);
        setIsSimulating(false);
        soundEngine.playChime();
        hapticSuccess();
        addLog(`Transakcja zakończona pomyślnie z kodem 200 OK w ${selectedPreset.defaultMetrics.ttfb}ms!`, "success");
      }
    }, 450);
  };

  const handleToggleSpike = () => {
    soundEngine.playClick();
    hapticSelection();
    const nextState = !trafficSpike;
    setTrafficSpike(nextState);
    if (nextState) {
      addLog("⚠️ Symulacja skoku ruchu: +50 000 req/s. Aktywacja auto-scalingu.", "warn");
    } else {
      addLog("Ruch powrócił do normy.", "info");
    }
  };

  const handleToggleCache = () => {
    soundEngine.playClick();
    hapticSelection();
    const nextState = !cacheEnabled;
    setCacheEnabled(nextState);
    if (nextState) {
      addLog("Pamięć podręczna (Redis / Edge Cache) została włączona.", "success");
    } else {
      addLog("⚠️ Bypass cache: wszystkie zapytania uderzają bezpośrednio w bazę danych.", "warn");
    }
  };

  const metrics = {
    ttfb: cacheEnabled
      ? (trafficSpike ? selectedPreset.defaultMetrics.ttfb * 1.4 : selectedPreset.defaultMetrics.ttfb)
      : selectedPreset.defaultMetrics.ttfb * 3.5,
    cacheHitRate: cacheEnabled ? (trafficSpike ? 96.5 : selectedPreset.defaultMetrics.cacheHitRate) : 0,
    p99Latency: cacheEnabled
      ? (trafficSpike ? selectedPreset.defaultMetrics.p99Latency * 1.6 : selectedPreset.defaultMetrics.p99Latency)
      : selectedPreset.defaultMetrics.p99Latency * 4,
    throughput: trafficSpike ? selectedPreset.defaultMetrics.throughput * 4 : selectedPreset.defaultMetrics.throughput,
  };

  return (
    <div className="relative w-full rounded-3xl border border-primary/30 bg-card/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden mb-12">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 relative z-10 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/30 shadow-md shadow-primary/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Geist'] text-lg font-bold text-foreground">
                Symulator Architektury Systemowej
              </h3>
              <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Interactive Telemetry
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Interaktywny model przepływu danych i metryk wydajności
            </p>
          </div>
        </div>

        {/* Preset Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-secondary/80 backdrop-blur-md p-1 rounded-2xl border border-border/70">
          {architecturePresets.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  soundEngine.playPop(800, 0.02);
                  hapticSelection();
                  setSelectedPreset(preset);
                  addLog(`Przełączono profil architektury na: [${preset.name}]`, "info");
                }}
                className={`px-3.5 py-1.5 rounded-xl font-['Geist'] text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {preset.name.split("+")[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm font-['Geist'] text-muted-foreground mb-6 relative z-10">
        {selectedPreset.description}
      </p>

      {/* Live Topology Flow Visualizer */}
      <div className="relative rounded-2xl border border-border/80 bg-background/60 p-4 sm:p-6 mb-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {selectedPreset.nodes.map((node, index) => {
            const isActive = activeStep === index;
            const Icon = node.icon;

            return (
              <div key={node.id} className="flex items-center flex-1 last:flex-none">
                {/* Node Box */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border bg-card/90 shadow-sm transition-all duration-300 min-w-[100px] text-center ${
                    isActive ? "ring-2 ring-primary/40 bg-primary/10 shadow-lg shadow-primary/20" : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border mb-2 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-foreground border-border/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-['Geist'] text-[11px] font-bold text-foreground truncate max-w-[90px]">
                    {node.label}
                  </span>
                  <span className="font-mono text-[9.5px] text-muted-foreground mt-0.5">
                    {node.latency}
                  </span>
                </motion.div>

                {/* Connection Arrow with Animated Pulse */}
                {index < selectedPreset.nodes.length - 1 && (
                  <div className="flex-1 flex items-center justify-center relative px-2">
                    <div className="w-full h-[2px] bg-border relative overflow-hidden">
                      {isSimulating && activeStep === index && (
                        <motion.div
                          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-primary to-transparent"
                          initial={{ left: "-30%" }}
                          animate={{ left: "100%" }}
                          transition={{ duration: 0.45, ease: "linear" }}
                        />
                      )}
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0 ml-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Realtime Telemetry Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-border/70 bg-card/70 p-3.5 text-center">
          <span className="font-mono text-[10.5px] text-muted-foreground uppercase block mb-0.5">
            TTFB Latency
          </span>
          <p className="font-mono text-xl font-bold text-primary">
            {metrics.ttfb.toFixed(0)} <span className="text-xs">ms</span>
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-3.5 text-center">
          <span className="font-mono text-[10.5px] text-muted-foreground uppercase block mb-0.5">
            Cache Hit Ratio
          </span>
          <p className="font-mono text-xl font-bold text-emerald-500">
            {metrics.cacheHitRate.toFixed(1)} <span className="text-xs">%</span>
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-3.5 text-center">
          <span className="font-mono text-[10.5px] text-muted-foreground uppercase block mb-0.5">
            P99 Response
          </span>
          <p className="font-mono text-xl font-bold text-foreground">
            {metrics.p99Latency.toFixed(0)} <span className="text-xs">ms</span>
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-3.5 text-center">
          <span className="font-mono text-[10.5px] text-muted-foreground uppercase block mb-0.5">
            Throughput (RPS)
          </span>
          <p className="font-mono text-xl font-bold text-cyan-500">
            {metrics.throughput.toLocaleString("pl-PL")} <span className="text-xs">req/s</span>
          </p>
        </div>
      </div>

      {/* Control Actions & Log Stream Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-['Geist'] text-xs font-bold text-primary-foreground shadow-md shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{isSimulating ? "Przetwarzanie strumienia..." : "Wyślij pakiet testowy"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleToggleSpike}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-colors ${
                trafficSpike
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                  : "bg-secondary border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{trafficSpike ? "Spike ON" : "Symuluj Spike"}</span>
            </button>

            <button
              onClick={handleToggleCache}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-colors ${
                cacheEnabled
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500"
                  : "bg-destructive/15 border-destructive/40 text-destructive"
              }`}
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>{cacheEnabled ? "Cache: Aktywny" : "Cache: Wyłączony"}</span>
            </button>
          </div>
        </div>

        {/* Live Terminal Telemetry Log */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-black/90 p-3 font-mono text-[11px] h-36 flex flex-col">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800 text-neutral-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE ARCHITECTURE EVENT LOG
            </span>
            <button
              onClick={() => {
                soundEngine.playClick();
                setLogs([{ id: "init", time: "00:00:00", message: "Wyczyszczono bufor logów.", type: "info" }]);
              }}
              className="hover:text-white transition-colors"
              title="Wyczyść"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 pt-2 scrollbar-thin">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-tight">
                <span className="text-neutral-500 shrink-0">[{log.time}]</span>
                <span
                  className={
                    log.type === "success"
                      ? "text-emerald-400"
                      : log.type === "warn"
                      ? "text-amber-400"
                      : "text-neutral-300"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureSimulator;
