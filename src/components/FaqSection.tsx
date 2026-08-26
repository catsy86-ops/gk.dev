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
import { HelpCircle, Search, Sparkles } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSelection } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";

const FaqSection = ({ className = "" }: { className?: string }) => {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => [
    { id: "all", label: t.faq.categories.all },
    { id: "Wycena & Czas", label: t.faq.categories.pricing },
    { id: "Technologie", label: t.faq.categories.tech },
    { id: "Współpraca", label: t.faq.categories.collaboration },
  ], [t.faq.categories]);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return t.faq.items.filter((f) => {
      const matchesCategory =
        activeCategory === "all" ||
        f.category === activeCategory ||
        f.category === categories.find((c) => c.id === activeCategory)?.label;
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [t.faq.items, activeCategory, searchQuery, categories]);

  return (
    <SectionWrapper id="faq" label={t.faq.badge} divider={false} className={className}>
      <CanvasGridBackground />
      <div className="relative z-10 mx-auto max-w-[860px] px-2 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest font-['Geist'] mb-4 shadow-sm">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{t.faq.badge}</span>
          </div>

          <h2 className="font-['Geist'] text-3xl md:text-5xl font-black tracking-tight text-foreground">
            {t.faq.title} <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">{t.faq.highlight}</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-['Geist'] max-w-lg mx-auto leading-relaxed">
            {t.faq.subtitle}
          </p>
        </motion.div>

        {/* Toolbar: Search + Category Chips */}
        <div className="space-y-4 mb-8">
          {/* Live Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.faq.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl pl-11 pr-10 py-3 text-xs sm:text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.playPop(800, 0.02);
                    hapticSelection();
                    setActiveCategory(cat.id);
                  }}
                  className={`relative rounded-xl border px-4 py-2 text-xs font-semibold font-['Geist'] transition-all cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card/90"
                  }`}
                >
                  {cat.label}
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
          <Accordion type="single" collapsible className="space-y-3.5">
            {filteredFaqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`item-${i}`}
                className="group rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl px-5 sm:px-6 data-[state=open]:border-primary/60 data-[state=open]:border-l-4 data-[state=open]:border-l-primary data-[state=open]:bg-card/95 transition-all duration-300 shadow-sm hover:border-border"
              >
                <AccordionTrigger
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                  }}
                  className="font-['Geist'] text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors py-4 sm:py-5 hover:no-underline text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span className="font-mono text-[11px] text-primary font-bold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                      {faq.category}
                    </span>
                    <span className="leading-snug">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="font-['Geist'] text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 pt-1 border-t border-border/40 mt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Empty state */}
          {filteredFaqs.length === 0 && (
            <div className="py-12 text-center space-y-2 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="font-bold text-foreground font-['Geist'] text-sm">{t.faq.emptyTitle}</p>
              <p className="text-xs text-muted-foreground font-mono">{t.faq.emptyDesc} "{searchQuery}".</p>
            </div>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default FaqSection;
