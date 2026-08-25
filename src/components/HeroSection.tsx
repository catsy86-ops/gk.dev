import { motion, useScroll, useTransform } from "motion/react";
import { Code2, Github, Linkedin, Mail } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RippleButton } from "@/components/ui/ripple-button";
import { CanvasGridBackground } from "@/components/ui/canvas-grid-background";
import { CanvasBubblesBackground } from "@/components/ui/canvas-bubbles-background";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { HeroCodeTerminal } from "@/components/HeroCodeTerminal";
import {
  EASE_STANDARD,
  TYPEWRITER_TYPING_SPEED,
  TYPEWRITER_DELETING_SPEED,
  TYPEWRITER_PAUSE_TIME,
} from "@/constants/animations";

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: EASE_STANDARD },
  }),
};

const badgeGlow = {
  animate: {
    boxShadow: [
      "0 0 0px hsl(var(--primary) / 0)",
      "0 0 20px hsl(var(--primary) / 0.25)",
      "0 0 0px hsl(var(--primary) / 0)",
    ],
  },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

const floatingBadge = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0, duration: 0.8, ease: EASE_STANDARD },
  },
};

const headingReveal = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.15, duration: 0.8, ease: EASE_STANDARD },
  },
};

const descReveal = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.45, duration: 0.7, ease: EASE_STANDARD },
  },
};

const ctaReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.65, duration: 0.6, ease: EASE_STANDARD },
  },
};

const socialsReveal = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.85, duration: 0.5, ease: EASE_STANDARD },
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const roles = ["Fullstack Developer", "React Specialist", "Cloud Architect", "UI/UX Enthusiast"];
const greetings = ["Cześć", "Hello", "Hej", "Yo", "Siema"];

const socialLinks = [
  { icon: Github, href: "https://github.com/gkdev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/gkdev", label: "LinkedIn" },
  { icon: Mail, href: "mailto:kontakt@gkdev.pl", label: "Email" },
] as const;

// ─── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * useTypewriter — extracted hook (SRP).
 * Handles typewriter animation logic independently of rendering.
 */
const useTypewriter = (
  words: readonly string[],
  typingSpeed = TYPEWRITER_TYPING_SPEED,
  deletingSpeed = TYPEWRITER_DELETING_SPEED,
  pauseTime = TYPEWRITER_PAUSE_TIME,
) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.slice(0, currentText.length + 1));
        if (currentText.length + 1 === word.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setCurrentText(word.slice(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
};

// ─── HeroSection ───────────────────────────────────────────────────────────────

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const magneticPrimary = useMagnetic(0.35);
  const magneticSecondary = useMagnetic(0.35);
  const typewriterText = useTypewriter(roles);
  const greetingText = useTypewriter(greetings, 100, 60, 2500);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], ["0%", "-120%"]);
  const orbY4 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const orbY5 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden"
      id="hero"
      aria-label="Sekcja powitalna"
    >
      {/* Background Video */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: isMobile ? 0 : videoY, scale: isMobile ? 1 : videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/5495781/5495781-uhd_2560_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Multi-layer overlay for maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--background)_/_0.3)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-primary/10 dark:mix-blend-overlay" />
      </motion.div>

      {/* Animated canvas backgrounds (no Three.js) */}
      {!prefersReduced && (
        <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
          <CanvasGridBackground />
          <CanvasBubblesBackground />
        </div>
      )}

      {/* Parallax background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] pointer-events-none z-[1]"
        style={{ y: isMobile ? 0 : orbY1 }}
        animate={isMobile ? {} : { x: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={isMobile ? {} : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 -right-32 w-72 h-72 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] pointer-events-none z-[1]"
        style={{ y: isMobile ? 0 : orbY2 }}
        animate={isMobile ? {} : { x: [0, -25, 0], scale: [1, 1.1, 1] }}
        transition={isMobile ? {} : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-[90px] pointer-events-none z-[1]"
            style={{ y: orbY3 }}
            animate={{ x: [0, 20, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[110px] pointer-events-none z-[1]"
            style={{ y: orbY4 }}
            animate={{ x: [0, -20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-rose-500/10 dark:bg-rose-500/5 blur-[100px] pointer-events-none z-[1]"
            style={{ y: orbY5 }}
            animate={{ x: [0, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-6 pt-[20vh] sm:pt-[24vh] md:pt-[26vh] pb-16 flex flex-col items-center gap-6 sm:gap-8"
        style={{ y: isMobile ? 0 : contentY, opacity: isMobile ? 1 : contentOpacity }}
      >
        {/* Top Badges: Availability & Role */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <AvailabilityBadge />

          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 backdrop-blur-xl px-4 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
            variants={floatingBadge}
            initial="hidden"
            animate="visible"
            aria-label={`Rola: ${typewriterText}`}
          >
            <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-['Geist'] text-xs font-medium text-primary min-w-[140px]" aria-live="polite">
              {typewriterText}
              <motion.span
                className="inline-block w-[2px] h-3.5 bg-primary ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                aria-hidden="true"
              />
            </span>
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              {...badgeGlow}
            />
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h1
          className="text-center font-['Geist'] font-medium tracking-[-0.04em] text-foreground leading-[1.05] text-shadow-hero"
          style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
          variants={headingReveal}
          initial="hidden"
          animate="visible"
        >
          <span className="inline-block min-w-[70px] md:min-w-[120px]" aria-live="polite">
            {greetingText}
            <motion.span
              className="inline-block w-[3px] ml-0.5 align-middle bg-foreground"
              style={{ height: "clamp(28px, 4vw, 60px)" }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              aria-hidden="true"
            />
          </span>
          {", jestem "}
          <motion.span
            className="font-['Instrument_Serif'] italic bg-gradient-to-r from-primary via-accent-blue to-primary bg-clip-text text-transparent text-shadow-glow inline-block bg-[length:200%_auto]"
            style={{ fontSize: "clamp(44px, 6.9vw, 100px)" }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            Grzegorz
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-center font-['Geist'] text-base sm:text-lg max-w-[554px] px-4 text-muted-foreground text-shadow-hero"
          variants={descReveal}
          initial="hidden"
          animate="visible"
        >
          Tworzę nowoczesne aplikacje webowe i mobilne z pasją do czystego kodu,{" "}
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, 15, -10, 15, 0], scale: [1, 1.2, 0.95, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          >
            🚀
          </motion.span>
        </motion.p>

        {/* CTA + Socials */}
        <motion.div
          className="flex flex-col items-center gap-5 sm:gap-6"
          variants={ctaReveal}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              ref={magneticPrimary.ref as React.Ref<HTMLDivElement>}
              onMouseMove={magneticPrimary.onMouseMove}
              onMouseLeave={magneticPrimary.onMouseLeave}
            >
              <RippleButton
                onClick={scrollToSection("projekty")}
                className="rounded-full bg-primary px-6 sm:px-7 py-3 sm:py-3.5 font-['Geist'] text-sm font-medium text-primary-foreground shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] transition-shadow hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Zobacz projekty
              </RippleButton>
            </div>
            <a
              ref={magneticSecondary.ref as React.Ref<HTMLAnchorElement>}
              onMouseMove={magneticSecondary.onMouseMove}
              onMouseLeave={magneticSecondary.onMouseLeave}
              href="#kontakt"
              onClick={scrollToSection("kontakt")}
              className="inline-block rounded-full border border-primary/20 bg-background/60 backdrop-blur-sm px-6 sm:px-7 py-3 sm:py-3.5 font-['Geist'] text-sm font-medium text-foreground transition-shadow hover:bg-background/80 hover:border-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Kontakt
            </a>
          </div>

          <motion.div
            className="flex items-center gap-3 sm:gap-5"
            variants={socialsReveal}
            initial="hidden"
            animate="visible"
            role="list"
            aria-label="Linki społecznościowe"
          >
            {socialLinks.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                role="listitem"
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.4, ease: EASE_STANDARD }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Interactive Code Terminal Widget */}
        <HeroCodeTerminal />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        aria-hidden="true"
      >
<motion.div
           className="flex flex-col items-center gap-2 text-muted-foreground/80 dark:text-muted-foreground/50"
           animate={{ y: [0, 6, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
         >
           <span className="text-[10px] font-['Geist'] tracking-[0.2em] uppercase">Scroll</span>
           <div className="w-5 h-8 rounded-full border border-muted-foreground/50 dark:border-muted-foreground/30 flex items-start justify-center pt-1.5">
             <motion.div
               className="w-1 h-1.5 rounded-full bg-muted-foreground/80 dark:bg-muted-foreground/50"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
