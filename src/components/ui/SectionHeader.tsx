import { type ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_STANDARD } from "@/constants/animations";

interface SectionHeaderProps {
  /** Small badge text above the heading */
  badge: string;
  /** Optional icon inside the badge */
  badgeIcon?: ReactNode;
  /** Main heading — plain text before the italic highlight */
  title: string;
  /** Italic gradient highlight word */
  highlight: string;
  /** Whether the highlight should have a gradient (default: false) */
  gradient?: boolean;
  /** Extra class names for the wrapper */
  className?: string;
}

/**
 * SectionHeader — shared heading block used by every section (DRY).
 *
 * Renders:
 *   [badge]
 *   [title] [highlight in italic]
 *
 * Handles its own entrance animations so individual sections stay clean (SRP).
 */
const SectionHeader = ({
  badge,
  badgeIcon,
  title,
  highlight,
  gradient = false,
  className = "",
}: SectionHeaderProps) => (
  <motion.div
    className={`text-center mb-16 ${className}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7 }}
  >
    {/* Badge */}
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary font-['Geist'] mb-5"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {badgeIcon && <span aria-hidden="true">{badgeIcon}</span>}
      {badge}
    </motion.span>

    {/* Heading */}
    <motion.h2
      className="font-['Geist'] font-medium tracking-[-0.03em] text-foreground text-4xl md:text-5xl leading-tight"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15, ease: EASE_STANDARD }}
    >
      {title}{" "}
      <motion.span
        className={[
          "font-['Instrument_Serif'] italic text-5xl md:text-6xl inline-block",
          gradient
            ? "bg-gradient-to-r from-primary via-accent-blue to-primary bg-clip-text text-transparent"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        initial={{ opacity: 0, rotateY: 90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE_STANDARD }}
      >
        {highlight}
      </motion.span>
    </motion.h2>
  </motion.div>
);

export default SectionHeader;
