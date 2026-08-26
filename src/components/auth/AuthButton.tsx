import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { LogIn, Sparkles, ShieldCheck } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";
import { AuthModal, GoogleIcon } from "@/components/auth/AuthModal";

export const AuthButton = () => {
  const { lang } = useI18n();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full border border-border/60 bg-secondary/50 animate-pulse" />
    );
  }

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "";

  return (
    <>
      <div className="flex items-center">
        <SignedIn>
          <div className="flex items-center gap-1.5 py-0.5 px-0.5">
            <UserButton
              afterSignOutUrl="/"
              userProfileMode="modal"
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "h-6 w-6 rounded-full ring-2 ring-primary/40 ring-offset-1 ring-offset-background transition-transform hover:scale-105",
                },
              }}
            />
            {firstName && (
              <span className="hidden lg:inline text-xs font-bold text-foreground font-['Geist'] max-w-[72px] truncate">
                {firstName}
              </span>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-1.5">
            {/* Direct Google 1-Click Login Quick Trigger */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(850, 0.025);
                hapticMedium();
                setIsAuthModalOpen(true);
              }}
              className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/15 via-secondary/80 to-primary/10 hover:from-primary/25 hover:to-primary/20 hover:border-primary px-3 sm:px-3.5 py-1.5 text-xs font-['Geist'] font-bold text-foreground hover:text-primary transition-all active:scale-95 shadow-sm hover:shadow-md hover:shadow-primary/15 cursor-pointer shrink-0"
              aria-label={lang === "pl" ? "Zaloguj się przez Google lub Email" : "Sign In with Google or Email"}
              title={lang === "pl" ? "Zaloguj się do Strefy Klienta" : "Sign In to Client Portal"}
            >
              <GoogleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span className="font-bold">
                {lang === "pl" ? "Zaloguj" : "Sign In"}
              </span>
            </button>
          </div>
        </SignedOut>
      </div>

      {/* Dedicated Auth Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default AuthButton;
