import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LOADING_DURATION_MS, LOADING_EXIT_DURATION_MS } from "@/constants/animations";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"loading" | "exit">("loading");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("exit"), LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "exit") {
      const t = setTimeout(onComplete, LOADING_EXIT_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      key="loader"
      role="status"
      aria-label="Ładowanie strony"
    >
      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            initial={{ width: 80, height: 80, opacity: 0 }}
            animate={{
              width: [80, 200 + i * 80],
              height: [80, 200 + i * 80],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="relative flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl font-bold tracking-[-0.04em] text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          GK
          <motion.span
            className="text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            .dev
          </motion.span>
        </motion.h1>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-[3px] rounded-full bg-border overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </motion.div>
      </motion.div>

      <span className="sr-only">Ładowanie...</span>
    </motion.div>
  );
};

export default LoadingScreen;