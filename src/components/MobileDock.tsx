import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Wrench, FolderOpen, Send, Sparkles, Terminal } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { MobileQuickActions } from "@/components/MobileQuickActions";
import { AuthModal } from "@/components/auth/AuthModal";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium, hapticSelection } from "@/lib/haptics";

const ClientPortalModal = lazy(() =>
  import("@/components/ClientPortalModal").then((m) => ({ default: m.ClientPortalModal }))
);

const tabs = [
  { id: "hero", label: "Start", href: "#hero", icon: Home },
  { id: "umiejetnosci", label: "Stack", href: "#umiejetnosci", icon: Wrench },
  { id: "projekty", label: "Projekty", href: "#projekty", icon: FolderOpen },
] as const;

interface MobileDockProps {
  onOpenTerminal?: () => void;
  onOpenPassport?: () => void;
  onToggleGkgadu?: () => void;
  onToggleWinamp?: () => void;
  onOpenBios?: () => void;
  onOpenReceipt?: () => void;
}

export const MobileDock = ({
  onOpenTerminal,
  onOpenPassport,
  onToggleGkgadu,
  onToggleWinamp,
  onOpenBios,
  onOpenReceipt,
}: MobileDockProps) => {
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const lastScrollY = useRef(0);
  const activeSection = useActiveSection();

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Always show near top of page
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (scrollDelta > 15 && currentScrollY > 120) {
        // Fast scroll down -> hide dock to give reading area
        setIsVisible(false);
      } else if (scrollDelta < -10) {
        // Scroll up -> reveal dock immediately
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    soundEngine.playClick();
    hapticSelection();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <aside className="md:hidden">
        <AnimatePresence>
          {isVisible && !isTyping && (
            <motion.div
              key="mobile-dock"
              initial={{ y: 90, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 90, opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed bottom-3 inset-x-0 mx-auto w-[96%] max-w-[430px] z-50 pointer-events-auto"
              style={{ marginBottom: "max(0.25rem, env(safe-area-inset-bottom, 0px))" }}
              aria-label="Pływające menu mobilne"
            >
              <div className="relative flex items-center justify-between rounded-full border border-border/80 bg-background/90 dark:bg-card/90 backdrop-blur-2xl p-1 shadow-[0_16px_45px_-10px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_55px_-10px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                {/* Navigation Tabs (Start, Stack, Projekty) */}
                <div className="flex items-center flex-1 justify-around gap-0.5 sm:gap-1">
                  {tabs.map((tab) => {
                    const isActive =
                      activeSection === tab.id || (tab.id === "hero" && !activeSection);

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => scrollTo(tab.href)}
                        className={`relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-full transition-colors min-h-[44px] cursor-pointer ${
                          isActive
                            ? "text-primary font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        aria-label={tab.label}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="mobile-dock-pill"
                            className="absolute inset-0 rounded-full bg-primary/15 dark:bg-primary/25 border border-primary/30 shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <tab.icon
                          className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4"
                          strokeWidth={isActive ? 2.4 : 1.8}
                        />
                        <span className="relative z-10 text-[9px] sm:text-[10px] font-['Geist'] mt-0.5 tracking-tight">
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}

                  {/* Terminal Direct Trigger Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(850, 0.03);
                      hapticMedium();
                      if (onOpenTerminal) {
                        onOpenTerminal();
                      }
                    }}
                    className="relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-full transition-colors min-h-[44px] text-emerald-500 hover:text-emerald-400 active:scale-95 cursor-pointer"
                    aria-label="Terminal CLI"
                    title="Terminal CLI"
                  >
                    <div className="relative">
                      <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" strokeWidth={2.2} />
                      <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-['Geist'] font-bold mt-0.5 tracking-tight font-mono text-emerald-500">
                      CLI
                    </span>
                  </button>

                  {/* Quick Action & XP Hub Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(850, 0.03);
                      hapticLight();
                      setIsQuickOpen(true);
                    }}
                    className="relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-full transition-colors min-h-[44px] text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer"
                    aria-label="Więcej opcji i Paszport XP"
                    title="Więcej opcji & XP"
                  >
                    <div className="relative">
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" strokeWidth={2.2} />
                      <span className="absolute -top-0.5 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-['Geist'] font-bold mt-0.5 tracking-tight text-foreground">
                      Więcej
                    </span>
                  </button>
                </div>

                {/* Action Contact Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playChime();
                    hapticMedium();
                    scrollTo("#kontakt");
                  }}
                  className="relative flex items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-primary-foreground font-['Geist'] text-xs font-bold shadow-md shadow-primary/30 active:scale-95 transition-transform shrink-0 ml-1 cursor-pointer min-h-[40px]"
                  aria-label="Napisz wiadomość"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Napisz</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Mobile Quick Action Sheet */}
      <MobileQuickActions
        isOpen={isQuickOpen}
        onClose={() => setIsQuickOpen(false)}
        onOpenTerminal={onOpenTerminal}
        onOpenPassport={onOpenPassport}
        onToggleGkgadu={onToggleGkgadu}
        onToggleWinamp={onToggleWinamp}
        onOpenBios={onOpenBios}
        onOpenReceipt={onOpenReceipt}
      />

      {/* Dedicated Auth Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Client Portal Modal */}
      {isClientPortalOpen && (
        <Suspense fallback={null}>
          <ClientPortalModal
            isOpen={isClientPortalOpen}
            onClose={() => setIsClientPortalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default MobileDock;
