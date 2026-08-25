import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github, Sparkles, CheckCircle2, Cpu, BarChart3, Layers } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

export interface ProjectData {
  id: string;
  title: string;
  category: "ecommerce" | "saas" | "mobile" | "web";
  categoryLabel: string;
  description: string;
  fullDescription: string;
  tags: string[];
  accent: string;
  accentBorder: string;
  accentGlow: string;
  image: string;
  demo: string;
  github?: string;
  featured: boolean;
  stats: { year: string; type: string };
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  architecture: string[];
}

interface ProjectDetailsModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-3xl rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.8)] overflow-hidden my-8 z-10"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-md active:scale-90"
              aria-label="Zamknij szczegóły projektu"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header / Media Banner */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-secondary">
              <OptimizedImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                widths={[600, 1000, 1400]}
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 backdrop-blur-md px-3 py-1 font-mono text-[11px] font-semibold text-primary mb-2 border border-primary/30">
                    <Sparkles className="h-3 w-3" />
                    {project.categoryLabel} • {project.stats.year}
                  </span>
                  <h2 id="modal-project-title" className="font-['Geist'] text-2xl sm:text-3xl font-bold text-foreground">
                    {project.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-medium font-['Geist'] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Kod
                    </a>
                  )}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium font-['Geist'] text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Demo Live
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Description */}
              <div>
                <h3 className="font-['Geist'] text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                  O projekcie
                </h3>
                <p className="font-['Geist'] text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {project.fullDescription || project.description}
                </p>
              </div>

              {/* Metrics Grid */}
              {project.metrics && project.metrics.length > 0 && (
                <div>
                  <h3 className="font-['Geist'] text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Kluczowe metryki & Osiągnięcia
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-border/60 bg-secondary/40 p-3.5 text-center"
                      >
                        <p className="font-mono text-lg font-bold text-primary">{m.value}</p>
                        <p className="font-['Geist'] text-[11px] text-muted-foreground mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div>
                  <h3 className="font-['Geist'] text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Główne funkcjonalności
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.keyFeatures.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Architecture & Tech Highlights */}
              {project.architecture && project.architecture.length > 0 && (
                <div>
                  <h3 className="font-['Geist'] text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    Architektura & Rozwiązania techniczne
                  </h3>
                  <div className="space-y-2">
                    {project.architecture.map((arch, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/40 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-muted-foreground flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{arch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div>
                <h3 className="font-['Geist'] text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Wykorzystane technologie
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-border/60 bg-secondary/70 px-3 py-1 font-mono text-xs text-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
