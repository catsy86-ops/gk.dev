import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, ArrowUpRight, Home, User, FolderOpen, Mail, Wrench } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";
import { NAVBAR_SCROLL_THRESHOLD, EASE_STANDARD } from "@/constants/animations";

const navLinks = [
  { label: "O mnie", href: "#o-mnie" },
  { label: "Umiejętności", href: "#umiejetnosci" },
  { label: "Projekty", href: "#projekty" },
  { label: "Kontakt", href: "#kontakt" },
];

const mobileTabs = [
  { icon: Home, label: "Start", href: "#hero", id: "hero" },
  { icon: User, label: "O mnie", href: "#o-mnie", id: "o-mnie" },
  { icon: Wrench, label: "Skills", href: "#umiejetnosci", id: "umiejetnosci" },
  { icon: FolderOpen, label: "Projekty", href: "#projekty", id: "projekty" },
  { icon: Mail, label: "Kontakt", href: "#kontakt", id: "kontakt" },
] as const;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const activeSection = useActiveSection();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";
  const toggle = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 font-['Geist'] transition-all duration-300 [transform:translateZ(0)] [will-change:transform] bg-background/80 backdrop-blur-xl ${
        scrolled
          ? "border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "border-b border-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_STANDARD }}
      role="navigation"
      aria-label="Główna nawigacja"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Mobile: logo row + tab bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <a
            href="#hero"
            onClick={(e) => handleClick(e, "#hero")}
            className="text-lg font-semibold tracking-[-0.03em] text-foreground"
          >
            <span className="text-foreground">GK</span>
            <span className="text-primary opacity-60">.dev</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="h-9 w-9 rounded-full border border-border/60 bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              aria-label="Przełącz motyw"
            >
              {isDark ? (
                <Sun className="h-4 w-4" strokeWidth={1.8} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={1.8} />
              )}
            </button>

            <a
              href="#kontakt"
              onClick={(e) => handleClick(e, "#kontakt")}
              className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-[0_2px_10px_rgba(59,130,246,0.3)] active:scale-95 transition-transform"
            >
              Kontakt
            </a>
          </div>
        </div>

        {/* Mobile tab bar — always visible */}
        <div className="border-t border-border/20">
          <div className="mx-auto max-w-md px-1 flex items-center justify-around">
            {mobileTabs.map((tab) => {
              const isActive = activeSection === tab.id || (tab.id === "hero" && !activeSection);
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollTo(tab.href)}
                  className="relative flex flex-col items-center justify-center w-full min-h-[44px] py-1.5 transition-colors"
                  aria-label={tab.label}
                >
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`mtab-${tab.id}`}
                        layoutId="mobile-nav-pill"
                        className="absolute inset-x-1 inset-y-0.5 rounded-lg bg-primary/[0.12]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <tab.icon
                    className={`relative z-10 h-[18px] w-[18px] transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.5}
                  />
                  <span
                    className={`relative z-10 text-[10px] leading-tight mt-0.5 transition-colors duration-200 font-['Geist'] ${
                      isActive ? "text-primary font-semibold" : "text-muted-foreground font-medium"
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

      {/* Desktop navbar */}
      <div className="hidden md:flex items-center justify-between mx-auto max-w-[1200px] px-6 py-4">
        <motion.a
          href="#hero"
          onClick={(e) => handleClick(e, "#hero")}
          className="logo-glitch text-xl font-semibold tracking-[-0.03em] text-foreground relative"
          data-text="GK.dev"
          onHoverStart={() => setLogoHovered(true)}
          onHoverEnd={() => setLogoHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={logoHovered ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : {}}
            transition={{ duration: 1.5, ease: "linear" }}
            className="bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_100%] bg-clip-text"
            style={{ WebkitTextFillColor: logoHovered ? "transparent" : "inherit" }}
          >
            GK
          </motion.span>
          <motion.span
            className="text-primary"
            animate={logoHovered ? { opacity: [1, 0.4, 1, 0.6, 1] } : { opacity: 0.6 }}
            transition={{ duration: 0.4 }}
          >
            .dev
          </motion.span>
        </motion.a>

        <div className="flex items-center gap-1" role="list">
          {navLinks.map((link) => {
            const isActive = `#${activeSection}` === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                role="listitem"
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 py-2 text-sm rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-secondary border border-border/50"
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={toggle}
            className="relative h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Przełącz motyw"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4 w-4" strokeWidth={1.8} />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4 w-4" strokeWidth={1.8} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.a
            href="#kontakt"
            onClick={(e) => handleClick(e, "#kontakt")}
            className="group rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] transition-all flex items-center gap-2"
            whileHover={{ scale: 1.02, boxShadow: "0 6px 20px 0 rgba(59,130,246,0.45)" }}
            whileTap={{ scale: 0.98 }}
          >
            Napisz do mnie
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;