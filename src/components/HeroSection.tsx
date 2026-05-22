import { motion, useScroll, useTransform } from "motion/react";
import { Code2, Github, Linkedin, Mail } from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RippleButton } from "@/components/ui/ripple-button";
import {
  EASE_STANDARD,
  TYPEWRITER_TYPING_SPEED,
  TYPEWRITER_DELETING_SPEED,
  TYPEWRITER_PAUSE_TIME,
  PARTICLE_COUNT_DESKTOP,
  PARTICLE_COUNT_MOBILE,
  PARTICLE_CONNECTION_DISTANCE,
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

// ─── ParticleField ─────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

/**
 * ParticleField — canvas-based particle network (extracted from HeroSection, SRP).
 * Respects prefers-reduced-motion.
 */
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const particles = useMemo<Particle[]>(() => {
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.0002 + 0.0001,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [isMobile]);

  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const setSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();

    // Throttled resize handler
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSize, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y -= p.speed * 16;
        if (p.y < -0.02) p.y = 1.02;

        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(217, 91%, 60%, ${p.opacity})`;
        ctx.fill();
      }

      // O(n²) connections — acceptable for ≤80 particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x - particles[j].x) * w;
          const dy = (particles[i].y - particles[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PARTICLE_CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x * w, particles[i].y * h);
            ctx.lineTo(particles[j].x * w, particles[j].y * h);
            ctx.strokeStyle = `hsla(217, 91%, 60%, ${0.08 * (1 - dist / PARTICLE_CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
};

// ─── HeroSection ───────────────────────────────────────────────────────────────

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const magneticPrimary = useMagnetic(0.35);
  const magneticSecondary = useMagnetic(0.35);
  const typewriterText = useTypewriter(roles);
  const greetingText = useTypewriter(greetings, 100, 60, 2500);

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

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      id="hero"
      aria-label="Sekcja powitalna"
    >
      {/* Background Video */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: videoY, scale: videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/5495781/5495781-uhd_2560_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
      </motion.div>

      {/* Parallax background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none z-[1]"
        style={{ y: orbY1 }}
      />
      <motion.div
        className="absolute bottom-1/3 -right-32 w-72 h-72 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none z-[1]"
        style={{ y: orbY2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-blue-400/5 blur-[90px] pointer-events-none z-[1]"
        style={{ y: orbY3 }}
      />

      {/* Particle network overlay */}
      <ParticleField />

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[30vh] sm:pt-[35vh] md:pt-[38vh] flex flex-col items-center gap-6 sm:gap-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Role badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 backdrop-blur-md px-4 py-1.5"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
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
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-center font-['Geist'] font-medium tracking-[-0.04em] text-foreground leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
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
          <span
            className="font-['Instrument_Serif'] italic bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent"
            style={{ fontSize: "clamp(44px, 6.9vw, 100px)" }}
          >
            Grzegorz
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-center font-['Geist'] text-base sm:text-lg max-w-[554px] px-4 text-muted-foreground"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Tworzę nowoczesne aplikacje webowe i mobilne. Specjalizuję się w React, TypeScript i architekturze cloud.
        </motion.p>

        {/* CTA + Socials */}
        <motion.div
          className="flex flex-col items-center gap-5 sm:gap-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
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

          <div className="flex items-center gap-5" role="list" aria-label="Linki społecznościowe">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                role="listitem"
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-muted-foreground/50"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-['Geist'] tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-muted-foreground/50"
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
