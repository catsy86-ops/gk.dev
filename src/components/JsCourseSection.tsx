import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { CanvasGridBackground } from "@/components/ui/canvas-grid-background";
import { jsCourseLessons, type CourseLesson } from "@/lib/js-course-data";
import {
  Code2,
  Zap,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Play,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Terminal,
  Share2,
  Lightbulb,
} from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/haptics";
import { triggerConfetti } from "@/lib/confetti";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useAchievements } from "@/hooks/use-achievements";
import { executeCodeInWorker } from "@/lib/code-runner";

const iconMap = {
  Code2,
  Zap,
  Layers,
  Cpu,
  ShieldCheck,
  Award,
};

export const JsCourseSection = () => {
  const { lang } = useI18n();
  const { unlock } = useAchievements();
  const [activeLessonId, setActiveLessonId] = useState<string>(jsCourseLessons[0].id);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gk_js_course_completed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<"lesson" | "sandbox">("lesson");
  const [editableCode, setEditableCode] = useState<string>(() => jsCourseLessons[0].codeSnippet);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const currentLesson: CourseLesson = useMemo(() => {
    return jsCourseLessons.find((l) => l.id === activeLessonId) || jsCourseLessons[0];
  }, [activeLessonId]);

  const CurrentIcon = iconMap[currentLesson.iconName] || Code2;
  const progressPercent = Math.round((completedLessons.length / jsCourseLessons.length) * 100);
  const isCourseComplete = completedLessons.length === jsCourseLessons.length;

  useEffect(() => {
    // Reset state on lesson change
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setConsoleOutput(null);
    setIsCopied(false);
    setEditableCode(currentLesson.codeSnippet);
  }, [activeLessonId, currentLesson.codeSnippet]);

  const handleLessonSelect = (id: string) => {
    soundEngine.playPop(750, 0.02);
    hapticLight();
    setActiveLessonId(id);
  };

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(editableCode);
    }
    soundEngine.playPop(850, 0.03);
    hapticLight();
    setIsCopied(true);
    toast({
      title: lang === "pl" ? "Skopiowano kod" : "Code copied",
      description: lang === "pl" ? "Kod z edytora jest gotowy do wklejenia." : "Editor code copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareCode = async () => {
    soundEngine.playPop(850, 0.03);
    hapticLight();
    const encoded = encodeURIComponent(editableCode);
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encoded}#kurs-js`;
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: lang === "pl" ? "Skopiowano link do kodu!" : "Code link copied!",
        description: lang === "pl" ? "Możesz przesłać ten link znajomemu lub rekruterowi." : "Share this URL with your custom code snippet.",
      });
    }
  };

  const codeChallenges = [
    {
      title: "Wyzwanie 1: Formatowanie Waluty (PLN)",
      snippet: `// Zadanie: Sformatuj liczbę jako kwotę w PLN (np. 1250.5 -> "1 250,50 zł")\nfunction formatPLN(amount) {\n  return new Intl.NumberFormat('pl-PL', {\n    style: 'currency',\n    currency: 'PLN'\n  }).format(amount);\n}\n\nconsole.log(formatPLN(14999.99));\nconsole.log(formatPLN(420));`,
    },
    {
      title: "Wyzwanie 2: Funkcja Debounce (TS/JS)",
      snippet: `// Zadanie: Implementacja opóźnienia wykonania (Debounce)\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst logMsg = debounce((msg) => console.log('Wywołano:', msg), 100);\nlogMsg('Test 1');\nlogMsg('Test 2 (Ostateczny)');`,
    },
  ];

  const handleRunCode = async () => {
    soundEngine.playChime();
    hapticMedium();
    setIsRunning(true);
    setConsoleOutput(lang === "pl" ? "⚙️ Uruchamianie kodu w izolowanym Web Workerze..." : "⚙️ Executing in isolated Web Worker...");

    try {
      const result = await executeCodeInWorker(editableCode);
      setConsoleOutput(result.output);
    } catch (err) {
      setConsoleOutput(`❌ Błąd: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    soundEngine.playPop(700, 0.02);
    hapticLight();
    setEditableCode(currentLesson.codeSnippet);
    setConsoleOutput(null);
  };

  const handleQuizOptionClick = (index: number) => {
    if (quizSubmitted) return;
    soundEngine.playPop(800, 0.02);
    hapticLight();
    setSelectedQuizAnswer(index);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);

    if (selectedQuizAnswer === currentLesson.quiz.correctIndex) {
      soundEngine.playChime();
      hapticSuccess();
      unlock("js_master");

      // Add to completed lessons if not already added
      if (!completedLessons.includes(currentLesson.id)) {
        const nextCompleted = [...completedLessons, currentLesson.id];
        setCompletedLessons(nextCompleted);
        try {
          localStorage.setItem("gk_js_course_completed", JSON.stringify(nextCompleted));
        } catch {
          // ignore
        }

        if (nextCompleted.length === jsCourseLessons.length) {
          triggerConfetti();
          toast({
            title: lang === "pl" ? "🎉 Gratulacje! Ukończono cały kurs!" : "🎉 Congratulations! Course completed!",
            description: lang === "pl" ? "Odblokowano certyfikat JavaScript Modern Master." : "Unlocked JavaScript Modern Master certificate.",
          });
        }
      }
    } else {
      soundEngine.playPop(400, 0.04);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = jsCourseLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < jsCourseLessons.length - 1) {
      handleLessonSelect(jsCourseLessons[currentIndex + 1].id);
    }
  };

  const handleResetCourse = () => {
    soundEngine.playPop(500, 0.03);
    setCompletedLessons([]);
    try {
      localStorage.removeItem("gk_js_course_completed");
    } catch {
      // ignore
    }
    toast({
      title: lang === "pl" ? "Zresetowano postęp kursu" : "Course progress reset",
      description: lang === "pl" ? "Możesz przejść moduły od nowa." : "You can start the course fresh.",
    });
  };

  return (
    <SectionWrapper id="kurs-js" label="Darmowy Kurs JavaScript" className="relative overflow-hidden bg-background">
      <CanvasGridBackground />

      <div className="relative z-10 mx-auto max-w-[1240px] px-2 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary font-['Geist'] mb-4 uppercase tracking-widest shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>{lang === "pl" ? "Darmowy Crash Course • Open Knowledge" : "Free Crash Course • Open Knowledge"}</span>
          </div>

          <h2 className="font-['Geist'] font-black tracking-tight text-foreground text-3xl md:text-5xl mb-4">
            {lang === "pl" ? "Nowoczesny" : "Modern"}{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              JavaScript (ES6+)
            </span>
          </h2>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground font-['Geist'] max-w-2xl mx-auto leading-relaxed">
            {lang === "pl"
              ? "Interaktywny, zwięzły kurs oparty na oficjalnych standardach MDN Web Docs i JavaScript.info. Praktyka, architektura kodu, quizy i natychmiastowa wiedza — bez zbędnego lania wody."
              : "An interactive, practical crash course based on MDN Web Docs & JavaScript.info standards. Code patterns, quizzes, and modern best practices."}
          </p>

          {/* Progress Tracker Card */}
          <div className="mt-6 max-w-xl mx-auto rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-['Geist'] text-xs sm:text-sm font-bold text-foreground">
                  {lang === "pl" ? "Twój postęp w nauce:" : "Your learning progress:"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-primary">
                  {completedLessons.length} / {jsCourseLessons.length} ({progressPercent}%)
                </span>
                {completedLessons.length > 0 && (
                  <button
                    onClick={handleResetCourse}
                    title={lang === "pl" ? "Resetuj postęp" : "Reset progress"}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary text-xs"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Modules Navigation Bar / Pills */}
        <div className="mb-8 flex items-center gap-2.5 overflow-x-auto pb-3 snap-x scrollbar-none">
          {jsCourseLessons.map((lesson, idx) => {
            const isSelected = lesson.id === activeLessonId;
            const isCompleted = completedLessons.includes(lesson.id);
            const LessonIcon = iconMap[lesson.iconName] || Code2;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleLessonSelect(lesson.id)}
                className={`relative group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all shrink-0 cursor-pointer snap-center text-left ${
                  isSelected
                    ? "border-primary/60 bg-card/95 shadow-md shadow-primary/10"
                    : "border-border/70 bg-card/60 hover:bg-card/90 hover:border-primary/30"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-course-pill"
                    className="absolute inset-0 rounded-2xl border-2 border-primary/60 bg-primary/[0.04] pointer-events-none"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
                      : isSelected
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "bg-secondary/70 border-border/80 text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <LessonIcon className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold">
                      Moduł 0{idx + 1}
                    </span>
                    <span className="font-mono text-[10px] text-primary/80 bg-primary/10 px-1.5 py-0.2 rounded">
                      {lesson.duration}
                    </span>
                  </div>
                  <p className="font-['Geist'] text-xs font-bold text-foreground line-clamp-1 max-w-[170px] sm:max-w-[200px]">
                    {lesson.moduleName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile / Tablet Segmented View Switcher (visible on <lg) */}
        <div className="flex lg:hidden items-center justify-center mb-6">
          <div className="inline-flex p-1 rounded-2xl bg-secondary/80 border border-border/80 shadow-sm">
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(700, 0.02);
                hapticLight();
                setMobileTab("lesson");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Geist'] transition-all cursor-pointer min-h-[40px] ${
                mobileTab === "lesson"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>{lang === "pl" ? "Lekcja & Quiz" : "Lesson & Quiz"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(700, 0.02);
                hapticLight();
                setMobileTab("sandbox");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Geist'] transition-all cursor-pointer min-h-[40px] ${
                mobileTab === "sandbox"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>{lang === "pl" ? "Konsola & Kod" : "Sandbox & Code"}</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Course View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Lesson Theory, Key Points & Interactive Quiz (7 cols) */}
          <div className={`lg:col-span-7 space-y-6 ${mobileTab === "lesson" ? "block" : "hidden lg:block"}`}>
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden"
            >
              {/* Header tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <CurrentIcon className="h-3.5 w-3.5" />
                    Moduł {currentLesson.module}: {currentLesson.moduleName}
                  </span>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-border bg-secondary/80 text-muted-foreground">
                    {currentLesson.level}
                  </span>
                </div>

                {/* Free source reference badge with clickable link */}
                <a
                  href={currentLesson.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors bg-secondary/60 hover:bg-secondary border border-border/80 px-3 py-1 rounded-full group"
                >
                  <span>{currentLesson.source.badge}</span>
                  <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Title */}
              <h3 className="font-['Geist'] text-xl sm:text-2xl font-black text-foreground tracking-tight mb-4">
                {currentLesson.title}
              </h3>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-['Geist'] mb-6 bg-secondary/40 border border-border/60 rounded-2xl p-4">
                {currentLesson.shortDesc}
              </p>

              {/* Theory Content */}
              <div className="space-y-3 mb-6">
                <h4 className="font-['Geist'] text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  {lang === "pl" ? "Zagadnienia Teoretyczne & Standardy" : "Theory & Architectural Standards"}
                </h4>
                {currentLesson.theory.map((paragraph, i) => (
                  <p key={i} className="font-['Geist'] text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Architecture Points */}
              <div className="mb-8 space-y-2.5">
                <h4 className="font-['Geist'] text-xs uppercase tracking-wider font-bold text-primary">
                  {lang === "pl" ? "Kluczowe Zasady Dobrego Kodu" : "Key Principles & Best Practices"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentLesson.keyPoints.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-border/60 bg-secondary/40 text-xs text-foreground font-['Geist']"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Self-Check Quiz */}
              <div className="border-t border-border/70 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  <h4 className="font-['Geist'] text-sm sm:text-base font-bold text-foreground">
                    {lang === "pl" ? "Interaktywny Test Wiedzy Modułu" : "Module Self-Check Quiz"}
                  </h4>
                </div>

                <p className="font-['Geist'] text-xs sm:text-sm text-muted-foreground mb-4 font-medium">
                  {currentLesson.quiz.question}
                </p>

                <div className="space-y-2 mb-4">
                  {currentLesson.quiz.options.map((option, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = idx === currentLesson.quiz.correctIndex;
                    let styleClasses = "border-border/70 bg-card/60 text-muted-foreground hover:bg-card/90 hover:text-foreground";

                    if (quizSubmitted) {
                      if (isCorrect) {
                        styleClasses = "border-emerald-500/60 bg-emerald-500/15 text-emerald-500 font-bold shadow-sm";
                      } else if (isSelected && !isCorrect) {
                        styleClasses = "border-red-500/60 bg-red-500/15 text-red-500 font-medium";
                      }
                    } else if (isSelected) {
                      styleClasses = "border-primary bg-primary/15 text-primary font-bold shadow-sm";
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuizOptionClick(idx)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-['Geist'] transition-all flex items-start gap-3 cursor-pointer ${styleClasses}`}
                      >
                        <span className="font-mono text-xs opacity-70 mt-0.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {quizSubmitted && isCorrect && (
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quiz Action / Feedback */}
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleQuizSubmit}
                    disabled={selectedQuizAnswer === null}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold font-['Geist'] transition-all cursor-pointer ${
                      selectedQuizAnswer !== null
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95"
                        : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span>{lang === "pl" ? "Sprawdź odpowiedź" : "Check Answer"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed font-['Geist'] ${
                      selectedQuizAnswer === currentLesson.quiz.correctIndex
                        ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                        : "bg-red-500/10 border-red-500/30 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {selectedQuizAnswer === currentLesson.quiz.correctIndex ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-500">
                            {lang === "pl" ? "Świetnie! Poprawna odpowiedź." : "Excellent! Correct answer."}
                          </span>
                        </>
                      ) : (
                        <span className="text-red-500">
                          {lang === "pl" ? "Niestety nie, oto wyjaśnienie:" : "Not quite, here is the explanation:"}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{currentLesson.quiz.explanation}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedQuizAnswer(null);
                        }}
                        className="text-[11px] font-bold text-muted-foreground hover:text-foreground underline cursor-pointer"
                      >
                        {lang === "pl" ? "Spróbuj ponownie" : "Try again"}
                      </button>

                      {currentLesson.module < jsCourseLessons.length && (
                        <button
                          type="button"
                          onClick={handleNextLesson}
                          className="inline-flex items-center gap-1.5 font-bold text-xs text-primary hover:underline cursor-pointer ml-auto"
                        >
                          <span>{lang === "pl" ? "Przejdź do następnego modułu" : "Next Module"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Code Sandbox & Certificate (5 cols) */}
          <div className={`lg:col-span-5 space-y-6 ${mobileTab === "sandbox" ? "block" : "hidden lg:block"}`}>
            {/* Code Sandbox Window */}
            <div className="rounded-3xl border border-border/80 bg-[#0d1117] text-slate-200 shadow-2xl overflow-hidden font-mono">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/30">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs text-muted-foreground font-sans font-medium">
                    {currentLesson.id}.js
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareCode}
                    title="Udostępnij link do swojego kodu"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-border/50 bg-secondary/40 hover:bg-secondary text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Share2 className="h-3 w-3 text-cyan-400" />
                    <span className="hidden sm:inline">Udostępnij</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCode}
                    title="Przywróć kod lekcji"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-border/50 bg-secondary/40 hover:bg-secondary text-slate-300 hover:text-white transition-all cursor-pointer"
                    aria-label="Przywróć kod początkowy"
                  >
                    <RefreshCw className="h-3 w-3 text-muted-foreground" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="Kopiuj kod"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-border/50 bg-secondary/40 hover:bg-secondary text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{isCopied ? "Skopiowano" : "Kopiuj"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`h-3 w-3 fill-current ${isRunning ? "animate-spin" : ""}`} />
                    <span>{isRunning ? "Wykonywanie..." : "Uruchom"}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Live Code Editor Textarea */}
              <div className="relative p-3 sm:p-4 bg-[#0d1117] space-y-2">
                {/* Algorithmic Challenge Selector Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-[10px]">
                  <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                    <Lightbulb className="h-3 w-3 text-amber-400" />
                    Wyzwania:
                  </span>
                  {codeChallenges.map((ch, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundEngine.playPop(800, 0.03);
                        hapticLight();
                        setEditableCode(ch.snippet);
                        toast({
                          title: ch.title,
                          description: "Załadowano kod zadania algorytmicznego.",
                        });
                      }}
                      className="px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold shrink-0 cursor-pointer transition-colors"
                    >
                      {ch.title.split(":")[0]}
                    </button>
                  ))}
                </div>

                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="w-full h-[240px] sm:h-[280px] bg-transparent text-xs leading-relaxed text-emerald-300/90 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-xl p-2.5 border border-border/30 scrollbar-thin selection:bg-primary/30"
                  spellCheck={false}
                  aria-label="Edytor kodu JavaScript"
                  placeholder="// Wpisz lub edytuj kod JavaScript..."
                />
              </div>

              {/* Console Output Terminal */}
              <AnimatePresence>
                {consoleOutput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border/40 bg-black/70 p-4 font-mono text-[11px] text-emerald-400"
                  >
                    <div className="flex items-center justify-between text-muted-foreground mb-1.5 text-[10px] uppercase font-bold">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="h-3 w-3" />
                        <span>Virtual Console Sandbox</span>
                      </div>
                      <button
                        onClick={() => setConsoleOutput(null)}
                        className="hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed">{consoleOutput}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Certificate of Completion Card */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/85 to-accent-blue/10 backdrop-blur-2xl p-6 sm:p-7 shadow-xl text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto shadow-md shadow-primary/20">
                <Award className="h-6 w-6" />
              </div>

              <div>
                <h4 className="font-['Geist'] text-base sm:text-lg font-bold text-foreground">
                  {lang === "pl" ? "Certyfikat JS Modern Master" : "JS Modern Master Certificate"}
                </h4>
                <p className="text-xs text-muted-foreground font-['Geist'] mt-1">
                  {lang === "pl"
                    ? "Zalicz wszystkie 5 modułów i interaktywne quizy, aby odblokować oficjalny certyfikat znajomości nowoczesnego JavaScriptu."
                    : "Complete all 5 modules and quizzes to unlock your modern JavaScript certificate."}
                </p>
              </div>

              {isCourseComplete ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{lang === "pl" ? "Kurs w 100% ukończony!" : "Course 100% Completed!"}</span>
                  </div>

                  <input
                    type="text"
                    placeholder={lang === "pl" ? "Wpisz swoje Imię i Nazwisko..." : "Enter your name..."}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-center px-3 py-2 rounded-xl border border-border/80 bg-background text-xs font-['Geist'] text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      triggerConfetti();
                      toast({
                        title: lang === "pl" ? "🎉 Certyfikat wygenerowany!" : "🎉 Certificate Generated!",
                        description: lang === "pl"
                          ? `Gratulacje dla ${userName || "Programisty"} za ukończenie kursu JS!`
                          : `Congrats to ${userName || "Developer"} for finishing the JS course!`,
                      });
                    }}
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    {lang === "pl" ? "Odbierz Certyfikat" : "Claim Certificate"}
                  </button>
                </motion.div>
              ) : (
                <div className="text-xs font-mono text-muted-foreground bg-secondary/50 rounded-xl p-3 border border-border/60">
                  {lang === "pl"
                    ? `Pozostało modułów do ukończenia: ${jsCourseLessons.length - completedLessons.length}`
                    : `Modules remaining: ${jsCourseLessons.length - completedLessons.length}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default JsCourseSection;
