import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { lazy, Suspense, useEffect, useState } from "react";
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
import { ScrollToTop } from "@/components/ScrollToTop";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ClickSpark } from "@/components/ui/ClickSpark";
import { isSlowConnection } from "@/lib/utils";

const StatsSection = lazy(() => import("@/components/StatsSection"));

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
  const [isLoading, setIsLoading] = useState(true);
  const shouldLoadStats = useShouldLoadHeavyContent();

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9998] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium">
        Przejdź do treści
      </a>
      <GrainOverlay />
      <AmbientBackground />
      <ClickSpark />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
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
        <ContactSection />
        <FaqSection className="bg-secondary/30" />
      </main>
      <Footer />
    </>
  );
};

export default Index;
