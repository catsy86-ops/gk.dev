import { useRef, useEffect, useState, memo } from "react";
import { motion, useInView } from "motion/react";
import { Calendar, Rocket, Code2, Users, Gauge, CheckCircle2, ShieldCheck, Search, Zap } from "lucide-react";
import { EASE_STANDARD } from "@/constants/animations";
import { CanvasStatsBackground } from "@/components/ui/canvas-stats-background";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  sublabel: string;
  delay: number;
  inView: boolean;
}

const StatItem = memo(({ icon, value, suffix = "", label, sublabel, delay, inView }: StatItemProps) => {
  const count = useCountUp(value, inView);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col items-center gap-3.5 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 hover:border-primary/40 hover:bg-card/90 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, delay, ease: EASE_STANDARD }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : tilt.x,
        rotateY: isMobile ? 0 : tilt.y,
        transformPerspective: 1000,
      }}
    >
      {/* Interactive Light Glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-10 mix-blend-overlay"
        animate={{
          background:
            !isMobile && isHovered
              ? `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.25), transparent 70%)`
              : "transparent",
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Card hover glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon with spring scale */}
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner group-hover:scale-110 group-hover:bg-primary/20 transition-transform duration-300"
        initial={{ scale: 0, rotate: -25 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.12, type: "spring", stiffness: 200, damping: 18 }}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      {/* Number */}
      <div className="relative text-center">
        <motion.span
          className="text-4xl sm:text-5xl font-black tracking-tight text-foreground tabular-nums font-['Geist']"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.4, delay: delay + 0.25 }}
          aria-label={`${value}${suffix}`}
        >
          {count}
          <motion.span
            className="text-primary font-bold ml-0.5"
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
      <div className="text-center space-y-1">
        <p className="text-xs sm:text-sm font-semibold text-foreground font-['Geist'] tracking-tight">
          {label}
        </p>
        <p className="text-[11px] font-mono text-muted-foreground">
          {sublabel}
        </p>
      </div>
    </motion.div>
  );
});
StatItem.displayName = "StatItem";

/* ============================================================
   Data
   ============================================================ */

const stats = [
  { icon: <Calendar className="h-6 w-6" strokeWidth={1.8} />, value: 7, suffix: "+", label: "Lat Doświadczenia", sublabel: "W branży IT & Web" },
  { icon: <Rocket className="h-6 w-6" strokeWidth={1.8} />, value: 25, suffix: "+", label: "Ukończonych Projektów", sublabel: "SaaS, E-commerce, Apps" },
  { icon: <Code2 className="h-6 w-6" strokeWidth={1.8} />, value: 12, suffix: "+", label: "Głównych Technologii", sublabel: "TypeScript, React, Node" },
  { icon: <Users className="h-6 w-6" strokeWidth={1.8} />, value: 15, suffix: "+", label: "Klientów & Partnerów", sublabel: "Polska, UE i Globalnie" },
];

const vitals = [
  { icon: Zap, label: "Performance", score: 100, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: CheckCircle2, label: "Accessibility", score: 100, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: ShieldCheck, label: "Best Practices", score: 100, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Search, label: "SEO Score", score: 100, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
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
      className="relative bg-secondary/20 py-20 px-4 md:py-28 md:px-6 overflow-hidden"
      id="statystyki"
      aria-label="Statystyki i Metryki Jakości"
    >
      {/* Canvas Background */}
      <CanvasStatsBackground />

      {/* Gradient fades at edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1240px] px-2 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase tracking-widest font-['Geist'] mb-4 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Gauge className="h-3.5 w-3.5" />
            Metryki & Doświadczenie
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground font-['Geist']"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Inżynieria potwierdzona liczbami
          </motion.h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-['Geist'] max-w-xl mx-auto">
            Wysoka wydajność, czysty kod i dbałość o każdy milisekund ładowania.
          </p>
        </motion.div>

        {/* Stats grid 3D */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          role="list"
          aria-label="Kluczowe liczby"
        >
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              sublabel={stat.sublabel}
              delay={i * 0.1}
              inView={inView}
            />
          ))}
        </div>

        {/* Live Lighthouse Vitals Matrix */}
        <motion.div
          className="mt-10 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-['Geist'] font-bold text-foreground text-base sm:text-lg">
                  Google Lighthouse Core Web Vitals
                </h3>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Zoptymalizowany pod kątem natychmiastowego First Contentful Paint (&lt; 0.6s) i maksymalnego SEO.
              </p>
            </div>

            {/* 4 Vitals Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              {vitals.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-3 ${item.bg}`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-lg font-black text-emerald-500">
                    <item.icon className="h-4 w-4" />
                    <span>{item.score}</span>
                  </div>
                  <span className="text-[11px] font-medium text-foreground/80 font-['Geist'] mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
