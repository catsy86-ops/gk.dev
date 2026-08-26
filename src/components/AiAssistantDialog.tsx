import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Send, ArrowUpRight, User, RefreshCw } from "lucide-react";
import { queryAiAssistant, AiResponse } from "@/lib/ai-engine";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  suggestedAction?: { label: string; targetHref: string };
  isTyping?: boolean;
}

const quickPrompts = [
  "Czy Grzegorz jest dostępny do projektów B2B?",
  "Jaki jest główny stack technologiczny?",
  "Zaproponuj architekturę dla nowego MVP SaaS",
  "Ile kosztuje i ile trwa realizacja projektu?",
];

interface AiAssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantDialog = ({ isOpen, onClose }: AiAssistantDialogProps) => {
  useScrollLock(isOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Cześć! Jestem **GK AI Architect** — lokalnym asystentem inżynieryjnym Grzegorza.\n\nW czym mogę Ci dzisiaj pomóc? Wybierz jedno z gotowych pytań lub napisz własne w polu poniżej!",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    soundEngine.playPop(800, 0.03);
    hapticLight();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    const userMsgId = Date.now().toString();
    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, sender: "user", text: query },
    ];
    setMessages(newMessages);
    setInputQuery("");
    setIsGenerating(true);

    const result: AiResponse = queryAiAssistant(query);

    // Simulate typing stream effect
    typingTimeoutRef.current = setTimeout(() => {
      const aiMsgId = (Date.now() + 1).toString();
      let currentLength = 0;
      const fullText = result.answer;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          text: "",
          isTyping: true,
          suggestedAction: result.suggestedAction,
        },
      ]);

      typingIntervalRef.current = setInterval(() => {
        currentLength += 4;
        if (currentLength >= fullText.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, text: fullText, isTyping: false }
                : msg
            )
          );
          setIsGenerating(false);
          soundEngine.playChime();
          hapticSuccess();
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, text: fullText.slice(0, currentLength) }
                : msg
            )
          );
        }
      }, 15);
    }, 200);
  };

  const handleActionClick = (targetHref: string) => {
    soundEngine.playClick();
    hapticLight();
    onClose();
    const id = targetHref.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => el.scrollIntoView?.({ behavior: "smooth" }), 150);
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "Cześć! Jestem **GK AI Architect** — lokalnym asystentem inżynieryjnym Grzegorza.\n\nW czym mogę Ci dzisiaj pomóc? Wybierz jedno z gotowych pytań lub napisz własne w polu poniżej!",
      },
    ]);
  };

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 overflow-hidden pointer-events-auto">
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

          {/* Dialog Container */}
          <motion.div
            className="relative w-full max-w-2xl rounded-3xl border border-primary/30 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 pointer-events-auto"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Asystent GK AI Architect"
          >
            {/* Border Beam */}
            <BorderBeam size={220} duration={8} colorFrom="#3b82f6" colorTo="#10b981" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/70 bg-secondary/40 relative z-20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-md shadow-primary/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-['Geist'] text-base font-bold text-foreground flex items-center gap-2">
                    <span>GK AI Architect</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      100% Local • Free
                    </span>
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">Natychmiastowe odpowiedzi na temat stacku i dostępności</p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-30">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="h-8 w-8 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer pointer-events-auto"
                  title="Wyczyść rozmowę"
                  aria-label="Wyczyść rozmowę"
                >
                  <RefreshCw className="h-3.5 w-3.5 pointer-events-none" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="h-8 w-8 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer pointer-events-auto"
                  title="Zamknij"
                  aria-label="Zamknij"
                >
                  <X className="h-4 w-4 pointer-events-none" />
                </button>
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-['Geist'] text-sm scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mt-1">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-sm shadow-md"
                        : "bg-secondary/70 border border-border/80 text-foreground rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</div>

                    {msg.isTyping && (
                      <span className="inline-block h-3.5 w-1 bg-primary ml-1 animate-pulse" />
                    )}

                    {msg.suggestedAction && !msg.isTyping && (
                      <div className="mt-3 pt-3 border-t border-border/60 flex justify-start">
                        <button
                          type="button"
                          onClick={() => handleActionClick(msg.suggestedAction!.targetHref)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary/15 border border-primary/30 px-3 py-1.5 font-mono text-xs font-bold text-primary hover:bg-primary/25 transition-colors cursor-pointer"
                        >
                          <span>{msg.suggestedAction.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border text-foreground mt-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2.5 bg-secondary/30 border-t border-border/60 flex gap-2 overflow-x-auto scrollbar-none">
              {quickPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isGenerating}
                  className="shrink-0 text-left rounded-xl border border-border/70 bg-card/80 px-3 py-1.5 font-mono text-[11px] text-foreground/90 hover:border-primary hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-border/70 bg-card/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Napisz pytanie o doświadczenie, stack, wycenę..."
                  disabled={isGenerating}
                  className="flex-1 rounded-2xl border border-border/80 bg-secondary/70 px-4 py-2.5 text-xs sm:text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isGenerating}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shrink-0 cursor-pointer"
                  aria-label="Wyślij zapytanie"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
