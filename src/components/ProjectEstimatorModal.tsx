import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, X, Check, ArrowRight, ArrowLeft, Sparkles, Layers, Clock, Send } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess, hapticSelection } from "@/lib/haptics";
import { triggerConfetti } from "@/lib/confetti";

interface ProjectEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEstimate: (summary: string) => void;
}

interface ProjectType {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  baseWeeks: number;
}

const projectTypes: ProjectType[] = [
  { id: "saas", name: "MVP SaaS / Platforma Web", desc: "Aplikacja z bazą danych, panelem i API", basePrice: 12000, baseWeeks: 4 },
  { id: "ecommerce", name: "Sklep E-Commerce High-End", desc: "Katalog, koszyk, płatności Stripe/BLIK", basePrice: 8000, baseWeeks: 3 },
  { id: "mobile", name: "Aplikacja Mobilna (Cross-Platform)", desc: "iOS & Android w React Native lub Flutter", basePrice: 10000, baseWeeks: 4 },
  { id: "landing", name: "Strona Wizytówkowa / Portfolio", desc: "Nowoczesny design, animacje i ultra-szybkie SEO", basePrice: 3500, baseWeeks: 1.5 },
];

interface Feature {
  id: string;
  name: string;
  price: number;
  weeks: number;
}

const featuresList: Feature[] = [
  { id: "ai", name: "Integracje AI (OpenAI / Claude / RAG)", price: 3000, weeks: 1 },
  { id: "payments", name: "Płatności Stripe / BLIK / Subskrypcje", price: 2000, weeks: 0.5 },
  { id: "auth", name: "Autoryzacja, Role i Bezpieczeństwo", price: 1500, weeks: 0.5 },
  { id: "cms", name: "Dedykowany Panel Administracyjny CMS", price: 2500, weeks: 1 },
  { id: "aws", name: "Infrastruktura Chmurowa AWS / Docker", price: 2000, weeks: 0.5 },
  { id: "i18n", name: "Wielojęzyczność (i18n) & Tłumaczenia", price: 1000, weeks: 0.5 },
];

const timelines = [
  { id: "urgent", name: "Pilny (< 3 tyg.)", factor: 1.2 },
  { id: "standard", name: "Standardowy (4–8 tyg.)", factor: 1.0 },
  { id: "flexible", name: "Elastyczny (> 8 tyg.)", factor: 0.9 },
];

export const ProjectEstimatorModal = ({
  isOpen,
  onClose,
  onApplyEstimate,
}: ProjectEstimatorModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<string>("saas");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["payments", "auth"]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("standard");

  const calculation = useMemo(() => {
    const typeObj = projectTypes.find((p) => p.id === selectedType) || projectTypes[0];
    const featuresCost = selectedFeatures.reduce((acc, featId) => {
      const feat = featuresList.find((f) => f.id === featId);
      return acc + (feat?.price || 0);
    }, 0);
    const featuresWeeks = selectedFeatures.reduce((acc, featId) => {
      const feat = featuresList.find((f) => f.id === featId);
      return acc + (feat?.weeks || 0);
    }, 0);

    const timelineObj = timelines.find((t) => t.id === selectedTimeline) || timelines[1];

    const baseSum = (typeObj.basePrice + featuresCost) * timelineObj.factor;
    const minPrice = Math.round(baseSum * 0.95);
    const maxPrice = Math.round(baseSum * 1.15);

    const totalWeeks = Math.ceil(typeObj.baseWeeks + featuresWeeks);

    return {
      typeObj,
      minPrice,
      maxPrice,
      totalWeeks,
      featuresCount: selectedFeatures.length,
    };
  }, [selectedType, selectedFeatures, selectedTimeline]);

  const toggleFeature = (id: string) => {
    soundEngine.playPop(750, 0.03);
    hapticLight();
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    soundEngine.playChime();
    hapticSuccess();
    triggerConfetti();
    const typeName = projectTypes.find((p) => p.id === selectedType)?.name;
    const featNames = selectedFeatures
      .map((fId) => featuresList.find((f) => f.id === fId)?.name)
      .join(", ");

    const summaryText = `[ESTYMACJA PROJEKTU]\nTyp: ${typeName}\nWybrane moduły: ${featNames || "Brak"}\nSzacowany budżet: ${calculation.minPrice.toLocaleString("pl-PL")} - ${calculation.maxPrice.toLocaleString("pl-PL")} PLN\nSzacowany czas: ~${calculation.totalWeeks} tyg.\n\n`;

    onApplyEstimate(summaryText);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            className="relative w-full max-w-2xl rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-label="Kalkulator wyceny projektu"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-['Geist'] text-base sm:text-lg font-bold text-foreground">
                    Kalkulator & Estymator Projektu
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">Krok {step} z 3</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Zamknij"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step Content */}
            <div className="py-6 min-h-[280px]">
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="font-['Geist'] text-sm font-bold text-foreground">
                    1. Jaki rodzaj aplikacji chcesz zbudować?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectTypes.map((pt) => {
                      const isSelected = selectedType === pt.id;
                      return (
                        <button
                          key={pt.id}
                          onClick={() => {
                            soundEngine.playPop(750, 0.03);
                            hapticSelection();
                            setSelectedType(pt.id);
                          }}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                              : "border-border/70 bg-card/60 hover:border-primary/40 hover:bg-card"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-['Geist'] text-sm font-bold text-foreground">
                              {pt.name}
                            </span>
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="font-['Geist'] text-xs text-muted-foreground">
                            {pt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-['Geist'] text-sm font-bold text-foreground">
                    2. Jakie funkcjonalności będą potrzebne? (Wybierz dowolne)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {featuresList.map((feat) => {
                      const isSelected = selectedFeatures.includes(feat.id);
                      return (
                        <button
                          key={feat.id}
                          onClick={() => toggleFeature(feat.id)}
                          className={`rounded-2xl border p-3.5 text-left transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                              : "border-border/70 bg-card/60 hover:border-primary/40"
                          }`}
                        >
                          <span className="font-['Geist'] text-xs font-semibold text-foreground">
                            {feat.name}
                          </span>
                          <div
                            className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border bg-secondary"
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-['Geist'] text-sm font-bold text-foreground">
                    3. Jaki jest preferowany harmonogram wdrożenia?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {timelines.map((time) => {
                      const isSelected = selectedTimeline === time.id;
                      return (
                        <button
                          key={time.id}
                          onClick={() => {
                            soundEngine.playPop(750, 0.03);
                            hapticSelection();
                            setSelectedTimeline(time.id);
                          }}
                          className={`rounded-2xl border p-4 text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                              : "border-border/70 bg-card/60 hover:border-primary/40"
                          }`}
                        >
                          <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <span className="font-['Geist'] text-xs font-bold text-foreground block">
                            {time.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Summary Card */}
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                        Orientacyjny Budżet:
                      </span>
                      <p className="font-['Geist'] text-2xl font-black text-foreground text-primary">
                        {calculation.minPrice.toLocaleString("pl-PL")} – {calculation.maxPrice.toLocaleString("pl-PL")} PLN
                      </p>
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        Szacowany czas realizacji: ~{calculation.totalWeeks} tygodni
                      </p>
                    </div>

                    <button
                      onClick={handleApply}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                    >
                      <Send className="h-4 w-4" />
                      <span>Wyślij z tą wyceną</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              {step > 1 ? (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setStep((s) => (s - 1) as 1 | 2 | 3);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Wstecz</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    hapticLight();
                    setStep((s) => (s + 1) as 1 | 2 | 3);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                  <span>Dalej</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
