import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Anna Kowalska",
    role: "CEO, TechStart",
    text: "Kaczy dostarczył fantastyczną aplikację webową, która przekroczyła nasze oczekiwania. Profesjonalizm i dbałość o detale na najwyższym poziomie.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Michał Nowak",
    role: "CTO, DataFlow",
    text: "Współpraca z Kaczy to czysta przyjemność. Szybka komunikacja, terminowość i kod najwyższej jakości. Zdecydowanie polecam!",
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
    text: "Kaczy pomógł nam przebudować całą architekturę frontendu. Wydajność wzrosła o 300%, a UX jest teraz na światowym poziomie.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Ewa Mazur",
    role: "Head of Design, Pixelworks",
    text: "Implementacja designu była pixel-perfect. Kaczy rozumie UI/UX na głębokim poziomie i potrafi przełożyć wizję na kod bez kompromisów.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Paweł Dąbrowski",
    role: "VP Engineering, FinScope",
    text: "Bezpieczeństwo i wydajność naszej platformy finansowej są kluczowe. Kaczy dostarczył rozwiązanie, które spełnia najwyższe standardy branżowe.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Marta Lewandowska",
    role: "CMO, GreenTech Solutions",
    text: "Nasza nowa strona zwiększyła konwersje o 180%. Kaczy nie tylko koduje — rozumie biznes i tworzy rozwiązania, które przynoszą realne rezultaty.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
  };

  const t = testimonials[current];

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden" id="opinie">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
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
          <div className="relative min-h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-8 md:p-10 shadow-lg">
                  {/* Quote icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                      >
                        <Star className="h-4 w-4 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-center font-['Geist'] text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="h-11 w-11 rounded-full object-cover border-2 border-primary/20 shadow-sm"
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
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="rounded-full border border-border/50 bg-card/60 backdrop-blur-sm p-2.5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              aria-label="Poprzednia opinia"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Opinia ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="rounded-full border border-border/50 bg-card/60 backdrop-blur-sm p-2.5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              aria-label="Następna opinia"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
