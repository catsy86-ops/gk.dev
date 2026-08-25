import { motion, useInView, AnimatePresence } from "motion/react";
import { Star, Github, Filter, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
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
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const filteredProjects = activeCategory === "all"
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <SectionWrapper ref={sectionRef} id="projekty" label="Projekty" className="relative overflow-hidden">
      {/* Canvas Background */}
      {inView && (
        <div className="absolute inset-0 z-0 opacity-30" aria-hidden="true">
          <CanvasProjectsBackground />
        </div>
      )}

      {/* Gradient overlay for depth */}
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

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <SectionHeader
          badge="Portfolio & Case Studies"
          badgeIcon={<Star className="h-3 w-3" />}
          title="Wybrane"
          highlight="realizacje"
          gradient
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
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
                  onClick={() => setActiveCategory(cat.id)}
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

        {/* Bento Grid layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpenDetails={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

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
