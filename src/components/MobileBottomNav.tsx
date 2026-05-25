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

import { toast } from "@/hooks/use-toast";

const bottomTabs = [
  { icon: Home, label: "Start", href: "#hero", id: "hero" },
  { icon: User, label: "O mnie", href: "#o-mnie", id: "o-mnie" },
  { icon: FolderOpen, label: "Projekty", href: "#projekty", id: "projekty" },
  { icon: Mail, label: "Kontakt", href: "#kontakt", id: "kontakt" },
] as const;

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] pb-2 px-3">
        <div className="rounded-2xl bg-background/80 backdrop-blur-xl border border-border/40 shadow-[0_-2px_20px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.06)_inset] safe-area-pb">
          {/* Top gradient accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-2xl" />
          {/* Center glow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-primary/[0.06] rounded-full blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-around px-1 py-1.5">
            {bottomTabs.map((item) => {
              const isActive = activeSection === item.id || (item.id === "hero" && !activeSection);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.href)}
                  className="relative flex flex-col items-center justify-center min-w-[52px] py-1.5 rounded-xl"
                  whileTap={{ scale: 0.88 }}
                >
                  {/* Active pill background */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`tab-bg-${item.id}`}
                        layoutId="bottom-tab-pill"
                        className="absolute inset-0 rounded-xl bg-primary/[0.12]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <span className="relative flex items-center justify-center h-6 w-6">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        y: isActive ? -0.5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    >
                      <item.icon
                        className={`h-[20px] w-[20px] transition-colors duration-200 ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.5}
                      />
                    </motion.div>
                  </span>

                  {/* Label */}
                  <motion.span
                    className={`text-[10px] leading-tight mt-0.5 transition-colors duration-200 ${
                      isActive ? "text-primary font-semibold" : "text-muted-foreground font-medium"
                    }`}
                    animate={{ opacity: isActive ? 1 : 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                </motion.button>
              );
            })}

            {/* More button */}
            <motion.button
              onClick={onMenuOpen}
              className="relative flex flex-col items-center justify-center min-w-[52px] py-1.5 rounded-xl"
              whileTap={{ scale: 0.88 }}
              aria-label={menuOpen ? "Zamknij menu" : "Więcej opcji"}
            >
              <AnimatePresence mode="wait">
                {menuOpen && (
                  <motion.div
                    key="menu-tab-bg"
                    layoutId="bottom-tab-pill"
                    className="absolute inset-0 rounded-xl bg-primary/[0.12]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <span className="relative flex items-center justify-center h-6 w-6">
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.div
                      key="close-icon"
                      initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-[20px] w-[20px] text-primary" strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu-icon"
                      initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-[20px] w-[20px] text-muted-foreground" strokeWidth={1.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>

              <motion.span
                className={`text-[10px] leading-tight mt-0.5 font-medium transition-colors duration-200 ${
                  menuOpen ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
                animate={{ opacity: menuOpen ? 1 : 0.5 }}
                transition={{ duration: 0.15 }}
              >
                Więcej
              </motion.span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ═══════ BOTTOM SHEET ═══════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 z-[9999] bg-foreground/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onMenuOpen()}
            />

            {/* Sheet panel */}
            <motion.div
              className="md:hidden fixed bottom-0 left-0 right-0 z-[10000] bg-background/95 backdrop-blur-2xl border-t border-border/50 rounded-t-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) onMenuOpen();
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="px-5 pt-2 pb-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-5 safe-area-content">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground/50">
                    Menu
                  </span>
                  <motion.button
                    onClick={() => onMenuOpen()}
                    className="h-8 w-8 rounded-full bg-secondary/60 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Zamknij menu"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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
                            ? "bg-primary/[0.08] border border-primary/15 text-primary"
                            : "bg-secondary/30 border border-transparent text-foreground hover:bg-secondary/60"
                        }`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
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
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                {/* Quick Actions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/40 px-1 block mb-1">
                    Szybkie akcje
                  </span>

                  <motion.button
                    onClick={handleDownloadCV}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-secondary/30 text-foreground hover:bg-secondary/60 transition-all text-left"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[15px] font-medium block">Pobierz CV</span>
                      <span className="text-[11px] text-muted-foreground">PDF • 2 strony</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 ml-auto shrink-0" strokeWidth={2} />
                  </motion.button>

                  <motion.button
                    onClick={handleCopyEmail}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-secondary/30 text-foreground hover:bg-secondary/60 transition-all text-left"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary shrink-0">
                      {copied ? (
                        <Check className="h-[18px] w-[18px]" strokeWidth={2} />
                      ) : (
                        <Copy className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[15px] font-medium block">
                        {copied ? "Skopiowano!" : "Kopiuj email"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">kontakt@gkdev.pl</span>
                    </div>
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-amber-500/[0.04] border-amber-500/10 hover:border-amber-500/25"
                      : "bg-slate-500/[0.04] border-slate-500/10 hover:border-slate-500/25"
                  }`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-amber-500/10 text-amber-500" : "bg-slate-500/10 text-slate-500"
                    }`}>
                      <AnimatePresence mode="wait">
                        {isDark ? (
                          <motion.div
                            key="sun"
                            initial={{ rotate: -90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: 90, scale: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon"
                            initial={{ rotate: 90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            exit={{ rotate: -90, scale: 0 }}
                            transition={{ duration: 0.15 }}
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

                  <div className={`h-7 w-12 rounded-full relative transition-colors duration-300 ${
                    isDark ? "bg-amber-500/20" : "bg-slate-400/20"
                  }`}>
                    <motion.div
                      className={`absolute top-[3px] h-[22px] w-[22px] rounded-full shadow-sm ${
                        isDark ? "bg-amber-400" : "bg-slate-300"
                      }`}
                      animate={{ left: isDark ? 24 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                {/* Social links */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/40 px-1 block">
                    Sociale
                  </span>
                  <div className="flex gap-2">
                    {socialLinks.map(({ icon: Icon, href, label }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        aria-label={label}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-secondary/60 transition-all"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                        <span className="text-[13px] font-medium">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Footer branding */}
                <div className="pt-1 text-center">
                  <p className="text-[10px] text-muted-foreground/25 tracking-wider uppercase">
                    GK<span className="text-primary/30">.dev</span> © {new Date().getFullYear()}
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