import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { lazy, Suspense } from "react";
import SkillsSection from "@/components/SkillsSection";
import TechMarquee from "@/components/TechMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const StatsSection = lazy(() => import("@/components/StatsSection"));

const Index = () => {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9998] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium">
        Przejdź do treści
      </a>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <Suspense fallback={<section className="py-28" />}>
          <StatsSection />
        </Suspense>
        <SkillsSection />
        <TechMarquee />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
