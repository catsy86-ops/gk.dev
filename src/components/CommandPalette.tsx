import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  User,
  FolderOpen,
  Mail,
  Wrench,
  HelpCircle,
  Sun,
  Moon,
  Download,
  Copy,
  Check,
  Github,
  Linkedin,
  ArrowRight,
  Sparkles,
  Terminal,
  Palette,
  Bot,
  LogIn,
  Bookmark,
  X as CloseIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/hooks/use-toast";
import { setGlobalAccent } from "@/lib/theme";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { AuthModal } from "@/components/auth/AuthModal";

interface CommandItem {
  id: string;
  label: string;
  category: "Nawigacja" | "Akcje" | "Społecznościowe";
  icon: typeof Search;
  action: () => void;
  shortcut?: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal?: () => void;
  onOpenAi?: () => void;
  onOpenClientPortal?: () => void;
}

export const CommandPalette = ({
  isOpen,
  onClose,
  onOpenTerminal,
  onOpenAi,
  onOpenClientPortal,
}: CommandPaletteProps) => {
  useScrollLock(isOpen);
  const { isSignedIn } = useUser();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const scrollTo = useCallback(
    (id: string) => {
      onClose();
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    },
    [onClose]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    onClose();
    toast({
      title: "Zmieniono motyw",
      description: `Aktywowano motyw ${resolvedTheme === "dark" ? "jasny" : "ciemny"}.`,
    });
  }, [resolvedTheme, setTheme, onClose]);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("kontakt@gkdev.pl");
    setCopied(true);
    toast({
      title: "Skopiowano email",
      description: "Adres kontakt@gkdev.pl znajduje się w Twoim schowku.",
    });
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1000);
  }, [onClose]);

  const downloadCv = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/cv.pdf";
    link.download = "Grzegorz_CV.pdf";
    link.click();
    onClose();
    toast({ title: "Pobieranie CV", description: "Rozpoczęto pobieranie pliku CV." });
  }, [onClose]);

  const items: CommandItem[] = [
    // Nawigacja
    { id: "hero", label: "Start / Główna", category: "Nawigacja", icon: Sparkles, action: () => scrollTo("hero"), keywords: ["home", "poczatek", "glowna"] },
    { id: "o-mnie", label: "O mnie & Doświadczenie", category: "Nawigacja", icon: User, action: () => scrollTo("o-mnie"), keywords: ["bio", "doswiadczenie", "edukacja", "career"] },
    { id: "umiejetnosci", label: "Umiejętności & Tech Stack", category: "Nawigacja", icon: Wrench, action: () => scrollTo("umiejetnosci"), keywords: ["skills", "stack", "react", "typescript", "node"] },
    { id: "projekty", label: "Realizacje & Case Studies (Projekty)", category: "Nawigacja", icon: FolderOpen, action: () => scrollTo("projekty"), keywords: ["projekty", "portfolio", "realizacje", "case studies", "apps"] },
    { id: "kontakt", label: "Formularz kontaktowy", category: "Nawigacja", icon: Mail, action: () => scrollTo("kontakt"), keywords: ["contact", "napisz", "email", "wiadomosc"] },
    { id: "faq", label: "Często zadawane pytania (FAQ)", category: "Nawigacja", icon: HelpCircle, action: () => scrollTo("faq"), keywords: ["pytania", "pomoc", "wycena", "cena"] },

    // Akcje Autentykacji i Portalu
    {
      id: "auth",
      label: isSignedIn ? "Moje Konto & Profil (Clerk)" : "Zaloguj się z Google / Email",
      category: "Akcje",
      icon: LogIn,
      action: () => {
        onClose();
        setIsAuthModalOpen(true);
      },
      shortcut: "G",
      keywords: ["zaloguj", "login", "google", "konto", "auth", "signin", "rejestracja"],
    },
    {
      id: "client-portal",
      label: "Strefa Klienta (Briefy, Zakładki, Konsultacje)",
      category: "Akcje",
      icon: Bookmark,
      action: () => {
        onClose();
        if (onOpenClientPortal) onOpenClientPortal();
      },
      shortcut: "P",
      keywords: ["strefa", "klient", "portal", "brief", "zakladki", "historia"],
    },

    // Inne Akcje
    {
      id: "theme",
      label: `Przełącz na tryb ${resolvedTheme === "dark" ? "jasny" : "ciemny"}`,
      category: "Akcje",
      icon: resolvedTheme === "dark" ? Sun : Moon,
      action: toggleTheme,
      shortcut: "T",
      keywords: ["motyw", "theme", "dark", "light", "ciemny", "jasny"],
    },
    {
      id: "email",
      label: "Kopiuj adres e-mail (kontakt@gkdev.pl)",
      category: "Akcje",
      icon: copied ? Check : Copy,
      action: copyEmail,
      shortcut: "E",
      keywords: ["mail", "email", "kontakt", "schowek"],
    },
    {
      id: "cv",
      label: "Pobierz plik CV (PDF)",
      category: "Akcje",
      icon: Download,
      action: downloadCv,
      shortcut: "C",
      keywords: ["cv", "resume", "zyciorys", "pdf"],
    },
    {
      id: "terminal",
      label: "Otwórz Interaktywny Terminal CLI (Shell)",
      category: "Akcje",
      icon: Terminal,
      action: () => {
        onClose();
        if (onOpenTerminal) onOpenTerminal();
      },
      shortcut: "~",
      keywords: ["terminal", "cli", "shell", "hacker", "bash", "komendy"],
    },
    {
      id: "ai",
      label: "Zapytaj Asystenta GK AI Architect",
      category: "Akcje",
      icon: Bot,
      action: () => {
        onClose();
        if (onOpenAi) onOpenAi();
      },
      shortcut: "AI",
      keywords: ["ai", "bot", "asystent", "pytanie", "architekt", "pomoc", "rekrutacja", "stawki"],
    },
    {
      id: "accent-blue",
      label: "Akcent: Electric Blue (Klasyczny Niebieski)",
      category: "Akcje",
      icon: Palette,
      action: () => {
        setGlobalAccent("blue");
        onClose();
        toast({ title: "Zmieniono motyw", description: "Akcent zmieniony na Electric Blue." });
      },
      keywords: ["kolor", "niebieski", "blue", "akcent", "paleta"],
    },
    {
      id: "accent-emerald",
      label: "Akcent: Cyber Emerald (Matrix Szmaragd)",
      category: "Akcje",
      icon: Palette,
      action: () => {
        setGlobalAccent("emerald");
        onClose();
        toast({ title: "Zmieniono motyw", description: "Akcent zmieniony na Cyber Emerald." });
      },
      keywords: ["kolor", "zielony", "szmaragd", "emerald", "matrix", "akcent"],
    },
    {
      id: "accent-violet",
      label: "Akcent: Neon Violet (Aurora Fiolet)",
      category: "Akcje",
      icon: Palette,
      action: () => {
        setGlobalAccent("violet");
        onClose();
        toast({ title: "Zmieniono motyw", description: "Akcent zmieniony na Neon Violet." });
      },
      keywords: ["kolor", "fioletowy", "violet", "aurora", "akcent"],
    },
    {
      id: "accent-amber",
      label: "Akcent: Warm Amber (Złocisty Bursztyn)",
      category: "Akcje",
      icon: Palette,
      action: () => {
        setGlobalAccent("amber");
        onClose();
        toast({ title: "Zmieniono motyw", description: "Akcent zmieniony na Warm Amber." });
      },
      keywords: ["kolor", "bursztyn", "amber", "zloty", "akcent"],
    },

    // Społecznościowe
    { id: "github", label: "Odwiedź profil GitHub (@catsy86-ops)", category: "Społecznościowe", icon: Github, action: () => { window.open("https://github.com/catsy86-ops", "_blank"); onClose(); }, keywords: ["github", "kod", "repozytoria", "git"] },
    { id: "linkedin", label: "Odwiedź profil LinkedIn", category: "Społecznościowe", icon: Linkedin, action: () => { window.open("https://linkedin.com", "_blank"); onClose(); }, keywords: ["linkedin", "kontakt", "social", "rekrutacja"] },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase();
    const matchesLabel = item.label.toLowerCase().includes(q);
    const matchesCategory = item.category.toLowerCase().includes(q);
    const matchesKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
    return matchesLabel || matchesCategory || matchesKeywords;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-[15vh] px-4 overflow-hidden pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            />

            {/* Modal Box */}
            <motion.div
              className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 font-['Geist'] pointer-events-auto"
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-label="Paleta poleceń"
            >
              {/* Search Bar */}
              <div className="flex items-center px-4 border-b border-border/60 bg-secondary/30">
                <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Szukaj sekcji lub wpisz polecenie... (np. projekty, ciemny, zaloguj)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent py-3.5 text-sm outline-none text-foreground placeholder:text-muted-foreground font-sans"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Brak wyników dla zapytania "{query}"
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-secondary/80 text-foreground transition-colors text-left text-xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary/10 transition-colors">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-[11px] font-mono text-muted-foreground">{item.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.shortcut && (
                          <span className="rounded-md border border-border/60 bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {item.shortcut}
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer Toolbar */}
              <div className="border-t border-border/50 bg-secondary/30 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Nawigacja błyskawiczna
                </span>
                <span>{filteredItems.length} pozycji</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dedicated Auth Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>,
    document.body
  );
};

export default CommandPalette;
