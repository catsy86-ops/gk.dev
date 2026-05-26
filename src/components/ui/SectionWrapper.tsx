import { type ReactNode, forwardRef } from "react";
import SectionDivider from "./SectionDivider";
import ErrorBoundary from "@/components/ErrorBoundary";

interface SectionWrapperProps {
  id: string;
  /** aria-label for the section */
  label: string;
  children: ReactNode;
  className?: string;
  /** Whether to show the top divider line (default: true) */
  divider?: boolean;
}

/**
 * SectionWrapper — HOC that wraps every page section (OCP / DRY).
 *
 * Provides:
 * - Consistent padding, overflow, z-index
 * - Top divider line (optional)
 * - Error boundary per section (so one broken section doesn't crash the page)
 * - Semantic <section> with id + aria-label
 *
 * Open for extension: pass className to customise per-section styles.
 */
const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ id, label, children, className = "", divider = true }, ref) => (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={`relative z-10 bg-background py-16 px-4 md:py-28 md:px-6 overflow-hidden ${className}`}
    >
      {/* Subtle mesh gradient background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.02] blur-[120px] hidden md:block" />
        <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] rounded-full bg-accent-blue/[0.02] blur-[100px] hidden md:block" />
      </div>
      {divider && <SectionDivider />}
      <ErrorBoundary section={label}>
        {children}
      </ErrorBoundary>
    </section>
  ),
);

SectionWrapper.displayName = "SectionWrapper";

export default SectionWrapper;
