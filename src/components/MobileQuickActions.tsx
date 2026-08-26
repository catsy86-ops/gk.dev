import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2,
  Phone,
  Mail,
  Download,
  X,
  Terminal,
  User,
  Trophy,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { GoogleIcon, AuthModal } from "@/components/auth/AuthModal";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess, hapticMedium } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useAchievements } from "@/hooks/use-achievements";
import { ThemeAccentPicker } from "@/components/ThemeAccentPicker";
import { LanguageToggle } from "@/components/LanguageToggle";

interface MobileQuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal?: () => void;
  onOpenPassport?: () => void;
}

export const MobileQuickActions = ({
  isOpen,
  onClose,
  onOpenTerminal,
  onOpenPassport,
}: MobileQuickActionsProps) => {
  useScrollLock(isOpen);
  const { isSignedIn, user } = useUser();
  const { resolvedTheme, setTheme } = useTheme();
  const { totalXp, rank, unlockedCount, totalCount } = useAchievements();
  const [copied, setCopied] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(true);

  useEffect(() => {
    setIsSoundMuted(soundEngine.getIsMuted());
  }, []);

  const toggleSound = useCallback(() => {
    const isNowActive = soundEngine.toggleMute();
    setIsSoundMuted(!isNowActive);
    hapticLight();
  }, []);

  const toggleTheme = useCallback(() => {
    soundEngine.playPop(700, 0.05);
    hapticLight();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleShare = async () => {
    soundEngine.playPop(750, 0.03);
    hapticLight();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "GK.dev — Senior Fullstack Developer",
          text: "Sprawdź portfolio Grzegorza — nowoczesne aplikacje webowe & mobile, React 19, TypeScript, Cloud.",
          url: window.location.href,
        });
      } catch {
        // user cancelled or share failed
      }
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({ title: "Link skopiowany!", description: "Adres portfolio jest w Twoim schowku." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    soundEngine.playClick();
    hapticSuccess();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText("+48500000000");
    }
    toast({ title: "Numer skopiowany", description: "+48 500 000 000 w schowku." });
  };

  if (typeof document === "undefined") return null;

  const xpProgress = Math.min(100, Math.round((totalXp / 300) * 100));

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999999] flex items-end justify-center p-0 md:hidden overflow-hidden pointer-events-auto">
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

            {/* Quick Action Sheet with Swipe-to-Dismiss */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.75 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 75 || info.velocity.y > 350) {
                  soundEngine.playClick();
                  hapticLight();
                  onClose();
                }
              }}
              className="relative w-full rounded-t-[32px] border-t border-border/80 bg-card/95 backdrop-blur-2xl p-5 sm:p-6 pb-[max(2.5rem,env(safe-area-inset-bottom,2.5rem))] shadow-2xl z-10 space-y-3.5 pointer-events-auto touch-none max-h-[90vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Szybkie akcje mobilne"
            >
              {/* Top drag handle pill */}
              <div className="w-full flex justify-center pb-1 cursor-grab active:cursor-grabbing">
                <div className="h-1.5 w-14 rounded-full bg-muted-foreground/40 hover:bg-primary transition-colors" />
              </div>

              {/* Header with Quick Preference Switches */}
              <div className="flex items-center justify-between relative z-20">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-['Geist'] text-base font-bold text-foreground">
                    Centrum Narzędzi & Akcji
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  {/* Preferences Capsule (Theme, Sound, Accent, Lang) */}
                  <div className="flex items-center gap-0.5 rounded-full border border-border/60 bg-secondary/70 p-0.5 shadow-xs">
                    {/* Sound Switch */}
                    <button
                      type="button"
                      onClick={toggleSound}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      aria-label="Dźwięki"
                    >
                      {isSoundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
                    </button>

                    {/* Theme Switch */}
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      aria-label="Motyw"
                    >
                      {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    </button>

                    {/* Accent Switch */}
                    <ThemeAccentPicker variant="ghost" />

                    {/* Language Switch */}
                    <LanguageToggle variant="ghost" />
                  </div>

                  {/* Close Sheet Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      soundEngine.playClick();
                      onClose();
                    }}
                    className="h-8 w-8 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
                    aria-label="Zamknij"
                    title="Zamknij"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dev Passport & XP Card Banner */}
              {onOpenPassport && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop(850, 0.03);
                    hapticMedium();
                    onClose();
                    onOpenPassport();
                  }}
                  className="w-full p-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-background to-amber-500/5 hover:bg-amber-500/20 text-left transition-all cursor-pointer shadow-sm group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-foreground">Paszport Dewelopera</p>
                          <span className="font-mono text-[9px] font-bold text-amber-500 px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40">
                            {rank.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{rank.title} • {unlockedCount}/{totalCount} odznak</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-500">
                      {totalXp} XP
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-secondary/80 rounded-full h-1.5 overflow-hidden border border-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500 rounded-full"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </button>
              )}

              {/* Terminal CLI Mobile Banner */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(850, 0.03);
                  hapticMedium();
                  onClose();
                  if (onOpenTerminal) {
                    onOpenTerminal();
                  }
                }}
                className="w-full p-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 flex items-center justify-between gap-3 text-emerald-500 font-['Geist'] transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8.5 w-8.5 rounded-xl bg-black/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-foreground">Terminal Deweloperski (CLI)</p>
                    <p className="text-[10px] font-mono text-emerald-400">Graj w Snake, Matrix, polecenia CLI</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40">
                  Otwórz ~
                </span>
              </button>

              {/* Google Authentication & Client Portal Banner */}
              <div className="p-3 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-background to-primary/10 flex items-center justify-between gap-2.5 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8.5 w-8.5 rounded-xl bg-background border border-border/80 flex items-center justify-center shrink-0 shadow-sm">
                    <GoogleIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-foreground truncate">
                      {isSignedIn ? (user?.fullName || "Konto Aktywne") : "Konto & Strefa Klienta"}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">
                      {isSignedIn ? "Synchronizacja w chmurze" : "Logowanie 1-Click z Google"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop(850, 0.03);
                    hapticMedium();
                    if (isSignedIn) {
                      onClose();
                      window.location.href = "#kontakt";
                    } else {
                      setIsAuthOpen(true);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  {isSignedIn ? (
                    <>
                      <User className="h-3.5 w-3.5" />
                      <span>Profil</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="h-3.5 w-3.5" />
                      <span>Zaloguj</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                {/* Native Web Share */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 p-3.5 text-primary active:scale-95 transition-all cursor-pointer min-h-[72px] shadow-sm"
                >
                  <Share2 className="h-4.5 w-4.5" />
                  <span className="font-['Geist'] text-xs font-bold">
                    {copied ? "Skopiowano!" : "Udostępnij profil"}
                  </span>
                </button>

                {/* Download CV */}
                <a
                  href="/cv.pdf"
                  download
                  onClick={() => {
                    soundEngine.playPop(750, 0.03);
                    hapticLight();
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary p-3.5 text-foreground active:scale-95 transition-all cursor-pointer min-h-[72px] shadow-sm"
                >
                  <Download className="h-4.5 w-4.5 text-primary" />
                  <span className="font-['Geist'] text-xs font-bold">Pobierz CV (PDF)</span>
                </a>

                {/* Direct Email */}
                <a
                  href="mailto:kontakt@gkdev.pl"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary p-3.5 text-foreground active:scale-95 transition-all cursor-pointer min-h-[72px] shadow-sm"
                >
                  <Mail className="h-4.5 w-4.5 text-primary" />
                  <span className="font-['Geist'] text-xs font-bold">Napisz Email</span>
                </a>

                {/* Direct Call / Copy Phone */}
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary p-3.5 text-foreground active:scale-95 transition-all cursor-pointer min-h-[72px] shadow-sm"
                >
                  <Phone className="h-4.5 w-4.5 text-emerald-500" />
                  <span className="font-['Geist'] text-xs font-bold">Kopiuj Telefon</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dedicated Auth Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>,
    document.body
  );
};

export default MobileQuickActions;
