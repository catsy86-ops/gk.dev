import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { User, LogIn, Sparkles } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";

export const AuthButton = () => {
  const { lang } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full border border-border/60 bg-secondary/50 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center">
      <SignedIn>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            userProfileMode="modal"
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-background transition-transform hover:scale-105",
              },
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop(800, 0.03);
              hapticLight();
            }}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/80 hover:bg-secondary px-3 py-1.5 text-xs font-['Geist'] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-all active:scale-95 shadow-sm cursor-pointer"
            aria-label={lang === "pl" ? "Zaloguj się" : "Sign In"}
            title={lang === "pl" ? "Zaloguj się do strefy klienta" : "Sign In"}
          >
            <LogIn className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">
              {lang === "pl" ? "Zaloguj" : "Sign In"}
            </span>
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};

export default AuthButton;
