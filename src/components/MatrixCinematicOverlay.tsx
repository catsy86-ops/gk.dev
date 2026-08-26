import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldAlert, X, Zap } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { useAchievements } from "@/hooks/use-achievements";
import { hapticSuccess } from "@/lib/haptics";

interface MatrixCinematicOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

const KATAKANA =
  "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ1234567890ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";

export const MatrixCinematicOverlay = ({
  isActive,
  onClose,
}: MatrixCinematicOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const { unlock } = useAchievements();

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(5.0);
      return;
    }

    // Trigger celebration & achievement
    hapticSuccess();
    unlock("matrix_hacker");

    const startTime = performance.now();
    const duration = 5000; // 5.0s exactly

    const timerInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max((duration - elapsed) / 1000, 0);
      setTimeLeft(parseFloat(remaining.toFixed(2)));

      if (remaining <= 0) {
        clearInterval(timerInterval);
        onClose();
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(timerInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onClose, unlock]);

  // Matrix Rain Canvas Animation
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      // Semi-transparent black rect creates fading trail effect
      ctx.fillStyle = "rgba(5, 10, 15, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = KATAKANA.charAt(Math.floor(Math.random() * KATAKANA.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Check distance to mouse for interactive ripple glow
        const distToMouse = Math.hypot(x - mouseX, y - mouseY);
        const isNearMouse = distToMouse < 100;

        if (isNearMouse) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
        } else if (Math.random() > 0.95) {
          // Leading white-hot spark
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 8;
        } else {
          // Matrix neon green & cyan
          ctx.fillStyle = i % 3 === 0 ? "#06b6d4" : "#10b981";
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, y);

        // Reset drop when exceeding screen height with random staggered respawn
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100000] flex flex-col justify-between bg-black text-emerald-400 overflow-hidden select-none pointer-events-auto"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.96,
            filter: "blur(12px)",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Tryb Matrix Digital Rain"
        >
          {/* Matrix Stream Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 z-0" />

          {/* Scanline CRT overlay effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-60" />

          {/* Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10" />

          {/* Top Cyberpunk HUD Header */}
          <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 backdrop-blur-sm bg-black/40 border-b border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <div className="flex flex-col">
                <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-emerald-300 uppercase flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-emerald-400" />
                  NEURAL REALITY BREACH // ACTIVE
                </span>
                <span className="font-mono text-[10px] text-emerald-500/80">
                  KERNEL DECRYPT PROTOCOL v2026.04 // CLOUD ARCHITECTURE
                </span>
              </div>
            </div>

            {/* Countdown Badge & Close Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-sm font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Zap className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>{timeLeft.toFixed(2)}s</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Wyłącz tryb Matrix"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center Holographic Glyphs */}
          <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="rounded-3xl border border-emerald-500/40 bg-black/70 backdrop-blur-md px-6 sm:px-10 py-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] max-w-lg"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400/90 font-bold block mb-1">
                SYSTEM CORE UNLOCKED
              </span>
              <h2 className="font-['Geist'] text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                GK.DEV MATRIX
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-mono text-emerald-300/80">
                Witaj w rdzeniu architektury. Poruszaj kursorem, aby zakłócić deszcz kodu.
              </p>
            </motion.div>
          </div>

          {/* Bottom Decrypt Terminal Footer */}
          <div className="relative z-20 p-4 sm:p-6 backdrop-blur-sm bg-black/40 border-t border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-400/90">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 animate-pulse" />
              <span>STACK: REACT 19 // TYPESCRIPT // THREE.JS // CLOUD EDGE</span>
            </div>
            <div className="hidden sm:inline-block text-emerald-500">
              STATUS: 100% DECRYPTED
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
