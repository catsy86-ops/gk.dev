import { motion, useScroll, useSpring } from "motion/react";

/**
 * ScrollProgress — thin progress bar at the top of the page.
 * aria-hidden: purely decorative, screen readers don't need it.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[100] pointer-events-none"
      style={{ scaleX }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default ScrollProgress;
