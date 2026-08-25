import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal } from "lucide-react";
import { soundEngine } from "@/lib/audio";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400; // 1.4s ultra-smooth loader

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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background text-foreground overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ["circle(100% at 50% 50%)", "circle(0% at 50% 50%)"],
            opacity: [1, 0],
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          role="status"
          aria-label="Inicjalizacja portfolio GK.dev"
        >
          {/* Multi-layer pulsating background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-primary/20"
                initial={{ width: 100, height: 100, opacity: 0 }}
                animate={{
                  width: [100, 240 + i * 100],
                  height: [100, 240 + i * 100],
                  opacity: [0.6, 0],
                  scale: [1, 1.2],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.45,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Ambient center glow */}
          <div className="absolute w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

          {/* Center Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Logo Monogram with Glitch */}
            <div className="relative">
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-accent-blue to-violet-600 shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/20"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-['Geist'] text-3xl font-black text-white tracking-tighter">
                  GK
                </span>
              </motion.div>
              <div className="absolute -inset-1 rounded-3xl bg-primary/30 blur-md -z-10 animate-pulse" />
            </div>

            {/* Title & Tagline */}
            <div className="text-center space-y-1.5">
              <h1 className="font-['Geist'] text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                <span>Grzegorz</span>
                <span className="text-primary font-mono font-medium text-sm px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  v2026.0
                </span>
              </h1>
              <p className="font-mono text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Terminal className="h-3 w-3 text-primary animate-pulse" />
                <span>Inicjalizacja architektury i modułów UI...</span>
              </p>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="flex flex-col items-center gap-3 w-64">
              <div className="w-full h-1.5 rounded-full bg-secondary/80 border border-border/50 overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent-blue to-violet-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="w-full flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  SYSTEM BOOT
                </span>
                <span className="font-bold text-foreground tabular-nums">
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