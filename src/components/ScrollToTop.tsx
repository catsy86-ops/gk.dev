import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";

const THRESHOLD = 500;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    soundEngine.playChime();
    hapticLight();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          onClick={scrollToTop}
          aria-label="Przewiń do góry"
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] right-4 md:right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/85 backdrop-blur-xl text-foreground shadow-lg hover:bg-card hover:border-primary/50 hover:text-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
