import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, WifiOff, RefreshCw, X, Sparkles } from "lucide-react";
import { usePwa } from "@/hooks/use-pwa";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";

export const PwaInstallPrompt = () => {
  const { isInstallable, isInstalled, isOnline, hasUpdate, promptInstall, applyUpdate } = usePwa();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    soundEngine.playPop(400, 0.04);
    hapticLight();
    setIsDismissed(true);
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (success) {
      setIsDismissed(true);
    }
  };

  return (
    <>
      {/* Offline Status Alert Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] w-[92%] max-w-md"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-card/95 backdrop-blur-2xl px-4 py-3 shadow-2xl shadow-amber-500/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                  <WifiOff className="h-4 w-4 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-['Geist'] text-xs font-bold text-foreground">
                    Tryb Offline aktywny
                  </p>
                  <p className="font-['Geist'] text-[11px] text-muted-foreground">
                    Wszystkie 22 projekty są dostępne z pamięci PWA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New App Version Update Alert */}
      <AnimatePresence>
        {hasUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] w-[92%] max-w-md"
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-2xl p-3.5 shadow-2xl shadow-primary/20">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary shrink-0">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </div>
                <div>
                  <p className="font-['Geist'] text-xs font-bold text-foreground">
                    Nowa wersja jest dostępna!
                  </p>
                  <p className="font-['Geist'] text-[11px] text-muted-foreground">
                    Kliknij, aby odświeżyć portfolio do najnowszego buildu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={applyUpdate}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                Aktualizuj
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Native PWA Floating Install Prompt */}
      <AnimatePresence>
        {isInstallable && !isInstalled && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-[9999] max-w-sm w-[calc(100vw-2rem)] sm:w-auto"
          >
            <div className="relative rounded-3xl border border-primary/30 bg-card/90 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Background gradient light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black shadow-lg shadow-primary/30 shrink-0">
                    GK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-['Geist'] text-sm font-bold text-foreground">
                        Pobierz aplikację GK.dev
                      </h4>
                      <span className="font-mono text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                        PWA
                      </span>
                    </div>
                    <p className="font-['Geist'] text-xs text-muted-foreground mt-0.5">
                      Dostęp do 22 projektów, kalkulatora i trybu Offline wprost z ekranu głównego.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
                  aria-label="Zamknij monit instalacji"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 rounded-full border border-border/80 bg-secondary/80 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer text-center"
                >
                  Później
                </button>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Zainstaluj na telefon</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
