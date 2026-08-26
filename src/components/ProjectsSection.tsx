import { motion, useInView, AnimatePresence } from "motion/react";
import { soundEngine } from "@/lib/audio";
import { hapticSelection, hapticLight } from "@/lib/haptics";
import { Github, Sparkles, Search, LayoutGrid, List, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useRef, useMemo, lazy, Suspense } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { type ProjectData } from "@/components/ProjectDetailsModal";
import { CanvasProjectsBackground } from "@/components/ui/canvas-projects-background";
import { useI18n } from "@/lib/i18n";
import { allProjectsData } from "@/lib/projects-data";

const ProjectDetailsModal = lazy(() =>
  import("@/components/ProjectDetailsModal").then((m) => ({ default: m.ProjectDetailsModal }))
);

const projectsData: ProjectData[] = allProjectsData;

const ProjectsSection = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryCounts = useMemo(() => {
    return {
      all: projectsData.length,
      saas: projectsData.filter((p) => p.category === "saas").length,
      ecommerce: projectsData.filter((p) => p.category === "ecommerce").length,
      web: projectsData.filter((p) => p.category === "web").length,
    };
  }, []);

  const categories = useMemo(() => [
    { id: "all", label: t.projects.all, count: categoryCounts.all },
    { id: "saas", label: t.projects.saas, count: categoryCounts.saas },
    { id: "ecommerce", label: t.projects.ecommerce, count: categoryCounts.ecommerce },
    { id: "web", label: t.projects.web, count: categoryCounts.web },
  ], [t.projects, categoryCounts]);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesCategory =
        activeCategory === "all" || project.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <SectionWrapper ref={sectionRef} id="projekty" label={t.nav.projects} className="bg-background relative overflow-hidden">
      {/* Canvas Background */}
      {inView && (
        <div className="absolute inset-0 z-0 opacity-30" aria-hidden="true">
          <CanvasProjectsBackground />
        </div>
      )}

      {/* Depth Gradient Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1360px]">
        <SectionHeader
          badge={t.projects.badge}
          badgeIcon={<Sparkles className="h-3 w-3" />}
          title={t.projects.title}
          highlight={t.projects.highlight}
          gradient
        />

        {/* Interactive Filter & View Toolbar */}
        <div className="mb-6 space-y-3">
          {/* Category Pills with Mobile Snap-Rail */}
          <div className="flex items-center justify-center px-2">
            <div className="flex items-center justify-start sm:justify-center gap-1 p-1 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl shadow-sm overflow-x-auto scrollbar-none max-w-full snap-x snap-mandatory">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(750, 0.03);
                      hapticSelection();
                      setActiveCategory(category.id);
                    }}
                    className={`relative px-3 sm:px-3.5 py-1 text-xs font-semibold font-['Geist'] rounded-xl transition-all whitespace-nowrap shrink-0 snap-center min-h-[34px] cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-project-category"
                        className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category.label}</span>
                    <span
                      className={`relative z-10 font-mono text-[9px] px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar & View switch row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
            {/* Live Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.projects.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border/70 bg-card/70 backdrop-blur-md pl-8 pr-4 py-1 text-xs font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results counter & Layout switcher */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted-foreground">
                {t.projects.found} <strong className="text-foreground">{filteredProjects.length}</strong> {t.projects.of} {projectsData.length}
              </span>

              <div className="flex items-center rounded-lg border border-border/60 bg-card/60 backdrop-blur-md p-0.5 shadow-sm">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                    setViewMode("grid");
                  }}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Widok kompaktowej siatki wielokolumnowej"
                  title="Siatka 4-kolumnowa"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                    setViewMode("list");
                  }}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Widok listy inżynierskiej"
                  title="Lista inżynierska"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact 4-Column Responsive Grid or Engineering List View */}
        {viewMode === "grid" ? (
          <div className="relative">
            <motion.div
              layout
              className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-3 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <div key={project.id} className="w-[78vw] sm:w-auto shrink-0 snap-center">
                    <ProjectCard
                      project={project}
                      index={i}
                      onOpenDetails={setSelectedProject}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Swipe Hint */}
            <div className="flex sm:hidden items-center justify-center gap-1 pt-2 pb-1">
              <span className="text-[10px] font-mono text-muted-foreground/70">
                {t.projects.swipeHint}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18, delay: i * 0.02 }}
                  onClick={() => setSelectedProject(project)}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl p-2.5 sm:p-3 hover:border-primary/50 hover:bg-card hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-11 w-16 object-cover rounded-lg border border-border/60 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Geist'] text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="rounded-full bg-primary/10 border border-primary/20 px-1.5 py-0.2 font-mono text-[9px] text-primary">
                          {project.categoryLabel}
                        </span>
                      </div>
                      <p className="font-['Geist'] text-[11px] text-muted-foreground line-clamp-1 max-w-xl">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end shrink-0">
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded bg-secondary px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        title={t.projects.viewLive}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all cursor-pointer"
                      >
                        <span>{t.projects.caseStudy}</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state when no projects match */}
        {filteredProjects.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <p className="font-['Geist'] text-base font-bold text-foreground">{t.projects.emptyTitle}</p>
            <p className="text-xs text-muted-foreground font-mono">{t.projects.emptyDesc}</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground cursor-pointer"
            >
              {t.projects.reset}
            </button>
          </div>
        )}

        {/* Call-to-action bottom */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-muted-foreground font-['Geist'] mb-3 text-xs">
            {t.projects.bottomHeading}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="https://github.com/gkdev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium font-['Geist'] text-foreground hover:border-primary/40 hover:text-primary transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Github className="h-3.5 w-3.5" />
              {t.projects.githubCta}
            </a>
            <a
              href="#kontakt"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium font-['Geist'] text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            >
              <Sparkles className="h-3 w-3" />
              {t.projects.startProjectCta}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Case Study Details Dialog */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectDetailsModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </Suspense>
      )}
    </SectionWrapper>
  );
};

export default ProjectsSection;
