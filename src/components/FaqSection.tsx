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
import { HelpCircle, Search, MessageCircle, ArrowRight } from "lucide-react";
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
            {t.faq.badge}
          </span>
          <h2 className="font-['Geist'] text-3xl md:text-5xl font-black tracking-tight text-foreground">
            {t.faq.title} <span className="text-primary">{t.faq.highlight}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-['Geist'] max-w-lg mx-auto">
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
              className="w-full rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
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
                  className="font-['Geist'] text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors py-5 hover:no-underline text-left cursor-pointer"
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
              <p className="font-bold text-foreground font-['Geist']">{t.faq.emptyTitle}</p>
              <p className="text-xs text-muted-foreground font-mono">{t.faq.emptyDesc} "{searchQuery}".</p>
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
                {t.faq.customQuestionHeading}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {t.faq.customQuestionSub}
            </p>
          </div>

          <motion.a
            href="#kontakt"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playChime();
              hapticMedium();
              document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_4px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.65)] border border-white/25 shrink-0 cursor-pointer overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {/* Shimmer light beam */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none -skew-x-12"
              animate={{ translateX: ["-150%", "250%"] }}
              transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 2, ease: "easeInOut" }}
            />
            <span className="relative z-10">{t.faq.contactDirectly}</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default FaqSection;
