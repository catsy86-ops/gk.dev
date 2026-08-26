import { useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import {
  X,
  ShieldCheck,
  Sparkles,
  Bookmark,
  Calendar,
  FileCode,
  Lock,
  ArrowRight,
  UserCheck,
  Eye,
  EyeOff,
  Github,
  KeyRound,
  Bot,
  Mail,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { calculatePasswordStrength } from "@/lib/password-strength";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "sign-in" | "sign-up";
}

// Google Official Multicolor SVG Icon
export const GoogleIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "sign-in",
}: AuthModalProps) => {
  useScrollLock(isOpen);
  const emailInputId = useId();
  const passwordInputId = useId();
  const { lang } = useI18n();
  const { isSignedIn, user } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  const [mode, setMode] = useState<"sign-in" | "sign-up">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useClerkEmbed, setUseClerkEmbed] = useState(false);

  const strength = calculatePasswordStrength(password);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleGoogleAuth = () => {
    soundEngine.playPop(850, 0.03);
    hapticMedium();
    onClose();
    if (mode === "sign-in") {
      openSignIn({});
    } else {
      openSignUp({});
    }
  };

  const handleGithubAuth = () => {
    soundEngine.playPop(800, 0.03);
    hapticMedium();
    onClose();
    if (mode === "sign-in") {
      openSignIn({});
    } else {
      openSignUp({});
    }
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playChime();
    hapticSuccess();
    // Transition to Clerk auth with prefilled state
    setUseClerkEmbed(true);
  };

  const handleSignOut = async () => {
    soundEngine.playClick();
    hapticLight();
    if (signOut) {
      await signOut();
    }
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden pointer-events-auto">
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

          {/* Modal Container: Split View on Desktop */}
          <motion.div
            className="relative w-full max-w-4xl rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col md:grid md:grid-cols-12 max-h-[92vh] font-['Geist'] pointer-events-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Panel Autentykacji i Konta GK.dev"
          >
            {/* LEFT COLUMN (Desktop): Visual Showcase & Security Vault */}
            <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-primary/15 via-background to-secondary/50 border-r border-border/60 relative overflow-hidden">
              {/* Glow Accent */}
              <div
                className="absolute -top-20 -left-20 w-56 h-56 bg-primary/20 rounded-full blur-[80px] pointer-events-none"
                aria-hidden="true"
              />

              {/* Brand & Security Header */}
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono font-semibold text-primary shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5 animate-pulse" />
                  <span>Zero-Trust Auth • 256-bit SSL</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">
                    GK<span className="text-primary">.dev</span> Vault
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "pl"
                      ? "Bezpieczna strefa klienta z synchronizacją briefów projektowych, dostępem do kalkulatora architektonicznego i konsultacji 1:1."
                      : "Secure client portal with synchronized project briefs, architecture estimation, and 1:1 consultation access."}
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/60 border border-border/80 shadow-sm backdrop-blur-sm">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {lang === "pl" ? "Logowanie 1-Click" : "1-Click Instant Login"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {lang === "pl" ? "Błyskawiczny dostęp przez Google i GitHub OAuth" : "Instant access via Google and GitHub OAuth"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/60 border border-border/80 shadow-sm backdrop-blur-sm">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {lang === "pl" ? "Chmurowy Schowek" : "Cloud Workspace"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {lang === "pl" ? "Zapisane zakładki wiedzy i wersje robocze briefów" : "Saved knowledge bookmarks & draft briefs"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/60 border border-border/80 shadow-sm backdrop-blur-sm">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {lang === "pl" ? "Asystent AI Architect" : "AI Architect Assistant"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {lang === "pl" ? "Nielimitowane analizy stosu technologicznego" : "Unlimited tech-stack & latency analysis"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Column Bottom Footer */}
              <div className="relative z-10 pt-6 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Clerk Engine
                </span>
                <span>PKCE • OAuth 2.0</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Form & OAuth Controls */}
            <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto max-h-[90vh] p-6 sm:p-8 space-y-6">
              {/* Top Navigation & Close */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground text-lg sm:text-xl">
                        {isSignedIn
                          ? lang === "pl"
                            ? "Twoje Konto GK.dev"
                            : "Your GK.dev Account"
                          : mode === "sign-in"
                          ? lang === "pl"
                            ? "Zaloguj się"
                            : "Sign In"
                          : lang === "pl"
                          ? "Utwórz konto"
                          : "Create Account"}
                      </h2>
                      <p className="font-mono text-xs text-muted-foreground">
                        {isSignedIn
                          ? user?.primaryEmailAddress?.emailAddress
                          : lang === "pl"
                          ? "Wybierz metodę 1-Click lub e-mail"
                          : "Choose 1-Click or email authentication"}
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
                    className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                    title="Zamknij"
                    aria-label="Zamknij"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Mode Switcher when unauthenticated */}
                {!isSignedIn && (
                  <div className="flex items-center p-1 rounded-2xl bg-secondary/80 border border-border/60 mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop(750, 0.02);
                        hapticLight();
                        setMode("sign-in");
                        setUseClerkEmbed(false);
                      }}
                      className={`relative flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        mode === "sign-in"
                          ? "text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode === "sign-in" && (
                        <motion.span
                          layoutId="auth-tab-pill"
                          className="absolute inset-0 rounded-xl bg-background border border-border/80 shadow-sm"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">
                        {lang === "pl" ? "Logowanie" : "Sign In"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop(750, 0.02);
                        hapticLight();
                        setMode("sign-up");
                        setUseClerkEmbed(false);
                      }}
                      className={`relative flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        mode === "sign-up"
                          ? "text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode === "sign-up" && (
                        <motion.span
                          layoutId="auth-tab-pill"
                          className="absolute inset-0 rounded-xl bg-background border border-border/80 shadow-sm"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">
                        {lang === "pl" ? "Rejestracja" : "Register"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Main Content Body */}
              <div className="space-y-5">
                {isSignedIn ? (
                  /* Authenticated State */
                  <div className="space-y-4 text-center py-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 mx-auto shadow-lg shadow-emerald-500/20">
                      <UserCheck className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {lang === "pl" ? "Jesteś pomyślnie zalogowany!" : "You are signed in!"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-left pt-2">
                      <div className="p-3 rounded-2xl border border-border/80 bg-secondary/40">
                        <span className="text-[11px] font-mono text-muted-foreground block">Konto:</span>
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          VIP Klient
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl border border-border/80 bg-secondary/40">
                        <span className="text-[11px] font-mono text-muted-foreground block">Synchronizacja:</span>
                        <span className="text-xs font-bold text-primary mt-0.5 block truncate">
                          Chmura Aktywna
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          onClose();
                        }}
                        className="flex-1 py-2.5 px-4 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/30 hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        Przejdź do Portalu
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="py-2.5 px-4 rounded-full border border-border bg-secondary hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold text-xs transition-all cursor-pointer"
                      >
                        Wyloguj
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Unauthenticated Flow */
                  <div className="space-y-4">
                    {/* 1-Click OAuth Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Google 1-Click Button */}
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-border/80 bg-background hover:bg-secondary/80 text-foreground font-semibold text-xs shadow-sm hover:shadow-md transition-all hover:border-primary/40 active:scale-[0.98] group cursor-pointer"
                      >
                        <GoogleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">
                          {mode === "sign-in" ? "Google 1-Click" : "Google Rejestracja"}
                        </span>
                      </button>

                      {/* GitHub 1-Click Button */}
                      <button
                        type="button"
                        onClick={handleGithubAuth}
                        className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-border/80 bg-background hover:bg-secondary/80 text-foreground font-semibold text-xs shadow-sm hover:shadow-md transition-all hover:border-primary/40 active:scale-[0.98] group cursor-pointer"
                      >
                        <Github className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">
                          {mode === "sign-in" ? "GitHub 1-Click" : "GitHub Rejestracja"}
                        </span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center py-1">
                      <div className="border-t border-border/80 w-full" />
                      <span className="bg-card px-3 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        {lang === "pl" ? "lub tradycyjnie przez e-mail" : "or via email"}
                      </span>
                      <div className="border-t border-border/80 w-full" />
                    </div>

                    {!useClerkEmbed ? (
                      /* Custom Rich Form with Password Strength */
                      <form onSubmit={handleCustomFormSubmit} className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label
                            htmlFor={emailInputId}
                            className="block text-xs font-semibold text-foreground/90 font-['Geist']"
                          >
                            Adres E-mail
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                            <input
                              id={emailInputId}
                              type="email"
                              required
                              placeholder="twoj.email@firma.pl"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-secondary/30 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-sans placeholder:text-muted-foreground/60"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor={passwordInputId}
                              className="block text-xs font-semibold text-foreground/90 font-['Geist']"
                            >
                              Hasło
                            </label>
                            {mode === "sign-in" && (
                              <button
                                type="button"
                                onClick={() => setUseClerkEmbed(true)}
                                className="text-[11px] text-primary hover:underline font-medium"
                              >
                                Nie pamiętasz hasła?
                              </button>
                            )}
                          </div>
                          <div className="relative flex items-center">
                            <KeyRound className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                            <input
                              id={passwordInputId}
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border/80 bg-secondary/30 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
                              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Password Strength Meter (Shown when typing password or during registration) */}
                          {password.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-1.5 pt-1"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-muted-foreground">Siła hasła:</span>
                                <span className={`font-bold ${strength.colorClass}`}>
                                  {lang === "pl" ? strength.labelPl : strength.labelEn}
                                </span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
                                {[1, 2, 3, 4].map((step) => (
                                  <div
                                    key={step}
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      step <= strength.score ? strength.barColor : "bg-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3 px-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>
                            {mode === "sign-in"
                              ? "Zaloguj się do platformy"
                              : "Utwórz konto w GK.dev"}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      /* Seamless Clerk Embedded Fallback */
                      <div className="flex justify-center w-full clerk-embed-container pt-1">
                        {mode === "sign-in" ? (
                          <SignIn
                            routing="virtual"
                            appearance={{
                              elements: {
                                rootBox: "w-full",
                                card: "w-full shadow-none border-0 bg-transparent p-0",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "hidden",
                                dividerRow: "hidden",
                                formButtonPrimary:
                                  "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 transition-all text-xs py-2.5",
                                footerAction: "text-xs text-muted-foreground",
                                footerActionLink: "text-primary font-bold hover:underline",
                              },
                            }}
                          />
                        ) : (
                          <SignUp
                            routing="virtual"
                            appearance={{
                              elements: {
                                rootBox: "w-full",
                                card: "w-full shadow-none border-0 bg-transparent p-0",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "hidden",
                                dividerRow: "hidden",
                                formButtonPrimary:
                                  "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 transition-all text-xs py-2.5",
                                footerAction: "text-xs text-muted-foreground",
                                footerActionLink: "text-primary font-bold hover:underline",
                              },
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trust & Guarantee Bottom Bar */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Szyfrowanie 256-bit • RODO/GDPR</span>
                </span>
                <span className="text-primary font-bold">GK.dev Studio</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuthModal;
