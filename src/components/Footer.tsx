import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, Heart, ArrowUp, Code2, Clock, Command } from "lucide-react";
import { CanvasBubblesBackground } from "@/components/ui/canvas-bubbles-background";
import { soundEngine } from "@/lib/audio";
import { BrandLogo } from "@/components/ui/BrandLogo";

const socialLinks = [
  { icon: Github, href: "https://github.com/gkdev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/gkdev", label: "LinkedIn" },
  { icon: Mail, href: "mailto:kontakt@gkdev.pl", label: "Email" },
] as const;

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [szczecinTime, setSzczecinTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("pl-PL", {
        timeZone: "Europe/Warsaw",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setSzczecinTime(timeStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    soundEngine.playChime();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 bg-card border-t border-border overflow-hidden" aria-label="Stopka strony">
      <CanvasBubblesBackground />

      {/* Wave top border */}
      <div className="absolute -top-[1px] left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg
          className="relative block w-full h-[30px] md:h-[50px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-background"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-[1240px] px-4 md:px-8 pt-20 pb-[max(4rem,env(safe-area-inset-bottom,4rem))] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Col 1: Brand & Bio */}
          <motion.div
            className="md:col-span-5 space-y-4 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center md:justify-start">
              <BrandLogo onClick={(e) => { e.preventDefault(); scrollToTop(); }} />
            </div>

            <p className="font-['Geist'] text-sm text-muted-foreground max-w-sm leading-relaxed">
              Projektowanie i wdrażanie nowoczesnych platform webowych, architektur chmurowych i aplikacji mobilnych.
            </p>

            {/* Live Clock Szczecin, PL */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/80 px-3.5 py-1.5 font-mono text-xs text-foreground shadow-sm">
              <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>Szczecin, PL</span>
              <span className="text-border">•</span>
              <span className="font-bold text-primary tabular-nums">{szczecinTime || "17:30:00"}</span>
              <span className="text-[10px] text-muted-foreground">CET</span>
            </div>
          </motion.div>

          {/* Col 2: Navigation links */}
          <motion.div
            className="md:col-span-4 space-y-3 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-['Geist'] text-xs font-bold uppercase tracking-widest text-foreground/80">
              Nawigacja
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: "Start", href: "#hero" },
                { label: "O mnie", href: "#o-mnie" },
                { label: "Umiejętności", href: "#umiejetnosci" },
                { label: "Projekty", href: "#projekty" },
                { label: "Opinie", href: "#opinie" },
                { label: "Kontakt", href: "#kontakt" },
                { label: "FAQ", href: "#faq" },
                { label: "Pobierz CV", href: "/cv.pdf" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      const id = link.href.replace("#", "");
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-['Geist'] py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Col 3: Social & Shortcuts */}
          <motion.div
            className="md:col-span-3 space-y-4 text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-['Geist'] text-xs font-bold uppercase tracking-widest text-foreground/80">
              Połączmy się
            </h4>
            <div className="flex items-center justify-center md:justify-end gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:scale-105"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                </a>
              ))}

              <AnimatePresence>
                {showScrollTop && (
                  <motion.button
                    key="scroll-top"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                    aria-label="Wróć na górę strony"
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Shortcuts Helper */}
            <div className="hidden lg:flex flex-col items-end gap-1.5 font-mono text-[11px] text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/80 bg-secondary px-1.5 py-0.5 text-[10px] text-foreground flex items-center gap-0.5">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
                <span>Menu poleceń</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Big Stylized Monogram / Watermark */}
        <motion.div
          className="mt-16 pt-10 border-t border-border/50 text-center select-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="font-['Geist'] text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-foreground/[0.04] dark:text-foreground/[0.03] uppercase">
            GRZEGORZ • DEV
          </span>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            © {new Date().getFullYear()} GK.dev • Kodowanie w Szczecinie
          </p>
          <p className="flex items-center gap-1">
            Zaprojektowane z{" "}
            <Heart className="h-3 w-3 text-red-500 inline mx-0.5" fill="currentColor" aria-label="pasją" />{" "}
            i rygorystycznym Clean Code
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
