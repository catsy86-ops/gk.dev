import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Minimize2, Bot } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticMedium } from "@/lib/haptics";
import { queryAiAssistant } from "@/lib/ai-engine";

interface TerminalDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: string | JSX.Element;
}

const welcomeOutput = (
  <div className="space-y-1 text-emerald-400">
    <p className="font-bold">GK.dev Interactive Shell v2.6.0 [x86_64-pc-none-elf]</p>
    <p className="text-muted-foreground text-xs">Wpisz <span className="text-emerald-300 font-bold">'help'</span>, aby wyświetlić listę dostępnych poleceń CLI.</p>
  </div>
);

export const TerminalDialog = ({ isOpen, onClose }: TerminalDialogProps) => {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: "init", command: "", output: welcomeOutput },
  ]);
  const [matrixActive, setMatrixActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    soundEngine.playPop(700, 0.03);

    if (trimmed === "clear") {
      setLogs([]);
      setInputVal("");
      return;
    }

    if (trimmed === "exit") {
      onClose();
      setInputVal("");
      return;
    }

    let outputNode: string | JSX.Element = "";

    if (trimmed.startsWith("ai ") || trimmed.startsWith("ask ") || trimmed === "ai" || trimmed === "ask") {
      const q = trimmed.replace(/^(ai|ask)\s*/, "").trim();
      const res = queryAiAssistant(q || "Cześć");
      outputNode = (
        <div className="space-y-1.5 text-xs text-foreground/90 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <Bot className="h-3.5 w-3.5" />
            <span>GK AI Architect:</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed">{res.answer}</p>
        </div>
      );
      setLogs((prev) => [...prev, { id: Date.now().toString(), command: cmd, output: outputNode }]);
      setInputVal("");
      return;
    }

    switch (trimmed) {
      case "help":
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-300 font-bold">Dostępne polecenia:</p>
            <p>• <span className="text-primary font-bold">ai &lt;pytanie&gt;</span> — Zapytaj asystenta GK AI Architect</p>
            <p>• <span className="text-primary font-bold">skills</span> — Wyświetla profil kompetencji i stack</p>
            <p>• <span className="text-primary font-bold">projects</span> — Lista najważniejszych realizacji komercyjnych</p>
            <p>• <span className="text-primary font-bold">whoami</span> — Krótkie bio inżyniera</p>
            <p>• <span className="text-primary font-bold">contact</span> — Dane kontaktowe i social media</p>
            <p>• <span className="text-primary font-bold">sudo hire</span> — Rozpoczyna współpracę i kieruje do formularza</p>
            <p>• <span className="text-primary font-bold">matrix</span> — Uruchamia tryb Matrix stream</p>
            <p>• <span className="text-primary font-bold">clear</span> — Czyści ekran terminala</p>
            <p>• <span className="text-primary font-bold">exit</span> — Zamyka okno terminala</p>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="space-y-1 text-xs text-foreground/90">
            <p className="text-cyan-400 font-bold">CORE STACK:</p>
            <p>⚡ Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS, Motion, Zustand</p>
            <p>🛠 Backend: Node.js, Express, NestJS, GraphQL, REST APIs, Microservices</p>
            <p>🗄 Bazy danych: PostgreSQL, Prisma, Drizzle, Redis, MongoDB</p>
            <p>☁️ Cloud & DevOps: AWS (S3, CloudFront, Lambda), Docker, CI/CD, Vercel</p>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="space-y-1 text-xs text-foreground/90">
            <p className="text-amber-400 font-bold">WYBRANE REALIZACJE:</p>
            <p>1. <span className="text-primary font-bold">Szczecin Styl</span> — E-commerce High Fashion (PageSpeed 98/100, Stripe)</p>
            <p>2. <span className="text-primary font-bold">Notatnik Cloud</span> — SaaS Second Brain (Offline-First, Realtime Sync)</p>
            <p>3. <span className="text-primary font-bold">Ghydra</span> — Project Management (WebSockets, Kanban Board)</p>
            <p>4. <span className="text-primary font-bold">Łysy Barber</span> — Studio Booking Platform & CMS</p>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <p className="text-xs text-foreground/90 leading-relaxed">
            Grzegorz — Senior Fullstack Developer & Architekt Oprogramowania z 7+ latami doświadczenia w projektowaniu wydajnych platform webowych.
          </p>
        );
        break;

      case "contact":
        outputNode = (
          <div className="space-y-1 text-xs text-foreground/90">
            <p>📧 Email: <a href="mailto:kontakt@gkdev.pl" className="text-primary underline">kontakt@gkdev.pl</a></p>
            <p>📍 Lokalizacja: Szczecin, Polska (CET)</p>
            <p>🐙 GitHub: <a href="https://github.com/gkdev" target="_blank" rel="noreferrer" className="text-primary underline">github.com/gkdev</a></p>
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
        }, 1200);
        break;

      case "matrix":
        setMatrixActive((prev) => !prev);
        outputNode = <p className="text-emerald-400 text-xs font-mono">Matrix rain {matrixActive ? "wyłączony" : "aktywowany"}!</p>;
        break;

      case "":
        outputNode = "";
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Terminal Window */}
          <motion.div
            className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-black/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden z-10 font-mono text-sm"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label="Interaktywny terminal deweloperski"
          >
            {/* Terminal Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-300">gk@dev-terminal:~</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="h-6 w-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Minimalizuj"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="h-6 w-6 rounded-md hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors"
                  aria-label="Zamknij terminal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto font-mono text-xs sm:text-sm">
              {logs.map((log) => (
                <div key={log.id} className="space-y-1.5">
                  {log.command && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="text-emerald-400 font-bold">gk@dev:~$</span>
                      <span className="text-white">{log.command}</span>
                    </div>
                  )}
                  {log.output && <div className="pl-4">{log.output}</div>}
                </div>
              ))}

              {/* Prompt Input Line */}
              <div className="flex items-center gap-2 pt-2 text-neutral-200">
                <span className="text-emerald-400 font-bold">gk@dev:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-emerald-300 focus:outline-none font-mono text-xs sm:text-sm caret-emerald-400"
                  autoFocus
                />
              </div>
              <div ref={bottomRef} />
            </div>

            {/* Terminal Footer */}
            <div className="px-4 py-2 bg-neutral-900/80 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Wpisz polecenie i naciśnij Enter</span>
              <span>Skrót: `~` lub ESC aby wyjść</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
