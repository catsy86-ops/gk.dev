import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useTheme } from "next-themes";
import { NAVBAR_SCROLL_THRESHOLD, EASE_STANDARD } from "@/constants/animations";

const navLinks = [
  { label: "O mnie", href: "#o-mnie", num: "01" },
  { label: "Umiejętności", href: "#umiejetnosci", num: "02" },
  { label: "Projekty", href: "#projekty", num: "03" },
  { label: "Kontakt", href: "#kontakt", num: "04" },
];

const sectionLabelMap: Record<string, string> = {
  hero: "Strona główna",
  "o-mnie": "O mnie",
  statystyki: "Statystyki",
  umiejetnosci: "Umiejętności",
  "tech-stack": "Tech Stack",
  projekty: "Projekty",
  opinie: "Opinie",
  kontakt: "Kontakt",
  faq: "FAQ",
};

const socialLinks = [
  { icon: Github, href: "https://github.com/gkdev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/gkdev", label: "LinkedIn" },
  { icon: Mail, href: "mailto:kontakt@gkdev.pl", label: "Email" },
];

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const activeSection = useActiveSection();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const toggle = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);
  const mobileMenuRef = useFocusTrap(mobileOpen, () => setMobileOpen(false));
  // Ref for focus management — focus first nav link when mobile menu opens
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > NAVBAR_SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Focus first link when menu opens (accessibility)
  useEffect(() => {
    if (mobileOpen) {
      const timer = setTimeout(() => firstNavLinkRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    },
    []
  );

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 font-['Geist'] transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_STANDARD }}
      role="navigation"
      aria-label="Główna nawigacja"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
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

        {/* Mobile section label */}
        <AnimatePresence>
          {scrolled && (
            <motion.span
              key={activeSection}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground font-['Geist'] tracking-wide"
            >
              {sectionLabelMap[activeSection] || ""}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1" role="list">
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

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden relative h-11 w-11 rounded-xl border border-border bg-secondary/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.92 }}
          aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <div className="relative w-5 h-[14px]">
            <motion.span
              className="absolute left-0 h-[1.5px] w-full rounded-full bg-foreground origin-left"
              animate={mobileOpen ? { rotate: 45, y: 0, width: 22 } : { rotate: 0, y: -5, width: 20 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] rounded-full bg-foreground"
              animate={mobileOpen ? { width: 0, opacity: 0 } : { width: 14, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 bottom-0 h-[1.5px] w-full rounded-full bg-foreground origin-left"
              animate={mobileOpen ? { rotate: -45, y: 0, width: 22 } : { rotate: 0, y: 5, width: 20 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            />
          </div>
        </motion.button>
      </div>

      {/* ===================== MOBILE MENU ===================== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="md:hidden fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu nawigacyjne"
              className="md:hidden fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[400px] bg-background border-l border-border/60 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Top gradient accent */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              {/* Decorative orb */}
              <div className="absolute top-20 -left-16 w-40 h-40 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-32 -right-16 w-32 h-32 rounded-full bg-violet-500/5 blur-[60px] pointer-events-none" />

              <div className="relative flex flex-col h-full px-6 pt-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.span
                    className="text-xs tracking-[0.2em] uppercase text-muted-foreground/60 font-medium"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    Nawigacja
                  </motion.span>

                  <motion.button
                    className="h-9 w-9 rounded-full border border-border/60 bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ delay: 0.05, duration: 0.3 }}
                    onClick={() => setMobileOpen(false)}
                    aria-label="Zamknij menu"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 1L13 13M13 1L1 13" />
                    </svg>
                  </motion.button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 flex flex-col gap-1" aria-label="Sekcje strony">
                  {navLinks.map((link, i) => {
                    const isActive = `#${activeSection}` === link.href;
                    return (
                      <motion.a
                        key={link.label}
                        ref={i === 0 ? firstNavLinkRef : undefined}
                        href={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                        aria-current={isActive ? "page" : undefined}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{
                          delay: 0.08 + i * 0.06,
                          duration: 0.45,
                          ease: EASE_STANDARD,
                        }}
                        className={`group relative flex items-center gap-4 rounded-xl px-4 py-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isActive
                            ? "text-primary"
                            : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {/* Active bg fill */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/10"
                            layoutId="mobile-active-bg"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        {/* Hover shine */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent" />

                        <span className="relative text-[11px] font-mono text-muted-foreground/40 tracking-wider">
                          {link.num}
                        </span>

                        <span className="relative text-lg font-semibold tracking-[-0.01em]">
                          {link.label}
                        </span>

                        <motion.div
                          className="relative ml-auto"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 200, damping: 18 }}
                        >
                          <ArrowUpRight className={`h-4 w-4 transition-colors duration-200 ${
                            isActive ? "text-primary" : "text-muted-foreground/20 group-hover:text-primary/60"
                          }`} />
                        </motion.div>
                      </motion.a>
                    );
                  })}
                </nav>

                {/* Theme toggle */}
                <motion.div
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/40 border border-border/30 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <span className="text-sm text-muted-foreground">
                    {isDark ? "Tryb ciemny" : "Tryb jasny"}
                  </span>
                  <motion.button
                    onClick={toggle}
                    className="relative h-8 w-14 rounded-full bg-secondary border border-border/50 flex items-center p-1"
                    whileTap={{ scale: 0.95 }}
                    aria-label="Przełącz motyw"
                  >
                    <motion.div
                      className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm"
                      animate={{ x: isDark ? 22 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <AnimatePresence mode="wait">
                        {isDark ? (
                          <motion.div key="sun-toggle" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.15 }}>
                            <Sun className="h-3.5 w-3.5" />
                          </motion.div>
                        ) : (
                          <motion.div key="moon-toggle" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.15 }}>
                            <Moon className="h-3.5 w-3.5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.button>
                </motion.div>

                {/* CTA */}
                <motion.a
                  href="#kontakt"
                  onClick={(e) => handleClick(e, "#kontakt")}
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-4px_rgba(59,130,246,0.4)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.42, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  whileTap={{ scale: 0.97 }}
                >
                  Napisz do mnie
                  <ArrowUpRight className="h-4 w-4" />
                </motion.a>

                {/* Social links + branding */}
                <motion.div
                  className="mt-auto pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent mb-6" />

                  <div className="flex items-center gap-3">
                    {socialLinks.map(({ icon: Icon, href, label }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        aria-label={label}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                        whileHover={{ y: -2, scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 + i * 0.06 }}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </motion.a>
                    ))}

                    <div className="ml-auto">
                      <p className="text-[10px] text-muted-foreground/30 tracking-wider uppercase">
                        GK<span className="text-primary/40">.dev</span> © {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;