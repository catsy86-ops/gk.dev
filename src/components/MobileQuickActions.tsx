import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Phone, Mail, Download, Sparkles, X, Check, Copy, User } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { GoogleIcon, AuthModal } from "@/components/auth/AuthModal";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess, hapticMedium } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface MobileQuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQuickActions = ({ isOpen, onClose }: MobileQuickActionsProps) => {
  useScrollLock(isOpen);
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [copied, setCopied] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
            className="relative w-full rounded-t-[32px] border-t border-border/80 bg-card/95 backdrop-blur-2xl p-6 pb-[max(2.5rem,env(safe-area-inset-bottom,2.5rem))] shadow-2xl z-10 space-y-4 pointer-events-auto touch-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Szybkie akcje mobilne"
          >
            {/* Top drag handle pill (Tactile Indicator) */}
            <div className="w-full flex justify-center pb-2 cursor-grab active:cursor-grabbing">
              <div className="h-1.5 w-14 rounded-full bg-muted-foreground/40 hover:bg-primary transition-colors" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-['Geist'] text-base font-bold text-foreground">
                  Szybki Kontakt & Udostępnianie
                </h3>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  soundEngine.playClick();
                  onClose();
                }}
                className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer pointer-events-auto relative z-30"
                aria-label="Zamknij"
                title="Zamknij"
              >
                <X className="h-4 w-4 pointer-events-none" />
              </button>
            </div>

            {/* Google Authentication & Client Portal Banner */}
            <div className="p-3.5 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-background to-primary/10 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-background border border-border/80 flex items-center justify-center shrink-0 shadow-sm">
                  <GoogleIcon className="h-4.5 w-4.5" />
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
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Native Web Share */}
              <button
                type="button"
                onClick={handleShare}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 p-4 text-primary active:scale-95 transition-all cursor-pointer min-h-[85px] shadow-sm"
              >
                <Share2 className="h-5 w-5" />
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
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary p-4 text-foreground active:scale-95 transition-all cursor-pointer min-h-[85px] shadow-sm"
              >
                <Download className="h-5 w-5 text-primary" />
                <span className="font-['Geist'] text-xs font-bold">Pobierz CV (PDF)</span>
              </a>

              {/* Direct Email */}
              <a
                href="mailto:kontakt@gkdev.pl"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary p-4 text-foreground active:scale-95 transition-all cursor-pointer min-h-[85px] shadow-sm"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-['Geist'] text-xs font-bold">Napisz Email</span>
              </a>

              {/* Direct Call / Copy Phone */}
              <button
                type="button"
                onClick={handleCopyPhone}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary p-4 text-foreground active:scale-95 transition-all cursor-pointer min-h-[85px] shadow-sm"
              >
                <Phone className="h-5 w-5 text-emerald-500" />
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
