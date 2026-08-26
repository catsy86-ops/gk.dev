import { motion, useInView, AnimatePresence } from "motion/react";
import { Code2, Database, Cloud, Smartphone, Layout, GitBranch, Sparkles, Check, Radar, Cpu } from "lucide-react";
import { useState, useRef, lazy, Suspense } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { CanvasSkillsBackground } from "@/components/ui/canvas-skills-background";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSelection } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";

const TechRadar = lazy(() => import("@/components/TechRadar").then((m) => ({ default: m.TechRadar })));
const ArchitectureSimulator = lazy(() => import("@/components/ArchitectureSimulator").then((m) => ({ default: m.ArchitectureSimulator })));
const DatabaseBenchmarkLab = lazy(() => import("@/components/DatabaseBenchmarkLab").then((m) => ({ default: m.DatabaseBenchmarkLab })));

const iconMap: Record<string, typeof Code2> = {
  frontend: Code2,
  backend: Database,
  cloud: Cloud,
  architecture: GitBranch,
  mobile: Smartphone,
  uiux: Layout,
};

const gradientMap: Record<string, string> = {
  frontend: "from-blue-500/20 via-cyan-500/10 to-transparent",
  backend: "from-emerald-500/20 via-green-500/10 to-transparent",
  cloud: "from-purple-500/20 via-violet-500/10 to-transparent",
  architecture: "from-indigo-500/20 via-sky-500/10 to-transparent",
  mobile: "from-orange-500/20 via-amber-500/10 to-transparent",
  uiux: "from-pink-500/20 via-rose-500/10 to-transparent",
};

const accentMap: Record<string, string> = {
  frontend: "hsl(var(--primary))",
  backend: "rgb(16, 185, 129)",
  cloud: "rgb(168, 85, 247)",
  architecture: "rgb(99, 102, 241)",
  mobile: "rgb(245, 158, 11)",
  uiux: "rgb(236, 72, 153)",
};

const sizeMap: Record<string, "large" | "medium" | "small"> = {
  frontend: "large",
  backend: "medium",
  cloud: "medium",
  architecture: "large",
  mobile: "small",
  uiux: "small",
};

const SkillsSection = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [interactiveMode, setInteractiveMode] = useState<"radar" | "simulator" | "benchmark">("radar");

  const skills = t.skills.items.map((item) => ({
    ...item,
    icon: iconMap[item.id] || Code2,
    gradient: gradientMap[item.id] || "from-blue-500/20 to-transparent",
    accentColor: accentMap[item.id] || "hsl(var(--primary))",
    size: sizeMap[item.id] || "medium",
  }));

  return (
    <SectionWrapper ref={sectionRef} id="umiejetnosci" label="Umiejętności" className="bg-secondary/30 relative overflow-hidden">
      {/* Canvas Background */}
      {inView && (
        <div className="absolute inset-0 z-0 opacity-35" aria-hidden="true">
          <CanvasSkillsBackground />
        </div>
      )}

      {/* Depth Gradient Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.5)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <SectionHeader
          badge={t.skills.badge}
          badgeIcon={<Sparkles className="h-3 w-3" />}
          title={t.skills.title}
          highlight={t.skills.highlight}
          gradient
        />

        {/* Interactive Mode Switcher Tabs */}
        <div className="flex items-center justify-center mb-8 px-2">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 p-1 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl shadow-sm overflow-x-auto scrollbar-none max-w-full snap-x snap-mandatory">
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(750, 0.03);
                hapticSelection();
                setInteractiveMode("radar");
              }}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold font-['Geist'] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 snap-center min-h-[42px] ${
                interactiveMode === "radar"
                  ? "text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {interactiveMode === "radar" && (
                <motion.div
                  layoutId="skills-interactive-tab"
                  className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Radar className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{t.skills.radarTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(750, 0.03);
                hapticSelection();
                setInteractiveMode("simulator");
              }}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold font-['Geist'] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 snap-center min-h-[42px] ${
                interactiveMode === "simulator"
                  ? "text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {interactiveMode === "simulator" && (
                <motion.div
                  layoutId="skills-interactive-tab"
                  className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Cpu className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{t.skills.simulatorTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(750, 0.03);
                hapticSelection();
                setInteractiveMode("benchmark");
              }}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold font-['Geist'] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 snap-center min-h-[42px] ${
                interactiveMode === "benchmark"
                  ? "text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {interactiveMode === "benchmark" && (
                <motion.div
                  layoutId="skills-interactive-tab"
                  className="absolute inset-0 rounded-xl bg-cyan-500 shadow-md shadow-cyan-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Database className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{t.skills.benchmarkTab}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Visualizer Display */}
        <AnimatePresence mode="wait">
          {interactiveMode === "radar" && (
            <motion.div
              key="tech-radar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Suspense fallback={<div className="h-[360px] rounded-3xl border border-border/70 bg-card/50 flex items-center justify-center animate-pulse text-muted-foreground text-xs font-mono">Loading Tech Radar...</div>}>
                <TechRadar />
              </Suspense>
            </motion.div>
          )}
          {interactiveMode === "simulator" && (
            <motion.div
              key="arch-simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Suspense fallback={<div className="h-[360px] rounded-3xl border border-border/70 bg-card/50 flex items-center justify-center animate-pulse text-muted-foreground text-xs font-mono">Loading Architecture Simulator...</div>}>
                <ArchitectureSimulator />
              </Suspense>
            </motion.div>
          )}
          {interactiveMode === "benchmark" && (
            <motion.div
              key="db-benchmark"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Suspense fallback={<div className="h-[360px] rounded-3xl border border-border/70 bg-card/50 flex items-center justify-center animate-pulse text-muted-foreground text-xs font-mono">Loading Benchmark Lab...</div>}>
                <DatabaseBenchmarkLab />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {skills.map((skill, index) => {
            const isLarge = skill.size === "large";
            const isHovered = hoveredSkill === skill.id;

            return (
              <motion.div
                key={skill.id}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => {
                  soundEngine.playPop(750, 0.03);
                  hapticLight();
                  setHoveredSkill((prev) => (prev === skill.id ? null : skill.id));
                }}
                className={`group relative rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-7 overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                  isLarge ? "lg:col-span-2" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
              >
                {/* Dynamic Gradient Background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${skill.gradient}`}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Subtle top border glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${skill.accentColor}, transparent)` }}
                />

                <div className="relative z-10">
                  {/* Icon & Subtitle Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-secondary/80 text-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ color: skill.accentColor }}
                    >
                      <skill.icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>

                    <span className="font-mono text-[11px] text-muted-foreground bg-secondary/60 backdrop-blur-sm px-3 py-1 rounded-full border border-border/40">
                      {skill.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-['Geist'] text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {skill.title}
                  </h3>

                  <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed mb-5">
                    {skill.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="space-y-2 mb-6">
                    {skill.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-['Geist'] text-foreground/80">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags bottom row */}
                <div className="relative z-10 pt-4 border-t border-border/40 flex flex-wrap gap-1.5">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-secondary/80 border border-border/40 px-2.5 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SkillsSection;
