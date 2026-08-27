import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Printer,
  Copy,
  Check,
  Download,
  Mail,
  MapPin,
  Globe,
  Github,
  Award,
  Briefcase,
  Code2,
  Sparkles,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/hooks/use-toast";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { DevReceiptModal } from "@/components/DevReceiptModal";

interface InteractiveResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveResumeModal = ({ isOpen, onClose }: InteractiveResumeModalProps) => {
  const { lang, t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const isPl = lang === "pl";

  const handlePrint = () => {
    hapticSuccess();
    window.print();
  };

  const handleCopyMarkdown = () => {
    hapticLight();
    const markdownResume = `# Grzegorz — Mid Fullstack Developer (Samouk)
📍 Szczecin, Polska | 📧 kontakt@gkdev.pl | 🌐 https://gkdev.pl | 🐙 https://github.com/catsy86

## PODSUMOWANIE ZAWODOWE
Programista samouk ze Szczecina z wielką pasją do tworzenia nowoczesnych, szybkich i dopracowanych aplikacji webowych. Ponad 2500+ godzin intensywnej praktyki w budowaniu systemów komercyjnych w React 19, Next.js, TypeScript oraz backendu Node.js/PostgreSQL. Stawiam na Clean Code, testy jednostkowe (TDD/Vitest) i standardy rynkowe NoFluffJobs.

## STACK TECHNOLOGICZNY
- Frontend: React 19, Next.js 15, TypeScript 5, Tailwind CSS, Motion, Zustand
- Backend: Node.js, Express, NestJS, PostgreSQL, Prisma ORM, Redis, REST & GraphQL APIs
- Narzędzia & Cloud: AWS (S3, Lambda, CloudFront), Docker, Git, CI/CD GitHub Actions, Vercel, Supabase
- Metodyki: Clean Code, TDD, Agile/Scrum, 100/100 Core Web Vitals, a11y WCAG 2.1

## DOŚWIADCZENIE ZAWODOWE
### 2023 — TERAZ | Mid Fullstack Developer | Freelance & Projekty Komercyjne (Szczecin / Remote)
- Samodzielna realizacja i rozwój aplikacji webowych, platform SaaS oraz sklepów e-commerce w ekosystemie JS/TS.
- Optymalizacja Core Web Vitals do 95-100 oraz wdrożenie pełnej bazy testów automatycznych.
- Integracja bramek płatności Stripe, baz PostgreSQL/Supabase oraz systemów autoryzacji Clerk/Auth.js.

### 2021 — 2023 | Junior → Mid Frontend Developer | Projekty Klientów & Zespoły Zdalne
- Budowa modułowych bibliotek komponentów UI w React i TypeScript z 60 FPS motion.
- Refaktoryzacja legacy kodu do czystego TypeScriptu ze 100% type-safety.
- Ścisła współpraca w metodyce Agile/GitFlow z zespołami rozproszonymi.

### 2020 — 2021 | Samouk & Praktyka Projektowa | Szczecin (Projekty Własne & Open Source)
- Intensywna autodydaktyka od podstaw: algorytmy, struktury danych, vanilla JavaScript, React i wzorce projektowe.
- Ponad 1000+ commitów na GitHubie i wdrożenie 15+ kompletnych projektów od zera do chmury.

## CERTYFIKATY & KWALIFIKACJE
1. Meta Front-End Developer Professional (Meta Platforms / Coursera, 2024)
2. AWS Certified Cloud Practitioner (Amazon Web Services, 2023)
3. Autodydaktyka & Praktyka Inżynierska (2500+ godzin nauki, 2020–2024)

## KLAUZULA RODO
Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji (zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych oraz RODO).`;

    navigator.clipboard.writeText(markdownResume);
    setCopied(true);
    toast({
      title: isPl ? "CV skopiowane do schowka!" : "Resume copied to clipboard!",
      description: isPl
        ? "Wersja Markdown jest gotowa do wklejenia w systemach rekrutacyjnych."
        : "Markdown version is ready to paste into ATS tools.",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    hapticLight();
    const resumeData = {
      name: "Grzegorz",
      title: isPl ? "Mid Fullstack Developer (Samouk)" : "Mid Fullstack Developer (Self-Taught)",
      location: "Szczecin, Poland",
      contact: {
        email: "kontakt@gkdev.pl",
        website: "https://gkdev.pl",
        github: "https://github.com/catsy86",
      },
      skills: ["React 19", "Next.js 15", "TypeScript 5", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS", "Docker", "Vitest"],
      experiences: t.about.experiences,
      educations: t.about.educations,
    };

    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_Grzegorz_Mid_Fullstack_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-xl transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-4xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92dvh] pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]"
          >
            {/* Top Toolbar (Non-printable) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-secondary/30 print:hidden shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-['Geist'] text-sm font-bold text-foreground">
                  {isPl ? "Oficjalne CV • Grzegorz" : "Official Resume • Grzegorz"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                  NoFluffJobs Standard
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop(850, 0.03);
                    hapticLight();
                    setIsReceiptOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  title="Generuj Paragon Inżynierski"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Paragon Dev</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border bg-card/80 hover:bg-accent text-foreground text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  title="Kopiuj wersję Markdown"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? (isPl ? "Skopiowano" : "Copied") : "Markdown"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border bg-card/80 hover:bg-accent text-foreground text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  title="Pobierz w formacie JSON"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                  title="Drukuj lub zapisz jako PDF (Ctrl+P)"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isPl ? "Drukuj / PDF" : "Print / PDF"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Resume Sheet */}
            <div className="p-6 sm:p-10 overflow-y-auto font-['Geist'] text-foreground space-y-8 bg-card print:p-0 print:overflow-visible">
              {/* Header Profile Section */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-border/70">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    Grzegorz
                  </h1>
                  <p className="text-base sm:text-lg font-bold text-primary mt-1 font-mono">
                    {t.about.bioRole}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
                    {t.about.bioDesc}
                  </p>
                </div>

                {/* Contact Badges */}
                <div className="space-y-2 text-xs font-mono text-muted-foreground shrink-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>Szczecin, Polska (Remote / Hybrid)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <a href="mailto:kontakt@gkdev.pl" className="hover:text-primary transition-colors">
                      kontakt@gkdev.pl
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    <a href="https://gkdev.pl" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                      https://gkdev.pl
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5 text-primary" />
                    <a href="https://github.com/catsy86" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                      github.com/catsy86
                    </a>
                  </div>
                </div>
              </div>

              {/* Core Competencies Bento Matrix */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground font-['Geist'] uppercase tracking-wider">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>{isPl ? "Kluczowe Kompetencje & Stack NoFluffJobs" : "Core Tech Stack & Competencies"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl border border-border/70 bg-secondary/30 space-y-1">
                    <span className="font-bold text-primary font-mono block">Frontend Core</span>
                    <p className="text-muted-foreground">React 19, Next.js 15, TypeScript 5, Tailwind CSS, Motion, Zustand, HTML5 Semantic, a11y</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-border/70 bg-secondary/30 space-y-1">
                    <span className="font-bold text-primary font-mono block">Backend & Cloud</span>
                    <p className="text-muted-foreground">Node.js, Express, NestJS, PostgreSQL, Prisma, Redis, AWS (S3, Lambda), Docker, Vercel, Supabase</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-border/70 bg-secondary/30 space-y-1">
                    <span className="font-bold text-primary font-mono block">Jakość & Metodyki</span>
                    <p className="text-muted-foreground">Clean Code, Testy Vitest / TDD, Playwright E2E, 100/100 Core Web Vitals, GitFlow, CI/CD</p>
                  </div>
                </div>
              </div>

              {/* Commercial Experience Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground font-['Geist'] uppercase tracking-wider">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>{t.about.experienceTab}</span>
                </div>
                <div className="space-y-4">
                  {t.about.experiences.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-secondary/20 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{exp.title}</h3>
                          <span className="text-xs text-muted-foreground font-semibold">{exp.company}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                          {exp.year}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Self-Taught Track */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground font-['Geist'] uppercase tracking-wider">
                  <Award className="h-4 w-4 text-primary" />
                  <span>{t.about.educationTab}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {t.about.educations.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-secondary/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-primary">{edu.year}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">{edu.company}</span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground">{edu.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* GDPR / RODO Clause */}
              <div className="pt-6 border-t border-border/60 text-[10px] text-muted-foreground/80 leading-relaxed font-['Geist']">
                <p>
                  {isPl
                    ? "Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji (zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO))."
                    : "I hereby give consent for my personal data to be processed for the purpose of conducting recruitment processes in accordance with the General Data Protection Regulation (EU 2016/679 - GDPR)."}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-secondary/30 print:hidden shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isPl ? "Dostępny do nowych wyzwań" : "Available for new projects"}</span>
              </div>

              <div className="flex items-center gap-3">
                <GlowButton variant="glow" size="sm" onClick={handlePrint} icon={<Printer className="h-3.5 w-3.5" />}>
                  {isPl ? "Zapisz jako PDF" : "Save as PDF"}
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Dev Receipt Modal */}
      {isReceiptOpen && (
        <DevReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </AnimatePresence>
  );
};

export default InteractiveResumeModal;
