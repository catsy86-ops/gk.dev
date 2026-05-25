import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Home,
  User,
  FolderOpen,
  Mail,
  Menu,
  X,
  FileText,
  Copy,
  Check,
  Github,
  Linkedin,
  Wrench,
  HelpCircle,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useActiveSection } from "@/hooks/use-active-section";
import { EASE_STANDARD } from "@/constants/animations";
import { toast } from "@/hooks/use-toast";

/* ─── Bottom tabs (max 5 for comfortable thumbs) ─── */
const bottomTabs = [
  { icon: Home, label: "Start", href: "#hero", id: "hero" },
  { icon: User, label: "O mnie", href: "#o-mnie", id: "o-mnie" },
  { icon: FolderOpen, label: "Projekty", href: "#projekty", id: "projekty" },
  { icon: Mail, label: "Kontakt", href: "#kontakt", id: "kontakt" },
] as const;

/* ─── Extra nav links inside the sheet ─── */
const extraNavLinks = [
  { icon: Wrench, label: "Umiejętności", href: "#umiejetnosci", id: "umiejetnosci" },
  { icon: BarChart3, label: "Statystyki", href: "#statystyki", id: "statystyki" },
  { icon: HelpCircle, label: "FAQ", href: "#faq", id: "faq" },
] as const;

const socialLinks = [
  { icon: Github, href: "https://github.com/gkdev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/gkdev", label: "LinkedIn" },
  { icon: Mail, href: "mailto:kontakt@gkdev.pl", label: "Email" },
] as const;

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

  const scrollTo = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (menuOpen) onMenuOpen();
  }, [menuOpen, onMenuOpen]);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("kontakt@gkdev.pl");
      setCopied(true);
      toast({ title: "Skopiowano!", description: "Adres email został skopiowany do schowka." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Błąd", description: "Nie udało się skopiować.", variant: "destructive" });
    }
  }, []);

  const handleDownloadCV = useCallback(() => {
    toast({ title: "CV", description: "Pobieranie CV..." });
    window.open("/cv.pdf", "_blank");
  }, []);

  return (
    <>
      {/* ═══════ BOTTOM TAB BAR ═══════ */}
      <motion.nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] w-full"
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.55, ease: EASE_STANDARD }}
      >
        {/* Glass panel */}
        <div className="mx-3 mb-3 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/40 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] safe-area-pb">
          {/* Subtle top gradient */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="flex items-center justify-between px-2 py-1.5">
            {bottomTabs.map((item) => {
              const isActive = activeSection === item.id || (item.id === "hero" && !activeSection);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.href)}
                  className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 rounded-xl"
                  whileTap={{ scale: 0.88 }}
                >
                  {/* Active dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-dot"
                        className="absolute -top-0.5 h-1 w-1 rounded-full bg-primary"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                  </AnimatePresence>

                  <item.icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                  <span
                    className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}

            {/* More button */}
            <motion.button
              onClick={onMenuOpen}
              className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 rounded-xl"
              whileTap={{ scale: 0.88 }}
              aria-label={menuOpen ? "Zamknij menu" : "Więcej opcji"}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 text-primary" strokeWidth={2} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={`text-[10px] font-medium tracking-wide ${menuOpen ? "text-primary" : "text-muted-foreground"}`}>
                Więcej
              </span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════ BOTTOM SHEET ═══════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 z-[30] bg-foreground/15 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => onMenuOpen()}
            />

            {/* Sheet panel */}
            <motion.div
              className="md:hidden fixed bottom-0 left-0 right-0 z-[35] bg-background/95 backdrop-blur-2xl border-t border-border/50 rounded-t-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] overflow-hidden"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) onMenuOpen();
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/25" />
              </div>

              <div className="px-5 pb-8 pt-2 max-h-[75vh] overflow-y-auto no-scrollbar space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground/60">
                    Menu
                  </span>
                  <motion.button
                    onClick={() => onMenuOpen()}
                    className="h-8 w-8 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Zamknij menu"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </motion.button>
                </div>

                {/* Extra nav links */}
                <div className="space-y-1.5">
                  {extraNavLinks.map((link, i) => {
                    const isActive = activeSection === link.id;
                    return (
                      <motion.button
                        key={link.id}
                        onClick={() => scrollTo(link.href)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all text-left ${
                          isActive
                            ? "bg-primary/8 border border-primary/15 text-primary"
                            : "bg-secondary/40 border border-transparent text-foreground hover:bg-secondary/70"
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          isActive ? "bg-primary/15" : "bg-primary/8"
                        }`}>
                          <link.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                        </div>
                        <span className="text-[15px] font-medium">{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="sheet-active-dot"
                            className="ml-auto h-2 w-2 rounded-full bg-primary"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Quick Actions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/50 px-1 block mb-1.5">
                    Szybkie akcje
                  </span>

                  <motion.button
                    onClick={handleDownloadCV}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/70 transition-all text-left"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <span className="text-[15px] font-medium block">Pobierz CV</span>
                      <span className="text-[11px] text-muted-foreground">PDF • 2 strony</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 ml-auto" strokeWidth={2} />
                  </motion.button>

                  <motion.button
                    onClick={handleCopyEmail}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/70 transition-all text-left"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                      {copied ? (
                        <Check className="h-[18px] w-[18px]" strokeWidth={2} />
                      ) : (
                        <Copy className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      )}
                    </div>
                    <div>
                      <span className="text-[15px] font-medium block">
                        {copied ? "Skopiowano!" : "Kopiuj email"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">kontakt@gkdev.pl</span>
                    </div>
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-amber-500/5 border-amber-500/15 hover:border-amber-500/30"
                      : "bg-slate-500/5 border-slate-500/15 hover:border-slate-500/30"
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      isDark ? "bg-amber-500/12 text-amber-500" : "bg-slate-500/12 text-slate-500"
                    }`}>
                      <AnimatePresence mode="wait">
                        {isDark ? (
                          <motion.div
                            key="sun"
                            initial={{ rotate: -90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: 90, scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon"
                            initial={{ rotate: 90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: -90, scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <span className="text-[15px] font-medium block">
                        {isDark ? "Tryb ciemny" : "Tryb jasny"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {isDark ? "Dotknij, aby rozjaśnić" : "Dotknij, aby przyciemnić"}
                      </span>
                    </div>
                  </div>

                  {/* Switch */}
                  <div className={`h-7 w-12 rounded-full relative transition-colors duration-300 ${
                    isDark ? "bg-amber-500/25" : "bg-slate-400/25"
                  }`}>
                    <motion.div
                      className={`absolute top-[3px] h-[22px] w-[22px] rounded-full shadow-sm ${
                        isDark ? "bg-amber-400" : "bg-slate-200"
                      }`}
                      animate={{ left: isDark ? 24 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Social links */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/50 px-1 block">
                    Sociale
                  </span>
                  <div className="flex gap-2.5">
                    {socialLinks.map(({ icon: Icon, href, label }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        aria-label={label}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-secondary/70 transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                        <span className="text-sm font-medium">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Footer branding */}
                <div className="pt-2 text-center">
                  <p className="text-[10px] text-muted-foreground/30 tracking-wider uppercase">
                    GK<span className="text-primary/40">.dev</span> © {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
