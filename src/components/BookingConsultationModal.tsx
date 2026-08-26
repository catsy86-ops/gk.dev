import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  User,
  Mail,
  FileText,
} from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { triggerConfetti } from "@/lib/confetti";
import { clientStore } from "@/lib/client-store";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@clerk/clerk-react";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface BookingConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = ["09:30", "11:00", "13:30", "15:00", "16:30"];

const consultationTopics = [
  { id: "saas-architecture", title: "Architektura SaaS & Skalowalność", desc: "Przegląd stacku, Next.js 15 SSR, bazy danych, chmura" },
  { id: "web-vitals-audit", title: "Audyt Wydajności & Architektury", desc: "Optymalizacja czasu odpowiedzi poniżej 50ms, budżet JS" },
  { id: "ai-llm-integration", title: "Wdrożenie AI & Vector Database", desc: "Integracja modeli LLM, pgvector, agenci AI" },
  { id: "code-review", title: "Code Review & Refaktoryzacja", desc: "Weryfikacja Clean Code, testy automatyczne, CI/CD" },
];

export const BookingConsultationModal = ({
  isOpen,
  onClose,
}: BookingConsultationModalProps) => {
  useScrollLock(isOpen);
  const { lang } = useI18n();
  const { user, isSignedIn } = useUser();

  const [selectedTopic, setSelectedTopic] = useState(consultationTopics[0].id);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[1]);
  const [selectedDayOffset, setSelectedDayOffset] = useState(1);
  const [name, setName] = useState(isSignedIn && user?.fullName ? user.fullName : "");
  const [email, setEmail] = useState(
    isSignedIn && user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress
      : ""
  );
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Generate next available 4 business days
  const availableDays = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      offset: i + 1,
      dayName: d.toLocaleDateString("pl-PL", { weekday: "short" }),
      dateFormatted: d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
      fullDate: d.toLocaleDateString("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit" }),
    };
  });

  const currentDay = availableDays.find((d) => d.offset === selectedDayOffset) || availableDays[0];
  const currentTopicObj = consultationTopics.find((t) => t.id === selectedTopic) || consultationTopics[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Wypełnij dane kontaktowe",
        description: "Podaj swoje imię oraz adres e-mail.",
        variant: "destructive",
      });
      return;
    }

    clientStore.saveBooking({
      date: currentDay.fullDate,
      timeSlot: selectedSlot,
      topic: currentTopicObj.title,
      name,
      email,
    });

    setIsSuccess(true);
    soundEngine.playChime();
    hapticSuccess();
    triggerConfetti();

    toast({
      title: "Konsultacja zarezerwowana!",
      description: `Spotkanie: ${currentDay.fullDate} o ${selectedSlot}. Zaproszenie wysłane na ${email}.`,
    });
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
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

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] my-0 sm:my-6 pointer-events-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Rezerwacja Konsultacji 1:1"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/60 bg-secondary/40 relative z-20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-['Geist'] font-bold text-foreground text-base sm:text-lg">
                    Rezerwacja Konsultacji Architektonicznej 1:1
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    30 minutowa bezpłatna analiza techniczna (Google Meet / Zoom)
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

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 font-['Geist'] scrollbar-thin">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-lg shadow-emerald-500/20 mb-2">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Termin zarezerwowany!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Dziękuję za rezerwację. Szczegóły spotkania oraz link do wideorozmowy zostały
                    przygotowane na dzień <strong className="text-foreground">{currentDay.fullDate} o {selectedSlot}</strong>.
                  </p>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Gotowe
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Topic Selection */}
                  <div>
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                      1. Wybierz obszar konsultacji
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {consultationTopics.map((topic) => {
                        const isSelected = selectedTopic === topic.id;
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playPop(800, 0.02);
                              setSelectedTopic(topic.id);
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? "bg-primary/10 border-primary shadow-sm"
                                : "bg-secondary/60 border-border/60 hover:border-border"
                            }`}
                          >
                            <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {topic.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{topic.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Day Picker */}
                  <div>
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                      2. Wybierz dzień
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableDays.map((day) => {
                        const isSelected = selectedDayOffset === day.offset;
                        return (
                          <button
                            key={day.offset}
                            type="button"
                            onClick={() => {
                              soundEngine.playPop(800, 0.02);
                              setSelectedDayOffset(day.offset);
                            }}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                : "bg-secondary/60 border-border/60 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="block text-[11px] uppercase font-bold opacity-80">
                              {day.dayName}
                            </span>
                            <span className="block text-sm font-black mt-0.5">{day.dateFormatted}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slot Picker */}
                  <div>
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase block mb-2">
                      3. Godzina spotkania (Strefa CET)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              soundEngine.playPop(850, 0.02);
                              setSelectedSlot(slot);
                            }}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-secondary/60 border-border/60 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                    <div>
                      <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                        Imię i Nazwisko *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jan Kowalski"
                        className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                        Adres E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jan@firma.pl"
                        className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Potwierdź rezerwację terminu</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BookingConsultationModal;
