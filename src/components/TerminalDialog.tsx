import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Copy,
  Trash2,
  Palette,
  Gamepad2,
  Play,
  Check,
} from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight, hapticSuccess } from "@/lib/haptics";
import { queryAiAssistant } from "@/lib/ai-engine";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useAchievements } from "@/hooks/use-achievements";
import { toast } from "@/hooks/use-toast";

interface TerminalDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: string | React.ReactNode;
}

type TerminalTheme = "matrix" | "cyber" | "dracula" | "amber" | "synthwave";

const themeStyles: Record<
  TerminalTheme,
  {
    bg: string;
    border: string;
    text: string;
    prompt: string;
    glow: string;
    headerBg: string;
  }
> = {
  matrix: {
    bg: "bg-black/95",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    prompt: "text-emerald-400",
    glow: "shadow-[0_0_50px_rgba(16,185,129,0.25)]",
    headerBg: "bg-neutral-950",
  },
  cyber: {
    bg: "bg-[#090d16]/95",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    prompt: "text-cyan-400",
    glow: "shadow-[0_0_50px_rgba(6,182,212,0.25)]",
    headerBg: "bg-[#040810]",
  },
  dracula: {
    bg: "bg-[#1e1f29]/95",
    border: "border-purple-500/40",
    text: "text-purple-300",
    prompt: "text-pink-400",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.25)]",
    headerBg: "bg-[#181920]",
  },
  amber: {
    bg: "bg-[#120c02]/95",
    border: "border-amber-500/40",
    text: "text-amber-400",
    prompt: "text-amber-400",
    glow: "shadow-[0_0_50px_rgba(245,158,11,0.25)]",
    headerBg: "bg-[#0a0701]",
  },
  synthwave: {
    bg: "bg-[#180826]/95",
    border: "border-fuchsia-500/40",
    text: "text-fuchsia-300",
    prompt: "text-cyan-400",
    glow: "shadow-[0_0_50px_rgba(217,70,239,0.25)]",
    headerBg: "bg-[#0f0418]",
  },
};

const asciiBanner = `
   ______   __ __           __          
  / ____/  / //_/  ____/ / ___   _   __
 / / _    / ,<    / __  / / _ \\ | | / /
/ /_/ /  / /| |  / /_/ / /  __/ | |/ / 
\\____/  /_/ |_|  \\__,_/  \\___/  |___/  
=========================================
  GK.dev Modern Developer Shell v3.0
=========================================`;

// Interactive Matrix Rain Component inside Terminal
const MatrixRainCanvas = ({ active, color = "#10b981" }: { active: boolean; color?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const columns = Math.floor(width / 16);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "010101XYZGKDEVREACTNEXTJS999";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = "12px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, drops[i] * 16);

        if (drops[i] * 16 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [active, color]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-25 z-0"
    />
  );
};

// Retro Terminal Snake Game
const TerminalSnakeGame = ({ onExit }: { onExit: () => void }) => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 10 });
  const [dir, setDir] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const gridSize = 20;

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setFood({ x: 15, y: 10 });
    setDir("RIGHT");
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code) && dirRef.current !== "DOWN") setDir("UP");
      if (["ArrowDown", "KeyS"].includes(e.code) && dirRef.current !== "UP") setDir("DOWN");
      if (["ArrowLeft", "KeyA"].includes(e.code) && dirRef.current !== "RIGHT") setDir("LEFT");
      if (["ArrowRight", "KeyD"].includes(e.code) && dirRef.current !== "LEFT") setDir("RIGHT");
      if (e.key === "q" || e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        if (dirRef.current === "UP") head.y -= 1;
        if (dirRef.current === "DOWN") head.y += 1;
        if (dirRef.current === "LEFT") head.x -= 1;
        if (dirRef.current === "RIGHT") head.x += 1;

        // Collision with walls
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
          setGameOver(true);
          soundEngine.playPop(300, 0.08);
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          soundEngine.playPop(300, 0.08);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          soundEngine.playPop(850, 0.02);
          hapticSuccess();
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [food, gameOver]);

  return (
    <div className="p-4 bg-black/80 rounded-2xl border border-emerald-500/40 text-center font-mono space-y-3">
      <div className="flex items-center justify-between text-xs text-emerald-400 border-b border-emerald-500/30 pb-2">
        <span className="font-bold flex items-center gap-1">
          <Gamepad2 className="h-4 w-4" /> RETRO SNAKE CLI
        </span>
        <span className="font-bold">WYNIK: {score} PKT</span>
        <button
          onClick={onExit}
          className="text-muted-foreground hover:text-white px-2 py-0.5 rounded border border-border/60 text-[10px]"
        >
          Wyjdź [Q]
        </button>
      </div>

      {/* Game Grid */}
      <div
        className="mx-auto bg-neutral-950 border border-neutral-800 rounded-lg relative overflow-hidden"
        style={{ width: "240px", height: "240px" }}
      >
        {snake.map((seg, i) => (
          <div
            key={i}
            className={`absolute rounded-sm ${i === 0 ? "bg-emerald-400 shadow-sm" : "bg-emerald-600"}`}
            style={{
              width: "11px",
              height: "11px",
              left: `${seg.x * 12}px`,
              top: `${seg.y * 12}px`,
            }}
          />
        ))}

        <div
          className="absolute bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"
          style={{
            width: "11px",
            height: "11px",
            left: `${food.x * 12}px`,
            top: `${food.y * 12}px`,
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center space-y-2 p-2">
            <p className="text-red-400 font-bold text-sm">GAME OVER!</p>
            <p className="text-xs text-slate-300">Zdobyto: {score} pkt</p>
            <button
              onClick={resetGame}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded"
            >
              Zagraj ponownie
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Sterowanie: <kbd className="text-emerald-400 font-bold">W/A/S/D</kbd> lub <kbd className="text-emerald-400 font-bold">Strzałki</kbd>
      </p>
    </div>
  );
};

export const TerminalDialog = ({ isOpen, onClose }: TerminalDialogProps) => {
  useScrollLock(isOpen);
  const { unlock } = useAchievements();
  const [inputVal, setInputVal] = useState("");
  const [theme, setTheme] = useState<TerminalTheme>("matrix");
  const [matrixActive, setMatrixActive] = useState(false);
  const [isPlayingSnake, setIsPlayingSnake] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedLogs, setCopiedLogs] = useState(false);

  // Command History Navigation
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const initialOutput = (
    <div className="space-y-2">
      <pre className="text-[10px] sm:text-xs leading-tight opacity-90 hidden sm:block font-bold">
        {asciiBanner}
      </pre>
      <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5" /> GK.dev Interactive Shell v3.0 [TypeScript / Node.js Engine]
        </p>
        <p className="text-muted-foreground text-[11px]">
          Wpisz <span className="font-bold text-emerald-400">'help'</span>, aby zobaczyć polecenia. Wypróbuj niespodzianki: <span className="font-bold text-cyan-400">'snake'</span>, <span className="font-bold text-cyan-400">'matrix'</span>, <span className="font-bold text-cyan-400">'neofetch'</span>, <span className="font-bold text-cyan-400">'theme cyber'</span>.
        </p>
      </div>
    </div>
  );

  const [logs, setLogs] = useState<CommandLog[]>([
    { id: "init", command: "", output: initialOutput },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentTheme = themeStyles[theme] || themeStyles.matrix;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [logs, isPlayingSnake]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    soundEngine.playPop(700, 0.03);
    unlock("terminal_hacker");

    // Save to command history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const lower = trimmed.toLowerCase();

    if (lower === "clear" || lower === "cls") {
      setLogs([]);
      setInputVal("");
      return;
    }

    if (lower === "exit" || lower === "quit") {
      onClose();
      setInputVal("");
      return;
    }

    let outputNode: string | React.ReactNode = "";

    // AI Query command
    if (lower.startsWith("ai ") || lower.startsWith("ask ") || lower === "ai" || lower === "ask") {
      const q = trimmed.replace(/^(ai|ask)\s*/i, "").trim();
      const res = queryAiAssistant(q || "Cześć! W czym możesz mi pomóc?");
      outputNode = (
        <div className="space-y-1.5 text-xs text-foreground/90 bg-primary/10 border border-primary/30 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>GK AI Architect Response:</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed">{res.answer}</p>
        </div>
      );
      setLogs((prev) => [...prev, { id: Date.now().toString(), command: cmd, output: outputNode }]);
      setInputVal("");
      return;
    }

    // Theme switch command
    if (lower.startsWith("theme ")) {
      const selectedTheme = lower.replace("theme ", "").trim() as TerminalTheme;
      if (themeStyles[selectedTheme]) {
        setTheme(selectedTheme);
        soundEngine.playChime();
        hapticSuccess();
        unlock("theme_curator");
        outputNode = <p className="text-xs font-bold">Zmieniono motyw terminala na: '{selectedTheme}'.</p>;
      } else {
        outputNode = <p className="text-xs text-red-400">Dostępne motywy: matrix, cyber, dracula, amber, synthwave.</p>;
      }
      setLogs((prev) => [...prev, { id: Date.now().toString(), command: cmd, output: outputNode }]);
      setInputVal("");
      return;
    }

    if (lower === "pwa clear" || lower === "cache clear") {
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((k) => caches.delete(k));
        });
      }
      outputNode = <p className="text-xs text-emerald-400 font-bold">Pamięć podręczna PWA Service Worker została wyczyszczona.</p>;
      setLogs((prev) => [...prev, { id: Date.now().toString(), command: cmd, output: outputNode }]);
      setInputVal("");
      return;
    }

    switch (lower) {
      case "help":
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-300 font-bold border-b border-border/40 pb-1 mb-1">
              Dostępne Polecenia Systemowe CLI:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <p>• <span className="text-primary font-bold">neofetch</span> — Statystyki profilu i technologie</p>
              <p>• <span className="text-primary font-bold">snake</span> — Mini-gra retro Snake w oknie terminala</p>
              <p>• <span className="text-primary font-bold">matrix</span> — Włącz/wyłącz cyfrowy deszcz Matrix</p>
              <p>• <span className="text-primary font-bold">ai &lt;pytanie&gt;</span> — Zapytaj inteligentnego asystenta AI</p>
              <p>• <span className="text-primary font-bold">pwa / offline</span> — Status pamięci podręcznej i trybu Offline</p>
              <p>• <span className="text-primary font-bold">skills</span> — Profil kompetencji i stack technologiczny</p>
              <p>• <span className="text-primary font-bold">projects</span> — Najważniejsze wdrożenia i case studies</p>
              <p>• <span className="text-primary font-bold">theme &lt;nazwa&gt;</span> — matrix | cyber | dracula | amber | synthwave</p>
              <p>• <span className="text-primary font-bold">whoami</span> — O autorze i doświadczeniu</p>
              <p>• <span className="text-primary font-bold">contact</span> — Dane kontaktowe i social media</p>
              <p>• <span className="text-primary font-bold">play</span> — Synteza 8-bitowej melodii audio</p>
              <p>• <span className="text-primary font-bold">sudo hire</span> — Rozpocznij projekt ze mną</p>
              <p>• <span className="text-primary font-bold">clear / cls</span> — Wyczyść ekran terminala</p>
              <p>• <span className="text-primary font-bold">exit</span> — Zamknij terminal</p>
            </div>
          </div>
        );
        break;

      case "pwa":
      case "offline":
      case "cache":
        outputNode = (
          <div className="space-y-1 font-mono text-[11px]">
            <p className="text-emerald-400 font-bold">⚡ PWA & Offline Engine v2.0</p>
            <p>• <span className="text-primary">Status Sieci:</span> {typeof navigator !== "undefined" && navigator.onLine ? "ONLINE 🟢 (Synchronizacja aktywna)" : "OFFLINE 🟡 (Cache PWA)"}</p>
            <p>• <span className="text-primary">Service Worker:</span> {typeof navigator !== "undefined" && "serviceWorker" in navigator ? "Zarejestrowany (/sw.js)" : "Brak wsparcia"}</p>
            <p>• <span className="text-primary">Pamięć Podręczna:</span> gkdev-core-v2, gkdev-assets-v2, gkdev-runtime-v2</p>
            <p className="text-muted-foreground pt-1">Polecenie konserwacji: <span className="text-foreground font-bold">pwa clear</span> (czyści pamięć podręczną SW).</p>
          </div>
        );
        break;

      case "neofetch":
      case "info":
        outputNode = (
          <div className="flex flex-col sm:flex-row items-start gap-4 text-xs">
            <div className="text-primary font-mono text-[10px] leading-none hidden sm:block">
              {`
   .---.
  /     \\
 | () () |
  \\  _  /
   \`---\`
  GK.dev`}
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <p><strong className="text-primary">OS:</strong> GK.dev Architecture Cloud v2026.1</p>
              <p><strong className="text-primary">Host:</strong> Grzegorz (Mid Fullstack Developer — Samouk, Szczecin)</p>
              <p><strong className="text-primary">Uptime:</strong> 2500+ godzin praktycznego kodowania & projektów</p>
              <p><strong className="text-primary">Frontend:</strong> React 19, Next.js 15, TypeScript, Tailwind CSS, Motion</p>
              <p><strong className="text-primary">Backend:</strong> Node.js, Express, NestJS, PostgreSQL, Redis, REST/GraphQL</p>
              <p><strong className="text-primary">Cloud:</strong> AWS, Docker, Vercel, Supabase, Cloudflare</p>
              <p><strong className="text-primary">Lighthouse:</strong> 100/100 Performance & SEO Sub-Second TTFB</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="h-3 w-4 bg-red-500 rounded-xs" />
                <span className="h-3 w-4 bg-green-500 rounded-xs" />
                <span className="h-3 w-4 bg-yellow-500 rounded-xs" />
                <span className="h-3 w-4 bg-blue-500 rounded-xs" />
                <span className="h-3 w-4 bg-purple-500 rounded-xs" />
                <span className="h-3 w-4 bg-cyan-500 rounded-xs" />
              </div>
            </div>
          </div>
        );
        break;

      case "snake":
      case "game":
        setIsPlayingSnake(true);
        outputNode = <p className="text-xs text-emerald-400">Uruchamianie minigry Retro Snake...</p>;
        break;

      case "matrix":
        setMatrixActive((prev) => !prev);
        outputNode = (
          <p className="text-xs font-bold">
            Matrix Digital Rain został {matrixActive ? "wyłączony" : "aktywowany"}!
          </p>
        );
        break;

      case "play":
      case "melody":
      case "music":
        soundEngine.playChime();
        hapticSuccess();
        outputNode = <p className="text-xs text-primary">🎵 Odtwarzanie 8-bitowej syntezy Web Audio API...</p>;
        break;

      case "skills":
        outputNode = (
          <div className="space-y-1 text-xs text-foreground/90">
            <p className="text-cyan-400 font-bold">PEŁNY PROFIL TECHNOLOGICZNY:</p>
            <p>⚡ Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS, Motion, Zustand</p>
            <p>🛠 Backend: Node.js, Express, NestJS, GraphQL, REST APIs, Microservices</p>
            <p>🗄 Bazy danych: PostgreSQL, Prisma, Drizzle, Redis, IndexedDB</p>
            <p>☁️ Cloud & DevOps: AWS (S3, CloudFront, Lambda), Docker, CI/CD, Vercel</p>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="space-y-1 text-xs text-foreground/90">
            <p className="text-amber-400 font-bold">WYBRANE REALIZACJE:</p>
            <p>1. <span className="text-primary font-bold">Przypominacz Tasks</span> — SaaS Daily Planner (IndexedDB, PWA, Offline-First)</p>
            <p>2. <span className="text-primary font-bold">Szczecin Styl</span> — E-commerce High Fashion (Speed 98, Stripe API)</p>
            <p>3. <span className="text-primary font-bold">Notatnik Cloud</span> — SaaS Second Brain (Realtime Sync, Postgres)</p>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <p className="text-xs text-foreground/90 leading-relaxed">
            Grzegorz — Mid Fullstack Developer & Pasjonat Samouk ze Szczecina. Tworzę nowoczesne, szybkie i czyste aplikacje internetowe w standardzie NoFluffJobs.
          </p>
        );
        break;

      case "contact":
        outputNode = (
          <div className="space-y-1 text-xs text-foreground/90">
            <p>📧 Email: <a href="mailto:kontakt@gkdev.pl" className="text-primary underline">kontakt@gkdev.pl</a></p>
            <p>📍 Lokalizacja: Szczecin, Polska (CET)</p>
            <p>🐙 GitHub: <a href="https://github.com/catsy86" target="_blank" rel="noreferrer" className="text-primary underline">github.com/catsy86</a></p>
          </div>
        );
        break;

      case "sudo hire":
      case "hire":
        hapticMedium();
        soundEngine.playChime();
        outputNode = (
          <div className="space-y-1 text-xs text-emerald-400 font-bold">
            <p>🚀 [AUTH GRANTED] Przekierowanie do formularza kontaktu...</p>
          </div>
        );
        setTimeout(() => {
          onClose();
          document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
        }, 1000);
        break;

      default:
        outputNode = (
          <p className="text-xs text-destructive">
            bash: polecenie nieznane: '{cmd}'. Wpisz <span className="underline font-bold">'help'</span> aby zobaczyć listę.
          </p>
        );
        break;
    }

    setLogs((prev) => [
      ...prev,
      { id: String(Date.now()), command: cmd, output: outputNode },
    ]);
    setInputVal("");
  }, [matrixActive, onClose, unlock]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal("");
        } else {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commandsList = ["help", "neofetch", "snake", "matrix", "ai", "skills", "projects", "whoami", "contact", "sudo hire", "clear", "theme"];
      const match = commandsList.find((c) => c.startsWith(inputVal.trim().toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const handleCopyAllLogs = () => {
    const text = logs
      .map((l) => `${l.command ? `gk@dev:~$ ${l.command}\n` : ""}${typeof l.output === "string" ? l.output : ""}`)
      .join("\n");
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedLogs(true);
    soundEngine.playPop(850, 0.02);
    toast({ title: "Skopiowano zawartość terminala", description: "Logi CLI zapisano w schowku." });
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer pointer-events-auto"
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

          {/* Terminal Window */}
          <motion.div
            className={`relative w-full rounded-2xl border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.glow} ${currentTheme.text} backdrop-blur-2xl overflow-hidden z-10 font-mono text-sm pointer-events-auto flex flex-col transition-all duration-300 ${
              isMaximized ? "max-w-5xl h-[85vh]" : "max-w-2xl max-h-[75vh]"
            }`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Interaktywny terminal deweloperski"
          >
            {/* Matrix Rain Canvas Background */}
            <MatrixRainCanvas active={matrixActive} color={theme === "cyber" ? "#06b6d4" : "#10b981"} />

            {/* Window Header */}
            <div className={`flex items-center justify-between px-4 py-2.5 ${currentTheme.headerBg} border-b border-neutral-800 relative z-20`}>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} title="Zamknij" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} title="Zmień rozmiar" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80 cursor-pointer" onClick={() => setMatrixActive(!matrixActive)} title="Matrix toggle" />
                </div>
                <span className="text-xs font-bold text-neutral-300 ml-2">gk@dev-terminal:~ ({theme})</span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPlayingSnake(!isPlayingSnake)}
                  className="h-6 px-2 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
                  title="Graj w Snake"
                >
                  <Gamepad2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Snake</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAllLogs}
                  className="h-6 w-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Kopiuj logi"
                >
                  {copiedLogs ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const themes: TerminalTheme[] = ["matrix", "cyber", "dracula", "amber", "synthwave"];
                    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
                    setTheme(next);
                    soundEngine.playPop(800, 0.02);
                  }}
                  className="h-6 w-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Zmień motyw CLI"
                >
                  <Palette className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => { setLogs([]); }}
                  className="h-6 w-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Wyczyść terminal"
                >
                  <Trash2 className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="h-6 w-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title={isMaximized ? "Przywróć" : "Maksymalizuj"}
                >
                  {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="h-6 w-6 rounded-md hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Zamknij terminal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Main Area */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto font-mono text-xs sm:text-sm flex-1 relative z-10 scrollbar-thin">
              {isPlayingSnake ? (
                <TerminalSnakeGame onExit={() => setIsPlayingSnake(false)} />
              ) : (
                <>
                  {logs.map((log) => (
                    <div key={log.id} className="space-y-1.5">
                      {log.command && (
                        <div className="flex items-center gap-2 text-neutral-400">
                          <span className={`${currentTheme.prompt} font-bold`}>gk@dev:~$</span>
                          <span className="text-white">{log.command}</span>
                        </div>
                      )}
                      {log.output && <div className="pl-2 sm:pl-4">{log.output}</div>}
                    </div>
                  ))}

                  {/* Prompt Input Line */}
                  <div className="flex items-center gap-2 pt-2 text-neutral-200">
                    <span className={`${currentTheme.prompt} font-bold`}>gk@dev:~$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent focus:outline-none font-mono text-xs sm:text-sm caret-emerald-400 text-foreground"
                      placeholder="Wpisz komendę (np. help, snake, ai, neofetch)..."
                      autoFocus
                    />
                  </div>
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Terminal Footer */}
            <div className={`px-4 py-2 ${currentTheme.headerBg} border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between relative z-20`}>
              <div className="flex items-center gap-3">
                <span>Tab: autouzupełnianie</span>
                <span className="hidden sm:inline">↑↓: historia</span>
              </div>
              <span className="font-bold text-neutral-400">Skrót: `~` lub ESC aby wyjść</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TerminalDialog;
