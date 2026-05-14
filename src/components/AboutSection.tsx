import { motion } from "motion/react";
import { Briefcase, GraduationCap, Heart } from "lucide-react";

const timeline = [
  {
    icon: Briefcase,
    year: "2023 — teraz",
    title: "Senior Fullstack Developer",
    company: "Freelance / Własne projekty",
    description: "Tworzę aplikacje webowe i mobilne dla klientów z Polski i zagranicy. React, TypeScript, Node.js.",
  },
  {
    icon: Briefcase,
    year: "2021 — 2023",
    title: "Fullstack Developer",
    company: "Software House",
    description: "Budowanie platformy SaaS, integracje API, optymalizacja wydajności i architektura mikroserwisów.",
  },
  {
    icon: GraduationCap,
    year: "2019 — 2021",
    title: "Junior Developer",
    company: "Startup technologiczny",
    description: "Pierwsze komercyjne doświadczenie — frontend w React, backend w Node.js, praca w zespole Agile.",
  },
  {
    icon: GraduationCap,
    year: "2015 — 2019",
    title: "Informatyka",
    company: "Politechnika Warszawska",
    description: "Studia inżynierskie — programowanie, algorytmy, bazy danych, sieci komputerowe.",
  },
];

const passions = [
  { emoji: "🚀", label: "Nowe technologie" },
  { emoji: "🎮", label: "Game dev" },
  { emoji: "📚", label: "Open source" },
  { emoji: "☕", label: "Kawa specialty" },
];

const AboutSection = () => {
  return (
    <section className="relative z-10 bg-background py-28 px-6 overflow-hidden" id="o-mnie">
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

      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground font-['Geist'] mb-5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, stiffness: 300 }}
          >
            Kim jestem
          </motion.span>

          <motion.h2
            className="font-['Geist'] font-medium tracking-[-0.03em] text-foreground text-4xl md:text-5xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            O{" "}
            <motion.span
              className="font-['Instrument_Serif'] italic text-5xl md:text-6xl inline-block"
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              mnie
            </motion.span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="font-['Geist'] text-muted-foreground leading-relaxed mb-6">
              Cześć! Jestem <span className="text-foreground font-medium">Grzegorz</span> — fullstack
              developer z pasją do tworzenia nowoczesnych aplikacji webowych i mobilnych.
              Od kilku lat projektuję i buduję rozwiązania, które łączą piękny design z solidną architekturą.
            </p>
            <p className="font-['Geist'] text-muted-foreground leading-relaxed mb-8">
              Specjalizuję się w ekosystemie React i TypeScript, ale nie boję się sięgać po nowe
              technologie. Wierzę, że najlepszy kod to taki, który jest czytelny, testowalny
              i łatwy do utrzymania.
            </p>

            {/* Passions */}
            <div className="flex flex-wrap gap-3">
              {passions.map((p, i) => (
                <motion.div
                  key={p.label}
                  className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-['Geist'] text-muted-foreground"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span>{p.emoji}</span>
                  {p.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <motion.div
              className="absolute left-5 top-2 bottom-2 w-[1px] bg-border"
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="relative pl-14"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.12,
                    ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
                  }}
                >
                  {/* Dot */}
                  <motion.div
                    className="absolute left-[12px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 300,
                      damping: 20,
                      delay: 0.4 + i * 0.12,
                    }}
                  >
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
                  </motion.div>

                  <span className="font-['Geist'] text-xs font-medium text-muted-foreground">
                    {item.year}
                  </span>
                  <h3 className="font-['Geist'] font-medium text-foreground text-base mt-1">
                    {item.title}
                  </h3>
                  <p className="font-['Geist'] text-sm text-muted-foreground/70 mb-1">
                    {item.company}
                  </p>
                  <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
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
