import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { CanvasGridBackground } from "@/components/ui/canvas-grid-background";
import { HelpCircle, Search, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSelection } from "@/lib/haptics";

const faqs = [
  {
    category: "Współpraca",
    question: "Jak wygląda proces współpracy i rozliczeń?",
    answer:
      "Zaczynamy od bezpłatnej rozmowy o Twoich celach biznesowych i architekturze. Przygotowuję szczegółowy estymator i harmonogram. Pracujemy w 1-2 tygodniowych sprintach z regularnymi wersjami demo na środowisku stagingowym.",
  },
  {
    category: "Wycena & Czas",
    question: "Ile kosztuje i ile trwa stworzenie dedykowanej aplikacji?",
    answer:
      "Prosty landing page / sklep to zwykle 1–2 tygodnie (od 3 500 zł). Kompleksowa platforma SaaS lub dedykowana aplikacja webowa to 4–8 tygodni (od 12 000 zł). Zawsze przedstawiam przejrzysty, stały budżet (Fixed Price) lub model Time & Material.",
  },
  {
    category: "Wycena & Czas",
    question: "Czy oferujesz wsparcie i SLA po wdrożeniu produkcyjnym?",
    answer:
      "Tak! Każdy projekt objęty jest 30-dniową bezpłatną gwarancją i opieką powdrożeniową. Dostępne są również elastyczne pakiety SLA obejmujące monitoring 24/7, optymalizację chmury AWS oraz ciągły rozwój nowych funkcji.",
  },
  {
    category: "Technologie",
    question: "W jakim stacku technologicznym tworzysz aplikacje?",
    answer:
      "Główny ekosystem to React 19, Next.js 15, TypeScript, Tailwind CSS na frontendzie oraz Node.js (NestJS/Express), PostgreSQL, Redis i AWS na backendzie. Do aplikacji mobilnych używam React Native i Flutter.",
  },
  {
    category: "Współpraca",
    question: "Czy kod i prawa autorskie przechodzą w 100% na klienta?",
    answer:
      "Oczywiście. Wraz z finalnym wdrożeniem i rozliczeniem przekazuję pełne autorskie prawa majątkowe, repozytorium GitHub oraz całą dokumentację wdrożeniową i architektoniczną.",
  },
  {
    category: "Technologie",
    question: "Czy dbasz o Google Lighthouse 100/100, SEO i dostępność?",
    answer:
      "Zdecydowanie. Każda realizacja jest testowana pod kątem Core Web Vitals (LCP < 0.8s, CLS 0), responsywności na każdym ekranie oraz standardów WCAG 2.1 (A11y).",
  },
] as const;

const categories = ["Wszystkie", "Wycena & Czas", "Technologie", "Współpraca"] as const;

const FaqSection = ({ className = "" }: { className?: string }) => {
  const [activeCategory, setActiveCategory] = useState<string>("Wszystkie");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter((f) => {
      const matchesCategory = activeCategory === "Wszystkie" || f.category === activeCategory;
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <SectionWrapper id="faq" label="Często zadawane pytania" divider={false} className={className}>
      <CanvasGridBackground />
      <div className="relative z-10 mx-auto max-w-[820px] px-2 sm:px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase tracking-widest font-['Geist'] mb-4 shadow-sm">
            <HelpCircle className="h-3.5 w-3.5" />
            Baza Wiedzy & FAQ
          </span>
          <h2 className="font-['Geist'] text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Często zadawane <span className="text-primary">pytania</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-['Geist'] max-w-lg mx-auto">
            Wszystko, co warto wiedzieć przed rozpoczęciem wspólnego projektu.
          </p>
        </motion.div>

        {/* Toolbar: Search + Category Chips */}
        <div className="space-y-4 mb-8">
          {/* Live Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Szukaj w pytaniach (np. wycena, czas, AWS, SEO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playPop(800, 0.02);
                    hapticSelection();
                    setActiveCategory(cat);
                  }}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`item-${i}`}
                className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl px-6 data-[state=open]:border-primary/50 data-[state=open]:border-l-4 data-[state=open]:border-l-primary data-[state=open]:bg-card/95 transition-all duration-300 shadow-sm"
              >
                <AccordionTrigger
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                  }}
                  className="font-['Geist'] text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors py-5 hover:no-underline text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary font-medium px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 hidden sm:inline-block">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="font-['Geist'] text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Empty state */}
          {filteredFaqs.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="font-bold text-foreground font-['Geist']">Brak wyników</p>
              <p className="text-xs text-muted-foreground font-mono">Nie znaleziono pytań pasujących do frazy "{searchQuery}".</p>
            </div>
          )}
        </motion.div>

        {/* Bottom Fast Inquire Banner */}
        <motion.div
          className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card/80 to-accent-blue/10 backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h3 className="font-['Geist'] font-bold text-foreground text-sm sm:text-base">
                Masz niestandardowe pytanie?
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Chętnie odpowiem na wszelkie pytania techniczne i biznesowe.
            </p>
          </div>

          <a
            href="#kontakt"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playChime();
              document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-95 transition-all hover:scale-105 shrink-0"
          >
            <span>Napisz bezpośrednio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default FaqSection;
