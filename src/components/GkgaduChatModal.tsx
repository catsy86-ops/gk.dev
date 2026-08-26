import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  X,
  Minus,
  MessageSquare,
  Users,
  Send,
  Bell,
  BellOff,
  Sparkles,
  Zap,
  Smile,
  Circle,
  LogIn,
  CheckCircle2,
  Download,
  Search,
  Hash,
  Laptop,
  Briefcase,
  Lock,
  Check,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import {
  gkGaduEngine,
  GgStatus,
  GgContact,
  GgMessage,
  GkGaduRoom,
} from "@/lib/gkgadu-engine";
import { ggNotificationService } from "@/lib/gkgadu-notifications";
import { SignInButton } from "@clerk/clerk-react";
import { useSafeUser } from "@/hooks/use-safe-clerk";
import { useAchievements } from "@/hooks/use-achievements";
import { hapticLight, hapticSuccess, hapticSelection } from "@/lib/haptics";

interface GkgaduChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GG_EMOJIS: Record<string, string> = {
  ":)": "😊",
  ":-)": "😊",
  ":D": "😃",
  ":-D": "😃",
  ";)": "😉",
  ";-)": "😉",
  ":(": "🙁",
  ":-(": "🙁",
  "<lol>": "🤣",
  "<serce>": "❤️",
  "<piwo>": "🍺",
  "<cool>": "😎",
  "<zly>": "😡",
  "<papa>": "👋",
  "<kawa>": "☕",
};

const REACTION_OPTIONS = ["☀️", "❤️", "🚀", "🍺", "🔥", "👍"];

export const GkgaduChatModal = ({ isOpen, onClose }: GkgaduChatModalProps) => {
  const { user, isLoaded } = useSafeUser();
  const { unlock } = useAchievements();

  const [state, setState] = useState(gkGaduEngine.getState());
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isShaded, setIsShaded] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [customDesc, setCustomDesc] = useState("");
  const [activeHoverMessageId, setActiveHoverMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync Clerk user with GKgadu engine
  useEffect(() => {
    if (isLoaded) {
      gkGaduEngine.init(user);
    }
  }, [user, isLoaded]);

  // Subscribe to engine state updates
  useEffect(() => {
    const unsubscribe = gkGaduEngine.subscribe((newState) => {
      setState(newState);
      setCustomDesc(newState.currentUser.statusDescription);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [state.messages, state.activeChatId, state.typingUsers]);

  const parseEmoticons = (text: string) => {
    let result = text;
    Object.entries(GG_EMOJIS).forEach(([code, emoji]) => {
      result = result.split(code).join(emoji);
    });
    return result;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    hapticLight();
    gkGaduEngine.sendMessage(inputText);
    setInputText("");
    unlock("gkgadu_pioneer");
  };

  const handleSendNudge = () => {
    hapticSelection();
    gkGaduEngine.sendNudge();
    unlock("gkgadu_pioneer");
  };

  const handleReactionClick = (messageId: string, emoji: string) => {
    hapticSelection();
    gkGaduEngine.addReaction(messageId, emoji);
    setActiveHoverMessageId(null);
  };

  const handleStatusChange = (status: GgStatus) => {
    hapticLight();
    gkGaduEngine.setStatus(status);
    setShowStatusMenu(false);
  };

  const handleSaveDescription = () => {
    gkGaduEngine.setStatus(state.currentUser.status, customDesc);
    setIsEditingDesc(false);
    hapticSuccess();
  };

  const handleExportHistory = () => {
    hapticSuccess();
    gkGaduEngine.exportChatHistory(state.activeChatId);
  };

  const allMessages = state.messages[state.activeChatId] || [];
  const filteredMessages = searchQuery.trim()
    ? allMessages.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMessages;

  const currentRoom = state.rooms?.find((r) => r.id === state.activeChatId);
  const currentContact = state.contacts.find((c) => c.ggNumber.toString() === state.activeChatId);

  const activeTitle = currentRoom
    ? currentRoom.name
    : currentContact
    ? currentContact.name
    : "Pokój Główny (Lounge ☀️)";

  const activeDescription = currentRoom
    ? currentRoom.topic
    : currentContact
    ? currentContact.statusDescription
    : "Publiczny czat na żywo dla społeczności GK.dev";

  const getStatusColor = (status: GgStatus) => {
    switch (status) {
      case "online":
        return "text-amber-400 fill-amber-400";
      case "away":
        return "text-yellow-400 fill-yellow-400";
      case "busy":
        return "text-red-500 fill-red-500";
      case "invisible":
        return "text-slate-400 fill-slate-400";
      default:
        return "text-slate-600 fill-slate-600";
    }
  };

  const getStatusLabel = (status: GgStatus) => {
    switch (status) {
      case "online":
        return "Dostępny";
      case "away":
        return "Zaraz wracam";
      case "busy":
        return "Nie przeszkadzać";
      case "invisible":
        return "Niewidoczny";
      default:
        return "Niedostępny";
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={
        state.isNudgeActive
          ? {
              x: [-12, 12, -8, 8, -4, 4, 0],
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5 },
            }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: 30, scale: 0.96 }}
      drag
      className="fixed bottom-20 left-2 right-2 sm:bottom-auto sm:left-auto sm:top-20 sm:right-8 z-[99999] select-none font-['Geist'] text-xs shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden border border-amber-500/40 bg-[#0f172a]/95 backdrop-blur-2xl w-auto sm:w-[410px] max-w-[calc(100vw-16px)] max-h-[82vh] text-slate-200 flex flex-col pointer-events-auto"
      style={{
        boxShadow: "0 0 35px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* ── Title Bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] border-b border-amber-500/30 cursor-grab sm:cursor-grab active:cursor-grabbing text-xs font-bold text-slate-200">
        <div className="flex items-center gap-2">
          {/* GG Sun Monogram */}
          <div className="relative">
            <Sun className="h-4 w-4 text-amber-400 fill-amber-400 animate-[spin_12s_linear_infinite]" />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-black" />
          </div>
          <span className="font-black tracking-wider bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
            GKgadu 2026
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-extrabold flex items-center gap-1">
            <span>GG #{state.currentUser.ggNumber}</span>
            {state.currentUser.isLoggedIn && (
              <span className="text-[8px] text-emerald-400" title="Konto zweryfikowane Clerk">✨</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* E2EE indicator badge */}
          <span
            className="h-5 px-1.5 rounded flex items-center gap-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono font-bold"
            title="Szyfrowanie End-to-End AES-GCM-256 aktywne"
          >
            <Lock className="h-2.5 w-2.5" />
            <span className="hidden sm:inline">E2EE</span>
          </span>

          <button
            type="button"
            onClick={handleExportHistory}
            className="h-5 px-1.5 rounded flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 cursor-pointer text-[10px]"
            title="Eksportuj historię rozmowy do .txt"
          >
            <Download className="h-2.5 w-2.5 text-amber-400" />
            <span className="hidden sm:inline">TXT</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              gkGaduEngine.toggleSound();
              if (state.soundEnabled) {
                await ggNotificationService.requestPermission();
              }
            }}
            className="h-6 w-6 sm:h-5 sm:w-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 cursor-pointer"
            title={state.soundEnabled ? "Wycisz dźwięki GG / Powiadomienia" : "Włącz dźwięki GG i Powiadomienia"}
          >
            {state.soundEnabled ? (
              <Bell className="h-3 w-3 text-amber-400" />
            ) : (
              <BellOff className="h-3 w-3 text-slate-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsShaded(!isShaded)}
            className="h-6 w-6 sm:h-5 sm:w-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 cursor-pointer"
            title={isShaded ? "Rozwiń okno" : "Zwiń do paska"}
          >
            <Minus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 sm:h-5 sm:w-5 rounded flex items-center justify-center bg-red-950/80 hover:bg-red-700 text-red-300 border border-red-800/60 cursor-pointer"
            title="Zamknij GKgadu"
          >
            <X className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
          </button>
        </div>
      </div>

      {/* ── Main Chassis Body ───────────────────────────────────── */}
      {!isShaded && (
        <div className="flex flex-col bg-gradient-to-b from-[#0b1120] to-[#020617] p-2.5 space-y-2">
          {/* User Status Bar */}
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 shadow-inner relative">
            {/* Status Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold cursor-pointer"
              >
                <Sun className={`h-3.5 w-3.5 ${getStatusColor(state.currentUser.status)}`} />
                <span>{getStatusLabel(state.currentUser.status)}</span>
              </button>

              {/* Status Popover Menu */}
              {showStatusMenu && (
                <div className="absolute left-0 top-8 z-30 w-44 rounded-xl bg-slate-900 border border-slate-700 p-1 shadow-2xl space-y-0.5">
                  {(["online", "away", "busy", "invisible"] as GgStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <Sun className={`h-3 w-3 ${getStatusColor(st)}`} />
                      <span>{getStatusLabel(st)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Description / Motto */}
            <div className="flex-1 truncate">
              {isEditingDesc ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveDescription()}
                    className="w-full bg-black/60 border border-amber-500/50 rounded px-1.5 py-0.5 text-[11px] text-amber-200 outline-none"
                    placeholder="Wpisz swój opis GG..."
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveDescription}
                    className="h-5 px-1.5 rounded bg-amber-500 text-black font-bold text-[10px]"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingDesc(true)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 truncate block w-full text-left cursor-pointer italic"
                  title="Kliknij, aby zmienić opis"
                >
                  "{state.currentUser.statusDescription}"
                </button>
              )}
            </div>
          </div>

          {/* Rooms & Contacts Navigation Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {/* Rooms: Lounge / Projekty / B2B */}
            {state.rooms?.map((room) => {
              const isSelected = state.activeChatId === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    hapticLight();
                    gkGaduEngine.setActiveChat(room.id);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{room.icon}</span>
                  <span className="truncate max-w-[70px]">{room.name.split(" ")[0]}</span>
                </button>
              );
            })}

            {/* Direct Contacts: Grzegorz / AI Bot / Peers */}
            {state.contacts.map((contact) => {
              const isSelected = state.activeChatId === contact.ggNumber.toString();
              return (
                <button
                  key={contact.ggNumber}
                  type="button"
                  onClick={() => {
                    hapticLight();
                    gkGaduEngine.setActiveChat(contact.ggNumber.toString());
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer relative ${
                    isSelected
                      ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sun className={`h-2.5 w-2.5 ${getStatusColor(contact.status)}`} />
                  <span className="truncate max-w-[65px]">{contact.name.split(" ")[0]}</span>
                  {contact.unreadCount ? (
                    <span className="h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-black">
                      {contact.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Active Chat Header */}
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Sun className={`h-3.5 w-3.5 shrink-0 ${currentContact ? getStatusColor(currentContact.status) : "text-amber-400 fill-amber-400"}`} />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-200 text-xs truncate">
                    {activeTitle}
                  </span>
                  {currentContact && (
                    <span className="text-[9px] font-mono text-amber-400/80">
                      GG: {currentContact.ggNumber}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate italic">
                  {activeDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                type="button"
                onClick={() => setIsSearching(!isSearching)}
                className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                title="Szukaj w rozmowie"
              >
                <Search className="h-3 w-3" />
              </button>

              {/* Nudge (Puk-Puk) Action */}
              <button
                type="button"
                onClick={handleSendNudge}
                className="h-6 px-2 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="Wyślij Puk-Puk (Potrząśnięcie oknem)"
              >
                <Zap className="h-3 w-3 text-amber-400" />
                <span>Puk-Puk!</span>
              </button>
            </div>
          </div>

          {/* Search Bar (if activated) */}
          {isSearching && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtruj wiadomości..."
                className="w-full h-7 bg-slate-900 border border-slate-700 rounded-lg px-2 text-[11px] text-slate-200 outline-none focus:border-amber-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="h-48 overflow-y-auto p-2 rounded-xl bg-black/60 border border-slate-800 space-y-2.5 font-['Geist'] text-xs">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                <MessageSquare className="h-6 w-6 mb-1 text-slate-600" />
                <p>{searchQuery ? "Brak wyników wyszukiwania." : "Brak wcześniejszych wiadomości."}</p>
                <p className="text-[10px]">Napisz coś, aby rozpocząć rozmowę w czasie rzeczywistym!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMe = msg.senderGgNumber === state.currentUser.ggNumber;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col group relative ${isMe ? "items-end" : "items-start"}`}
                    onMouseEnter={() => setActiveHoverMessageId(msg.id)}
                    onMouseLeave={() => setActiveHoverMessageId(null)}
                  >
                    <div className="flex items-baseline gap-1.5 mb-0.5 text-[9px] text-slate-500 font-mono">
                      <span className="font-bold text-slate-400">
                        {isMe ? "Ty" : msg.senderName}
                      </span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.isEncrypted && (
                        <Lock className="h-2 w-2 text-emerald-400/80" title="Wiadomość zaszyfrowana E2EE" />
                      )}
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-2xl max-w-[85%] text-xs break-words shadow-sm relative ${
                        msg.isNudge
                          ? "bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold animate-pulse"
                          : isMe
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-medium rounded-tr-none"
                          : "bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {parseEmoticons(msg.text)}

                      {/* Delivery Status Receipt */}
                      {isMe && !msg.isNudge && (
                        <span className="inline-flex items-center ml-1 text-[9px] text-black/70">
                          {msg.deliveryStatus === "delivered" ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>

                    {/* Quick Reaction Pill Bar (Hover Overlay) */}
                    <AnimatePresence>
                      {activeHoverMessageId === msg.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/95 border border-slate-700 shadow-xl my-1 z-10"
                        >
                          {REACTION_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleReactionClick(msg.id, emoji)}
                              className="text-xs hover:scale-125 transition-transform p-0.5 cursor-pointer"
                              title={`Zareaguj ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Existing Message Reactions List */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, usersList]) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleReactionClick(msg.id, emoji)}
                            className="px-1.5 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[10px] flex items-center gap-1 text-slate-300 hover:border-amber-500/50 cursor-pointer"
                            title={`Reakcje od: ${usersList.join(", ")}`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[9px] font-bold text-amber-300">{usersList.length}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {state.typingUsers[state.activeChatId] && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono italic animate-pulse">
                <div className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>{state.typingUsers[state.activeChatId]} pisze...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Emoticon Picker Popover */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 grid grid-cols-5 gap-1.5 text-center text-base"
              >
                {Object.entries(GG_EMOJIS).map(([code, emoji]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => `${prev} ${code} `);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1 rounded hover:bg-slate-800 cursor-pointer transition-all active:scale-125"
                    title={code}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input & Send Bar */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-amber-400 cursor-pointer shrink-0 transition-all"
              title="Emotikony GG"
            >
              <Smile className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Napisz wiadomość... (Enter)"
              className="flex-1 h-8 bg-black/60 border border-slate-700 rounded-lg px-2.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-500/80 transition-colors font-['Geist']"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-8 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-sm"
            >
              <Send className="h-3 w-3" />
              <span className="hidden sm:inline">Wyślij</span>
            </button>
          </form>

          {/* Guest Login Banner for Clerk */}
          {!state.currentUser.isLoggedIn && (
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-200">
              <div className="flex items-center gap-1.5">
                <LogIn className="h-3.5 w-3.5 text-amber-400" />
                <span>Zaloguj się, aby mieć stały numer GG!</span>
              </div>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="px-2 py-1 rounded bg-amber-500 text-black font-bold text-[10px] hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Zaloguj
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      )}
    </motion.div>,
    document.body
  );
};

export default GkgaduChatModal;
