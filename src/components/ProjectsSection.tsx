import { motion, useScroll, useTransform } from "motion/react";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { useState, forwardRef, useRef } from "react";

const projects = [
  {
    title: "TaskFlow",
    description: "Aplikacja do zarządzania projektami z drag & drop, real-time sync i dashboardem analitycznym.",
    tags: ["React", "TypeScript", "Supabase"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    github: "#",
    demo: "#",
  },
  {
    title: "ShopNest",
    description: "Platforma e-commerce z koszykiem, płatnościami Stripe i panelem administracyjnym.",
    tags: ["Next.js", "Prisma", "Stripe"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    github: "#",
    demo: "#",
  },
  {
    title: "WeatherPulse",
    description: "Aplikacja pogodowa z geolokalizacją, animowanymi mapami i 7-dniową prognozą.",
    tags: ["React Native", "OpenWeather API"],
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
    github: "#",
    demo: "#",
  },
  {
    title: "DevBoard",
    description: "Dashboard dla developerów — integracja z GitHub, Jira i Slack w jednym miejscu.",
    tags: ["Vue.js", "Node.js", "GraphQL"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    github: "#",
    demo: "#",
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

const ProjectCard = forwardRef<HTMLDivElement, { project: typeof projects[0]; index: number }>(({ project, index }, ref) => {
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
      className="group relative rounded-2xl border border-border bg-card overflow-hidden"
      variants={cardVariants}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      style={{ y: parallaxY }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none z-10"
        animate={{
          boxShadow: isHovered
            ? "0px 20px 60px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)"
            : "0px 0px 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[3/2]">
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
          className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
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
            href={project.github}
            aria-label={`GitHub – ${project.title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-secondary transition-colors"
          >
            <Github className="h-4 w-4" strokeWidth={1.8} />
          </a>
          <a
            href={project.demo}
            aria-label={`Demo – ${project.title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-hero-cta text-hero-cta-foreground shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          </a>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <motion.h3
            className="font-['Geist'] font-medium text-foreground text-xl tracking-[-0.01em]"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          >
            {project.title}
          </motion.h3>
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -4,
              y: isHovered ? 0 : 4,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
        <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, tagIdx) => (
            <motion.span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground font-['Geist']"
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
    <section className="relative z-10 bg-background py-28 px-6 overflow-hidden" id="projekty">
      {/* Section line */}
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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground font-['Geist'] mb-5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, stiffness: 300 }}
          >
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
              className="font-['Instrument_Serif'] italic text-5xl md:text-6xl inline-block"
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
