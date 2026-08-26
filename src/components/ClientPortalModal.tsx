import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Bookmark,
  FileCode,
  Calendar,
  X,
  Sparkles,
  Download,
  Trash2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useClientStore } from "@/hooks/use-client-store";
import { articlesData, type Article } from "@/lib/articles";
import { ArticleReaderModal } from "@/components/ArticleReaderModal";
import { GoogleIcon } from "@/components/auth/AuthModal";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess, hapticMedium } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { isSupabaseConfigured } from "@/lib/supabase";

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export const ClientPortalModal = ({
  isOpen,
  onClose,
  onOpenBooking,
}: ClientPortalModalProps) => {
  useScrollLock(isOpen);
  const { user, isSignedIn } = useUser();
  const { bookmarks, briefs, bookings, toggleBookmark, removeBrief, removeBooking } = useClientStore();

  const [activeTab, setActiveTab] = useState<"bookmarks" | "briefs" | "bookings">("bookmarks");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const bookmarkedArticles = articlesData.filter((a) => bookmarks.includes(a.id));

  const handleDownloadBrief = (briefContent: string, briefId: string) => {
    soundEngine.playPop(850, 0.02);
    hapticSuccess();
    const element = document.createElement("a");
    const file = new Blob([briefContent], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `brief-zapisany-${briefId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: "Pobrano brief", description: "Plik zapisano na dysku." });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
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
            className="relative w-full max-w-3xl rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-0 sm:my-6 font-['Geist'] pointer-events-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Strefa Klienta & Panel Użytkownika"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/60 bg-secondary/40 relative z-20">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h2 className="font-bold text-foreground text-base sm:text-lg">
                      Strefa Klienta & Panel Inżynierski
                    </h2>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                      {isSignedIn ? "Autoryzowany" : "Sesja Lokalna"}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                      {isSupabaseConfigured ? "Supabase Cloud" : "DB Sync"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {isSignedIn && user?.fullName ? `Zalogowano jako: ${user.fullName}` : "Zarządzaj zakładkami i zapisanymi projektami"}
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-border/60 bg-secondary/20 overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(800, 0.02);
                  setActiveTab("bookmarks");
                }}
                className={`flex items-center gap-2 pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "bookmarks"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Zakładki wiedzy ({bookmarkedArticles.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(800, 0.02);
                  setActiveTab("briefs");
                }}
                className={`flex items-center gap-2 pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "briefs"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Historia Briefów ({briefs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(800, 0.02);
                  setActiveTab("bookings");
                }}
                className={`flex items-center gap-2 pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "bookings"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Konsultacje ({bookings.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {/* Unauthenticated Cloud Sync Callout Banner */}
              {!isSignedIn && (
                <div className="p-4 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-background to-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-xs sm:text-sm">
                        Zaloguj się, aby zsynchronizować dane w chmurze
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Dostęp do briefów, historii i rezerwacji na dowolnym urządzeniu
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(850, 0.025);
                      hapticMedium();
                      openSignIn({});
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border/80 bg-background hover:bg-secondary text-foreground text-xs font-bold shadow-sm transition-all hover:border-primary/40 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <GoogleIcon className="h-4 w-4" />
                    <span>Zaloguj z Google</span>
                  </button>
                </div>
              )}

              {/* 1. Bookmarks Tab */}
              {activeTab === "bookmarks" && (
                <div className="space-y-3">
                  {bookmarkedArticles.length > 0 ? (
                    bookmarkedArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-secondary/40 hover:bg-secondary/70 transition-all gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                              {article.category}
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">{article.readTime}</span>
                          </div>
                          <h4 className="font-bold text-foreground text-sm truncate">{article.title}</h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playPop(850, 0.02);
                              setSelectedArticle(article);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-all"
                          >
                            <span>Czytaj</span>
                            <BookOpen className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              toggleBookmark(article.id);
                              toast({ title: "Usunięto zakładkę", description: article.title });
                            }}
                            className="p-1.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-destructive transition-colors"
                            title="Usuń z zakładek"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <Bookmark className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-bold text-foreground text-sm">Brak zapisanych zakładek</p>
                      <p className="text-xs text-muted-foreground">
                        Kliknij ikonę zakładki w sekcji Bazy Wiedzy, aby zapisać artykuły na później.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Briefs Tab */}
              {activeTab === "briefs" && (
                <div className="space-y-3">
                  {briefs.length > 0 ? (
                    briefs.map((brief) => (
                      <div
                        key={brief.id}
                        className="p-4 rounded-2xl border border-border/80 bg-secondary/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm">{brief.projectType}</span>
                            <span className="text-[11px] font-mono text-muted-foreground">({brief.date})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDownloadBrief(brief.content, brief.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-xs font-bold text-foreground hover:border-primary/40"
                            >
                              <Download className="h-3 w-3" />
                              <span>Pobierz</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                removeBrief(brief.id);
                              }}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground line-clamp-2">
                          Horyzont: {brief.timeline}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <FileCode className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-bold text-foreground text-sm">Brak zapisanych briefów</p>
                      <p className="text-xs text-muted-foreground">
                        Wygeneruj brief w formularzu kontaktowym, aby zachować go w historii.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Bookings Tab */}
              {activeTab === "bookings" && (
                <div className="space-y-3">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-secondary/40"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm">{booking.topic}</span>
                            <span className="rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                              Potwierdzone
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Termin: <strong className="text-foreground">{booking.date} o {booking.timeSlot}</strong>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            removeBooking(booking.id);
                          }}
                          className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-bold text-foreground text-sm">Brak aktywnych rezerwacji</p>
                      {onOpenBooking && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenBooking();
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:scale-105 transition-all"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Umów 30-minutową konsultację</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Reader Modal nested if opened */}
      <ArticleReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>,
    document.body
  );
};

export default ClientPortalModal;
