import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, Heart, ArrowUp, Code2 } from "lucide-react";
import { useState, useEffect } from "react";

const socialLinks = [
  { icon: Github, href: "https://github.com/gkdev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/gkdev", label: "LinkedIn" },
  { icon: Mail, href: "mailto:kontakt@gkdev.pl", label: "Email" },
] as const;

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 bg-card border-t border-border overflow-hidden" aria-label="Stopka strony">
      {/* Top gradient accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
      />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-[1200px] px-6 py-16 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & tagline */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollToTop(); }}
              className="logo-glitch text-xl font-semibold tracking-[-0.03em] text-foreground font-['Geist'] inline-block mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              data-text="GK.dev"
              whileHover={{ scale: 1.05 }}
              aria-label="GK.dev — wróć na górę"
            >
              GK<span className="text-primary/50">.dev</span>
            </motion.a>
            <p className="font-['Geist'] text-sm text-muted-foreground max-w-[280px]">
              Tworzę nowoczesne aplikacje webowe i mobilne z pasją do czystego kodu.
            </p>
          </motion.div>

          {/* Social links */}
          <motion.nav
            className="flex items-center gap-3"
            aria-label="Linki społecznościowe"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {socialLinks.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </motion.a>
            ))}
          </motion.nav>

          {/* Back to top */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                key="scroll-top"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Wróć na górę strony"
              >
                <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.8} aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <motion.div
          className="h-[1px] my-8"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--border)), transparent)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          aria-hidden="true"
        />

        {/* Copyright */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="font-['Geist'] text-xs text-muted-foreground flex items-center gap-1.5">
            <Code2 className="h-3 w-3 text-primary/50" aria-hidden="true" />
            © {new Date().getFullYear()} GK.dev — Wszelkie prawa zastrzeżone.
          </p>
          <p className="font-['Geist'] text-xs text-muted-foreground flex items-center gap-1">
            Zbudowane z{" "}
            <Heart className="h-3 w-3 text-destructive inline mx-0.5" fill="currentColor" aria-label="miłością" />{" "}
            i dużą ilością kawy
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
