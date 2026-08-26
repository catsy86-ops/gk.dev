import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  ArrowUpRight,
  FolderOpen,
  Search,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Menu,
  X,
  Bot,
  Calendar,
  Bookmark,
  Terminal,
  Trophy,
  Radio,
} from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";
import { NAVBAR_SCROLL_THRESHOLD } from "@/constants/animations";
import { GlowButton } from "@/components/ui/GlowButton";
import { ThemeAccentPicker } from "@/components/ThemeAccentPicker";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AuthButton } from "@/components/auth/AuthButton";
import { useI18n } from "@/lib/i18n";
import { soundEngine } from "@/lib/audio";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { hapticLight, hapticMedium } from "@/lib/haptics";

const prefetchCommandPalette = () => import("@/components/CommandPalette");
const prefetchAiAssistant = () => import("@/components/AiAssistantDialog");
const prefetchClientPortal = () => import("@/components/ClientPortalModal");
const prefetchBooking = () => import("@/components/BookingConsultationModal");

const CommandPalette = lazy(() =>
  prefetchCommandPalette().then((m) => ({ default: m.CommandPalette }))
);
const AiAssistantDialog = lazy(() =>
  prefetchAiAssistant().then((m) => ({ default: m.AiAssistantDialog }))
);
const ClientPortalModal = lazy(() =>
  prefetchClientPortal().then((m) => ({ default: m.ClientPortalModal }))
);
const BookingConsultationModal = lazy(() =>
  prefetchBooking().then((m) => ({ default: m.BookingConsultationModal }))
);

interface SubItem {
  icon: typeof Code2;
  title: string;
  desc: string;
  href: string;
  badge?: string;
}

interface NavbarProps {
  onOpenTerminal?: () => void;
  onOpenPassport?: () => void;
  onTriggerMatrix?: () => void;
  onToggleWinamp?: () => void;
  isWinampOpen?: boolean;
}

const Navbar = ({
  onOpenTerminal,
  onOpenPassport,
  onTriggerMatrix,
  onToggleWinamp,
  isWinampOpen,
}: NavbarProps) => {
  const { t, lang } = useI18n();

  const navItems = [
    { label: t.nav.about, href: "#o-mnie", id: "o-mnie" },
    {
      label: t.nav.skills,
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
          desc: "AWS, Docker, CI/CD, Sub-second TTFB",
          href: "#umiejetnosci",
        },
      ] as SubItem[],
    },
    {
      label: t.nav.projects,
      href: "#projekty",
      id: "projekty",
      subItems: [
        {
          icon: Sparkles,
          title: "SaaS Platform & AI Engine",
          desc: "Realtime analytics dashboard (100k+ users)",
          href: "#projekty",
          badge: lang === "pl" ? "Wyróżniony" : "Featured",
        },
        {
          icon: FolderOpen,
          title: "E-Commerce Headless",
          desc: "Next.js + Shopify Storefront (Speed 98)",
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
    { label: t.nav.reviews, href: "#opinie", id: "opinie" },
    { label: t.nav.course, href: "#kurs-js", id: "kurs-js" },
    { label: t.nav.faq, href: "#faq", id: "faq" },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
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
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > NAVBAR_SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 font-['Geist'] transition-all duration-300 pointer-events-none ${
          scrolled ? "pt-2 md:pt-3" : "pt-0 md:pt-4"
        }`}
        role="banner"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto max-w-[1360px] px-2 sm:px-4 lg:px-6">
          {/* Floating Capsule Bar */}
          <nav
            className={`pointer-events-auto relative flex items-center justify-between gap-2 lg:gap-3 rounded-full border px-3 sm:px-4 py-2 transition-all duration-300 shadow-lg ${
              scrolled
                ? "border-border/80 bg-background/95 backdrop-blur-2xl shadow-[0_10px_35px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)]"
                : "border-border/60 bg-background/80 backdrop-blur-xl shadow-md"
            }`}
            role="navigation"
            aria-label="Główna nawigacja"
          >
            {/* Zone 1: Logo with live availability pill */}
            <div className="flex items-center gap-2 shrink-0">
              <BrandLogo showWordmark={false} onClick={(e) => handleClick(e, "#hero")} />
            </div>

            {/* Zone 2: Desktop Nav Items */}
            <div
              className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-md rounded-full p-1 border border-border/60 shadow-inner shrink-0"
              role="list"
            >
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
                      className={`relative flex items-center gap-1 px-2.5 xl:px-3.5 py-1.5 text-xs xl:text-[13px] font-semibold tracking-tight whitespace-nowrap rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 select-none ${
                        isActive
                          ? "text-primary font-bold shadow-sm"
                          : "text-foreground/80 hover:text-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-background dark:bg-card border border-border/80 shadow-sm"
                          layoutId="nav-pill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                      {hasSub && (
                        <ChevronDown
                          className={`relative z-10 h-3 w-3 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-primary" : "text-muted-foreground/70"
                          }`}
                        />
                      )}
                    </a>

                    {/* Mega Flyout Dropdown with Invisible Hover Bridge */}
                    <AnimatePresence>
                      {hasSub && isOpen && (
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-72 lg:w-80 z-50 pointer-events-auto before:absolute before:-top-3 before:h-4 before:inset-x-0 before:content-['']"
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
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

            {/* Zone 3: Polished Action Tools Hub */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Terminal CLI Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(850, 0.03);
                  hapticMedium();
                  if (onOpenTerminal) {
                    onOpenTerminal();
                  }
                }}
                className="relative flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all font-['Geist'] shadow-sm active:scale-95 group cursor-pointer shrink-0"
                aria-label="Otwórz Terminal CLI (~)"
                title="Terminal CLI (~)"
              >
                <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-6 transition-transform" />
                <span className="hidden xl:inline text-xs font-bold font-mono">CLI</span>
                <span className="hidden 2xl:inline-block font-mono text-[9px] font-bold px-1 rounded bg-emerald-500/15 border border-emerald-500/30">
                  ~
                </span>
              </button>

              {/* 5-Second Matrix Reality Breach Trigger */}
              {onTriggerMatrix && (
                <button
                  type="button"
                  onClick={() => {
                    hapticMedium();
                    onTriggerMatrix();
                  }}
                  className="relative flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-emerald-400/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all font-['Geist'] shadow-[0_0_12px_rgba(16,185,129,0.25)] active:scale-95 group cursor-pointer shrink-0"
                  aria-label="Tryb Matrix (M)"
                  title="Uruchom Tryb Matrix Reality Breach (5s / M)"
                >
                  <span className="font-mono text-xs font-black tracking-tighter text-emerald-300 group-hover:scale-110 transition-transform">
                    MATRIX
                  </span>
                  <span className="hidden xl:inline-block font-mono text-[9px] font-bold px-1 rounded bg-emerald-400/20 border border-emerald-400/40">
                    5s
                  </span>
                </button>
              )}

              {/* GKinAmp Cyber Lo-Fi Player Trigger */}
              {onToggleWinamp && (
                <button
                  type="button"
                  onClick={() => {
                    hapticMedium();
                    onToggleWinamp();
                  }}
                  className={`relative flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border transition-all font-['Geist'] shadow-sm active:scale-95 group cursor-pointer shrink-0 ${
                    isWinampOpen
                      ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                      : "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500"
                  }`}
                  aria-label="GKinAmp Audio Player"
                  title="GKinAmp 2026 Lo-Fi Player"
                >
                  <Radio className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
                  <span className="hidden xl:inline text-xs font-bold font-mono">GKinAmp</span>
                </button>
              )}

              {/* Dev Passport / Achievements Trigger */}
              {onOpenPassport && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop(850, 0.03);
                    hapticMedium();
                    onOpenPassport();
                  }}
                  className="relative flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500 transition-all font-['Geist'] shadow-sm active:scale-95 group cursor-pointer shrink-0"
                  aria-label="Paszport Dewelopera & Osiągnięcia (P)"
                  title="Paszport Dewelopera & Osiągnięcia (P)"
                >
                  <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
                  <span className="hidden xl:inline text-xs font-bold font-mono">XP</span>
                </button>
              )}

              {/* AI Architect Assistant Trigger */}
              <button
                type="button"
                onMouseEnter={prefetchAiAssistant}
                onTouchStart={prefetchAiAssistant}
                onClick={() => {
                  soundEngine.playPop(850, 0.03);
                  setIsAiOpen(true);
                }}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all font-['Geist'] shadow-sm active:scale-95 group cursor-pointer shrink-0"
                aria-label="GK AI Assistant"
                title="Zapytaj GK AI Assistanta"
              >
                <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              </button>

              {/* Quick search button / Cmd+K trigger */}
              <button
                type="button"
                onMouseEnter={prefetchCommandPalette}
                onTouchStart={prefetchCommandPalette}
                onClick={() => {
                  soundEngine.playClick();
                  setIsCommandOpen(true);
                }}
                className="flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-border/80 bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all font-['Geist'] shadow-sm cursor-pointer shrink-0 group"
                aria-label="Otwórz menu poleceń (Cmd+K)"
                title="Szukaj (Cmd+K)"
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="hidden 2xl:inline text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                  {lang === "pl" ? "Szukaj" : "Search"}
                </span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded border border-border/70 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </button>

              {/* Seamless Preferences Capsule (Theme, Sound, Accent, Lang, Bookmarks, Auth) */}
              <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-border/60 bg-secondary/50 backdrop-blur-md p-0.5 shrink-0">
                {/* Sound Toggle */}
                <button
                  onClick={toggleSound}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  aria-label={isSoundMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
                  title={isSoundMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
                >
                  {isSoundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggle}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Przełącz motyw"
                  title="Przełącz motyw"
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
                        <Sun className="h-3.5 w-3.5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-3.5 w-3.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Theme Color Accent Picker */}
                <ThemeAccentPicker variant="ghost" />

                {/* Language Switcher */}
                <LanguageToggle variant="ghost" />

                {/* Client Portal / Bookmarks Trigger */}
                <button
                  onClick={() => {
                    soundEngine.playPop(800, 0.03);
                    setIsClientPortalOpen(true);
                  }}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title={t.nav.clientPortal}
                  aria-label={t.nav.clientPortal}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                </button>

                {/* Auth separator + Clerk button inside capsule */}
                <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" aria-hidden="true" />
                <div className="pr-0.5">
                  <AuthButton />
                </div>
              </div>

              {/* Mobile / Tablet Hamburger Menu Toggle (visible on < lg:) */}
              <button
                onClick={() => {
                  soundEngine.playPop(750, 0.03);
                  setIsMobileNavOpen((prev) => !prev);
                }}
                className="flex lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-secondary items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-sm shrink-0"
                aria-label="Otwórz menu nawigacji"
                aria-expanded={isMobileNavOpen}
              >
                {isMobileNavOpen ? <X className="h-4 w-4 text-primary" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </nav>

          {/* Mobile / Tablet Dropdown Menu Sheet */}
          <AnimatePresence>
            {isMobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto mt-2 rounded-3xl border border-border/80 bg-background/95 backdrop-blur-2xl p-4 shadow-2xl space-y-3 lg:hidden"
              >
                {/* Mobile Auth & Account Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-primary/15 via-secondary/70 to-primary/10 border border-primary/25">
                  <div>
                    <p className="text-xs font-bold text-foreground">Strefa Klienta</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Konto & Logowanie Google</p>
                  </div>
                  <AuthButton />
                </div>

                {/* Mobile Terminal CLI Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop(850, 0.03);
                    hapticMedium();
                    setIsMobileNavOpen(false);
                    if (onOpenTerminal) {
                      onOpenTerminal();
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-bold text-xs shadow-sm hover:bg-emerald-500/25 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span>Terminal Deweloperski (CLI)</span>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                    Otwórz ~
                  </span>
                </button>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        soundEngine.playClick();
                        setIsMobileNavOpen(false);
                        handleClick(e, item.href);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 hover:bg-secondary text-sm font-semibold text-foreground transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </a>
                  ))}

                  {/* Direct quick action buttons */}
                  <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setIsMobileNavOpen(false);
                        setIsClientPortalOpen(true);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground transition-colors"
                    >
                      <span>{t.nav.clientPortal}</span>
                      <Bookmark className="h-4 w-4 text-primary" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setIsMobileNavOpen(false);
                        setIsBookingOpen(true);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold transition-colors"
                    >
                      <span>{t.nav.bookConsultation} (30 min)</span>
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mobile preferences row */}
                  <div className="flex sm:hidden items-center justify-between p-2.5 rounded-2xl bg-secondary/40 border border-border/60 mt-2">
                    <span className="text-xs font-mono text-muted-foreground">Ustawienia:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={toggleSound}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground"
                      >
                        {isSoundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-primary" />}
                      </button>
                      <button
                        onClick={toggle}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground"
                      >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </button>
                      <ThemeAccentPicker />
                      <LanguageToggle />
                    </div>
                  </div>

                  <a
                    href="#kontakt"
                    onClick={(e) => {
                      soundEngine.playClick();
                      setIsMobileNavOpen(false);
                      handleClick(e, "#kontakt");
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/30 mt-2"
                  >
                    <span>Napisz do mnie</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Command Palette Dialog */}
      {isCommandOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isCommandOpen}
            onClose={() => setIsCommandOpen(false)}
            onOpenTerminal={onOpenTerminal}
            onOpenAi={() => setIsAiOpen(true)}
            onOpenClientPortal={() => setIsClientPortalOpen(true)}
          />
        </Suspense>
      )}

      {/* GK AI Architect Assistant Dialog */}
      {isAiOpen && (
        <Suspense fallback={null}>
          <AiAssistantDialog
            isOpen={isAiOpen}
            onClose={() => setIsAiOpen(false)}
          />
        </Suspense>
      )}

      {/* Client Portal Modal */}
      {isClientPortalOpen && (
        <Suspense fallback={null}>
          <ClientPortalModal
            isOpen={isClientPortalOpen}
            onClose={() => setIsClientPortalOpen(false)}
          />
        </Suspense>
      )}

      {/* Booking Consultation Modal */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingConsultationModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default Navbar;