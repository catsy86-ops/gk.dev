import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FileCode,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface B2bProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToContact?: (message: string) => void;
}

export const B2bProposalModal = ({
  isOpen,
  onClose,
  onApplyToContact,
}: B2bProposalModalProps) => {
  useScrollLock(isOpen);
  const [projectType, setProjectType] = useState<string>("saas");
  const [timeline, setTimeline] = useState<string>("1-2m");
  const [teamSize] = useState<string>("solo");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const projectTypes = [
    { id: "saas", label: "Aplikacja SaaS / Web Platform", stack: "Next.js 15, React 19, TypeScript, PostgreSQL, Redis, Tailwind" },
    { id: "audit", label: "Audyt Architektury & Wydajności", stack: "DevTools Profiler, Flamegraphs, Edge Caching, Memory Leak Audit" },
    { id: "ai", label: "Integracja AI / LLM & Vector Search", stack: "pgvector, LangChain/OpenAI, Semantic Caching, Streaming SSR" },
    { id: "mobile", label: "Aplikacja Mobilna (iOS & Android)", stack: "React Native / Expo, Offline-First SQLite, Push Notifications" },
  ];

  const currentType = projectTypes.find((p) => p.id === projectType) || projectTypes[0];

  const generatedBrief = `=========================================
BRIEF PROJEKTOWY & SPECYFIKACJA TECHNICZNA
=========================================
Typ projektu: ${currentType.label}
Rekomendowany stos: ${currentType.stack}${aiEnabled ? " + Moduł AI RAG" : ""}
Horyzont czasowy: ${timeline === "2-4w" ? "2-4 tygodnie (Fast-track MVP)" : timeline === "1-2m" ? "1-2 miesiące (Standard)" : "3+ miesiące (Enterprise)"}
Model współpracy: ${teamSize === "solo" ? "Samodzielny Lead Fullstack Engineer" : "Wsparcie i prowadzenie zespołu inżynierskiego"}

Kluczowe wymagania niefunkcjonalne:
- Responsywność & Dostępność (WCAG 2.1 AA)
- 100/100 Core Web Vitals (sub-50ms INP, sub-0.8s LCP)
- Bezpieczeństwo: Row-Level Security (RLS), RBAC, Idempotencja transakcji
- Testy automatyczne: Unit (Vitest) + E2E (Playwright)

Inżynier prowadzący: Grzegorz (GK.dev)
Kontakt: https://gkdev.pl/#kontakt
`;

  const handleCopy = () => {
    soundEngine.playPop(750, 0.03);
    hapticLight();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedBrief);
      setIsCopied(true);
      toast({ title: "Brief skopiowany", description: "Gotowa specyfikacja projektu w schowku." });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    soundEngine.playPop(850, 0.02);
    hapticSuccess();
    const element = document.createElement("a");
    const file = new Blob([generatedBrief], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `brief-projektowy-gkdev-${projectType}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: "Pobrano plik briefu", description: "Plik specyfikacji został zapisany na dysku." });
  };

  const handleTransferToContact = () => {
    soundEngine.playClick();
    hapticLight();
    onClose();
    if (onApplyToContact) {
      onApplyToContact(
        `Cześć Grzegorz, chciałbym skonsultować projekt: ${currentType.label}. Stack: ${currentType.stack}.`
      );
    }
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playClick();
              onClose();
            }}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-0 sm:my-6 pointer-events-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Generator Briefu B2B"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/60 bg-secondary/40 relative z-20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-['Geist'] font-bold text-foreground text-base sm:text-lg">
                    Generator Briefu B2B & Architektury
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Szybka specyfikacja zakresu i stosu technologicznego
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  soundEngine.playClick();
                  onClose();
                }}
                className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer relative z-30 pointer-events-auto"
                title="Zamknij"
                aria-label="Zamknij"
              >
                <X className="h-4 w-4 pointer-events-none" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 font-['Geist'] scrollbar-thin">
              {/* Project Type Picker */}
              <div>
                <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                  1. Typ i domena projektu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {projectTypes.map((type) => {
                    const isSelected = projectType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playPop(800, 0.02);
                          setProjectType(type.id);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary shadow-sm"
                            : "bg-secondary/60 border-border/60 hover:border-border"
                        }`}
                      >
                        <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {type.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                    2. Horyzont czasowy
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "2-4w", label: "2-4 tyg." },
                      { id: "1-2m", label: "1-2 mies." },
                      { id: "3m+", label: "3+ mies." },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playPop(800, 0.02);
                          setTimeline(item.id);
                        }}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                          timeline === item.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/60 border-border/60 text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                    3. Integracja AI (LLM / RAG)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setAiEnabled(!aiEnabled);
                    }}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      aiEnabled
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-secondary/60 border-border/60 text-muted-foreground"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{aiEnabled ? "Moduł AI: Włączony" : "Moduł AI: Nie wymagany"}</span>
                  </button>
                </div>
              </div>

              {/* Preview Box */}
              <div>
                <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                  Podgląd wygenerowanej specyfikacji
                </label>
                <pre className="rounded-2xl border border-border/80 bg-neutral-950 p-4 font-mono text-[11px] text-neutral-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {generatedBrief}
                </pre>
              </div>
            </div>

            {/* Footer Toolbar */}
            <div className="p-4 sm:p-5 border-t border-border/60 bg-secondary/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:border-primary/40 transition-all cursor-pointer shadow-sm"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? "Skopiowano" : "Kopiuj"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:border-primary/40 transition-all cursor-pointer shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Pobierz .txt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleTransferToContact}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Przejdź do formularza</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default B2bProposalModal;
