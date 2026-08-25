import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Phone, Mail, Download, Sparkles, X, Check, Copy } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";

interface MobileQuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQuickActions = ({ isOpen, onClose }: MobileQuickActionsProps) => {
  const [copied, setCopied] = useState(false);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center p-0 md:hidden overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Quick Action Sheet */}
          <motion.div
            className="relative w-full rounded-t-[32px] border-t border-border/80 bg-card/95 backdrop-blur-2xl p-6 pb-[max(2rem,env(safe-area-inset-bottom,2rem))] shadow-2xl z-10 space-y-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            role="dialog"
            aria-label="Szybkie akcje mobilne"
          >
            {/* Top drag handle pill */}
            <div className="w-full flex justify-center pb-2">
              <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-['Geist'] text-base font-bold text-foreground">
                  Szybki Kontakt & Udostępnianie
                </h3>
              </div>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Native Web Share */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-primary active:scale-95 transition-transform"
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
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 p-4 text-foreground active:scale-95 transition-transform"
              >
                <Download className="h-5 w-5 text-primary" />
                <span className="font-['Geist'] text-xs font-bold">Pobierz CV (PDF)</span>
              </a>

              {/* Direct Email */}
              <a
                href="mailto:kontakt@gkdev.pl"
                onClick={onClose}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 p-4 text-foreground active:scale-95 transition-transform"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-['Geist'] text-xs font-bold">Napisz Email</span>
              </a>

              {/* Direct Call / Copy Phone */}
              <button
                onClick={handleCopyPhone}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 p-4 text-foreground active:scale-95 transition-transform"
              >
                <Phone className="h-5 w-5 text-emerald-500" />
                <span className="font-['Geist'] text-xs font-bold">Kopiuj Telefon</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
