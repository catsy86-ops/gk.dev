import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { lazy, Suspense, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import SkillsSection from "@/components/SkillsSection";
import TechMarquee from "@/components/TechMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const StatsSection = lazy(() => import("@/components/StatsSection"));

function useShouldLoadHeavyContent() {
  const [shouldLoad, setShouldLoad] = useState(true);
  useEffect(() => {
    const conn = (navigator as any).connection;
    if (conn) {
      const slow = conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.saveData;
      setShouldLoad(!slow);
    }
  }, []);
  return shouldLoad;
}

function StatsSkeleton() {
  return (
    <section className="py-28 px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-8 space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  const shouldLoadStats = useShouldLoadHeavyContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9998] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium">
        Przejdź do treści
      </a>
      <GrainOverlay />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
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
        <ContactSection />
        <FaqSection className="bg-secondary/30" />
        {/* Spacer for mobile bottom nav */}
        <div className="h-20 md:h-0" aria-hidden="true" />
      </main>
      <Footer />
      <MobileBottomNav onMenuOpen={() => setMobileMenuOpen((p) => !p)} menuOpen={mobileMenuOpen} />
    </>
  );
};

export default Index;
