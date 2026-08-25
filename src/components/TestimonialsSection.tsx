import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, Pause, Play, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { ImageReveal } from "@/components/ui/image-reveal";
import { EASE_STANDARD } from "@/constants/animations";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSelection } from "@/lib/haptics";

const testimonials = [
  {
    name: "Anna Kowalska",
    role: "CEO, TechStart",
    text: "GK dostarczył fantastyczną aplikację webową, która przekroczyła nasze oczekiwania. Profesjonalizm, architektura i dbałość o detale na najwyższym poziomie.",
    rating: 5,
    metric: "+145% wzrostu sprzedaży",
    project: "E-Commerce High-End",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Michał Nowak",
    role: "CTO, DataFlow",
    text: "Współpraca z GK to czysta przyjemność. Błyskawiczna komunikacja, terminowość i kod najwyższej jakości. Zdecydowanie polecam do projektów o wysokiej skali.",
    rating: 5,
    metric: "300% szybszy frontend",
    project: "Platforma SaaS & API",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Katarzyna Wiśniewska",
    role: "Product Manager, CloudBase",
    text: "Nasz dashboard analityczny został zbudowany perfekcyjnie. Responsywny, szybki i piękny wizualnie. Nasi klienci biznesowi są absolutnie zachwyceni.",
    rating: 5,
    metric: "99.99% Uptime & Realtime",
    project: "Cloud Dashboard",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Tomasz Zieliński",
    role: "Founder, AppVenture",
    text: "GK pomógł nam przebudować architekturę aplikacji. Wydajność wzrosła spektakularnie, a UX jest teraz na światowym poziomie referencyjnym.",
    rating: 5,
    metric: "-55% bounce rate",
    project: "Aplikacja Web & Mobile",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Ewa Mazur",
    role: "Head of Design, Pixelworks",
    text: "Implementacja designu była bezbłędnie pixel-perfect. GK doskonale rozumie zaawansowane micro-interactions i potrafi przełożyć makiety na 60 FPS.",
    rating: 5,
    metric: "100/100 Core Web Vitals",
    project: "Design System & Frontend",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Paweł Dąbrowski",
    role: "VP Engineering, FinScope",
    text: "Bezpieczeństwo i wydajność naszej platformy finansowej były kluczowe. GK dostarczył rozwiązanie spełniające najostrzejsze standardy enterprise.",
    rating: 5,
    metric: "0 luk bezpieczeństwa",
    project: "FinTech Platform",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Marta Lewandowska",
    role: "CMO, GreenTech Solutions",
    text: "Nowa platforma przyniosła nam ogromny skok konwersji. GK nie tylko koduje — rozumie produkt biznesowo i tworzy rozwiązania przynoszące wymierne zyski.",
    rating: 5,
    metric: "+180% nowych leadów",
    project: "GreenTech Ecosystem",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
  },
] as const;

const AUTOPLAY_INTERVAL = 6000;

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => {
    soundEngine.playPop(750, 0.02);
    hapticLight();
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    soundEngine.playPop(700, 0.02);
    hapticLight();
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goTo = useCallback((index: number) => {
    soundEngine.playPop(800, 0.02);
    hapticSelection();
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.96 }),
  };

  const t = testimonials[current];

  return (
    <section
      ref={sectionRef}
      className="relative bg-secondary/30 py-20 px-4 md:py-32 md:px-6 overflow-hidden"
      id="opinie"
      aria-label="Opinie i Rekomendacje Klientów"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-2 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase tracking-widest font-['Geist'] mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Rekomendacje & Social Proof
          </span>
          <h2 className="font-['Geist'] text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Zaufanie potwierdzone <span className="text-primary">wynikami</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-['Geist'] max-w-xl mx-auto">
            Referencje od liderów technologicznych, startupów i agencji.
          </p>
        </motion.div>

        {/* Bento Showcase Card */}
        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            className="relative min-h-[380px] flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE_STANDARD }}
                className="w-full rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-7 md:p-10 shadow-2xl overflow-hidden relative"
              >
                {/* Top Badge Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-mono text-[11px] font-bold text-emerald-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Zweryfikowane wdrożenie • {t.project}</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-mono text-[11px] font-bold text-primary">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{t.metric}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6" aria-label={`Ocena: ${t.rating} na 5 gwiazdek`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="font-['Geist'] text-base md:text-xl text-foreground font-medium leading-relaxed mb-8 relative">
                  <Quote className="h-8 w-8 text-primary/15 absolute -top-4 -left-4 -z-10 pointer-events-none" />
                  "{t.text}"
                </blockquote>

                {/* Author footer */}
                <div className="flex items-center justify-between pt-6 border-t border-border/60">
                  <div className="flex items-center gap-3.5">
                    <ImageReveal
                      src={t.photo}
                      alt={`Zdjęcie: ${t.name}`}
                      containerClassName="h-12 w-12 rounded-full"
                      className="rounded-full object-cover border-2 border-primary/30 shadow-md"
                      direction="up"
                      delay={0.1}
                    />
                    <div className="text-left">
                      <p className="font-['Geist'] text-base font-bold text-foreground">{t.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-muted-foreground/60">
                    {current + 1} / {testimonials.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 mt-8 px-2">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md text-foreground hover:border-primary/40 hover:text-primary transition-all active:scale-90 shadow-sm"
              aria-label="Poprzednia opinia"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Pagination Tabs */}
            <div className="flex items-center gap-2" role="tablist">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  role="tab"
                  aria-selected={i === current}
                  onClick={() => goTo(i)}
                  className="p-1"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === current ? "w-8 h-2.5 bg-primary shadow-md shadow-primary/30" : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md text-foreground hover:border-primary/40 hover:text-primary transition-all active:scale-90 shadow-sm"
                aria-label={isPaused ? "Wznów autoplay" : "Zatrzymaj autoplay"}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>

              <button
                onClick={next}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md text-foreground hover:border-primary/40 hover:text-primary transition-all active:scale-90 shadow-sm"
                aria-label="Następna opinia"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
