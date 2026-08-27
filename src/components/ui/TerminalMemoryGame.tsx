import { useState, useEffect, useCallback } from "react";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { useAchievements } from "@/hooks/use-achievements";
import { triggerConfetti } from "@/lib/confetti";

const PAIRS = [
  { emoji: "⚛️",  label: "React" },
  { emoji: "🔷",  label: "TypeScript" },
  { emoji: "🟢",  label: "Node.js" },
  { emoji: "▲",   label: "Next.js" },
  { emoji: "🐘",  label: "PostgreSQL" },
  { emoji: "🌊",  label: "Tailwind" },
  { emoji: "🐙",  label: "Git" },
  { emoji: "☁️",  label: "AWS" },
];

interface Card {
  id: number;
  emoji: string;
  label: string;
  revealed: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const doubled = [...PAIRS, ...PAIRS];
  return shuffle(doubled).map((p, id) => ({
    id,
    emoji: p.emoji,
    label: p.label,
    revealed: false,
    matched: false,
  }));
}

interface TerminalMemoryGameProps {
  theme: string;
  onExit: () => void;
}

const themeColor: Record<string, string> = {
  matrix: "text-emerald-400",
  cyber: "text-cyan-400",
  dracula: "text-purple-300",
  amber: "text-amber-400",
  synthwave: "text-pink-400",
};

const themeSelected: Record<string, string> = {
  matrix: "bg-emerald-500/30 border-emerald-400",
  cyber: "bg-cyan-500/30 border-cyan-400",
  dracula: "bg-purple-500/30 border-purple-400",
  amber: "bg-amber-500/30 border-amber-400",
  synthwave: "bg-pink-500/30 border-pink-400",
};

export const TerminalMemoryGame = ({ theme, onExit }: TerminalMemoryGameProps) => {
  const { unlock } = useAchievements();
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const color = themeColor[theme] ?? themeColor.matrix;
  const sel = themeSelected[theme] ?? themeSelected.matrix;

  // Timer
  useEffect(() => {
    if (!started || won) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [started, won]);

  // Win detection
  useEffect(() => {
    if (matched.length === PAIRS.length * 2 && matched.length > 0) {
      setWon(true);
      triggerConfetti();
      unlock("memory_champion");
    }
  }, [matched, unlock]);

  // ESC handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q" || e.key === "Q") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  const handleCard = useCallback((id: number) => {
    if (locked || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.revealed || card.matched) return;
    if (flipped.includes(id)) return;
    if (flipped.length === 2) return;

    if (!started) setStarted(true);
    hapticLight();
    soundEngine.playPop(750, 0.02);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, revealed: true } : c)));

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [aId, bId] = newFlipped;
      const a = cards.find((c) => c.id === aId)!;
      const b = cards.find((c) => c.id === bId)!;

      if (a.emoji === b.emoji) {
        // Match!
        hapticSuccess();
        soundEngine.playChime();
        setMatched((prev) => [...prev, aId, bId]);
        setCards((prev) =>
          prev.map((c) => (c.id === aId || c.id === bId ? { ...c, matched: true, revealed: true } : c))
        );
        setFlipped([]);
      } else {
        // No match — flip back
        setLocked(true);
        soundEngine.playPop(350, 0.04);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === aId || c.id === bId ? { ...c, revealed: false } : c
            )
          );
          setFlipped([]);
          setLocked(false);
        }, 850);
      }
    }
  }, [cards, flipped, locked, won, started]);

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setElapsed(0);
    setStarted(false);
    setWon(false);
    setLocked(false);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="p-3 bg-black/80 rounded-2xl border border-neutral-700/60 font-mono space-y-3 max-w-sm mx-auto">
      {/* Header */}
      <div className={`flex items-center justify-between text-[11px] border-b border-neutral-800 pb-2 ${color}`}>
        <span className="font-bold">🧠 STACK MEMORY GAME</span>
        <div className="flex items-center gap-3 text-neutral-400">
          <span>⏱ {fmt(elapsed)}</span>
          <span>🎯 {moves} ruchów</span>
          <button
            onClick={onExit}
            className="hover:text-white px-1.5 py-0.5 rounded border border-neutral-700 text-[10px]"
          >
            Wyjdź [Q]
          </button>
        </div>
      </div>

      {/* Win screen */}
      {won ? (
        <div className="text-center space-y-3 py-4">
          <p className={`text-lg font-bold ${color}`}>🏆 WYGRANA!</p>
          <p className="text-xs text-neutral-300">
            Czas: <span className={`font-bold ${color}`}>{fmt(elapsed)}</span> · Ruchy:{" "}
            <span className={`font-bold ${color}`}>{moves}</span>
          </p>
          <p className="text-[10px] text-neutral-500">Achievement odblokowany: 🧠 Memory Champion (+80 XP)</p>
          <button
            onClick={restart}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${sel} text-white hover:opacity-80 transition-opacity`}
          >
            Zagraj ponownie
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
            <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${color.replace("text-", "bg-")}`}
                style={{ width: `${(matched.length / (PAIRS.length * 2)) * 100}%` }}
              />
            </div>
            <span>{matched.length / 2}/{PAIRS.length} par</span>
          </div>

          {/* Grid 4x4 */}
          <div className="grid grid-cols-4 gap-1.5">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCard(card.id)}
                className={`relative h-12 rounded-xl border text-base font-bold transition-all duration-200 cursor-pointer ${
                  card.matched
                    ? `${sel} opacity-60 scale-95 border-opacity-40`
                    : card.revealed
                    ? `${sel} border`
                    : "bg-neutral-900 border-neutral-700 hover:bg-neutral-800 hover:border-neutral-500"
                }`}
                aria-label={card.revealed || card.matched ? card.label : "Ukryta karta"}
                disabled={locked || card.matched}
              >
                {card.revealed || card.matched ? (
                  <span className="text-base leading-none">{card.emoji}</span>
                ) : (
                  <span className={`text-xs font-mono ${color} opacity-30`}>?</span>
                )}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-neutral-600 text-center">
            Kliknij karty aby odkryć pary · ESC lub Q aby wyjść
          </p>
        </>
      )}
    </div>
  );
};
