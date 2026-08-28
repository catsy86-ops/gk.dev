import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Disc3, Radio } from "lucide-react";
import { musicEngine } from "@/lib/music-engine";
import { soundEngine } from "@/lib/audio";
import { hapticMedium } from "@/lib/haptics";

export interface WinampFloatingButtonProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onOpen?: () => void;
}

/**
 * GKinAmp 2026 Cyber Floating Action Button (FAB)
 * Positioned right above GKgadu Floating Bubble (bottom-40 on mobile, sm:bottom-20 on desktop)
 */
export function WinampFloatingButton({
  isOpen = false,
  onToggle,
  onOpen,
}: WinampFloatingButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState("");
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
    const unsubscribe = musicEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setTrackTitle(state.track?.title || "GKinAmp");
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    soundEngine.playPop(920, 0.03);
    hapticMedium();
    if (onToggle) {
      onToggle();
    } else if (onOpen) {
      onOpen();
    }
  };

  return (
    <div className="fixed bottom-36 right-4 sm:bottom-24 sm:right-6 z-40 pointer-events-auto select-none">
      <AnimatePresence>
        {!isOpen && !isTyping && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-slate-950 font-bold shadow-[0_10px_30px_rgba(16,185,129,0.45)] border border-emerald-300/80 cursor-pointer group backdrop-blur-md"
            aria-label="Otwórz GKinAmp 2026"
            title={isPlaying ? `GKinAmp: ${trackTitle}` : "Otwórz odtwarzacz GKinAmp 2026"}
          >
            {/* Spinning/pulsing Music Icon */}
            <div className="relative">
              {isPlaying ? (
                <Disc3 className="h-6 w-6 text-slate-950 animate-[spin_3s_linear_infinite]" />
              ) : (
                <Music className="h-6 w-6 text-slate-950 transition-transform group-hover:scale-110" />
              )}
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-emerald-300 ${
                  isPlaying ? "bg-emerald-400 animate-ping" : "bg-cyan-400 animate-pulse"
                }`}
              />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['Geist'] text-xs font-black tracking-tight leading-none text-slate-950">
                GKinAmp
              </span>
              <span className="font-mono text-[9px] text-emerald-950/90 font-bold leading-tight flex items-center gap-1">
                {isPlaying ? (
                  <>
                    <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-950" />
                    <span>PLAYING</span>
                  </>
                ) : (
                  <span>2026 🎵</span>
                )}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WinampFloatingButton;
