import { motion } from "motion/react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SectionColorConfig {
  orb1: string;
  orb2: string;
  orb3: string;
}

const sectionColors: Record<string, SectionColorConfig> = {
  hero: {
    orb1: "rgba(59, 130, 246, 0.14)", // Electric Blue
    orb2: "rgba(6, 182, 212, 0.12)",  // Cyan
    orb3: "rgba(139, 92, 246, 0.08)", // Violet
  },
  "o-mnie": {
    orb1: "rgba(139, 92, 246, 0.14)", // Violet
    orb2: "rgba(99, 102, 241, 0.12)",  // Indigo
    orb3: "rgba(236, 72, 153, 0.08)", // Pink
  },
  umiejetnosci: {
    orb1: "rgba(16, 185, 129, 0.14)", // Emerald
    orb2: "rgba(20, 184, 166, 0.12)", // Teal
    orb3: "rgba(59, 130, 246, 0.08)",  // Blue
  },
  projekty: {
    orb1: "rgba(168, 85, 247, 0.14)", // Purple
    orb2: "rgba(245, 158, 11, 0.10)",  // Amber
    orb3: "rgba(6, 182, 212, 0.08)",  // Cyan
  },
  opinie: {
    orb1: "rgba(59, 130, 246, 0.12)",
    orb2: "rgba(236, 72, 153, 0.10)",
    orb3: "rgba(139, 92, 246, 0.08)",
  },
  kontakt: {
    orb1: "rgba(16, 185, 129, 0.12)",
    orb2: "rgba(59, 130, 246, 0.14)",
    orb3: "rgba(139, 92, 246, 0.08)",
  },
  faq: {
    orb1: "rgba(99, 102, 241, 0.12)",
    orb2: "rgba(6, 182, 212, 0.10)",
    orb3: "rgba(59, 130, 246, 0.08)",
  },
};

export const AmbientBackground = () => {
  const activeSection = useActiveSection() || "hero";
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const colors = sectionColors[activeSection] || sectionColors.hero;

  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Top Left Orb */}
      <motion.div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px]"
        animate={{
          backgroundColor: colors.orb1,
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: "easeInOut" },
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Center Right Orb */}
      <motion.div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-[150px]"
        animate={{
          backgroundColor: colors.orb2,
          x: [0, -35, 0],
          y: [0, 45, 0],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: "easeInOut" },
          x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Bottom Center Orb */}
      <motion.div
        className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px]"
        animate={{
          backgroundColor: colors.orb3,
          scale: [1, 1.15, 1],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: "easeInOut" },
          scale: { duration: 13, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  );
};
