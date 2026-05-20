import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, Pause, Play } from "lucide-react";
import { EASE_STANDARD } from "@/constants/animations";

const testimonials = [
  {
    name: "Anna Kowalska",
    role: "CEO, TechStart",
    text: "GK dostarczył fantastyczną aplikację webową, która przekroczyła nasze oczekiwania. Profesjonalizm i dbałość o detale na najwyższym poziomie.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Michał Nowak",
    role: "CTO, DataFlow",
    text: "Współpraca z GK to czysta przyjemność. Szybka komunikacja, terminowość i kod najwyższej jakości. Zdecydowanie polecam!",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Katarzyna Wiśniewska",
    role: "Product Manager, CloudBase",
    text: "Nasz dashboard analityczny został zbudowany perfekcyjnie. Responsywny, szybki i piękny wizualnie. Klienci są zachwyceni.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Tomasz Zieliński",
    role: "Founder, AppVenture",
    text: "GK pomógł nam przebudować całą architekturę frontendu. Wydajność wzrosła o 300%, a UX jest teraz na światowym poziomie.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Ewa Mazur",
    role: "Head of Design, Pixelworks",
    text: "Implementacja designu była pixel-perfect. GK rozumie UI/UX na głębokim poziomie i potrafi przełożyć wizję na kod bez kompromisów.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Paweł Dąbrowski",
    role: "VP Engineering, FinScope",
    text: "Bezpieczeństwo i wydajność naszej platformy finansowej są kluczowe. GK dostarczył rozwiązanie, które spełnia najwyższe standardy branżowe.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Marta Lewandowska",
    role: "CMO, GreenTech Solutions",
    text: "Nasza nowa strona zwiększyła konwersje o 180%. GK nie tylko koduje — rozumie biznes i tworzy rozwiązania, które przynoszą realne rezultaty.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
  },
] as const;

const AUTOPLAY_INTERVAL = 5000;

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  // Unique id for aria-live region
  const liveId = "testimonials-live";

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
  };

  const t = testimonials[current];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      id="opinie"
      aria-label="Opinie klientów"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block font-['Geist'] text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4">
            Opinie klientów
          </span>
          <h2 className="font-['Geist'] text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Co mówią{" "}
            <span className="font-['Instrument_Serif'] italic bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent">
              klienci
            </span>
          </h2>
        </motion.div>

        {/* Slider */}
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Live region for screen readers */}
          <div
            id={liveId}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            Opinia {current + 1} z {testimonials.length}: {t.name}, {t.role} — {t.text}
          </div>

          <div
            className="relative min-h-[320px] flex items-center justify-center"
            role="region"
            aria-label={`Opinia ${current + 1} z ${testimonials.length}`}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: EASE_STANDARD }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-8 md:p-10 shadow-lg">
                  {/* Quote icon */}
                  <div className="mb-6 flex justify-center" aria-hidden="true">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div
                    className="flex justify-center gap-1 mb-6"
                    aria-label={`Ocena: ${t.rating} na 5 gwiazdek`}
                  >
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                        aria-hidden="true"
                      >
                        <Star className="h-4 w-4 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Text */}
                  <blockquote className="text-center font-['Geist'] text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                    "{t.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={t.photo}
                      alt={`Zdjęcie profilowe: ${t.name}`}
                      className="h-11 w-11 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                      loading="lazy"
                      width={44}
                      height={44}
                    />
                    <div className="text-left">
                      <p className="font-['Geist'] text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="font-['Geist'] text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8" role="group" aria-label="Kontrolki slidera">
            <button
              onClick={prev}
              className="rounded-full border border-border/50 bg-card/60 backdrop-blur-sm p-2.5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Poprzednia opinia"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Wybierz opinię">
              {testimonials.map((testimonial, i) => (
                <button
                  key={testimonial.name}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Opinia ${i + 1}: ${testimonial.name}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            {/* Pause/Play button — important for accessibility (WCAG 2.1 criterion 2.2.2) */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="rounded-full border border-border/50 bg-card/60 backdrop-blur-sm p-2.5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={isPaused ? "Wznów automatyczne przewijanie" : "Zatrzymaj automatyczne przewijanie"}
              aria-pressed={isPaused}
            >
              {isPaused
                ? <Play className="h-4 w-4" aria-hidden="true" />
                : <Pause className="h-4 w-4" aria-hidden="true" />
              }
            </button>

            <button
              onClick={next}
              className="rounded-full border border-border/50 bg-card/60 backdrop-blur-sm p-2.5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Następna opinia"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
