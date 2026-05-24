import { motion } from "motion/react";

/**
 * SectionDivider — animated top-border line used by every section (DRY).
 * Extracted from repeated inline code across all section components.
 */
const SectionDivider = () => (
  <>
    <motion.div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
      style={{
        background:
          "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), hsl(var(--accent-blue) / 0.2), hsl(var(--primary) / 0.3), transparent)",
        backgroundSize: "200% 100%",
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.2 }}
      aria-hidden="true"
    />
    {/* Subtle glow beneath the line */}
    <motion.div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[60px]"
      style={{
        background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay: 0.4 }}
      aria-hidden="true"
    />
  </>
);

export default SectionDivider;
