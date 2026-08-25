import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  ArrowUpRight,
  Home,
  User,
  FolderOpen,
  Mail,
  Wrench,
  Search,
  Command,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  FileText,
  MessageSquare,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";
import { NAVBAR_SCROLL_THRESHOLD } from "@/constants/animations";
import { CommandPalette } from "@/components/CommandPalette";
import { soundEngine } from "@/lib/audio";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface SubItem {
  icon: typeof Code2;
  title: string;
  desc: string;
  href: string;
  badge?: string;
}

const navItems = [
  {
    label: "O mnie",
    href: "#o-mnie",
    id: "o-mnie",
    subItems: [
      {
        icon: User,
        title: "Profil i Doświadczenie",
        desc: "Senior Fullstack Engineer & Architekt",
        href: "#o-mnie",
      },
      {
        icon: Briefcase,
        title: "Ścieżka Kariery",
        desc: "Oś czasu realizacji i sukcesów komercyjnych",
        href: "#o-mnie",
      },
      {
        icon: FileText,
        title: "Pobierz CV (PDF)",
        desc: "Pełny życiorys i certyfikaty techniczne",
        href: "/cv.pdf",
        badge: "PDF",
      },
    ] as SubItem[],
  },
  {
    label: "Umiejętności",
    href: "#umiejetnosci",
    id: "umiejetnosci",
    subItems: [
      {
        icon: Code2,
        title: "Frontend Engineering",
        desc: "React 19, Next.js 15, TypeScript, Tailwind",
        href: "#umiejetnosci",
      },
      {
        icon: Cpu,
        title: "Backend & Architektura",
        desc: "Node.js, GraphQL, PostgreSQL, Microservices",
        href: "#umiejetnosci",
      },
      {
        icon: Layers,
        title: "Cloud & Performance",
        desc: "AWS, Docker, CI/CD, Lighthouse 100/100",
        href: "#umiejetnosci",
      },
    ] as SubItem[],
  },
  {
    label: "Projekty",
    href: "#projekty",
    id: "projekty",
    subItems: [
      {
        icon: Sparkles,
        title: "SaaS Platform & AI Engine",
        desc: "Realtime analytics dashboard (100k+ users)",
        href: "#projekty",
        badge: "Wyróżniony",
      },
      {
        icon: FolderOpen,
        title: "E-Commerce Headless",
        desc: "Next.js + Shopify Storefront (PageSpeed 98)",
        href: "#projekty",
      },
      {
        icon: Layers,
        title: "Wszystkie Case Studies",
        desc: "Architektura, kod źródłowy i metryki",
        href: "#projekty",
      },
    ] as SubItem[],
  },
  { label: "Opinie", href: "#opinie", id: "opinie" },
  { label: "FAQ", href: "#faq", id: "faq" },
  { label: "Kontakt", href: "#kontakt", id: "kontakt" },
];

const mobileTabs = [
  { icon: Home, label: "Start", href: "#hero", id: "hero" },
  { icon: User, label: "O mnie", href: "#o-mnie", id: "o-mnie" },
  { icon: Wrench, label: "Stack", href: "#umiejetnosci", id: "umiejetnosci" },
  { icon: FolderOpen, label: "Projekty", href: "#projekty", id: "projekty" },
  { icon: MessageSquare, label: "Opinie", href: "#opinie", id: "opinie" },
  { icon: HelpCircle, label: "FAQ", href: "#faq", id: "faq" },
  { icon: Mail, label: "Kontakt", href: "#kontakt", id: "kontakt" },
] as const;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const activeSection = useActiveSection();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setIsSoundMuted(soundEngine.getIsMuted());
  }, []);

  const toggleSound = useCallback(() => {
    const isNowActive = soundEngine.toggleMute();
    setIsSoundMuted(!isNowActive);
  }, []);

  const toggle = useCallback(() => {
    soundEngine.playPop(700, 0.05);
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  const scrollTo = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > NAVBAR_SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredNav(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredNav(null);
    }, 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 font-['Geist'] transition-all duration-300 pointer-events-none ${
        scrolled ? "pt-2 md:pt-3" : "pt-0 md:pt-4"
      }`}
      role="banner"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto max-w-[1240px] px-3 sm:px-6">
        {/* Floating Capsule Bar */}
        <nav
          className={`pointer-events-auto relative flex items-center justify-between rounded-2xl md:rounded-full border px-4 py-2.5 md:py-2.5 transition-all duration-300 shadow-lg ${
            scrolled
              ? "border-border/80 bg-background/85 backdrop-blur-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)]"
              : "border-border/50 bg-background/65 backdrop-blur-xl shadow-sm"
          }`}
          role="navigation"
          aria-label="Główna nawigacja"
        >
          {/* Logo with live status ping */}
          <div className="flex items-center gap-3">
            <BrandLogo onClick={(e) => handleClick(e, "#hero")} />

            {/* Availability subtle pill on desktop */}
            <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10.5px] text-emerald-500 font-medium">
              <span>● Available</span>
            </div>
          </div>

          {/* Desktop Nav Items with Mega Dropdowns */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1" role="list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const hasSub = Boolean(item.subItems && item.subItems.length > 0);
              const isOpen = hoveredNav === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      soundEngine.playClick();
                      handleClick(e, item.href);
                    }}
                    role="listitem"
                    aria-current={isActive ? "page" : undefined}
                    aria-expanded={hasSub ? isOpen : undefined}
                    className={`relative flex items-center gap-1 px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-secondary border border-border/80 dark:border-border/50 shadow-sm"
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {hasSub && (
                      <ChevronDown
                        className={`relative z-10 h-3 w-3 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : "text-muted-foreground/60"
                        }`}
                      />
                    )}
                  </a>

                  {/* Mega Flyout Dropdown */}
                  <AnimatePresence>
                    {hasSub && isOpen && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 lg:w-80 z-50 pointer-events-auto"
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                      >
                        <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl p-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
                          <div className="p-1 space-y-1">
                            {item.subItems?.map((sub, idx) => (
                              <a
                                key={idx}
                                href={sub.href}
                                onClick={(e) => {
                                  soundEngine.playClick();
                                  setHoveredNav(null);
                                  handleClick(e, sub.href);
                                }}
                                className="group flex items-start gap-3 rounded-xl p-2.5 hover:bg-secondary/80 transition-colors text-left"
                              >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary transition-colors">
                                  <sub.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {sub.title}
                                    </p>
                                    {sub.badge && (
                                      <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                                    {sub.desc}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Action Tools Hub */}
          <div className="flex items-center gap-2">
            {/* Quick search button / Cmd+K trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsCommandOpen(true);
              }}
              className="flex items-center gap-2 rounded-full border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all font-['Geist'] shadow-sm"
              aria-label="Otwórz menu poleceń (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="hidden lg:inline text-[12px]">Szukaj...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/80 px-1.5 py-0.5 font-mono text-[9.5px]">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              aria-label={isSoundMuted ? "Włącz dźwięki interfejsu" : "Wycisz dźwięki"}
              title={isSoundMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
            >
              {isSoundMuted ? (
                <VolumeX className="h-4 w-4" strokeWidth={1.8} />
              ) : (
                <Volume2 className="h-4 w-4 text-primary" strokeWidth={1.8} />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              aria-label="Przełącz motyw"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" strokeWidth={1.8} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" strokeWidth={1.8} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* CTA Button */}
            <a
              href="#kontakt"
              onClick={(e) => {
                soundEngine.playChime();
                handleClick(e, "#kontakt");
              }}
              className="group hidden sm:flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] transition-all hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Napisz</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </nav>

        {/* Mobile bottom pill dock */}
        <div className="md:hidden mt-2 pointer-events-auto">
          <div className="rounded-2xl border border-border/70 bg-background/80 backdrop-blur-xl p-1 shadow-md">
            <div className="flex items-center justify-around">
              {mobileTabs.map((tab) => {
                const isActive = activeSection === tab.id || (tab.id === "hero" && !activeSection);
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEngine.playClick();
                      scrollTo(tab.href);
                    }}
                    className="relative flex flex-col items-center justify-center w-full py-1.5 transition-colors"
                    aria-label={tab.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          key={`mtab-${tab.id}`}
                          layoutId="mobile-nav-pill"
                          className="absolute inset-x-1 inset-y-0.5 rounded-lg bg-primary/[0.15] dark:bg-primary/[0.12]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    <tab.icon
                      className={`relative z-10 h-4 w-4 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.5}
                    />
                    <span
                      className={`relative z-10 text-[10px] leading-tight mt-0.5 transition-colors duration-200 font-['Geist'] ${
                        isActive ? "text-primary font-bold" : "text-muted-foreground font-medium"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Dialog */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </header>
  );
};

export default Navbar;