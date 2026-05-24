import { motion, useScroll, useTransform } from "motion/react";
import { Briefcase, GraduationCap, Sparkles, Download, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";

const timeline = [
  {
    icon: Briefcase,
    year: "2023 — teraz",
    title: "Senior Fullstack Developer",
    company: "Freelance / Własne projekty",
    description: "Tworzę aplikacje webowe i mobilne dla klientów z Polski i zagranicy. React, TypeScript, Node.js.",
    accent: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Briefcase,
    year: "2021 — 2023",
    title: "Fullstack Developer",
    company: "Software House",
    description: "Budowanie platformy SaaS, integracje API, optymalizacja wydajności i architektura mikroserwisów.",
    accent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    icon: GraduationCap,
    year: "2019 — 2021",
    title: "Junior Developer",
    company: "Startup technologiczny",
    description: "Pierwsze komercyjne doświadczenie — frontend w React, backend w Node.js, praca w zespole Agile.",
    accent: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    icon: GraduationCap,
    year: "2015 — 2019",
    title: "Informatyka",
    company: "Politechnika Warszawska",
    description: "Studia inżynierskie — programowanie, algorytmy, bazy danych, sieci komputerowe.",
    accent: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  },
];

const passions = [
  { emoji: "🚀", label: "Nowe technologie" },
  { emoji: "🎮", label: "Game dev" },
  { emoji: "📚", label: "Open source" },
  { emoji: "☕", label: "Kawa specialty" },
];

const techStack = [
  { name: "React" },
  { name: "TypeScript" },
  { name: "Node.js" },
  { name: "Next.js" },
  { name: "Tailwind" },
  { name: "PostgreSQL" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null);
  const magneticCv = useMagnetic(0.3);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-5%", "8%"]);
  const parallaxYInverse = useTransform(scrollYProgress, [0, 1], ["5%", "-8%"]);

  return (
    <section ref={sectionRef} className="relative bg-secondary/30 py-32 px-6 overflow-hidden" id="o-mnie">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Noise/grid texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(hsl(var(--foreground))_0.5px,transparent_0.5px)] bg-[length:24px_24px]" />

        {/* Orb glows */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[150px]"
          style={{ y: parallaxY }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full bg-violet-500/4 blur-[120px]"
          style={{ y: parallaxYInverse }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      {/* Top line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.1), transparent)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* === HEADER === */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary font-['Geist'] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="h-3 w-3" />
            Kim jestem
          </motion.span>

          <motion.h2
            className="font-['Geist'] font-medium tracking-[-0.02em] text-foreground text-4xl md:text-6xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            O{" "}
            <motion.span
              className="font-['Instrument_Serif'] italic text-5xl md:text-7xl inline-block bg-gradient-to-r from-primary via-accent-blue to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              mnie
            </motion.span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* === BIO CARD === */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="sticky top-28">
              {/* Main bio card with gradient border */}
              <motion.div
                className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden group"
                whileHover={{ boxShadow: "0 20px 60px -10px rgba(59,130,246,0.12), 0 0 0 1px hsl(var(--primary)/0.2)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/10" />
                  <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-primary/30 via-transparent to-accent-blue/20" style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                </div>

                {/* Card glow on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  {/* Profile avatar row */}
                  <motion.div
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.div
                      className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-2xl shadow-lg shadow-primary/20"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="font-bold text-white font-['Geist']">GK</span>
                      <motion.div
                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, type: "spring" }}
                      >
                        <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <p className="font-['Geist'] font-semibold text-foreground text-lg">Grzegorz</p>
                      <p className="font-['Geist'] text-xs text-muted-foreground">Fullstack Developer</p>
                    </div>
                  </motion.div>

                  {/* Bio text */}
                  <p className="font-['Geist'] text-muted-foreground leading-relaxed mb-5 text-[15px]">
                    Cześć! Jestem <span className="text-foreground font-semibold">Grzegorz</span> — fullstack
                    developer z pasją do tworzenia nowoczesnych aplikacji webowych i mobilnych.
                    Od kilku lat projektuję i buduję rozwiązania, które łączą piękny design z solidną architekturą.
                  </p>
                  <p className="font-['Geist'] text-muted-foreground leading-relaxed mb-8 text-[15px]">
                    Specjalizuję się w ekosystemie React i TypeScript, ale nie boję się sięgać po nowe
                    technologie. Wierzę, że najlepszy kod to taki, który jest czytelny, testowalny
                    i łatwy do utrzymania.
                  </p>

                  {/* Tech stack pills */}
                  <div className="mb-8">
                    <p className="font-['Geist'] text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, i) => (
                        <motion.span
                          key={tech.name}
                          className="inline-flex items-center rounded-lg border border-border/50 bg-secondary/60 px-3 py-1.5 text-xs font-['Geist'] text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.06, type: "spring", stiffness: 250 }}
                          whileHover={{ y: -2, scale: 1.05 }}
                        >
                          {tech.name}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Passions */}
                  <p className="font-['Geist'] text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
                    Zainteresowania
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {passions.map((p, i) => (
                      <motion.div
                        key={p.label}
                        className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3.5 py-1.5 text-sm font-['Geist'] text-muted-foreground hover:text-foreground hover:border-primary/25 hover:bg-primary/5 transition-all cursor-default"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.06 }}
                        whileHover={{ scale: 1.06, y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: i * 0.3 }}
                        >
                          {p.emoji}
                        </motion.span>
                        {p.label}
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3">
                    <motion.a
                      ref={magneticCv.ref as React.Ref<HTMLAnchorElement>}
                      onMouseMove={magneticCv.onMouseMove}
                      onMouseLeave={magneticCv.onMouseLeave}
                      href="/cv.pdf"
                      download
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground font-['Geist'] shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] transition-shadow"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Pobierz CV
                    </motion.a>
                    <motion.a
                      href="#kontakt"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground font-['Geist'] hover:border-primary/30 hover:text-primary transition-all"
                      whileHover={{ gap: "8px" }}
                    >
                      Napisz do mnie
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* === TIMELINE === */}
          <div className="relative">
            {/* Vertical line with glow */}
            <motion.div
              className="absolute left-[22px] top-0 bottom-0 w-[1px]"
              style={{ background: "linear-gradient(180deg, transparent, hsl(var(--border)), hsl(var(--primary)/0.2), hsl(var(--border)), transparent)" }}
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            />

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="relative pl-16"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.15,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  onMouseEnter={() => setHoveredTimeline(i)}
                  onMouseLeave={() => setHoveredTimeline(null)}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`absolute left-[9px] top-2 flex h-[27px] w-[27px] items-center justify-center rounded-full border-2 transition-all duration-300 ${item.accent}`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.45 + i * 0.15,
                    }}
                    animate={{
                      scale: hoveredTimeline === i ? 1.2 : 1,
                      boxShadow: hoveredTimeline === i
                        ? "0 0 20px 4px hsl(var(--primary) / 0.2)"
                        : "0 0 0px 0px transparent",
                    }}
                  >
                    <item.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </motion.div>

                  {/* Pulse ring */}
                  {i === 0 && (
                    <motion.div
                      className="absolute left-[9px] top-2 h-[27px] w-[27px] rounded-full border border-primary/30"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                    />
                  )}

                  {/* Card */}
                  <motion.div
                    className={`relative rounded-2xl border transition-all duration-300 p-5 overflow-hidden ${
                      hoveredTimeline === i
                        ? "border-primary/20 bg-card/80 shadow-[0_8px_30px_-6px_rgba(59,130,246,0.08)] translate-x-1"
                        : "border-transparent bg-transparent"
                    }`}
                  >
                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/[0.03] via-transparent to-transparent pointer-events-none"
                      animate={{ opacity: hoveredTimeline === i ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Year badge */}
                    <motion.span
                      className={`inline-block text-[11px] font-semibold tracking-[0.15em] uppercase mb-2 font-['Geist'] ${
                        hoveredTimeline === i ? item.accent.split(" ")[1] : "text-muted-foreground"
                      }`}
                    >
                      {item.year}
                    </motion.span>
                    <h3 className="font-['Geist'] font-semibold text-foreground text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="font-['Geist'] text-sm text-muted-foreground/70 mb-2">
                      {item.company}
                    </p>
                    <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Decorative corner accent */}
                    <motion.div
                      className={`absolute top-0 right-0 w-16 h-16 rounded-bl-2xl opacity-0 transition-opacity duration-500 pointer-events-none ${
                        item.accent.split(" ")[0].replace("/10", "/5")
                      }`}
                      animate={{ opacity: hoveredTimeline === i ? 1 : 0 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
