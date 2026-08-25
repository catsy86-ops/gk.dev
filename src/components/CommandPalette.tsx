import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";

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
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
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

    // Akcje
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

    // Społecznościowe
    {
      id: "github",
      label: "Otwórz profil GitHub (@gkdev)",
      category: "Społecznościowe",
      icon: Github,
      action: () => {
        window.open("https://github.com/gkdev", "_blank", "noopener,noreferrer");
        onClose();
      },
      keywords: ["git", "github", "repo", "kod"],
    },
    {
      id: "linkedin",
      label: "Otwórz profil LinkedIn",
      category: "Społecznościowe",
      icon: Linkedin,
      action: () => {
        window.open("https://linkedin.com/in/gkdev", "_blank", "noopener,noreferrer");
        onClose();
      },
      keywords: ["linkedin", "social", "profil"],
    },
  ];

  const q = query.toLowerCase().trim();
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.id.toLowerCase().includes(q) ||
    (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
  );

  // Global key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-xl rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Wyszukiwarka i menu poleceń"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
              <Search className="h-5 w-5 text-primary shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Szukaj sekcji, akcji, projektów..."
                className="w-full bg-transparent font-['Geist'] text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <span className="rounded-md border border-border/60 bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </span>
            </div>

            {/* Results list */}
            <div className="max-h-[380px] overflow-y-auto p-2 sm:p-3 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-10 text-center text-sm font-['Geist'] text-muted-foreground">
                  Brak wyników dla "{query}"
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left font-['Geist'] text-sm text-foreground hover:bg-secondary/80 hover:text-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
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

            {/* Footer tips */}
            <div className="flex items-center justify-between border-t border-border/40 bg-secondary/40 px-5 py-2.5 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-background/80 px-1.5 py-0.5 border border-border/60 text-[10px]">↑↓</kbd> Nawigacja
                <kbd className="rounded bg-background/80 px-1.5 py-0.5 border border-border/60 text-[10px] ml-2">↵</kbd> Wybierz
              </span>
              <span>GK.dev Command Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
