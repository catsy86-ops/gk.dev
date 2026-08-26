import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Cpu } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { ThreeLoadingScene } from "@/components/ThreeLoadingScene";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500; // 1.5s loader with 3D Matrix scene

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        soundEngine.playChime();
        setIsDone(true);
        setTimeout(onComplete, 600);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070a11] text-foreground overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ["circle(100% at 50% 50%)", "circle(0% at 50% 50%)"],
            opacity: [1, 0],
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          role="status"
          aria-label="Inicjalizacja portfolio GK.dev"
        >
          {/* Three.js 3D WebGL Matrix Digital Rain & Hologram Canvas */}
          <ThreeLoadingScene />

          {/* Vignette Overlay for cinematic contrast */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-[1]" />

          {/* Central 3D GK.DEV Floating Interface */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-7 px-4 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* 3D Cybernetic Monogram Badge */}
            <div className="relative group">
              <motion.div
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/90 via-cyan-500/80 to-indigo-600/90 shadow-[0_0_60px_rgba(59,130,246,0.6)] border border-cyan-400/40 backdrop-blur-xl"
                animate={{
                  rotateZ: [0, 2, -2, 0],
                  boxShadow: [
                    "0 0 40px rgba(59,130,246,0.5)",
                    "0 0 70px rgba(6,182,212,0.8)",
                    "0 0 40px rgba(59,130,246,0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="font-['Geist'] text-3xl font-black text-white tracking-tighter drop-shadow-md">
                    GK
                  </span>
                  <span className="font-mono text-[9px] font-extrabold text-cyan-200 tracking-widest uppercase">
                    .DEV
                  </span>
                </div>
              </motion.div>
              <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl -z-10 animate-pulse" />
            </div>

            {/* Title & System Telemetry */}
            <div className="text-center space-y-2">
              <h1 className="font-['Geist'] text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                <span>GK.DEV</span>
                <span className="text-emerald-400 font-mono font-medium text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-sm">
                  v2026.0
                </span>
              </h1>
              <p className="font-mono text-xs text-cyan-300/80 flex items-center justify-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>Ładowanie modułów Three.js & Matrix Rain...</span>
              </p>
            </div>

            {/* Futuristic Progress HUD & Percentage */}
            <div className="flex flex-col items-center gap-2.5 w-full max-w-[280px]">
              <div className="w-full h-2 rounded-full bg-slate-900/80 border border-cyan-500/30 overflow-hidden relative shadow-inner p-0.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.9)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="w-full flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                  <Cpu className="h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
                  INITIALIZING
                </span>
                <span className="font-bold text-white tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
