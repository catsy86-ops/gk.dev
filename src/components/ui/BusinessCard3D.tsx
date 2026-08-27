import { useState } from "react";
import { motion } from "motion/react";
import { useAchievements } from "@/hooks/use-achievements";
import { soundEngine } from "@/lib/audio";
import { hapticMedium } from "@/lib/haptics";

const STACK = [
  { emoji: "⚛️", label: "React 19" },
  { emoji: "🔷", label: "TypeScript" },
  { emoji: "🟢", label: "Node.js" },
  { emoji: "▲",  label: "Next.js" },
  { emoji: "🐘", label: "PostgreSQL" },
  { emoji: "☁️", label: "AWS" },
];

export const BusinessCard3D = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false);
  const { unlock } = useAchievements();

  const handleFlip = () => {
    soundEngine.playPop(880, 0.03);
    hapticMedium();
    setIsFlipped((prev) => !prev);
    if (!hasFlippedOnce) {
      setHasFlippedOnce(true);
      setTimeout(() => unlock("card_flipper"), 400);
    }
  };

  return (
    <div
      className="w-[280px] sm:w-[320px] h-[170px] sm:h-[190px] cursor-pointer select-none"
      style={{ perspective: "900px" }}
      onClick={handleFlip}
      onMouseEnter={() => { if (!isFlipped) setIsFlipped(true); }}
      onMouseLeave={() => { if (isFlipped) setIsFlipped(false); }}
      role="button"
      tabIndex={0}
      aria-label="Interaktywna wizytówka 3D — obróć aby zobaczyć stack technologiczny"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleFlip(); }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* ── AWERS ── */}
        <div
          className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_60%)]" />
          <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-black text-base backdrop-blur-sm border border-white/30">
                  GK
                </div>
                <div>
                  <p className="font-['Geist'] font-bold text-sm leading-tight">Grzegorz</p>
                  <p className="font-mono text-[10px] text-white/70">Fullstack Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono bg-emerald-400/20 border border-emerald-400/40 px-2 py-1 rounded-full text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dostępny
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] text-white/50 mb-0.5">📍 Szczecin, PL · CET</p>
              <p className="font-mono text-xs text-white/80">kontakt@gkdev.pl</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-['Geist'] text-[10px] text-white/40 font-medium">gkdev.pl · 2026</p>
              {!hasFlippedOnce && (
                <motion.p
                  className="text-[9px] font-mono text-white/50 flex items-center gap-1"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ↻ Najedź aby obrócić
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* ── REWERS ── */}
        <div
          className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.6)_0%,_transparent_60%)]" />
          <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5">
            <div>
              <p className="font-mono text-[9px] text-primary/80 font-semibold uppercase tracking-widest mb-2.5">
                Stack Technologiczny
              </p>
              <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                {STACK.map((s) => (
                  <div key={s.label} className="flex items-center gap-1 text-[10px] text-slate-300 font-mono">
                    <span className="text-xs">{s.emoji}</span>
                    <span className="truncate">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-white/10 pt-3">
              <div>
                <p className="font-mono text-[9px] text-slate-500 mb-0.5">E-mail</p>
                <p className="font-mono text-xs text-primary">kontakt@gkdev.pl</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold px-2 py-1 rounded-lg font-mono">
                  ✓ Zatrudnij mnie
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
