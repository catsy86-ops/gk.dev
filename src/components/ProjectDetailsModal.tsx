import { useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { X, ExternalLink, Github, Sparkles, CheckCircle2, Cpu, BarChart3, Layers, Tag, Laptop, Smartphone } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight } from "@/lib/haptics";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sheetRef = useRef<HTMLDivElement>(null);
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "mobile">("desktop");

  if (!project) return null;

  const handleClose = () => {
    soundEngine.playPop(500, 0.05);
    hapticLight();
    onClose();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // If dragged down fast or far enough on mobile, close sheet
    if (info.offset.y > 80 || info.velocity.y > 400) {
      soundEngine.playPop(450, 0.05);
      hapticMedium();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal / Native Bottom Sheet Container */}
          <motion.div
            ref={sheetRef}
            className={`relative w-full max-w-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10 ${
              isMobile
                ? "rounded-t-[32px] max-h-[90dvh] pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]"
                : "rounded-3xl my-8"
            }`}
            initial={isMobile ? { y: "100%", opacity: 0.5 } : { opacity: 0, scale: 0.92, y: 20 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            {/* Mobile Drag Handle Bar */}
            {isMobile && (
              <div className="w-full pt-3 pb-1 flex justify-center items-center cursor-grab active:cursor-grabbing bg-card/50">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-md active:scale-90"
              aria-label="Zamknij szczegóły projektu"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Container */}
            <div className="max-h-[calc(90dvh-4rem)] sm:max-h-[80vh] overflow-y-auto overscroll-contain">
              {/* Header / Media Banner */}
              <div className="relative bg-secondary/50 p-4 sm:p-6 border-b border-border/60">
                {/* Device Frame Switcher toolbar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-mono text-[11px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" />
                    {project.categoryLabel} • {project.stats.year}
                  </span>

                  <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md rounded-xl p-1 border border-border/60 shadow-sm mr-12 sm:mr-0">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        hapticLight();
                        setDeviceFrame("desktop");
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        deviceFrame === "desktop"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Laptop className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">MacBook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        hapticLight();
                        setDeviceFrame("mobile");
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        deviceFrame === "mobile"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">iPhone</span>
                    </button>
                  </div>
                </div>

                {/* Mockup Frame Presentation */}
                <div className="flex justify-center items-center py-2">
                  {deviceFrame === "desktop" ? (
                    <motion.div
                      key="frame-desktop"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full rounded-2xl border border-border/80 bg-background/90 shadow-2xl overflow-hidden"
                    >
                      {/* Browser header */}
                      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/60 bg-muted/40">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        <span className="mx-auto text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">
                          {project.demo.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <OptimizedImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          widths={[600, 1000, 1400]}
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="frame-mobile"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-56 rounded-[32px] border-[5px] border-border/90 bg-background shadow-2xl overflow-hidden relative"
                    >
                      {/* Dynamic Island Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-16 bg-black rounded-full z-20" />
                      <div className="relative aspect-[9/16] w-full overflow-hidden">
                        <OptimizedImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          widths={[600]}
                          sizes="250px"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="modal-project-title" className="font-['Geist'] text-2xl sm:text-3xl font-bold text-foreground">
                      {project.title}
                    </h2>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
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
              <div className="p-6 sm:p-8 space-y-6">
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
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{arch}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h3 className="font-['Geist'] text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Stack technologiczny
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl border border-border/60 bg-secondary/60 px-3 py-1 font-mono text-xs text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mobile Sticky Action Bar */}
                <div className="sm:hidden pt-4 border-t border-border/60 flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary py-3 text-xs font-semibold font-['Geist'] text-foreground active:scale-95"
                    >
                      <Github className="h-4 w-4" />
                      Kod GitHub
                    </a>
                  )}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-semibold font-['Geist'] text-primary-foreground shadow-lg shadow-primary/30 active:scale-95"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Zobacz Live
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
