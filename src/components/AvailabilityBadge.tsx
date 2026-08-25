import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export const AvailabilityBadge = () => {
  return (
    <motion.div
      className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 backdrop-blur-xl px-3.5 py-1.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </span>
      <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
        Dostępny do projektów
      </span>
      <span className="hidden sm:inline-block text-emerald-500/40" aria-hidden="true">
        •
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
        <Sparkles className="h-2.5 w-2.5 text-emerald-500" />
        Q1/Q2 2026
      </span>
    </motion.div>
  );
};
