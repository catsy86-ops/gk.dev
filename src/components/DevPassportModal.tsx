import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Keyboard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Share2,
} from "lucide-react";
import { useAchievements } from "@/hooks/use-achievements";
import { soundEngine, type SoundProfile } from "@/lib/audio";
import { hapticMedium, hapticLight } from "@/lib/haptics";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { toast } from "@/hooks/use-toast";

interface DevPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevPassportModal = ({ isOpen, onClose }: DevPassportModalProps) => {
  const { achievements, totalXp, unlockedCount, totalCount, rank } = useAchievements();
  const modalRef = useRef<HTMLDivElement>(null);
  useScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const currentSoundProfile = soundEngine.getProfile();
  const isMuted = soundEngine.getIsMuted();

  const handleProfileSelect = (p: SoundProfile) => {
    soundEngine.setProfile(p);
    hapticMedium();
    toast({
      title: "Zmieniono profil dźwiękowy",
      description: `Aktywny styl: ${p.toUpperCase()}`,
    });
  };

  const handleSharePassport = () => {
    soundEngine.playClick();
    hapticMedium();
    const text = `🏆 Mój Paszport Dewelopera GK.dev: Ranga ${rank.title} (${totalXp} XP, ${unlockedCount}/${totalCount} odznak)! Sprawdź na: ${window.location.origin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast({
        title: "Skopiowano do schowka!",
        description: "Możesz podzielić się swoim wynikiem w mediach społecznościowych.",
      });
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border border-primary/30 bg-card/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl shadow-primary/20 text-foreground pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))]"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-primary to-indigo-600 text-white shadow-lg shadow-amber-500/20 shrink-0">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-foreground">
                    Paszport Dewelopera & Osiągnięcia
                  </h3>
                  <span className="font-mono text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                    DEV XP
                  </span>
                </div>
                <p className="font-['Geist'] text-xs text-muted-foreground mt-0.5">
                  Zbieraj punkty doświadczenia eksplorując portfolio, terminal CLI i kurs JS.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors shrink-0 cursor-pointer"
              aria-label="Zamknij paszport"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Level & XP Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground font-['Geist']">
                Aktualna Ranga
              </span>
              <p className={`font-['Plus_Jakarta_Sans'] text-base font-extrabold ${rank.color}`}>
                {rank.title}
              </p>
              <span className="inline-block text-[10px] font-mono font-bold bg-background/80 px-2 py-0.5 rounded-md border border-border/40">
                {rank.level}
              </span>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground font-['Geist']">
                Zdobyte Doświadczenie
              </span>
              <p className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-foreground">
                {totalXp} <span className="text-xs text-primary">XP</span>
              </p>
              <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalXp / 290) * 100)}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground font-['Geist']">
                Odblokowane Odznaki
              </span>
              <p className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-foreground">
                {unlockedCount} / {totalCount}
              </p>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">
                {Math.round((unlockedCount / totalCount) * 100)}% ukończenia
              </span>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3 mb-6">
            <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Twoje Odznaki ({unlockedCount}/{totalCount})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((ach) => {
                const isUnlocked = Boolean(ach.unlockedAt);
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      isUnlocked
                        ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                        : "border-border/40 bg-secondary/20 opacity-60"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        isUnlocked
                          ? "bg-emerald-500/20 shadow-md shadow-emerald-500/10"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ach.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-foreground truncate">
                          {ach.title}
                        </p>
                        <span className="font-mono text-[9px] font-bold text-primary shrink-0">
                          +{ach.xp} XP
                        </span>
                      </div>
                      <p className="font-['Geist'] text-[11px] text-muted-foreground truncate">
                        {ach.description}
                      </p>
                    </div>

                    {isUnlocked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sound Themes & Power Shortcuts Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 pt-5">
            {/* Sound Profiles */}
            <div className="space-y-2">
              <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-foreground flex items-center gap-1.5">
                {isMuted ? <VolumeX className="h-3.5 w-3.5 text-muted-foreground" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
                Profile Dźwiękowe UI
              </h5>
              <div className="grid grid-cols-3 gap-1.5">
                {(["minimal", "mechanical", "arcade"] as SoundProfile[]).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => handleProfileSelect(sp)}
                    className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold capitalize transition-all cursor-pointer border ${
                      currentSoundProfile === sp
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-secondary hover:bg-secondary/80 text-muted-foreground border-border/50"
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts Overview */}
            <div className="space-y-2">
              <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-foreground flex items-center gap-1.5">
                <Keyboard className="h-3.5 w-3.5 text-primary" />
                Skróty Power-User
              </h5>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-muted-foreground">
                <span><kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-bold">/</kbd> Szukaj</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-bold">T</kbd> Terminal</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-bold">P</kbd> Paszport</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-bold">E</kbd> Wycena</span>
              </div>
            </div>
          </div>

          {/* Share Action */}
          <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSharePassport}
              className="flex items-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 px-3.5 py-2 text-xs font-bold text-foreground transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Udostępnij mój paszport</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
