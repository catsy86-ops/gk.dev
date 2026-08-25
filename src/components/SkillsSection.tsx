import { motion, useInView } from "motion/react";
import { Code2, Database, Cloud, Smartphone, Layout, GitBranch, Sparkles, Check } from "lucide-react";
import { useState, useRef } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { CanvasSkillsBackground } from "@/components/ui/canvas-skills-background";

interface SkillItem {
  id: string;
  icon: typeof Code2;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  accentColor: string;
  tags: string[];
  highlights: string[];
  size: "large" | "medium" | "small";
}

const skills: SkillItem[] = [
  {
    id: "frontend",
    icon: Code2,
    title: "Frontend Engineering",
    subtitle: "React • Next.js • TypeScript",
    description:
      "Tworzenie nowoczesnych, responsywnych interfejsów webowych z dbałością o 60 FPS, dostępność (a11y) i estetykę pixel-perfect.",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    accentColor: "hsl(var(--primary))",
    tags: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Motion", "Zustand", "Radix UI"],
    highlights: ["Ultra-fast Core Web Vitals", "Server Components & SSR", "Type-safe State Management"],
    size: "large",
  },
  {
    id: "backend",
    icon: Database,
    title: "Backend & Systemy API",
    subtitle: "Node.js • PostgreSQL • Redis",
    description:
      "Skalowalne usługi backendowe, bezpieczne bazy danych, relacje, cache'owanie i architektura sterowana zdarzeniami.",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    accentColor: "rgb(16, 185, 129)",
    tags: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "GraphQL", "REST"],
    highlights: ["Bezpieczne autoryzacje JWT/OAuth", "Transakcje i indeksy DB", "Sub-50ms API Latency"],
    size: "medium",
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud & DevOps",
    subtitle: "AWS • Docker • CI/CD",
    description:
      "Automatyzacja procesów deploymentu, konteneryzacja, bezawaryjny hosting chmurowy i monitoring.",
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    accentColor: "rgb(168, 85, 247)",
    tags: ["AWS S3/EC2", "Docker", "GitHub Actions", "Vercel", "Linux", "Nginx"],
    highlights: ["Automatyczny pipeline CI/CD", "Skalowalność horyzontalna", "Zero-Downtime Releases"],
    size: "medium",
  },
  {
    id: "architecture",
    icon: GitBranch,
    title: "Architektura & Clean Code",
    subtitle: "Design Patterns • Testing",
    description:
      "Struktury kodu łatwe w utrzymaniu, refaktoryzacji i skalowaniu zespołowym w oparciu o SOLID i Clean Architecture.",
    gradient: "from-indigo-500/20 via-sky-500/10 to-transparent",
    accentColor: "rgb(99, 102, 241)",
    tags: ["SOLID", "Design Patterns", "Vitest", "Playwright", "Monorepo"],
    highlights: ["95%+ Test Coverage", "Modułowość kodu", "Standardy ESLint/Prettier"],
    size: "large",
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Development",
    subtitle: "React Native • Cross-platform",
    description:
      "Aplikacje mobilne na platformy iOS i Android z natywną wydajnością i płynnymi animacjami gestów.",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    accentColor: "rgb(245, 158, 11)",
    tags: ["React Native", "Expo", "Mobile UX", "Async Storage"],
    highlights: ["Płynna obsługa gestów", "Tryb Offline", "iOS & Android"],
    size: "small",
  },
  {
    id: "uiux",
    icon: Layout,
    title: "UI/UX & Design Systems",
    subtitle: "Figma • Prototyping",
    description:
      "Projektowanie użytecznych i intuicyjnych systemów designu z naciskiem na konwersję i ergonomię użytkownika.",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    accentColor: "rgb(236, 72, 153)",
    tags: ["Figma", "Design Tokens", "Micro-interactions", "WCAG 2.1"],
    highlights: ["Komponenty modułowe", "Dostępność cyfrowa", "Responsive Design"],
    size: "small",
  },
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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
          badge="Kompetencje & Stack"
          badgeIcon={<Sparkles className="h-3 w-3" />}
          title="Moje"
          highlight="umiejętności"
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
                className={`group relative rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-7 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
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
