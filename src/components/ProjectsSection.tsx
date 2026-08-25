import { motion, useInView, AnimatePresence } from "motion/react";
import { soundEngine } from "@/lib/audio";
import { hapticSelection, hapticLight } from "@/lib/haptics";
import { Star, Github, Filter, Sparkles, Search, LayoutGrid, List, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetailsModal, type ProjectData } from "@/components/ProjectDetailsModal";
import { CanvasProjectsBackground } from "@/components/ui/canvas-projects-background";

const categories = [
  { id: "all", label: "Wszystkie projekty" },
  { id: "saas", label: "Fullstack & SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "web", label: "Web & Mobile" },
] as const;

const projectsData: ProjectData[] = [
  {
    id: "szczecin-styl",
    title: "Szczecin Styl",
    category: "ecommerce",
    categoryLabel: "E-commerce",
    description:
      "Nowoczesna platforma e-commerce dla butiku modowego z dynamicznym filtrowaniem, koszykiem w czasie rzeczywistym i płatnościami online.",
    fullDescription:
      "Kompleksowe wdrożenie butiku internetowego Szczecin Styl łączące estetykę high-fashion z ultraszybkim czasem ładowania. Platforma obsługuje automatyczne zarządzanie stanem magazynowym, integrację bramki płatności Stripe/BLIK oraz optymalizację SEO z renderowaniem hybrydowym.",
    tags: ["React 18", "TypeScript", "Tailwind CSS", "Stripe API", "Zustand"],
    accent: "from-purple-500/20 to-pink-500/10",
    accentBorder: "hover:border-purple-500/40",
    accentGlow: "0 0 35px -5px rgba(168,85,247,0.25)",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=500&fit=crop",
    demo: "https://szczecin-styl-main.vercel.app/",
    featured: true,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Google PageSpeed", value: "98/100" },
      { label: "Wzrost konwersji", value: "+145%" },
      { label: "Czas ładowania", value: "0.45s" },
    ],
    keyFeatures: [
      "Wielopoziomowe filtrowanie kolekcji po rozmiarach, kolorach i cenie",
      "Koszyk z natychmiastową synchronizacją stanu i weryfikacją stanów",
      "Bezpieczne płatności kartą i BLIK z webhookami Stripe",
      "Responsywny panel zarządzania zamówieniami",
    ],
    architecture: [
      "Architektura komponentowa React z TypeScript dla pełnego type-safety",
      "Zustand do ultra-wydajnego zarządzania stanem koszyka",
      "Tailwind CSS ze strategią Zero-Runtime overhead",
    ],
  },
  {
    id: "notatnik",
    title: "Notatnik Cloud",
    category: "saas",
    categoryLabel: "SaaS / Produktywność",
    description:
      "Aplikacja do zarządzania notatkami i wiedzą z synchronizacją w chmurze w czasie rzeczywistym, edytorem Markdown i tagowaniem.",
    fullDescription:
      "Zaawansowana aplikacja typu second-brain ułatwiająca organizację notatek, fragmentów kodu i zadań. Zapewnia natychmiastową synchronizację danych pomiędzy urządzeniami w czasie rzeczywistym oraz pracę w trybie offline-first.",
    tags: ["React", "Firebase Realtime", "TypeScript", "Tailwind", "Markdown"],
    accent: "from-blue-500/20 to-cyan-500/10",
    accentBorder: "hover:border-blue-500/40",
    accentGlow: "0 0 35px -5px rgba(59,130,246,0.25)",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    demo: "https://notatnik-seven.vercel.app/",
    featured: true,
    stats: { year: "2024", type: "SaaS" },
    metrics: [
      { label: "Latencja synchronizacji", value: "< 25ms" },
      { label: "Tryb Offline", value: "100% PWA" },
      { label: "Uptime", value: "99.99%" },
    ],
    keyFeatures: [
      "Edytor Rich-Text z podświetlaniem składni kodu i Markdown",
      "Synchronizacja w chmurze w czasie rzeczywistym (Realtime Database)",
      "Globalne wyszukiwanie pełnotekstowe z indeksem tagów",
      "Pełne szyfrowanie danych użytkownika",
    ],
    architecture: [
      "Architektura Offline-First z IndexedDB i Firebase Cloud Sync",
      "Optimistic UI updates dla zerowego poczucia opóźnienia",
      "Custom hooki do zarządzania subskrypcjami strumieni danych",
    ],
  },
  {
    id: "ghydra",
    title: "Ghydra Project Management",
    category: "saas",
    categoryLabel: "Fullstack SaaS",
    description:
      "Platforma do zarządzania projektami dla zespołów inżynierskich z interaktywną tablicą Kanban, śledzeniem czasu i kolaboracją live.",
    fullDescription:
      "Kompleksowy system zarządzania workflowem dla zespołów programistycznych. Łączy zarządzanie zadaniami, metryki wydajności sprintów, zintegrowany czat oraz automatyzację powiadomień przez WebSockets.",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Express"],
    accent: "from-emerald-500/20 to-green-500/10",
    accentBorder: "hover:border-emerald-500/40",
    accentGlow: "0 0 35px -5px rgba(16,185,129,0.25)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    demo: "https://ghydra-main.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Zarządzanie" },
    metrics: [
      { label: "Aktywne zespoły", value: "50+" },
      { label: "Czas reakcji API", value: "32ms" },
      { label: "WebSockets", value: "Live Sync" },
    ],
    keyFeatures: [
      "Interaktywna tablica Kanban typu drag & drop",
      "Śledzenie czasu pracy z eksportem raportów",
      "Wielodostępna edycja w czasie rzeczywistym przez Socket.io",
      "Role i uprawnienia dla członków organizacji",
    ],
    architecture: [
      "Mikroserwisy backendowe w Node.js & Express",
      "Baza danych MongoDB z optymalizowanymi indeksami",
      "Dwukierunkowa komunikacja WebSocket dla powiadomień live",
    ],
  },
  {
    id: "lysy",
    title: "Łysy Barber Studio",
    category: "web",
    categoryLabel: "Portfolio & CMS",
    description:
      "Ekskluzywne portfolio z systemem rezerwacji wizyt online, interaktywną galerią metamorfoz i opiniami klientów.",
    fullDescription:
      "Dedykowana platforma internetowa dla renomowanego salonu fryzjerskiego. Projekt skupiony na kreowaniu wizerunku premium, responsywnej prezentacji prac oraz płynnym procesie rezerwacji terminów online.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Headless CMS"],
    accent: "from-amber-500/20 to-orange-500/10",
    accentBorder: "hover:border-amber-500/40",
    accentGlow: "0 0 35px -5px rgba(245,158,11,0.25)",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=500&fit=crop",
    demo: "https://lysy-smoky.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Portfolio" },
    metrics: [
      { label: "Nowe rezerwacje", value: "+220%" },
      { label: "Lighthouse A11y", value: "100/100" },
      { label: "Zmniejszony bounce-rate", value: "-40%" },
    ],
    keyFeatures: [
      "Dynamiczny kalendarz rezerwacji terminów",
      "Galeria 'Przed i Po' z suwakiem porównawczym",
      "System opinii z moderacją i integracją Google Reviews",
    ],
    architecture: [
      "Server-Side Rendering (SSR) w Next.js dla maksymalnego SEO",
      "Animacje oparte na GPU z motion/react",
    ],
  },
  {
    id: "lucasz-elektro",
    title: "Łuszy Elektro Glow",
    category: "ecommerce",
    categoryLabel: "E-commerce",
    description:
      "Sklep internetowy z profesjonalnym oświetleniem LED i elektroniką. Zaawansowane filtry parametrów, konfigurator oświetlenia i Stripe.",
    fullDescription:
      "Platforma e-commerce dedykowana branży oświetleniowej. Wyposażona w inteligentny konfigurator zestawów LED, porównywarkę specyfikacji technicznych oraz bezpieczny moduł płatności.",
    tags: ["React", "TypeScript", "Stripe Checkout", "Tailwind"],
    accent: "from-yellow-500/20 to-red-500/10",
    accentBorder: "hover:border-yellow-500/40",
    accentGlow: "0 0 35px -5px rgba(234,179,8,0.25)",
    image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=800&h=500&fit=crop",
    demo: "https://lucasz-elektro-glow-main.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Katalog produktów", value: "500+ SKU" },
      { label: "Średni koszyk", value: "+35%" },
      { label: "Stripe", value: "Automatyzacja" },
    ],
    keyFeatures: [
      "Zaawansowana wyszukiwarka z filtrami parametrów elektrycznych",
      "Kalkulator poboru mocy i doboru zasilaczy",
      "Generowanie faktur PDF i tracking przesyłek",
    ],
    architecture: [
      "React z architekturą modułową",
      "Integracja Stripe API z obsługą płatności wielowalutowych",
    ],
  },
  {
    id: "ufisza",
    title: "uFISZA Commerce",
    category: "ecommerce",
    categoryLabel: "E-commerce",
    description:
      "Sklep internetowy z deskami i akcesoriami sportowymi. System rekomendacji produktowych, warianty i panel zamówień.",
    fullDescription:
      "Projekt stworzony dla marki streetwear i desek fisz. Czysty, nowoczesny interfejs z intuicyjną nawigacją po kolekcjach, wariantami kolorystycznymi w czasie rzeczywistym i szybkim procesem zakupu one-step checkout.",
    tags: ["React", "TypeScript", "Tailwind CSS", "State Machine"],
    accent: "from-teal-500/20 to-cyan-500/10",
    accentBorder: "hover:border-teal-500/40",
    accentGlow: "0 0 35px -5px rgba(20,184,166,0.25)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=500&fit=crop",
    demo: "https://fisz-handel-c1bb3a8d-uubz.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Mobile Traffic", value: "78%" },
      { label: "Checkout Time", value: "< 45s" },
      { label: "Zadowolenie", value: "5.0 ★" },
    ],
    keyFeatures: [
      "Szybki koszyk modalny bez przeładowania strony",
      "Wizualny wybór wariantów kolorystycznych i kół",
      "Optymalizacja dla urządzeń mobilnych",
    ],
    architecture: [
      "Stan aplikacji modelowany za pomocą maszyny stanów",
      "Optymalizacja grafik z preloadingiem wariantów",
    ],
  },
];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projectsData.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <SectionWrapper ref={sectionRef} id="projekty" label="Projekty" className="relative overflow-hidden">
      {/* Canvas Background */}
      {inView && (
        <div className="absolute inset-0 z-0 opacity-40" aria-hidden="true">
          <CanvasProjectsBackground />
        </div>
      )}

      {/* Depth Gradient Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

      {/* Parallax Aurora Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-[150px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/3 -right-40 w-80 h-80 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[140px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-2 sm:px-4">
        <SectionHeader
          badge="Portfolio & Case Studies"
          badgeIcon={<Star className="h-3 w-3" />}
          title="Wybrane"
          highlight="realizacje"
          gradient
        />

        {/* Toolbar: Categories + Live Search + ViewMode Toggle */}
        <div className="space-y-4 mb-10">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full border border-border/60 bg-card/60 backdrop-blur-xl shadow-sm">
              <span className="hidden sm:inline-flex items-center gap-1 pl-3 pr-2 text-xs font-mono text-muted-foreground">
                <Filter className="h-3 w-3" />
                Filtr:
              </span>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundEngine.playPop(800, 0.03);
                      hapticSelection();
                      setActiveCategory(cat.id);
                    }}
                    className={`relative px-4 py-2 text-xs sm:text-sm font-medium font-['Geist'] rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="project-category-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-[0_2px_12px_rgba(59,130,246,0.4)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar & View switch row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-3xl mx-auto">
            {/* Live Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Szukaj (np. Stripe, React, SaaS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border/70 bg-card/70 backdrop-blur-md pl-9 pr-4 py-1.5 text-xs font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results counter & Layout switcher */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                Znaleziono: <strong className="text-foreground">{filteredProjects.length}</strong> z {projectsData.length}
              </span>

              <div className="flex items-center rounded-xl border border-border/60 bg-card/60 backdrop-blur-md p-1 shadow-sm">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                    setViewMode("grid");
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Widok siatki Bento"
                  title="Siatka Bento"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                    setViewMode("list");
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Widok listy inżynierskiej"
                  title="Lista inżynierska"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid (with Mobile Horizontal Snap-Swipe) or Engineering List View */}
        {viewMode === "grid" ? (
          <div className="relative">
            <motion.div
              layout
              className="flex sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-7 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <div key={project.id} className="w-[86vw] sm:w-auto shrink-0 snap-center">
                    <ProjectCard
                      project={project}
                      index={i}
                      onOpenDetails={setSelectedProject}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Swipe Hint and dots */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 pt-2 pb-1">
              <span className="text-[10px] font-mono text-muted-foreground/70">
                ← Przesuń kciukiem w lewo / prawo →
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  onClick={() => setSelectedProject(project)}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-5 hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-16 w-24 object-cover rounded-xl border border-border/60 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Geist'] text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
                          {project.categoryLabel}
                        </span>
                      </div>
                      <p className="font-['Geist'] text-xs text-muted-foreground line-clamp-1 max-w-xl">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end shrink-0">
                    <div className="hidden sm:flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-lg bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        title="Zobacz Live"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="h-3 w-3" />
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
          <div className="py-16 text-center space-y-3">
            <p className="font-['Geist'] text-lg font-bold text-foreground">Brak pasujących projektów</p>
            <p className="text-sm text-muted-foreground font-mono">Spróbuj wpisać inną frazę lub zresetuj filtr.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Resetuj filtry
            </button>
          </div>
        )}

        {/* Call-to-action bottom */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-muted-foreground font-['Geist'] mb-4 text-sm">
            Chcesz poznać więcej szczegółów lub omówić dedykowany projekt?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/gkdev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 backdrop-blur-md px-5 py-2.5 text-xs font-medium font-['Geist'] text-foreground hover:border-primary/40 hover:text-primary transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Github className="h-4 w-4" />
              Odwiedź profil GitHub
            </a>
            <a
              href="#kontakt"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium font-['Geist'] text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Rozpocznij projekt
            </a>
          </div>
        </motion.div>
      </div>

      {/* Case Study Details Dialog */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </SectionWrapper>
  );
};

export default ProjectsSection;
