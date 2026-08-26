import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import {
  X,
  ExternalLink,
  Github,
  Sparkles,
  CheckCircle2,
  Cpu,
  BarChart3,
  Layers,
  Tag,
  Laptop,
  Smartphone,
  Share2,
  FileCode2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ProjectSvgThumbnail } from "@/components/ProjectSvgThumbnail";
import { useMediaQuery } from "@/hooks/use-media-query";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight } from "@/lib/haptics";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { toast } from "@/hooks/use-toast";

export interface ProjectData {
  id: string;
  title: string;
  category: "ecommerce" | "saas" | "mobile" | "web";
  categoryLabel: string;
  description: string;
  fullDescription: string;
  challenge?: string;
  solution?: string;
  results?: string;
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

export const ProjectDetailsModal = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) => {
  useScrollLock(isOpen);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sheetRef = useRef<HTMLDivElement>(null);
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "mobile" | "vector">("vector");
  const [activeTab, setActiveTab] = useState<"case-study" | "sandbox" | "features" | "architecture">("case-study");
  const [sandboxViewport, setSandboxViewport] = useState<"desktop" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!project) return null;

  const handleClose = () => {
    soundEngine.playPop(500, 0.05);
    hapticLight();
    onClose();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 400) {
      soundEngine.playPop(450, 0.05);
      hapticMedium();
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(project.demo);
      soundEngine.playChime();
      hapticLight();
      toast({
        title: "Skopiowano adres projektu!",
        description: `Link do ${project.title} został skopiowany do schowka.`,
      });
    } catch {
      toast({
        title: "Błąd kopiowania",
        description: "Nie udało się skopiować linku do schowka.",
      });
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
          />

          {/* Modal / Native Bottom Sheet Container */}
          <motion.div
            ref={sheetRef}
            className={`relative w-full max-w-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10 pointer-events-auto ${
              isMobile
                ? "rounded-t-[32px] max-h-[92dvh] pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]"
                : "rounded-3xl my-6"
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
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-md active:scale-90 cursor-pointer pointer-events-auto"
              aria-label="Zamknij szczegóły projektu"
              title="Zamknij"
            >
              <X className="h-5 w-5 pointer-events-none" />
            </button>

            {/* Scrollable Container */}
            <div className="max-h-[calc(92dvh-4rem)] sm:max-h-[82vh] overflow-y-auto overscroll-contain scrollbar-thin">
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
                        setDeviceFrame("vector");
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        deviceFrame === "vector"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>SVG Vector</span>
                    </button>
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
                  {deviceFrame === "vector" ? (
                    <motion.div
                      key="frame-vector"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-48 sm:h-56 rounded-2xl border border-border/80 bg-background/90 shadow-2xl overflow-hidden relative"
                    >
                      <ProjectSvgThumbnail
                        projectId={project.id}
                        category={project.category}
                        accent={project.accent}
                        isHovered={true}
                      />
                    </motion.div>
                  ) : deviceFrame === "desktop" ? (
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
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/80 hover:bg-secondary px-3.5 py-2 text-xs font-semibold font-['Geist'] text-foreground hover:border-primary/40 hover:text-primary transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                      title="Kopiuj link do projektu"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Udostępnij</span>
                    </button>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          soundEngine.playPop(750, 0.02);
                          hapticLight();
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/80 hover:bg-secondary px-4 py-2 text-xs font-semibold font-['Geist'] text-foreground hover:border-primary/40 hover:text-primary transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>Kod</span>
                      </a>
                    )}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        soundEngine.playChime();
                        hapticLight();
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold font-['Geist'] text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Demo Live</span>
                    </a>
                  </div>
                </div>

                {/* Case Study Sub-Tabs Switcher */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      hapticLight();
                      setActiveTab("case-study");
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      activeTab === "case-study"
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <FileCode2 className="h-3.5 w-3.5" />
                    <span>Case Study & Wyzwanie</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      hapticLight();
                      setActiveTab("sandbox");
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      activeTab === "sandbox"
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Podgląd Live Sandbox</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      hapticLight();
                      setActiveTab("features");
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      activeTab === "features"
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Funkcjonalności & Metryki</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      hapticLight();
                      setActiveTab("architecture");
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      activeTab === "architecture"
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    <span>Architektura & Stack</span>
                  </button>
                </div>
              </div>

              {/* Modal Body with Animated Tab Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {activeTab === "case-study" && (
                  <motion.div
                    key="tab-case-study"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Overview */}
                    <div>
                      <h3 className="font-['Geist'] text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Kontekst & Przegląd Projektu
                      </h3>
                      <p className="font-['Geist'] text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {project.fullDescription || project.description}
                      </p>
                    </div>

                    {/* Challenge Box */}
                    {project.challenge && (
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-1.5">
                        <h4 className="font-['Geist'] text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Wyzwanie Inżynieryjne & Biznesowe
                        </h4>
                        <p className="font-['Geist'] text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {project.challenge}
                        </p>
                      </div>
                    )}

                    {/* Solution Box */}
                    {project.solution && (
                      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-1.5">
                        <h4 className="font-['Geist'] text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Rozwiązanie Techniczne & Architektura
                        </h4>
                        <p className="font-['Geist'] text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {project.solution}
                        </p>
                      </div>
                    )}

                    {/* Results Box */}
                    {project.results && (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-1.5">
                        <h4 className="font-['Geist'] text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Mierzalne Rezultaty & Wpływ
                        </h4>
                        <p className="font-['Geist'] text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {project.results}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "sandbox" && (
                  <motion.div
                    key="tab-sandbox"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Sandbox Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="hidden sm:inline">Podgląd Sandbox:</span>
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground truncate max-w-[180px] sm:max-w-xs">
                          {project.demo}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-card/80 border border-border/70 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setSandboxViewport("desktop");
                            }}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              sandboxViewport === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Widok Desktop"
                          >
                            <Laptop className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setSandboxViewport("mobile");
                            }}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              sandboxViewport === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Widok Mobile"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playPop(600, 0.04);
                            setIframeKey((prev) => prev + 1);
                          }}
                          className="p-1.5 rounded-xl border border-border/80 bg-card/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                          title="Odśwież podgląd iframe"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>

                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <span>Pełne okno</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    {/* Iframe Viewport Container */}
                    <div className="w-full flex justify-center items-center py-2 bg-background/50 rounded-2xl border border-border/60 overflow-hidden">
                      <div
                        className={`transition-all duration-300 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xl relative ${
                          sandboxViewport === "mobile" ? "w-[375px] h-[600px]" : "w-full h-[520px]"
                        }`}
                      >
                        <iframe
                          key={iframeKey}
                          src={project.demo}
                          title={`Podgląd na żywo ${project.title}`}
                          className="w-full h-full border-0 bg-background"
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "features" && (
                  <motion.div
                    key="tab-features"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
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
                              className="flex items-start gap-2.5 rounded-xl border border-border/40 bg-secondary/30 p-3 text-xs sm:text-sm text-foreground/90"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "architecture" && (
                  <motion.div
                    key="tab-architecture"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Architecture & Tech Highlights */}
                    {project.architecture && project.architecture.length > 0 && (
                      <div>
                        <h3 className="font-['Geist'] text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-primary" />
                          Architektura & Rozwiązania techniczne
                        </h3>
                        <div className="space-y-2.5">
                          {project.architecture.map((arch, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-xs sm:text-sm font-mono text-foreground/90 flex items-center gap-3"
                            >
                              <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
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
                            className="rounded-xl border border-border/80 bg-secondary px-3.5 py-1.5 font-mono text-xs font-medium text-foreground shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mobile Sticky Action Bar */}
                <div className="sm:hidden pt-4 border-t border-border/60 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary py-3 text-xs font-semibold font-['Geist'] text-foreground active:scale-95 cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    Udostępnij
                  </button>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      soundEngine.playChime();
                      hapticLight();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 py-3 text-xs font-bold font-['Geist'] text-white shadow-lg shadow-primary/30 active:scale-95 cursor-pointer border border-white/20"
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
    </AnimatePresence>,
    document.body
  );
};

export default ProjectDetailsModal;
