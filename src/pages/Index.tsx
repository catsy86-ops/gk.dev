import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SkillsSection from "@/components/SkillsSection";
import TechMarquee from "@/components/TechMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import JsCourseSection from "@/components/JsCourseSection";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ClickSpark } from "@/components/ui/ClickSpark";
import { MobileDock } from "@/components/MobileDock";
import { isSlowConnection } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSeo } from "@/hooks/use-seo";
import { MatrixCinematicOverlay } from "@/components/MatrixCinematicOverlay";
import { WinampPlayer } from "@/components/WinampPlayer";
import { WinampFloatingButton } from "@/components/WinampFloatingButton";
import { OfflineNetworkIndicator } from "@/components/OfflineNetworkIndicator";
import { GkgaduFloatingBubble } from "@/components/GkgaduFloatingBubble";
import { musicEngine } from "@/lib/music-engine";
import { soundEngine } from "@/lib/audio";
import { hapticMedium } from "@/lib/haptics";

const StatsSection = lazy(() => import("@/components/StatsSection"));
const TerminalDialog = lazy(() =>
  import("@/components/TerminalDialog").then((m) => ({ default: m.TerminalDialog }))
);
const DevPassportModal = lazy(() =>
  import("@/components/DevPassportModal").then((m) => ({ default: m.DevPassportModal }))
);
const GkgaduChatModal = lazy(() =>
  import("@/components/GkgaduChatModal").then((m) => ({ default: m.GkgaduChatModal }))
);
const BiosSimulatorModal = lazy(() =>
  import("@/components/BiosSimulatorModal").then((m) => ({ default: m.BiosSimulatorModal }))
);
const DevReceiptModal = lazy(() =>
  import("@/components/DevReceiptModal").then((m) => ({ default: m.DevReceiptModal }))
);

function useShouldLoadHeavyContent() {
  const [shouldLoad, setShouldLoad] = useState(true);
  useEffect(() => {
    setShouldLoad(!isSlowConnection());
  }, []);
  return shouldLoad;
}

function StatsSkeleton() {
  return (
    <section className="py-16 px-4 md:py-28 md:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

interface IndexProps {
  initialAuthModal?: "sign-in" | "sign-up";
}

const Index = ({ initialAuthModal }: IndexProps) => {
  useSeo();
  const navigate = useNavigate();
  const location = useLocation();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isWinampOpen, setIsWinampOpen] = useState(false);
  const [isGkgaduOpen, setIsGkgaduOpen] = useState(false);
  const [isBiosOpen, setIsBiosOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const shouldLoadStats = useShouldLoadHeavyContent();

  const isAuthRoute =
    initialAuthModal !== undefined ||
    location.pathname === "/sign-in" ||
    location.pathname === "/sign-up";

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(isAuthRoute);
  const authMode: "sign-in" | "sign-up" =
    initialAuthModal ||
    (location.pathname === "/sign-up" ? "sign-up" : "sign-in");

  useEffect(() => {
    if (isAuthRoute) {
      setIsAuthModalOpen(true);
    }
  }, [isAuthRoute, location.pathname]);

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
      navigate("/", { replace: true });
    }
  };

  const handleOpenTerminal = useCallback(() => {
    hapticMedium();
    setIsTerminalOpen(true);
  }, []);

  const handleOpenPassport = useCallback(() => {
    hapticMedium();
    setIsPassportOpen(true);
  }, []);

  const handleTriggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
  }, []);

  const handleToggleWinamp = useCallback(() => {
    setIsWinampOpen((prev) => {
      const next = !prev;
      if (!next) {
        musicEngine.pause();
      }
      return next;
    });
  }, []);

  const handleToggleGkgadu = useCallback(() => {
    setIsGkgaduOpen((prev) => !prev);
  }, []);

  const handleFocusSearch = useCallback(() => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleOpenEstimator = useCallback(() => {
    const el = document.getElementById("kontakt");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleOpenBios = useCallback(() => {
    soundEngine.playPop(900, 0.05);
    hapticMedium();
    setIsBiosOpen(true);
  }, []);

  const handleOpenReceipt = useCallback(() => {
    soundEngine.playChime();
    hapticMedium();
    setIsReceiptOpen(true);
  }, []);

  // Global Power-User Hotkeys (/, T, P, E, M, B, R)
  useKeyboardShortcuts({
    onOpenTerminal: handleOpenTerminal,
    onOpenPassport: handleOpenPassport,
    onFocusSearch: handleFocusSearch,
    onOpenEstimator: handleOpenEstimator,
    onTriggerMatrix: handleTriggerMatrix,
    onOpenBios: handleOpenBios,
    onOpenReceipt: handleOpenReceipt,
  });

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9998] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium">
        Przejdź do treści
      </a>
      <OfflineNetworkIndicator />
      <AmbientBackground />
      <ClickSpark />
      <CustomCursor />
      <ScrollProgress />
      <MatrixCinematicOverlay
        isActive={isMatrixActive}
        onClose={() => setIsMatrixActive(false)}
      />
      <WinampPlayer
        isOpen={isWinampOpen}
        onClose={() => setIsWinampOpen(false)}
      />
      <Navbar
        onOpenTerminal={handleOpenTerminal}
        onOpenPassport={handleOpenPassport}
        onTriggerMatrix={handleTriggerMatrix}
        onToggleWinamp={handleToggleWinamp}
        isWinampOpen={isWinampOpen}
        onToggleGkgadu={handleToggleGkgadu}
        isGkgaduOpen={isGkgaduOpen}
        onOpenBios={handleOpenBios}
        onOpenReceipt={handleOpenReceipt}
      />
      <MobileDock
        onOpenTerminal={handleOpenTerminal}
        onOpenPassport={handleOpenPassport}
        onToggleGkgadu={handleToggleGkgadu}
        onToggleWinamp={handleToggleWinamp}
        onOpenBios={handleOpenBios}
        onOpenReceipt={handleOpenReceipt}
      />
      <WinampFloatingButton
        isOpen={isWinampOpen}
        onToggle={handleToggleWinamp}
      />
      <GkgaduFloatingBubble
        isOpen={isGkgaduOpen}
        onToggle={handleToggleGkgadu}
      />
      <ScrollToTop />
      <main id="main" className="overflow-x-hidden relative">
        <HeroSection />
        <AboutSection />
        {shouldLoadStats ? (
          <Suspense fallback={<StatsSkeleton />}>
            <StatsSection />
          </Suspense>
        ) : (
          <StatsSkeleton />
        )}
        <SkillsSection />
        <TechMarquee />
        <ProjectsSection />
        <TestimonialsSection />
        <JsCourseSection />
        <ContactSection />
        <FaqSection className="bg-secondary/30" />
      </main>
      <Footer />

      {/* Easter Egg Terminal CLI */}
      {isTerminalOpen && (
        <Suspense fallback={null}>
          <TerminalDialog
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
          />
        </Suspense>
      )}

      {/* Dev Passport & Gamification Modal */}
      {isPassportOpen && (
        <Suspense fallback={null}>
          <DevPassportModal
            isOpen={isPassportOpen}
            onClose={() => setIsPassportOpen(false)}
          />
        </Suspense>
      )}

      {/* GKgadu 2026 Real-Time Instant Messenger */}
      {isGkgaduOpen && (
        <Suspense fallback={null}>
          <GkgaduChatModal
            isOpen={isGkgaduOpen}
            onClose={() => setIsGkgaduOpen(false)}
          />
        </Suspense>
      )}

      {/* Retro Award BIOS Setup Utility */}
      {isBiosOpen && (
        <Suspense fallback={null}>
          <BiosSimulatorModal
            isOpen={isBiosOpen}
            onClose={() => setIsBiosOpen(false)}
          />
        </Suspense>
      )}

      {/* Dev Receipt Modal */}
      {isReceiptOpen && (
        <Suspense fallback={null}>
          <DevReceiptModal
            isOpen={isReceiptOpen}
            onClose={() => setIsReceiptOpen(false)}
          />
        </Suspense>
      )}

      {/* Global Auth Modal for /sign-in, /sign-up and interactive triggers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </>
  );
};

export default Index;
