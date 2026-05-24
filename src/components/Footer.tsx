import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, Heart, ArrowUp, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CanvasBubblesBackground } from "@/components/ui/canvas-bubbles-background";

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
      <CanvasBubblesBackground />
      {/* Wave top border */}
      <div className="absolute -top-[1px] left-0 right-0 overflow-hidden leading-none" aria-hidden="true">
        <svg
          className="relative block w-full h-[40px] md:h-[60px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-background"
            opacity="0.5"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,172.6-46C576,5.7,637.61,27,752.63,59.79c70.05,18.48,146.53,26.09,214.34,3V0Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 relative">
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
          <p className="font-['Geist'] text-sm text-muted-foreground max-w-[280px] mb-5">
            Tworzę nowoczesne aplikacje webowe i mobilne z pasją do czystego kodu.
          </p>
          <nav aria-label="Szybka nawigacja" className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: "O mnie", href: "#o-mnie" },
              { label: "Projekty", href: "#projekty" },
              { label: "Kontakt", href: "#kontakt" },
              { label: "FAQ", href: "#faq" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  const id = link.href.replace("#", "");
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-['Geist'] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
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
