import { motion } from "motion/react";

/**
 * SectionDivider — animated top-border line used by every section (DRY).
 * Extracted from repeated inline code across all section components.
 */
const SectionDivider = () => (
  <motion.div
    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
    style={{
      background:
        "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.1), transparent)",
    }}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay: 0.2 }}
    aria-hidden="true"
  />
);

export default SectionDivider;
