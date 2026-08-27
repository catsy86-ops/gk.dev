import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, MessageSquare } from "lucide-react";
import { gkGaduEngine, GkGaduState } from "@/lib/gkgadu-engine";
import { soundEngine } from "@/lib/audio";
import { hapticMedium } from "@/lib/haptics";

interface GkgaduFloatingBubbleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const GkgaduFloatingBubble = ({ isOpen, onToggle }: GkgaduFloatingBubbleProps) => {
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        setIsTyping(true);
      }
    };
    const handleFocusOut = () => {
      setIsTyping(false);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = gkGaduEngine.subscribe((state: GkGaduState) => {
      const total = state.contacts.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setUnreadTotal(total);
    });
    return () => unsubscribe();
  }, []);

  // Global keybinding: press 'G' or 'g' when not inside an input/textarea to toggle GKgadu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "g" || e.key === "G") &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName) &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        soundEngine.playPop(850, 0.03);
        hapticMedium();
        onToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggle]);

  return (
    <div className="hidden sm:block fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[99998] pointer-events-auto select-none">
      <AnimatePresence>
        {!isOpen && !isTyping && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              soundEngine.playPop(850, 0.03);
              hapticMedium();
              onToggle();
            }}
            className="relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold shadow-[0_10px_30px_rgba(245,158,11,0.5)] border border-amber-300/80 cursor-pointer group backdrop-blur-md"
            aria-label="Otwórz GKgadu 2026 (Naciśnij G)"
            title="GKgadu 2026 Komunikator na żywo (Skrót klawiszowy: G)"
          >
            {/* Pulsing Sun Icon */}
            <div className="relative">
              <Sun className="h-6 w-6 text-slate-950 fill-amber-300 animate-[spin_10s_linear_infinite]" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-950 ring-2 ring-emerald-400 animate-pulse" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['Geist'] text-xs font-black tracking-tight leading-none text-slate-950">
                GKgadu
              </span>
              <span className="font-mono text-[9px] text-amber-950/80 font-bold leading-tight">
                Live ☀️ [G]
              </span>
            </div>

            {/* Unread badge */}
            {unreadTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white font-mono text-[10px] font-extrabold shadow-md animate-bounce ring-2 ring-white">
                {unreadTotal}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GkgaduFloatingBubble;
