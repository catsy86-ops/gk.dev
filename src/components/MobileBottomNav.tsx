import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Home, User, Wrench, FolderOpen, Mail, Menu, X, FileText, Copy, Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useActiveSection } from "@/hooks/use-active-section";
import { EASE_STANDARD } from "@/constants/animations";
import { toast } from "@/hooks/use-toast";

const bottomNavItems = [
  { icon: Home, label: "Start", href: "#hero", id: "hero" },
  { icon: User, label: "O mnie", href: "#o-mnie", id: "o-mnie" },
  { icon: Wrench, label: "Umiejętności", href: "#umiejetnosci", id: "umiejetnosci" },
  { icon: FolderOpen, label: "Projekty", href: "#projekty", id: "projekty" },
  { icon: Mail, label: "Kontakt", href: "#kontakt", id: "kontakt" },
];

const quickActions = [
  {
    icon: FileText,
    label: "Pobierz CV",
    action: () => {
      toast({ title: "CV", description: "Pobieranie CV..." });
      window.open("/cv.pdf", "_blank");
    },
  },
  {
    icon: Copy,
    label: "Kopiuj email",
    action: async () => {
      try {
        await navigator.clipboard.writeText("kontakt@gkdev.pl");
        toast({ title: "Skopiowano!", description: "Adres email został skopiowany do schowka." });
      } catch {
        toast({ title: "Błąd", description: "Nie udało się skopiować adresu email.", variant: "destructive" });
      }
    },
  },
];

interface MobileBottomNavProps {
  onMenuOpen: () => void;
  menuOpen: boolean;
}

export const MobileBottomNav = ({ onMenuOpen, menuOpen }: MobileBottomNavProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && resolvedTheme === "dark";
  const toggleTheme = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);
  const activeSection = useActiveSection();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("kontakt@gkdev.pl");
      setCopied(true);
      toast({ title: "Skopiowano!", description: "Adres email został skopiowany do schowka." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Błąd", description: "Nie udało się skopiować.", variant: "destructive" });
    }
  };

  return (
    <>
      {/* Floating Theme Toggle Button - prominent on mobile */}
      <motion.button
        onClick={toggleTheme}
        className={`md:hidden fixed right-4 bottom-24 z-[45] h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30"
            : "bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-900/30"
        }`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
        whileTap={{ scale: 0.85 }}
        aria-label={isDark ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
      >
        <AnimatePresence mode="wait">
          {mounted && isDark ? (
            <motion.div
              key="sun-float"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <Sun className="h-5 w-5 text-white" strokeWidth={2.2} />
            </motion.div>
          ) : (
            <motion.div
              key="moon-float"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <Moon className="h-5 w-5 text-white" strokeWidth={2.2} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isDark
              ? "0 0 20px 4px rgba(251,191,36,0.3), 0 0 40px 8px rgba(251,191,36,0.1)"
              : "0 0 20px 4px rgba(148,163,184,0.25), 0 0 40px 8px rgba(148,163,184,0.08)",
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      {/* Bottom Navigation Bar */}
      <motion.nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-2xl border-t border-border/40 safe-area-pb"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: EASE_STANDARD }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === "hero" && !activeSection);
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollTo(item.href)}
                className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-[18px] w-[18px] relative z-10" strokeWidth={isActive ? 2 : 1.6} />
                <span className="text-[9px] font-medium relative z-10 tracking-wide">{item.label}</span>
              </motion.button>
            );
          })}

          {/* More menu button */}
          <motion.button
            onClick={onMenuOpen}
            className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl ${
              menuOpen ? "text-primary" : "text-muted-foreground"
            }`}
            whileTap={{ scale: 0.9 }}
            aria-label="Więcej opcji"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[9px] font-medium tracking-wide">Więcej</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Quick Actions Sheet (appears when menuOpen) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 z-30 bg-foreground/10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onMenuOpen()}
            />

            {/* Actions panel */}
            <motion.div
              className="md:hidden fixed bottom-[72px] left-4 right-4 z-[35] bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Glow line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="p-4 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium px-1">
                  Szybkie akcje
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      onClick={action.action}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground hover:bg-secondary hover:border-primary/20 transition-all text-left"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {action.label === "Kopiuj email" && copied ? (
                          <Check className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <action.icon className="h-4 w-4" strokeWidth={1.8} />
                        )}
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Theme toggle big button in panel */}
                <motion.button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40"
                      : "bg-gradient-to-r from-slate-500/10 to-slate-700/10 border-slate-500/20 hover:border-slate-500/40"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      isDark ? "bg-amber-500/15 text-amber-500" : "bg-slate-500/15 text-slate-500"
                    }`}>
                      <AnimatePresence mode="wait">
                        {isDark ? (
                          <motion.div
                            key="sun-panel"
                            initial={{ rotate: -90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: 90, scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sun className="h-4.5 w-4.5" strokeWidth={2} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon-panel"
                            initial={{ rotate: 90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: -90, scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Moon className="h-4.5 w-4.5" strokeWidth={2} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium block">
                        {isDark ? "Tryb ciemny" : "Tryb jasny"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {isDark ? "Kliknij, aby włączyć światło" : "Kliknij, aby włączyć ciemność"}
                      </span>
                    </div>
                  </div>
                  {/* Switch indicator */}
                  <div className={`h-6 w-11 rounded-full relative transition-colors duration-300 ${
                    isDark ? "bg-amber-500/30" : "bg-slate-400/30"
                  }`}>
                    <motion.div
                      className={`absolute top-0.5 h-5 w-5 rounded-full shadow-md ${
                        isDark ? "bg-amber-400" : "bg-slate-300"
                      }`}
                      animate={{ left: isDark ? 22 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>

                {/* Email copy button */}
                <motion.button
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 hover:bg-secondary hover:border-primary/20 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.8} />}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium block">Kopiuj email</span>
                      <span className="text-[10px] text-muted-foreground">kontakt@gkdev.pl</span>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
