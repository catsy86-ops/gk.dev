import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, WifiOff, RefreshCw, X, Share, CheckCircle2, Sparkles } from "lucide-react";
import { usePwa } from "@/hooks/use-pwa";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium } from "@/lib/haptics";

export const PwaInstallPrompt = () => {
  const { isInstallable, isInstalled, isIos, isOnline, hasUpdate, promptInstall, applyUpdate } = usePwa();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

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
    setShowIosGuide(false);
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  const handleInstallClick = async () => {
    if (isIos && !isInstalled) {
      soundEngine.playClick();
      hapticMedium();
      setShowIosGuide(true);
      return;
    }

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
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] w-[94%] max-w-lg"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/50 bg-card/95 backdrop-blur-2xl px-4 py-3.5 shadow-2xl shadow-amber-500/15">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                  <WifiOff className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-['Geist'] text-xs sm:text-sm font-bold text-foreground">
                      Tryb Offline aktywny
                    </p>
                    <span className="font-mono text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded-md">
                      PWA Cache
                    </span>
                  </div>
                  <p className="font-['Geist'] text-[11px] text-muted-foreground">
                    Aplikacja, projekty i kurs JS działają w pełni z pamięci podręcznej.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  window.location.reload();
                }}
                className="flex items-center gap-1 rounded-xl bg-secondary hover:bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-foreground transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Odśwież</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New App Version Update Alert */}
      <AnimatePresence>
        {hasUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] w-[94%] max-w-lg"
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-2xl p-4 shadow-2xl shadow-primary/20">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary shrink-0">
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-['Geist'] text-xs sm:text-sm font-bold text-foreground">
                      Dostępna nowa wersja portfolio
                    </p>
                    <span className="font-mono text-[9px] bg-primary/20 text-primary font-bold px-1.5 py-0.2 rounded-md">
                      v2.0
                    </span>
                  </div>
                  <p className="font-['Geist'] text-[11px] text-muted-foreground">
                    Zaktualizuj aplikację, aby załadować najnowsze poprawki i projekty.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={applyUpdate}
                className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-95 cursor-pointer shrink-0 transition-all"
              >
                Aktualizuj
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Native PWA Floating Install Prompt & iOS Guide */}
      <AnimatePresence>
        {(isInstallable || (isIos && !isInstalled)) && !isInstalled && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-[9999] max-w-sm w-[calc(100vw-2rem)] sm:w-auto"
          >
            <div className="relative rounded-3xl border border-primary/30 bg-card/95 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Background gradient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-primary/30 shrink-0">
                    GK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-['Geist'] text-sm font-bold text-foreground">
                        Pobierz aplikację GK.dev
                      </h4>
                      <span className="font-mono text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        PWA
                      </span>
                    </div>
                    <p className="font-['Geist'] text-xs text-muted-foreground mt-0.5">
                      Pełny dostęp do 22 projektów, kursu JS i trybu Offline wprost z ekranu głównego.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0 cursor-pointer"
                  aria-label="Zamknij monit instalacji"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* iOS Safari Instruction Drawer */}
              {showIosGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-3 rounded-2xl border border-primary/20 bg-primary/10 p-3 text-xs space-y-1.5 font-['Geist']"
                >
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Share className="h-3.5 w-3.5 text-primary" />
                    Jak zainstalować na iOS (Safari):
                  </p>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-[11px]">
                    <li>Kliknij przycisk <strong>Udostępnij (Share)</strong> na dolnym pasku Safari.</li>
                    <li>Przewiń w dół i wybierz <strong>„Do ekranu początkowego” (Add to Home Screen)</strong>.</li>
                  </ol>
                </motion.div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 rounded-full border border-border/80 bg-secondary/80 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer text-center"
                >
                  Później
                </button>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 py-2 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                >
                  {isIos ? <Share className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                  <span>{isIos ? "Pokaż jak dodać" : "Zainstaluj aplikację"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
