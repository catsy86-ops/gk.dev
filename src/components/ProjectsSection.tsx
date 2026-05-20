import { motion, useScroll, useTransform } from "motion/react";
import { ExternalLink, ArrowUpRight, Star } from "lucide-react";
import { useState, forwardRef, useRef } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const projects = [
  {
    title: "Szczecin Styl",
    description:
      "Nowoczesna strona e-commerce dla butiku odzieżowego. Responsywny katalog produktów, filtrowanie, koszyk i integracja z systemem płatności.",
    tags: ["React", "TypeScript", "Tailwind", "E-commerce"],
    accent: "from-purple-500/20 to-pink-500/10",
    accentBorder: "hover:border-purple-500/30",
    accentGlow: "0 0 30px -5px rgba(168,85,247,0.2)",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=500&fit=crop",
    demo: "https://szczecin-styl-main.vercel.app/",
    featured: true,
  },
  {
    title: "Notatnik",
    description:
      "Aplikacja do zarządzania notatkami z synchronizacją w chmurze. Edytor rich-text, tagi, wyszukiwanie i ciemny motyw.",
    tags: ["React", "Firebase", "TypeScript", "Tailwind"],
    accent: "from-blue-500/20 to-cyan-500/10",
    accentBorder: "hover:border-blue-500/30",
    accentGlow: "0 0 30px -5px rgba(59,130,246,0.2)",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    demo: "https://notatnik-seven.vercel.app/",
    featured: true,
  },
  {
    title: "Łysy",
    description:
      "Portfolio dla fryzjera z galerią prac, rezerwacją wizyt i systemem opinii klientów. Responsywny design z animacjami.",
    tags: ["Next.js", "TypeScript", "Tailwind", "CMS"],
    accent: "from-amber-500/20 to-orange-500/10",
    accentBorder: "hover:border-amber-500/30",
    accentGlow: "0 0 30px -5px rgba(245,158,11,0.2)",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=500&fit=crop",
    demo: "https://lysy-smoky.vercel.app/",
    featured: false,
  },
  {
    title: "Ghydra",
    description:
      "Platforma do zarządzania projektami z tablicą Kanban, przydzielaniem zadań i śledzeniem czasu. Kolaboracja w zespołach.",
    tags: ["React", "Node.js", "MongoDB", "Socket.io"],
    accent: "from-emerald-500/20 to-green-500/10",
    accentBorder: "hover:border-emerald-500/30",
    accentGlow: "0 0 30px -5px rgba(16,185,129,0.2)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    demo: "https://ghydra-main.vercel.app/",
    featured: false,
  },
  {
    title: "Łuszy Elektro Glow",
    description:
      "Sklep internetowy z oświetleniem LED i akcesoriami elektronicznymi. Zaawansowany system filtrowania, porównywanie produktów i rekomendacje.",
    tags: ["React", "TypeScript", "Stripe", "Tailwind"],
    accent: "from-yellow-500/20 to-red-500/10",
    accentBorder: "hover:border-yellow-500/30",
    accentGlow: "0 0 30px -5px rgba(234,179,8,0.2)",
    image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=800&h=500&fit=crop",
    demo: "https://lucasz-elektro-glow-main.vercel.app/",
    featured: false,
  },
  {
    title: "uFISZA",
    description:
      "Platforma e-commerce do sprzedaży fiszu — katalog produktów, koszyk, płatności online i panel zarządzania zamówieniami.",
    tags: ["React", "TypeScript", "Tailwind", "E-commerce"],
    accent: "from-teal-500/20 to-cyan-500/10",
    accentBorder: "hover:border-teal-500/30",
    accentGlow: "0 0 30px -5px rgba(20,184,166,0.2)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=500&fit=crop",
    demo: "https://fisz-handel-c1bb3a8d-uubz.vercel.app/",
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
          className="absolute top-4 left-4 z-30 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent-blue backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-white font-['Geist'] shadow-lg"
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 300 }}
        >
          <Star className="h-3.5 w-3.5" fill="currentColor" />
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
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground font-['Geist'] shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            Otwórz
          </a>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <motion.h3
            className="font-['Geist'] font-semibold text-foreground text-lg tracking-[-0.01em] flex-1"
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
            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label={`Otwórz ${project.title}`}
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.a>
        </div>

        {/* Description */}
        <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, tagIdx) => (
            <motion.span
              key={tag}
              className="rounded-full bg-secondary/80 backdrop-blur-sm border border-border/30 px-3 py-1 text-[11px] font-medium text-muted-foreground font-['Geist'] tracking-wide hover:border-primary/30 hover:text-primary transition-colors"
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
    <SectionWrapper id="projekty" label="Projekty">
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
        <SectionHeader
          badge="Wybrane realizacje"
          badgeIcon={<Star className="h-3 w-3" />}
          title="Moje"
          highlight="projekty"
          gradient
        />

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
    </SectionWrapper>
  );
};

export default ProjectsSection;