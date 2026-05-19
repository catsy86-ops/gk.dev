import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "O mnie", href: "#o-mnie", emoji: "👋" },
  { label: "Umiejętności", href: "#umiejetnosci", emoji: "⚡" },
  { label: "Projekty", href: "#projekty", emoji: "🚀" },
  { label: "Kontakt", href: "#kontakt", emoji: "✉️" },
];

const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-5 h-4 flex flex-col justify-center items-center">
    <motion.span
      className="absolute h-[1.5px] w-5 rounded-full bg-foreground"
      animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
    />
    <motion.span
      className="absolute h-[1.5px] rounded-full bg-foreground"
      animate={isOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 12 }}
      transition={{ duration: 0.25 }}
    />
    <motion.span
      className="absolute h-[1.5px] w-5 rounded-full bg-foreground"
      animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
    />
  </div>
);

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const activeSection = useActiveSection();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const toggle = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
        {/* Logo with glitch effect */}
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
            animate={logoHovered ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            } : {}}
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

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = `#${activeSection}` === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`relative px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
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
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            onClick={toggle}
            className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground"
            whileTap={{ scale: 0.9 }}
            aria-label="Przełącz motyw"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun-m" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="moon-m" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            className="relative h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <HamburgerIcon isOpen={mobileOpen} />
          </motion.button>
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Backdrop — tap to close */}
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Decorative gradient orbs */}
            <motion.div
              className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            />
            <motion.div
              className="absolute bottom-20 -right-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full pt-24 pb-10 px-6 sm:px-10">
              {/* Close button — top right */}
              <motion.button
                className="absolute top-6 right-6 h-10 w-10 rounded-full border border-border/50 bg-card/40 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                onClick={() => setMobileOpen(false)}
                aria-label="Zamknij menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 2L14 14" />
                  <path d="M14 2L2 14" />
                </svg>
              </motion.button>

              {/* Nav links */}
              <div className="flex flex-col gap-0 flex-1 justify-center">
                {navLinks.map((link, i) => {
                  const isActive = `#${activeSection}` === link.href;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleClick(e, link.href)}
                      className={`group flex items-center gap-4 py-4 px-4 rounded-2xl transition-colors border-b border-border/20 last:border-b-0 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/55 hover:text-foreground hover:bg-secondary/40"
                      }`}
                      initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                      transition={{
                        delay: 0.08 + i * 0.08,
                        duration: 0.5,
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                    >
                      <motion.span
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.08, type: "spring", stiffness: 250, damping: 20 }}
                      >
                        {link.emoji}
                      </motion.span>
                      <span className="text-xl sm:text-2xl font-semibold tracking-[-0.02em]">
                        {link.label}
                      </span>
                      {isActive && (
                        <motion.div
                          className="ml-auto h-2 w-2 rounded-full bg-primary"
                          layoutId="mobile-active-dot"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                      <motion.span
                        className="ml-auto text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.a
                  href="#kontakt"
                  onClick={(e) => handleClick(e, "#kontakt")}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-[0_8px_30px_-4px_rgba(59,130,246,0.5)]"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                >
                  Napisz do mnie
                  <ArrowRight className="h-5 w-5" />
                </motion.a>
              </motion.div>

              {/* Bottom branding */}
              <motion.div
                className="text-center mt-8 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <p className="text-xs text-muted-foreground/40">
                  GK<span className="text-primary/30">.dev</span> © {new Date().getFullYear()}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
