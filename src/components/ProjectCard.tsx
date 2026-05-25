import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Star, Globe } from "lucide-react";
import { useState, forwardRef, useRef } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EASE_STANDARD } from "@/constants/animations";

interface Project {
  title: string;
  description: string;
  tags: string[];
  accent: string;
  accentBorder: string;
  accentGlow: string;
  image: string;
  demo: string;
  featured: boolean;
  stats: { year: string; type: string };
}

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
      ease: EASE_STANDARD,
    },
  }),
};

const ProjectCard = forwardRef<
  HTMLDivElement,
  { project: Project; index: number }
>(({ project, index }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const isHoverDevice = useMediaQuery("(hover: hover)");
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgParallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    // 3D tilt calculation
    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
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
      className={`group relative rounded-2xl border border-border bg-card overflow-hidden ${project.accentBorder}`}
      variants={cardVariants}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      tabIndex={0}
      role="link"
      aria-label={`Projekt ${project.title} — otwórz demo`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(project.demo, "_blank", "noopener,noreferrer");
        }
      }}
      style={{
        y: parallaxY,
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Mouse-following spotlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-[5]"
        animate={{
          background: isHoverDevice && isHovered
            ? `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.06), transparent 40%)`
            : "transparent",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Enhanced shadow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={{
          boxShadow: isHoverDevice && isHovered
            ? `0 20px 60px -10px rgba(0,0,0,0.15), ${project.accentGlow}`
            : "0 4px 20px -5px rgba(0,0,0,0.08)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Animated gradient bg on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${project.accent}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHoverDevice && isHovered ? 1 : 0 }}
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
        animate={isHoverDevice && isHovered ? { x: "200%" } : { x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Glowing border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        animate={{
          boxShadow: isHoverDevice && isHovered
            ? `inset 0 0 0 1px rgba(255,255,255,0.15), ${project.accentGlow}`
            : "inset 0 0 0 1px rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Featured badge */}
      {project.featured && (
        <motion.div
          className="absolute top-4 left-4 z-30 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent-blue backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--hero-star))] font-['Geist'] shadow-lg"
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            aria-hidden="true"
          >
            <Star className="h-3.5 w-3.5" fill="currentColor" />
          </motion.div>
          Wyróżniony
        </motion.div>
      )}

      {/* Project stats badge */}
      <motion.div
        className="absolute top-4 right-4 z-30 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border/50 px-3 py-1.5 text-[10px] font-medium text-muted-foreground font-['Geist']"
        initial={{ opacity: 0, y: -10, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4, type: "spring", stiffness: 300 }}
      >
        <span className="text-primary font-semibold">{project.stats.year}</span>
        <span className="text-border">•</span>
        <span>{project.stats.type}</span>
      </motion.div>

      {/* Thumbnail */}
      <motion.div
        className="relative overflow-hidden aspect-[16/10]"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <OptimizedImage
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
          widths={[400, 800, 1200]}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ scale: isHoverDevice && isHovered ? 1.12 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ y: imgParallax }}
        />

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
          animate={{ opacity: isHoverDevice && isHovered ? 0.95 : 0.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover action buttons */}
        <motion.div
          className="absolute bottom-4 right-4 flex items-center gap-2"
          initial={false}
          animate={{
            opacity: isHoverDevice && isHovered ? 1 : 0,
            y: isHoverDevice && isHovered ? 0 : 12,
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
            <Globe className="h-3.5 w-3.5" strokeWidth={2} />
            Otwórz
          </a>
        </motion.div>
      </motion.div>

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
              opacity: isHoverDevice && isHovered ? 1 : 0,
              x: isHoverDevice && isHovered ? 0 : -4,
              y: isHoverDevice && isHovered ? 0 : 4,
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

export { ProjectCard };
export type { Project };
