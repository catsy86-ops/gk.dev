import { useState, useEffect, useCallback } from "react";
import { soundEngine } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlockedAt: string | null;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "terminal_hacker",
    title: "Terminal Hacker",
    description: "Uruchomiono i wykonano polecenia w interaktywnym CLI",
    icon: "💻",
    xp: 50,
    unlockedAt: null,
  },
  {
    id: "js_master",
    title: "JavaScript Master",
    description: "Rozwiązano quiz w darmowym kursie programowania",
    icon: "⚡",
    xp: 50,
    unlockedAt: null,
  },
  {
    id: "pwa_offline",
    title: "PWA Pioneer",
    description: "Przetestowano tryb Offline lub zainstalowano aplikację PWA",
    icon: "📱",
    xp: 50,
    unlockedAt: null,
  },
  {
    id: "theme_curator",
    title: "Aesthetic Curator",
    description: "Zmieniono motyw kolorystyczny lub styl terminala",
    icon: "🎨",
    xp: 30,
    unlockedAt: null,
  },
  {
    id: "sound_virtuoso",
    title: "Sound Virtuoso",
    description: "Wybrano profil dźwiękowy lub włączono efekty audio",
    icon: "🎵",
    xp: 30,
    unlockedAt: null,
  },
  {
    id: "architect_explorer",
    title: "Architecture Explorer",
    description: "Przeanalizowano case study i architekturę projektu",
    icon: "🔍",
    xp: 40,
    unlockedAt: null,
  },
  {
    id: "quote_creator",
    title: "Business Strategist",
    description: "Skonfigurowano wycenę projektu w kalkulatorze",
    icon: "🧮",
    xp: 40,
    unlockedAt: null,
  },
  {
    id: "matrix_hacker",
    title: "Matrix Reality Breach",
    description: "Przełamano barierę rzeczywistości i aktywowano 5s tryb Matrix",
    icon: "🕶️",
    xp: 75,
    unlockedAt: null,
  },
  {
    id: "gkinamp_dj",
    title: "GKinAmp Maestro",
    description: "Uruchomiono utwór MIDI, zmieniono skórkę lub włączono dźwięk przestrzenny 8D w GKinAmp",
    icon: "🎛️",
    xp: 60,
    unlockedAt: null,
  },
  {
    id: "beat_master",
    title: "Beat Catcher Master",
    description: "Zdobyto punkty w zręcznościowej minigrze rytmicznej w odtwarzaczu GKinAmp",
    icon: "🎮",
    xp: 80,
    unlockedAt: null,
  },
  {
    id: "gkgadu_pioneer",
    title: "GKgadu Pionier",
    description: "Napisano wiadomość lub wysłano Puk-Puk na żywo w komunikatorze GKgadu",
    icon: "☀️",
    xp: 50,
    unlockedAt: null,
  },
];

const STORAGE_KEY = "gk_dev_achievements";

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window === "undefined") return INITIAL_ACHIEVEMENTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Record<string, string> = JSON.parse(saved);
        return INITIAL_ACHIEVEMENTS.map((a) => ({
          ...a,
          unlockedAt: parsed[a.id] || null,
        }));
      }
    } catch {
      // Fallback
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const unlock = useCallback((id: string) => {
    setAchievements((prev) => {
      const item = prev.find((a) => a.id === id);
      if (!item || item.unlockedAt) return prev; // Already unlocked

      const now = new Date().toISOString();
      const updated = prev.map((a) => (a.id === id ? { ...a, unlockedAt: now } : a));

      // Save to localStorage
      try {
        const record: Record<string, string> = {};
        updated.forEach((a) => {
          if (a.unlockedAt) record[a.id] = a.unlockedAt;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      } catch {
        // Storage full or restricted
      }

      // Celebrate
      hapticSuccess();
      triggerConfetti();
      toast({
        title: `🏆 Odblokowano Osiągnięcie: ${item.title}!`,
        description: `+${item.xp} XP — ${item.description}`,
      });

      return updated;
    });
  }, []);

  const totalXp = achievements.reduce((acc, a) => (a.unlockedAt ? acc + a.xp : acc), 0);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  const getRank = () => {
    if (totalXp >= 250) return { title: "Lead AI Architect", level: "Senior ★★★", color: "text-amber-400" };
    if (totalXp >= 150) return { title: "Full-Stack Engineer", level: "Mid ★★", color: "text-primary" };
    if (totalXp >= 50) return { title: "Tech Explorer", level: "Junior ★", color: "text-emerald-400" };
    return { title: "Visitor", level: "Guest", color: "text-muted-foreground" };
  };

  return {
    achievements,
    unlock,
    totalXp,
    unlockedCount,
    totalCount: achievements.length,
    rank: getRank(),
  };
}
