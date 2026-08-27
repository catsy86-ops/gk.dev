import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Star, Globe, Layers } from "lucide-react";
import { useState, forwardRef, useRef } from "react";
import { ProjectSvgThumbnail } from "@/components/ProjectSvgThumbnail";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EASE_STANDARD } from "@/constants/animations";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/components/ProjectDetailsModal";
import { useAchievements } from "@/hooks/use-achievements";

export type Project = ProjectData;

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onOpenDetails?: (project: ProjectData) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97, filter: "blur(3px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      delay: i * 0.04,
      ease: EASE_STANDARD,
    },
  }),
};

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, index, onOpenDetails }, ref) => {
    const { unlock } = useAchievements();
    const [isHovered, setIsHovered] = useState(false);
    const isHoverDevice = useMediaQuery("(hover: hover)");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: cardRef,
      offset: ["start end", "end start"],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [10, -10]);

    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });

      const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
      const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
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
          "group relative rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-lg",
          project.accentBorder
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
        whileHover={isMobile ? {} : { y: -3, transition: { duration: 0.2 } }}
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
          className="absolute inset-0 rounded-xl pointer-events-none z-[6] mix-blend-overlay"
          animate={{
            background:
              isHoverDevice && isHovered
                ? `radial-gradient(240px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.2), transparent 60%)`
                : "transparent",
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Mouse-following spotlight */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-[5]"
          animate={{
            background:
              isHoverDevice && isHovered
                ? `radial-gradient(280px circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.08), transparent 45%)`
                : "transparent",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Animated gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.accent}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHoverDevice && isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div>
          {/* Top badges bar (micro-sized) */}
          <div className="relative z-30 flex items-center justify-between p-2.5 sm:p-3 pb-0">
            {project.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 backdrop-blur-md px-2 py-0.2 font-mono text-[9px] font-bold text-primary border border-primary/30 shadow-sm">
                <Star className="h-2 w-2 fill-current" />
                Featured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-medium text-muted-foreground bg-secondary/80 backdrop-blur-sm px-1.5 py-0.2 rounded-full border border-border/50">
                {project.categoryLabel}
              </span>
            )}

            <div className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground bg-card/90 backdrop-blur-md border border-border/60 px-1.5 py-0.2 rounded-full">
              <span className="text-primary font-bold">{project.stats.year}</span>
              <span className="text-border">•</span>
              <span>{project.stats.type}</span>
            </div>
          </div>

          {/* Ultra-compact thumbnail container with Vector SVG artwork in DeviceFrame */}
          <div className="relative mt-2 mx-2.5 sm:mx-3">
            <DeviceFrame variant="macbook" title={`gk.dev/apps/${project.id}`}>
              <div className="relative w-full h-full">
                <ProjectSvgThumbnail
                  projectId={project.id}
                  category={project.category}
                  accent={project.accent}
                  isHovered={isHovered}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent pointer-events-none" />

                {/* Micro Action buttons */}
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 z-20">
                  {onOpenDetails && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        unlock("architect_explorer");
                        onOpenDetails(project);
                      }}
                      className="flex h-6 items-center gap-1 rounded-md border border-border/70 bg-card/90 backdrop-blur-md px-2 text-[10px] font-semibold text-foreground hover:bg-card hover:border-primary/50 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Layers className="h-2.5 w-2.5 text-primary" />
                      Case Study
                    </button>
                  )}

                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Demo – ${project.title}`}
                    className="flex h-6 items-center gap-1 rounded-md bg-primary px-2 text-[10px] font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                  >
                    <Globe className="h-2.5 w-2.5" />
                    Demo
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            </DeviceFrame>
          </div>

          {/* Project Title & Description (ultra-compact) */}
          <div className="p-2.5 sm:p-3 pb-1.5">
            <h3 className="font-['Geist'] font-bold text-foreground text-xs sm:text-sm tracking-tight group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
              {project.title}
            </h3>

            <p className="font-['Geist'] text-[11px] text-muted-foreground leading-snug line-clamp-1">
              {project.description}
            </p>
          </div>
        </div>

        {/* Footer info: tags & metrics */}
        <div className="p-2.5 sm:p-3 pt-0 space-y-1.5">
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex items-center gap-1 font-mono text-[9px] text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5">
              <span className="font-bold">{project.metrics[0].value}</span>
              <span className="text-muted-foreground truncate">• {project.metrics[0].label}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-secondary/80 border border-border/50 px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground group-hover:text-foreground transition-colors"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="rounded bg-secondary/50 border border-border/40 px-1 py-0.2 text-[9px] font-mono text-muted-foreground/70">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
