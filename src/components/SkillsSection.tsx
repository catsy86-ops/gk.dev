import { motion, useInView } from "motion/react";
import { Code2, Database, Cloud, Smartphone, Layout, GitBranch, Sparkles, Check } from "lucide-react";
import { useState, useRef } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { CanvasSkillsBackground } from "@/components/ui/canvas-skills-background";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";

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
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${skill.accentColor}12, transparent 60%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Top: Icon + Title + Years tag */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 ${
                        isHovered
                          ? "border-primary/50 bg-primary/20 scale-110 shadow-lg shadow-primary/20"
                          : "border-border/80 bg-secondary/80 group-hover:border-primary/30"
                      }`}
                    >
                      <skill.icon
                        className="h-6 w-6 transition-colors duration-300"
                        style={{
                          color: isHovered ? skill.accentColor : undefined,
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full border border-border/80 bg-secondary/80 text-muted-foreground backdrop-blur-sm shadow-sm">
                        {skill.years}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-['Geist'] text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {skill.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Bottom: Tags */}
                <div className="relative z-10 pt-6 mt-4 border-t border-border/60">
                  <div className="flex flex-wrap gap-1.5">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2.5 py-1 rounded-xl border border-border/70 bg-secondary/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-200"
                      >
                        <Check className="h-3 w-3 text-primary/70" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner Gradient Accent */}
                <div
                  className={`absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${skill.gradient} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SkillsSection;
