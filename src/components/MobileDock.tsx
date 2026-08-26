import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, User, Wrench, FolderOpen, Send, Sparkles } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { MobileQuickActions } from "@/components/MobileQuickActions";
import { GoogleIcon, AuthModal } from "@/components/auth/AuthModal";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium, hapticSelection } from "@/lib/haptics";

const ClientPortalModal = lazy(() =>
  import("@/components/ClientPortalModal").then((m) => ({ default: m.ClientPortalModal }))
);

const tabs = [
  { id: "hero", label: "Start", href: "#hero", icon: Home },
  { id: "o-mnie", label: "O mnie", href: "#o-mnie", icon: User },
  { id: "umiejetnosci", label: "Stack", href: "#umiejetnosci", icon: Wrench },
  { id: "projekty", label: "Projekty", href: "#projekty", icon: FolderOpen },
] as const;

export const MobileDock = () => {
  const { isSignedIn } = useUser();
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const activeSection = useActiveSection();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Always show at the top of the page
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (scrollDelta > 15 && currentScrollY > 120) {
        // Fast scroll down -> hide dock to give more reading area
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
          {isVisible && (
            <motion.div
              key="mobile-dock"
              initial={{ y: 90, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 90, opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed bottom-4 inset-x-0 mx-auto w-[95%] max-w-[420px] z-50 pointer-events-auto"
              style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
              aria-label="Pływające menu mobilne"
            >
              <div className="relative flex items-center justify-between rounded-full border border-border/80 bg-background/85 dark:bg-card/85 backdrop-blur-2xl p-1.5 shadow-[0_16px_45px_-10px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_55px_-10px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                {/* Navigation Tabs */}
                <div className="flex items-center flex-1 justify-around gap-0.5">
                  {tabs.map((tab) => {
                    const isActive =
                      activeSection === tab.id || (tab.id === "hero" && !activeSection);

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => scrollTo(tab.href)}
                        className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-colors min-h-[44px] cursor-pointer ${
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
                          className="relative z-10 h-4 w-4"
                          strokeWidth={isActive ? 2.4 : 1.8}
                        />
                        <span className="relative z-10 text-[10px] font-['Geist'] mt-0.5 tracking-tight">
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}

                  {/* Direct Account & Google Login Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(850, 0.03);
                      hapticMedium();
                      if (isSignedIn) {
                        setIsClientPortalOpen(true);
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-colors min-h-[44px] text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer"
                    aria-label={isSignedIn ? "Moje Konto" : "Zaloguj z Google"}
                    title={isSignedIn ? "Strefa Klienta" : "Zaloguj z Google"}
                  >
                    {isSignedIn ? (
                      <div className="relative">
                        <User className="h-4 w-4 text-primary" />
                        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    ) : (
                      <GoogleIcon className="h-4 w-4" />
                    )}
                    <span className="text-[10px] font-['Geist'] font-bold mt-0.5 tracking-tight text-foreground">
                      {isSignedIn ? "Konto" : "Zaloguj"}
                    </span>
                  </button>
                </div>

                {/* Quick Action Hub Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop(850, 0.03);
                    hapticLight();
                    setIsQuickOpen(true);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0 ml-1 active:scale-90 cursor-pointer"
                  aria-label="Szybkie akcje"
                  title="Szybkie akcje"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </button>

                {/* Action Contact Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playChime();
                    hapticMedium();
                    scrollTo("#kontakt");
                  }}
                  className="relative flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2.5 text-primary-foreground font-['Geist'] text-xs font-bold shadow-md shadow-primary/30 active:scale-95 transition-transform shrink-0 ml-1 cursor-pointer min-h-[40px]"
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
