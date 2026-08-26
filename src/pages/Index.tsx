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
import { soundEngine } from "@/lib/audio";
import { hapticMedium } from "@/lib/haptics";

const StatsSection = lazy(() => import("@/components/StatsSection"));
const TerminalDialog = lazy(() =>
  import("@/components/TerminalDialog").then((m) => ({ default: m.TerminalDialog }))
);
const DevPassportModal = lazy(() =>
  import("@/components/DevPassportModal").then((m) => ({ default: m.DevPassportModal }))
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
    soundEngine.playPop(850, 0.03);
    hapticMedium();
    setIsTerminalOpen(true);
  }, []);

  const handleOpenPassport = useCallback(() => {
    soundEngine.playPop(850, 0.03);
    hapticMedium();
    setIsPassportOpen(true);
  }, []);

  const handleTriggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
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

  // Global Power-User Hotkeys (/, T, P, E, M)
  useKeyboardShortcuts({
    onOpenTerminal: handleOpenTerminal,
    onOpenPassport: handleOpenPassport,
    onFocusSearch: handleFocusSearch,
    onOpenEstimator: handleOpenEstimator,
    onTriggerMatrix: handleTriggerMatrix,
  });

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9998] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium">
        Przejdź do treści
      </a>
      <AmbientBackground />
      <ClickSpark />
      <CustomCursor />
      <ScrollProgress />
      <MatrixCinematicOverlay
        isActive={isMatrixActive}
        onClose={() => setIsMatrixActive(false)}
      />
      <Navbar
        onOpenTerminal={handleOpenTerminal}
        onOpenPassport={handleOpenPassport}
        onTriggerMatrix={handleTriggerMatrix}
      />
      <MobileDock
        onOpenTerminal={handleOpenTerminal}
        onOpenPassport={handleOpenPassport}
      />
      <ScrollToTop />
      <main id="main">
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
