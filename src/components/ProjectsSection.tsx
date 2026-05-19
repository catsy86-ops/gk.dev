import { motion, useScroll, useTransform } from "motion/react";
import { ExternalLink, ArrowUpRight, Star } from "lucide-react";
import { useState, forwardRef, useRef } from "react";

const projects = [
  {
    title: "Wartość Firmy",
    description:
      "Kalkulator wyceny przedsiębiorstw — estymacja na podstawie DCF, mnożników i metody aktywów netto. Interaktywne wykresy i eksport PDF.",
    tags: ["Angular", "TypeScript", "Bootstrap"],
    accent: "from-blue-500/20 to-cyan-500/10",
    accentBorder: "hover:border-blue-500/30",
    accentGlow: "0 0 30px -5px rgba(59,130,246,0.2)",
    image:
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c3ea89de-36c1-4cc4-9c66-53182cd4a6a9/id-preview-6a3f3809--ac9c976f-9b8b-4f29-aa1a-82a36c8c4ad6.lovable.app-1774777004451.png",
    demo: "https://wycena.vercel.app",
    featured: true,
  },
  {
    title: "uFISZA",
    description:
      "Platforma e-commerce do sprzedaży fiszu — katalog produktów, koszyk, płatności online i panel zarządzania zamówieniami.",
    tags: ["React", "TypeScript", "Tailwind"],
    accent: "from-emerald-500/20 to-green-500/10",
    accentBorder: "hover:border-emerald-500/30",
    accentGlow: "0 0 30px -5px rgba(16,185,129,0.2)",
    image:
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c3ea89de-36c1-4cc4-9c66-53182cd4a6a9/id-preview-6a3f3809--ac9c976f-9b8b-4f29-aa1a-82a36c8c4ad6.lovable.app-1774777004451.png",
    demo: "https://fisz-handel-c1bb3a8d-uubz.vercel.app",
    featured: false,
  },
  {
    title: "Jednoręka Kaczka",
    description:
      "Gra w stylu jednoręki bandyta z systemem poziomów, auto-spinem i animacjami. Kaczki, kasyno, klimat!",
    tags: ["React", "TypeScript", "Framer Motion"],
    accent: "from-amber-500/20 to-orange-500/10",
    accentBorder: "hover:border-amber-500/30",
    accentGlow: "0 0 30px -5px rgba(245,158,11,0.2)",
    image:
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c896a25f-872c-4cce-92a4-6f2c6dfcabe0/id-preview-289dc1cd--a35697ee-c8bc-4f17-9569-e2c3c532c2c9.lovable.app-1774851748709.png",
    demo: "https://jednoreki.vercel.app",
    featured: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.88, rotateX: 8, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      delay: i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const ProjectCard = forwardRef<
  HTMLDivElement,
  { project: (typeof projects)[0]; index: number }
>(({ project, index }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgParallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={cardRef}
      className={`group relative rounded-2xl border border-border bg-card overflow-hidden ${project.accentBorder}`}
      variants={cardVariants}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      style={{ y: parallaxY }}
    >
      {/* Animated gradient bg on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${project.accent}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Shine sweep effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, transparent 50%)",
        }}
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "200%" } : { x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Glowing border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        animate={{
          boxShadow: isHovered
            ? `inset 0 0 0 1px rgba(255,255,255,0.15), ${project.accentGlow}`
            : "inset 0 0 0 1px rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Featured badge */}
      {project.featured && (
        <motion.div
          className="absolute top-4 left-4 z-30 flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-primary-foreground font-['Geist'] shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Star className="h-3 w-3" fill="currentColor" />
          Wyróżniony
        </motion.div>
      )}

      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ y: imgParallax }}
        />

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
          animate={{ opacity: isHovered ? 0.9 : 0.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover action buttons */}
        <motion.div
          className="absolute bottom-4 right-4 flex items-center gap-2"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 12,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Demo – ${project.title}`}
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground font-['Geist'] shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] transition-shadow"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            Zobacz na żywo
          </a>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <motion.h3
            className="font-['Geist'] font-semibold text-foreground text-lg tracking-[-0.01em]"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          >
            {project.title}
          </motion.h3>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -4,
              y: isHovered ? 0 : 4,
            }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.a>
        </div>
        <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, tagIdx) => (
            <motion.span
              key={tag}
              className="rounded-full bg-secondary/80 backdrop-blur-sm border border-border/30 px-3 py-1 text-[11px] font-medium text-muted-foreground font-['Geist'] tracking-wide"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.4 + tagIdx * 0.05 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";

const ProjectsSection = () => {
  return (
    <section
      className="relative z-10 bg-background py-28 px-6 overflow-hidden"
      id="projekty"
    >
      {/* Section line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.1), transparent)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-primary/3 blur-[150px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full bg-violet-500/3 blur-[120px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary font-['Geist'] mb-5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, stiffness: 300 }}
          >
            <Star className="h-3 w-3" />
            Wybrane realizacje
          </motion.span>
          <motion.h2
            className="font-['Geist'] font-medium tracking-[-0.03em] text-foreground text-4xl md:text-5xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Moje{" "}
            <motion.span
              className="font-['Instrument_Serif'] italic text-5xl md:text-6xl inline-block bg-gradient-to-r from-primary via-accent-blue to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              projekty
            </motion.span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;