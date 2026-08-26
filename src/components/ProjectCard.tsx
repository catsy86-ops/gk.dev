import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Star, Globe, Layers } from "lucide-react";
import { useState, forwardRef, useRef } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ProjectSvgThumbnail } from "@/components/ProjectSvgThumbnail";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EASE_STANDARD } from "@/constants/animations";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/components/ProjectDetailsModal";

export type Project = ProjectData;

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onOpenDetails?: (project: ProjectData) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: EASE_STANDARD,
    },
  }),
};

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, index, onOpenDetails }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const isHoverDevice = useMediaQuery("(hover: hover)");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: cardRef,
      offset: ["start end", "end start"],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [25, -25]);
    const imgParallax = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });

      const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 50, y: 50 });
      setTilt({ x: 0, y: 0 });
      setIsHovered(false);
    };

    return (
      <motion.div
        ref={cardRef}
        layout
        className={cn(
          "group relative rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-300",
          project.accentBorder,
          project.featured ? "md:col-span-2 lg:col-span-2" : ""
        )}
        variants={cardVariants}
        custom={index}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTouchEnd={() => setIsHovered(false)}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={isMobile ? {} : { y: -6, transition: { duration: 0.3 } }}
        tabIndex={0}
        data-cursor="project"
        aria-label={`Projekt ${project.title}`}
        style={{
          y: isMobile ? 0 : parallaxY,
          rotateX: isMobile ? 0 : tilt.x,
          rotateY: isMobile ? 0 : tilt.y,
          transformPerspective: 1000,
        }}
      >
        {/* Dynamic Light Glare Reflection */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-[6] mix-blend-overlay"
          animate={{
            background:
              isHoverDevice && isHovered
                ? `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.25), transparent 60%)`
                : "transparent",
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Mouse-following spotlight */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-[5]"
          animate={{
            background:
              isHoverDevice && isHovered
                ? `radial-gradient(500px circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.08), transparent 40%)`
                : "transparent",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Enhanced shadow on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          animate={{
            boxShadow:
              isHoverDevice && isHovered
                ? `0 20px 60px -10px rgba(0,0,0,0.18), ${project.accentGlow}`
                : "0 4px 20px -5px rgba(0,0,0,0.06)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.accent}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHoverDevice && isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        <div>
          {/* Top badges bar */}
          <div className="relative z-30 flex items-center justify-between p-4 pb-0">
            {project.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 backdrop-blur-md px-3 py-1 font-mono text-[11px] font-semibold text-primary border border-primary/30 shadow-sm">
                <Star className="h-3 w-3 fill-current" />
                Wyróżniony projekt
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-muted-foreground bg-secondary/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border/40">
                {project.categoryLabel}
              </span>
            )}

            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-card/80 backdrop-blur-md border border-border/50 px-2.5 py-1 rounded-full">
              <span className="text-primary font-bold">{project.stats.year}</span>
              <span className="text-border">•</span>
              <span>{project.stats.type}</span>
            </div>
          </div>

          {/* Thumbnail media container with Vector SVG artwork */}
          <div className="relative mt-3 mx-4 overflow-hidden rounded-2xl aspect-[16/10] bg-secondary/50 border border-border/40">
            <ProjectSvgThumbnail
              projectId={project.id}
              category={project.category}
              accent={project.accent}
              isHovered={isHovered}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/85 via-card/10 to-transparent pointer-events-none" />

            {/* Quick Action buttons */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
              {onOpenDetails && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(project);
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-card/90 backdrop-blur-md px-3.5 text-xs font-medium text-foreground hover:bg-card hover:border-primary/40 transition-all shadow-md active:scale-95"
                >
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Case Study
                </button>
              )}

              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Demo – ${project.title}`}
                className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
              >
                <Globe className="h-3.5 w-3.5" />
                Demo
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Project Title & Description */}
          <div className="p-5 sm:p-6 pb-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-['Geist'] font-bold text-foreground text-lg sm:text-xl tracking-tight group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </div>

            <p className="font-['Geist'] text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
              {project.description}
            </p>
          </div>
        </div>

        {/* Footer info: tags & metrics */}
        <div className="p-5 sm:p-6 pt-0 space-y-3">
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-primary/90 bg-primary/5 dark:bg-primary/10 border border-primary/15 rounded-xl px-3 py-1.5">
              <span className="font-bold">{project.metrics[0].value}</span>
              <span className="text-muted-foreground">• {project.metrics[0].label}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-secondary/80 border border-border/40 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
