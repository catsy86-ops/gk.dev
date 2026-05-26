import { useRef, useEffect, useState, memo } from "react";
import { motion, useInView } from "motion/react";
import { Calendar, Rocket, Code2, Users } from "lucide-react";
import { EASE_STANDARD } from "@/constants/animations";
import { CanvasStatsBackground } from "@/components/ui/canvas-stats-background";

/* ============================================================
   Hooks
   ============================================================ */

const useCountUp = (target: number, inView: boolean, duration = 2200) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return count;
};

/* ============================================================
   Subcomponents
   ============================================================ */

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
  inView: boolean;
}

const StatItem = memo(({ icon, value, suffix = "", label, delay, inView }: StatItemProps) => {
  const count = useCountUp(value, inView);

  return (
    <motion.div
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-6 sm:p-8 transition-all duration-500 hover:border-primary/25 hover:bg-card/70 hover:shadow-[0_8px_40px_-12px_rgba(59,130,246,0.15)] hover:-translate-y-1"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, delay, ease: EASE_STANDARD }}
    >
      {/* Card glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Icon */}
      <motion.div
        className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary border border-primary/10"
        initial={{ scale: 0, rotate: -25 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.12, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      {/* Number */}
      <div className="relative text-center">
        <motion.span
          className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-foreground tabular-nums"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.4, delay: delay + 0.25 }}
          aria-label={`${value}${suffix}`}
        >
          {count}
          <motion.span
            className="text-primary/80"
            initial={{ opacity: 0, x: -4 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.5 }}
            aria-hidden="true"
          >
            {suffix}
          </motion.span>
        </motion.span>
      </div>

      {/* Label */}
      <motion.p
        className="text-[12px] sm:text-[13px] text-muted-foreground font-medium tracking-[0.04em] uppercase text-center leading-tight"
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: delay + 0.35 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
});
StatItem.displayName = "StatItem";

/* ============================================================
   Data
   ============================================================ */

const stats = [
  { icon: <Calendar className="h-5 w-5" strokeWidth={1.6} />, value: 7, suffix: "+", label: "Lat doświadczenia" },
  { icon: <Rocket className="h-5 w-5" strokeWidth={1.6} />, value: 25, suffix: "+", label: "Ukończone projekty" },
  { icon: <Code2 className="h-5 w-5" strokeWidth={1.6} />, value: 12, suffix: "+", label: "Technologie" },
  { icon: <Users className="h-5 w-5" strokeWidth={1.6} />, value: 15, suffix: "+", label: "Zadowolonych klientów" },
];

/* ============================================================
   StatsSection
   ============================================================ */

const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative bg-secondary/30 py-16 px-4 md:py-20 md:px-6 overflow-hidden"
      id="statystyki"
      aria-label="Statystyki"
    >
      {/* Canvas Background */}
      <CanvasStatsBackground />

      {/* Gradient fades at edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

      {/* Subtle divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary tracking-[0.2em] uppercase mb-4 font-['Geist']"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.span
              className="h-1 w-1 rounded-full bg-primary inline-block"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            />
            W liczbach
          </motion.span>
          <motion.h2
            className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-foreground font-['Geist']"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Doświadczenie w pigułce
          </motion.h2>
        </motion.div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          role="list"
          aria-label="Statystyki"
        >
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.1}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
