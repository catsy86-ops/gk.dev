import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Code2, Github, Linkedin, Mail } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import GKLogo from "@/assets/gk-logo.png";
import { useMagnetic } from "@/hooks/use-magnetic";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

const roles = ["Fullstack Developer", "React Specialist", "Cloud Architect", "UI/UX Enthusiast"];
const greetings = ["Cześć", "Hello", "Hej", "Yo", "Siema"];

const useTypewriter = (words: string[], typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) => {
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
  const logoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.4], [0.06, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden" id="hero">
      {/* Background Video — laptop coding */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: videoY, scale: videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/5495781/5495781-uhd_2560_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        {/* Blue tint overlay */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
      </motion.div>

      {/* Background logo watermark */}
      <motion.div
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
        style={{ scale: logoScale, opacity: logoOpacity }}
      >
        <img
          src={GKLogo}
          alt=""
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] object-contain select-none"
          aria-hidden="true"
        />
      </motion.div>

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[290px] flex flex-col items-center gap-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 backdrop-blur-md px-4 py-1.5"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-['Geist'] text-xs font-medium text-primary min-w-[140px]">
            {typewriterText}
            <motion.span
              className="inline-block w-[2px] h-3.5 bg-primary ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-center font-['Geist'] font-medium tracking-[-0.04em] text-foreground leading-[1.05]"
          style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <span className="inline-block min-w-[80px] md:min-w-[120px]">
            {greetingText}
            <motion.span
              className="inline-block w-[3px] ml-0.5 align-middle bg-foreground"
              style={{ height: "clamp(30px, 4vw, 60px)" }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          </span>
          , jestem{" "}
          <span
            className="font-['Instrument_Serif'] italic bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent"
            style={{ fontSize: "clamp(50px, 6.9vw, 100px)" }}
          >
            Grzegorz
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-center font-['Geist'] text-lg max-w-[554px] text-muted-foreground"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Tworzę nowoczesne aplikacje webowe i mobilne. Specjalizuję się w React, TypeScript i architekturze cloud.
        </motion.p>

        {/* CTA + Socials */}
        <motion.div
          className="flex flex-col items-center gap-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="flex items-center gap-4">
            <a
              ref={magneticPrimary.ref as React.Ref<HTMLAnchorElement>}
              onMouseMove={magneticPrimary.onMouseMove}
              onMouseLeave={magneticPrimary.onMouseLeave}
              href="#projekty"
              onClick={(e) => { e.preventDefault(); document.getElementById("projekty")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-block rounded-full bg-primary px-7 py-3.5 font-['Geist'] text-sm font-medium text-primary-foreground shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] transition-shadow hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] active:scale-[0.98]"
            >
              Zobacz projekty
            </a>
            <a
              ref={magneticSecondary.ref as React.Ref<HTMLAnchorElement>}
              onMouseMove={magneticSecondary.onMouseMove}
              onMouseLeave={magneticSecondary.onMouseLeave}
              href="#kontakt"
              onClick={(e) => { e.preventDefault(); document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-block rounded-full border border-primary/20 bg-background/60 backdrop-blur-sm px-7 py-3.5 font-['Geist'] text-sm font-medium text-foreground transition-shadow hover:bg-background/80 hover:border-primary/30 active:scale-[0.98]"
            >
              Kontakt
            </a>
          </div>

          <div className="flex items-center gap-5">
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "mailto:GK@example.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
