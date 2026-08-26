import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  ArrowUpRight,
  User,
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
} from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";
import { NAVBAR_SCROLL_THRESHOLD } from "@/constants/animations";
import { CommandPalette } from "@/components/CommandPalette";
import { AiAssistantDialog } from "@/components/AiAssistantDialog";
import { GlowButton } from "@/components/ui/GlowButton";
import { ThemeAccentPicker } from "@/components/ThemeAccentPicker";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AuthButton } from "@/components/auth/AuthButton";
import { ClientPortalModal } from "@/components/ClientPortalModal";
import { BookingConsultationModal } from "@/components/BookingConsultationModal";
import { useI18n } from "@/lib/i18n";
import { soundEngine } from "@/lib/audio";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface SubItem {
  icon: typeof Code2;
  title: string;
  desc: string;
  href: string;
  badge?: string;
}

interface NavbarProps {
  onOpenTerminal?: () => void;
}

const Navbar = ({ onOpenTerminal }: NavbarProps) => {
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
          desc: "AWS, Docker, CI/CD, Lighthouse 100/100",
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
    { label: t.nav.reviews, href: "#opinie", id: "opinie" },
    { label: t.nav.articles, href: "#artykuly", id: "artykuly" },
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
      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

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
      <div className="mx-auto max-w-[1240px] px-2.5 sm:px-5">
        {/* Floating Capsule Bar */}
        <nav
          className={`pointer-events-auto relative flex items-center justify-between rounded-full border px-3 sm:px-4 py-2 transition-all duration-300 shadow-lg ${
            scrolled
              ? "border-border/80 bg-background/90 backdrop-blur-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)]"
              : "border-border/50 bg-background/70 backdrop-blur-xl shadow-sm"
          }`}
          role="navigation"
          aria-label="Główna nawigacja"
        >
          {/* Zone 1: Logo with live status ping */}
          <div className="flex items-center gap-2.5 shrink-0">
            <BrandLogo onClick={(e) => handleClick(e, "#hero")} />

            {/* Desktop Live Availability status subtle pill */}
            <div className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          {/* Zone 2: Desktop Nav Items (visible on xl: and above, zero clipping) */}
          <div
            className="hidden xl:flex items-center gap-0.5 bg-secondary/40 backdrop-blur-md rounded-full px-1.5 py-0.5 border border-border/40"
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
                    className={`relative flex items-center gap-1 px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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

          {/* Zone 3: Compact & Polished Action Tools Hub */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* AI Architect Assistant Trigger */}
            <button
              onClick={() => {
                soundEngine.playPop(850, 0.03);
                setIsAiOpen(true);
              }}
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all font-['Geist'] shadow-sm active:scale-95 group cursor-pointer"
              aria-label="GK AI Assistant"
              title="Zapytaj GK AI Assistanta"
            >
              <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Quick search button / Cmd+K trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsCommandOpen(true);
              }}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border/80 bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all font-['Geist'] shadow-sm cursor-pointer"
              aria-label="Otwórz menu poleceń (Cmd+K)"
              title="Szukaj (Cmd+K)"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Preferences Capsule (Theme, Palette, Lang, Bookmarks) */}
            <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-border/60 bg-secondary/50 backdrop-blur-md p-0.5">
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
                      exit={{ rotate: -90, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-3.5 w-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Theme Color Accent Picker */}
              <ThemeAccentPicker />

              {/* Language Switcher */}
              <LanguageToggle />

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
            </div>

            {/* Book Consultation Trigger (2xl only to prevent medium desktop squishing) */}
            <button
              onClick={() => {
                soundEngine.playPop(850, 0.03);
                setIsBookingOpen(true);
              }}
              className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-500 font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
              title={t.nav.bookConsultation}
              aria-label={t.nav.bookConsultation}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{t.nav.bookConsultation}</span>
            </button>

            {/* Clerk Authentication Button */}
            <AuthButton />

            {/* CTA Button (Napisz) */}
            <div className="hidden md:block">
              <GlowButton
                variant="glow"
                size="sm"
                href="#kontakt"
                onClick={(e) => {
                  handleClick(e, "#kontakt");
                }}
                icon={<ArrowUpRight className="h-3.5 w-3.5" />}
              >
                {lang === "pl" ? "Napisz" : "Contact"}
              </GlowButton>
            </div>

            {/* Mobile / Tablet Hamburger Menu Toggle (visible on < xl:) */}
            <button
              onClick={() => {
                soundEngine.playPop(750, 0.03);
                setIsMobileNavOpen((prev) => !prev);
              }}
              className="flex xl:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-secondary items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-sm"
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
              className="pointer-events-auto mt-2 rounded-3xl border border-border/80 bg-background/95 backdrop-blur-2xl p-4 shadow-2xl space-y-3 xl:hidden"
            >
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
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 hover:bg-secondary text-sm font-semibold text-foreground"
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
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground"
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
                    className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold"
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

      {/* Command Palette Dialog */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenTerminal={onOpenTerminal}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* GK AI Architect Assistant Dialog */}
      <AiAssistantDialog
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* Client Portal Modal */}
      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Consultation Booking Modal */}
      <BookingConsultationModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </header>
  );
};

export default Navbar;