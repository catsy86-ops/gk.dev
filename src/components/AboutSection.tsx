import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Briefcase, GraduationCap, Sparkles, Download, ArrowUpRight, Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { HolographicCard } from "@/components/ui/HolographicCard";
import { GithubActivityBadge } from "@/components/GithubActivityBadge";
import { soundEngine } from "@/lib/audio";
import { hapticSelection } from "@/lib/haptics";

const experienceTimeline = [
  {
    icon: Briefcase,
    year: "2023 — TERAZ",
    title: "Senior Fullstack Developer & Architekt",
    company: "Freelance / Dedykowane Platformy SaaS",
    description: "Projektowanie i wdrażanie kompletnych systemów webowych, aplikacji mobilnych i backendu API w chmurze.",
    highlights: ["Wzrost konwersji klientów do +145%", "Optymalizacja Core Web Vitals do 98-100", "Architektura mikroserwisów & Serverless"],
    tags: ["React 19", "Next.js", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
    accent: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Briefcase,
    year: "2021 — 2023",
    title: "Fullstack Software Engineer",
    company: "Software House & Agencje UE",
    description: "Budowanie platform SaaS dla e-commerce i enterprise, integracje bramek płatniczych oraz optymalizacja zapytań SQL.",
    highlights: ["Obsługa 100k+ unikalnych sesji miesięcznie", "Projektowanie API GraphQL & REST", "Redukcja czasu ładowania aplikacji o 60%"],
    tags: ["TypeScript", "NestJS", "PostgreSQL", "Docker", "Redis", "Tailwind"],
    accent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    icon: Briefcase,
    year: "2019 — 2021",
    title: "Frontend Developer",
    company: "Startup Technologiczny",
    description: "Rozwój interfejsów użytkownika w React i TypeScript, integracje z zewnętrznymi API oraz dbałość o responsywność i animacje.",
    highlights: ["Wdrożenie biblioteki komponentów Design System", "Współpraca w metodyce Agile/Scrum", "100% Type-Safe TypeScript codebase"],
    tags: ["React", "TypeScript", "Redux", "REST API", "SCSS"],
    accent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
];

const educationTimeline = [
  {
    icon: ShieldCheck,
    year: "2024",
    title: "AWS Certified Solutions Architect",
    company: "Amazon Web Services",
    description: "Międzynarodowy certyfikat poświadczający wiedzę z projektowania skalowalnych, bezpiecznych i bezawaryjnych architektur chmurowych.",
    highlights: ["High Availability & Fault Tolerance", "Serverless & Containerized Workloads", "Cost Optimization & Security"],
    tags: ["AWS", "Cloud Architecture", "S3", "Lambda", "ECS"],
    accent: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    icon: Award,
    year: "2023",
    title: "Meta Front-End Developer Professional",
    company: "Meta Platforms",
    description: "Zaawansowana certyfikacja obejmująca architekturę React, optymalizację renderowania, testy jednostkowe i dostępność WCAG.",
    highlights: ["Test-Driven Development (TDD)", "Zaawansowane wzorce React", "Dostępność cyfrowa (a11y)"],
    tags: ["React", "CI/CD", "Jest/Vitest", "Web Standards"],
    accent: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
  {
    icon: GraduationCap,
    year: "2015 — 2019",
    title: "Inżynieria Oprogramowania & Informatyka",
    company: "Studia Inżynierskie",
    description: "Tytuł inżyniera informatyki ze specjalizacją w inżynierii systemów webowych, algorytmach i strukturach danych oraz bazach relacyjnych.",
    highlights: ["Obrona pracy inżynierskiej z wyróżnieniem", "Algorytmika i bazy danych", "Projektowanie architektur SOLID"],
    tags: ["Informatyka", "Algorytmy", "Bazy Danych", "Sieci"],
    accent: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  },
];

const passions = [
  { emoji: "🚀", label: "Nowe technologie" },
  { emoji: "🎮", label: "Game dev & 3D" },
  { emoji: "📚", label: "Open source" },
  { emoji: "☕", label: "Kawa specialty" },
];

const techStack = [
  { name: "React 19" },
  { name: "TypeScript" },
  { name: "Node.js" },
  { name: "Next.js 15" },
  { name: "AWS Cloud" },
  { name: "PostgreSQL" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-5%", "8%"]);
  const parallaxYInverse = useTransform(scrollYProgress, [0, 1], ["5%", "-8%"]);
  const timelineProgress = useTransform(scrollYProgress, [0.2, 0.85], [0, 1]);

  const currentTimeline = activeTab === "experience" ? experienceTimeline : educationTimeline;

  return (
    <section ref={sectionRef} className="relative bg-secondary/30 py-16 px-4 md:py-32 md:px-6 overflow-hidden" id="o-mnie">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(hsl(var(--foreground))_0.5px,transparent_0.5px)] bg-[length:24px_24px]" />
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-[150px]"
          style={{ y: parallaxY }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full bg-violet-500/10 dark:bg-violet-500/4 blur-[120px]"
          style={{ y: parallaxYInverse }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-2 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary font-['Geist'] mb-4 uppercase tracking-widest shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Profil & Ścieżka Kariery
          </motion.span>

          <motion.h2
            className="font-['Geist'] font-black tracking-tight text-foreground text-3xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Inżynieria z pasją do <span className="text-primary">doskonałości</span>
          </motion.h2>

          <div className="flex justify-center">
            <GithubActivityBadge />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Col 1: Bio Card */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="lg:sticky lg:top-28 space-y-6">
              <HolographicCard className="p-7 md:p-8">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-600 text-white font-black text-2xl shadow-md shadow-primary/30 border border-white/20">
                    GK
                  </div>
                  <div>
                    <h3 className="font-['Geist'] text-lg font-bold text-foreground">Grzegorz</h3>
                    <p className="font-mono text-xs text-primary font-medium">Senior Fullstack Engineer</p>
                  </div>
                </div>

                <p className="font-['Geist'] text-muted-foreground text-sm leading-relaxed mb-6">
                  Specjalizuję się w tworzeniu zaawansowanych aplikacji SaaS, platform e-commerce oraz systemów chmurowych z bezkompromisowym naciskiem na wydajność, bezpieczeństwo i estetykę.
                </p>

                {/* Tech Tags */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-foreground/80 font-['Geist'] mb-2.5">Główny Stack:</p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <span
                        key={tech.name}
                        className="rounded-xl border border-border/60 bg-secondary/70 px-3 py-1 font-mono text-xs text-foreground font-medium"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Passions */}
                <div className="mb-8">
                  <p className="text-xs font-semibold text-foreground/80 font-['Geist'] mb-2.5">Pasje i rozwój:</p>
                  <div className="flex flex-wrap gap-2">
                    {passions.map((p) => (
                      <span
                        key={p.label}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-secondary/50 border border-border/40 px-3 py-1 text-xs text-muted-foreground"
                      >
                        <span>{p.emoji}</span>
                        <span>{p.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
                  <GlowButton
                    variant="glow"
                    size="sm"
                    href="/cv.pdf"
                    download
                    icon={<Download className="h-3.5 w-3.5" />}
                  >
                    Pobierz CV (PDF)
                  </GlowButton>

                  <GlowButton
                    variant="glass"
                    size="sm"
                    href="#kontakt"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                  >
                    Napisz
                  </GlowButton>
                </div>
              </HolographicCard>
            </div>
          </motion.div>

          {/* Col 2: Interactive Timeline & Tab Switcher */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Timeline Tab Switcher */}
            <div className="flex items-center justify-center sm:justify-start gap-2 p-1 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl shadow-sm w-fit">
              <button
                onClick={() => {
                  soundEngine.playPop(750, 0.03);
                  hapticSelection();
                  setActiveTab("experience");
                }}
                className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold font-['Geist'] rounded-xl transition-colors ${
                  activeTab === "experience"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === "experience" && (
                  <motion.div
                    layoutId="timeline-tab-pill"
                    className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Briefcase className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Doświadczenie Komercyjne</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playPop(750, 0.03);
                  hapticSelection();
                  setActiveTab("education");
                }}
                className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold font-['Geist'] rounded-xl transition-colors ${
                  activeTab === "education"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === "education" && (
                  <motion.div
                    layoutId="timeline-tab-pill"
                    className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <GraduationCap className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Certyfikaty & Edukacja</span>
              </button>
            </div>

            {/* Timeline Track & Cards */}
            <div className="relative pl-6 sm:pl-8">
              {/* Dynamic vertical progress line */}
              <div className="absolute left-[11px] sm:left-[15px] top-0 bottom-0 w-[2px] bg-border/60" />
              <motion.div
                className="absolute left-[11px] sm:left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                style={{ scaleY: timelineProgress, originY: 0 }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {currentTimeline.map((item, i) => (
                    <motion.div
                      key={item.title + item.year}
                      className="relative pl-8 sm:pl-10"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      onMouseEnter={() => setHoveredTimeline(i)}
                      onMouseLeave={() => setHoveredTimeline(null)}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-background shadow-md transition-transform duration-300 ${
                          hoveredTimeline === i ? "scale-125 border-primary text-primary" : "border-border text-muted-foreground"
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                      </div>

                      {/* Card Content */}
                      <div
                        className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                          hoveredTimeline === i
                            ? "border-primary/40 bg-card/90 shadow-xl"
                            : "border-border/70 bg-card/70 backdrop-blur-xl"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                            {item.year}
                          </span>
                          <span className="font-['Geist'] text-xs font-semibold text-muted-foreground">
                            {item.company}
                          </span>
                        </div>

                        <h4 className="font-['Geist'] text-base sm:text-lg font-bold text-foreground mb-2">
                          {item.title}
                        </h4>

                        <p className="font-['Geist'] text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Achievements / Highlights */}
                        <div className="space-y-1.5 mb-4">
                          {item.highlights.map((h, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-foreground/85 font-['Geist']">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
