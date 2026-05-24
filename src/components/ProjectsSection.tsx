import { motion, useInView } from "motion/react";
import { Star, Github } from "lucide-react";
import { lazy, Suspense, useRef, useMemo } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { useMediaQuery } from "@/hooks/use-media-query";

const ProjectsScene = lazy(() => import("./projects-scene"));

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
    stats: { year: "2024", type: "E-commerce" },
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
    stats: { year: "2024", type: "Produktywność" },
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
    stats: { year: "2024", type: "Portfolio" },
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
    stats: { year: "2024", type: "Zarządzanie" },
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
    stats: { year: "2024", type: "E-commerce" },
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
    stats: { year: "2024", type: "E-commerce" },
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useMemo(
    () => (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    },
    []
  );

  return (
    <SectionWrapper ref={sectionRef} id="projekty" label="Projekty" className="relative overflow-hidden">
      {/* Three.js Background */}
      {!prefersReduced && inView && (
        <div className="absolute inset-0 z-0 opacity-30" aria-hidden="true">
          <Suspense fallback={null}>
            <ProjectsScene isMobile={isMobile} mouseRef={mouseRef} />
          </Suspense>
        </div>
      )}

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

      {/* Enhanced background orbs with better positioning */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-primary/4 blur-[150px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/3 -right-40 w-80 h-80 rounded-full bg-violet-500/4 blur-[140px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-cyan-500/3 blur-[120px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4 }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]" onMouseMove={handleMouseMove}>
        <SectionHeader
          badge="Wybrane realizacje"
          badgeIcon={<Star className="h-3 w-3" />}
          title="Moje"
          highlight="projekty"
          gradient
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8"
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

        {/* Call-to-action section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-muted-foreground font-['Geist'] mb-4">
            Chcesz zobaczyć więcej projektów?
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 hover:border-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Github className="h-4 w-4" />
            Odwiedź moje GitHub
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default ProjectsSection;
