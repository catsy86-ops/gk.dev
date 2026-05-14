import { useRef, useEffect, useState, memo } from "react";
import { motion, useInView } from "motion/react";
import { Calendar, Rocket, Code2, Users } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
  inView: boolean;
}

const useCountUp = (target: number, inView: boolean, duration = 2000) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
};

const StatItem = memo(({ icon, value, suffix = "", label, delay, inView }: StatItemProps) => {
  const count = useCountUp(value, inView);

  return (
    <motion.div
      className="group relative flex flex-col items-center gap-4 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 md:p-10 transition-colors hover:border-primary/30 hover:bg-card/80"
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        initial={{ scale: 0, rotate: -30 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.15, type: "spring", stiffness: 200 }}
      >
        {icon}
      </motion.div>

      {/* Number */}
      <div className="relative text-center">
        <motion.span
          className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
        >
          {count}
          <span className="text-primary">{suffix}</span>
        </motion.span>
      </div>

      {/* Label */}
      <motion.p
        className="relative text-sm text-muted-foreground font-medium tracking-wide uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.35 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
});
StatItem.displayName = "StatItem";

const stats = [
  { icon: <Calendar className="h-6 w-6" strokeWidth={1.5} />, value: 3, suffix: "+", label: "Lata doświadczenia" },
  { icon: <Rocket className="h-6 w-6" strokeWidth={1.5} />, value: 25, suffix: "+", label: "Ukończone projekty" },
  { icon: <Code2 className="h-6 w-6" strokeWidth={1.5} />, value: 12, suffix: "+", label: "Technologie" },
  { icon: <Users className="h-6 w-6" strokeWidth={1.5} />, value: 15, suffix: "+", label: "Zadowolonych klientów" },
];

const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-sm font-medium text-primary tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            W liczbach
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Doświadczenie w pigułce
          </motion.h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.12}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
