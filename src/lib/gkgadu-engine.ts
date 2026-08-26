import {
  supabase,
  persistGkgaduMessageToSupabase,
  fetchGkgaduMessagesFromSupabase,
} from "@/lib/supabase";
import { soundEngine } from "@/lib/audio";
import { encryptMessage, decryptMessage, EncryptedPayload } from "@/lib/gkgadu-crypto";
import { ggNotificationService } from "@/lib/gkgadu-notifications";
import { gkgaduDataPipeline } from "@/lib/gkgadu-pipeline";

export type GgStatus = "online" | "away" | "busy" | "invisible" | "offline";

export interface GgContact {
  ggNumber: number;
  id: string;
  name: string;
  avatarUrl?: string;
  status: GgStatus;
  statusDescription: string;
  isAuthor?: boolean;
  isAiBot?: boolean;
  isCustomPeer?: boolean;
  isLivePeer?: boolean;
  isVerified?: boolean;
  unreadCount?: number;
}

export interface GgMessage {
  id: string;
  chatId: string; // e.g. "lounge", "projects", "b2b" or contact ggNumber string
  recipientGgNumber: number;
  senderGgNumber: number;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: number;
  isNudge?: boolean;
  isAi?: boolean;
  isEncrypted?: boolean;
  deliveryStatus?: "sending" | "sent" | "delivered";
  reactions?: Record<string, string[]>; // emoji -> [names]
}

export interface GkGaduRoom {
  id: string;
  name: string;
  topic: string;
  icon: string;
  onlineCount: number;
}

export interface GkGaduState {
  currentUser: {
    ggNumber: number;
    id: string;
    name: string;
    avatarUrl?: string;
    status: GgStatus;
    statusDescription: string;
    isLoggedIn: boolean;
    isVerified?: boolean;
  };
  contacts: GgContact[];
  rooms: GkGaduRoom[];
  messages: Record<string, GgMessage[]>; // chatId -> list of messages
  activeChatId: string; // "lounge", "projects", "b2b", or contact ggNumber
  typingUsers: Record<string, string>; // chatId -> typing user name
  isNudgeActive: boolean;
  soundEnabled: boolean;
  onlineCount: number;
}

export const INITIAL_ROOMS: GkGaduRoom[] = [
  {
    id: "lounge",
    name: "Pokój Główny (Lounge ☀️)",
    topic: "Publiczny czat na żywo dla społeczności GK.dev",
    icon: "☀️",
    onlineCount: 4,
  },
  {
    id: "projects",
    name: "Strefa Projektów (💻)",
    topic: "Dyskusje o architekturze, React 19, TypeScript i Next.js",
    icon: "💻",
    onlineCount: 3,
  },
  {
    id: "b2b",
    name: "Konsultacje B2B (💼)",
    topic: "Wyceny projektów, audyty wydajności i współpraca",
    icon: "💼",
    onlineCount: 2,
  },
];

// Built-in Special Contacts
export const AUTHOR_CONTACT: GgContact = {
  ggNumber: 1001,
  id: "author-grzegorz",
  name: "Grzegorz (GK.dev)",
  avatarUrl: "",
  status: "online",
  statusDescription: "Mid Fullstack Developer • Koduję w React 19 ☕",
  isAuthor: true,
  unreadCount: 0,
};

export const AI_BOT_CONTACT: GgContact = {
  ggNumber: 1002,
  id: "ai-assistant-bot",
  name: "GKgadu AI Bot",
  avatarUrl: "",
  status: "online",
  statusDescription: "Twój wirtualny doradca techniczny 24/7 🤖",
  isAiBot: true,
  unreadCount: 0,
};

export const INITIAL_CONTACTS: GgContact[] = [
  AUTHOR_CONTACT,
  AI_BOT_CONTACT,
  {
    ggNumber: 4281093,
    id: "peer-krzysztof",
    name: "Krzysztof [DevOps]",
    status: "away",
    statusDescription: "Deploy na produkcję w toku... 🚀",
    unreadCount: 0,
  },
  {
    ggNumber: 8392104,
    id: "peer-anna",
    name: "Anna [UI Designer]",
    status: "busy",
    statusDescription: "Figma design system review 🎨",
    unreadCount: 0,
  },
];

const INITIAL_MESSAGES: Record<string, GgMessage[]> = {
  lounge: [
    {
      id: "m-lounge-1",
      chatId: "lounge",
      recipientGgNumber: 0,
      senderGgNumber: 1001,
      senderName: "Grzegorz (GK.dev)",
      text: "Cześć wszystkim na nowym GKgadu! ☀️ Piszcie śmiało, czat działa w czasie rzeczywistym.",
      timestamp: Date.now() - 3600000,
    },
    {
      id: "m-lounge-2",
      chatId: "lounge",
      recipientGgNumber: 0,
      senderGgNumber: 1002,
      senderName: "GKgadu AI Bot",
      text: "Witajcie w strefie real-time! Możecie przetestować emotki, Puk-Puk i wysyłanie wiadomości. :)",
      timestamp: Date.now() - 1800000,
    },
  ],
  "1001": [
    {
      id: "m-auth-1",
      chatId: "1001",
      recipientGgNumber: 1001,
      senderGgNumber: 1001,
      senderName: "Grzegorz (GK.dev)",
      text: "Siemanko! Dzięki za odwiedzenie mojego portfolio. W czym mogę pomóc przy Twoim projekcie? <piwo>",
      timestamp: Date.now() - 600000,
    },
  ],
  "1002": [
    {
      id: "m-bot-1",
      chatId: "1002",
      recipientGgNumber: 1002,
      senderGgNumber: 1002,
      senderName: "GKgadu AI Bot",
      text: "Cześć! Jestem asystentem AI zintegrowanym z GKgadu. Zapytaj mnie o stack technologiczny, projekty lub wycenę.",
      timestamp: Date.now() - 300000,
    },
  ],
};

const STORAGE_MESSAGES_KEY = "gkgadu_messages_v2";
const STORAGE_STATUS_KEY = "gkgadu_user_status_v2";

class GkGaduEngine {
  private state: GkGaduState;
  private listeners: Set<(state: GkGaduState) => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
  private isInitialized = false;

  constructor() {
    this.state = {
      currentUser: {
        ggNumber: 7482910,
        id: "guest-user",
        name: "Gość GKgadu",
        status: "online",
        statusDescription: "Przeglądam portfolio GK.dev 🌐",
        isLoggedIn: false,
      },
      contacts: [...INITIAL_CONTACTS],
      rooms: [...INITIAL_ROOMS],
      messages: {
        ...INITIAL_MESSAGES,
        projects: [
          {
            id: "m-proj-1",
            chatId: "projects",
            recipientGgNumber: 0,
            senderGgNumber: 1001,
            senderName: "Grzegorz (GK.dev)",
            text: "W tym kanale omawiamy architekturę projektów: React 19, Supabase, Tailwind, WebSockets i optymalizację WebGL. 💻",
            timestamp: Date.now() - 7200000,
          },
        ],
        b2b: [
          {
            id: "m-b2b-1",
            chatId: "b2b",
            recipientGgNumber: 0,
            senderGgNumber: 1001,
            senderName: "Grzegorz (GK.dev)",
            text: "Witaj w pokoju B2B! Chętnie odpowiem na pytania o wycenę, czas realizacji MVP i warunki współpracy. 💼",
            timestamp: Date.now() - 3600000,
          },
        ],
      },
      activeChatId: "lounge",
      typingUsers: {},
      isNudgeActive: false,
      soundEnabled: true,
      onlineCount: 4,
    };

    if (typeof window !== "undefined") {
      this.loadPersistedData();
      this.initBroadcastChannel();
      this.initSupabaseRealtime();
    }
  }

  private loadPersistedData() {
    try {
      const savedMsg = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedMsg) {
        const parsed = JSON.parse(savedMsg);
        this.state.messages = { ...INITIAL_MESSAGES, ...parsed };
      }

      const savedStatus = localStorage.getItem(STORAGE_STATUS_KEY);
      if (savedStatus) {
        const parsedStatus = JSON.parse(savedStatus);
        this.state.currentUser.status = parsedStatus.status || "online";
        this.state.currentUser.statusDescription =
          parsedStatus.statusDescription || this.state.currentUser.statusDescription;
      }
    } catch {
      // Ignored
    }
  }

  private saveMessages() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(this.state.messages));
      } catch {
        // Ignored
      }
    }
  }

  private initBroadcastChannel() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.broadcastChannel = new BroadcastChannel("gkgadu_realtime_mesh");
        this.broadcastChannel.onmessage = async (event) => {
          const { type, payload } = event.data;
          if (type === "NEW_MESSAGE") {
            await this.receiveIncomingMessage(payload, false);
          } else if (type === "NUDGE") {
            this.triggerNudgeEffect();
          } else if (type === "STATUS_UPDATE") {
            this.updatePeerStatus(payload);
          } else if (type === "REACTION") {
            this.applyPeerReaction(payload);
          }
        };
      } catch {
        // Fallback for older browsers
      }
    }
  }

  private async initSupabaseRealtime() {
    try {
      this.realtimeChannel = supabase.channel("gkgadu_public_room", {
        config: {
          broadcast: { self: false },
          presence: { key: this.state.currentUser.ggNumber.toString() },
        },
      });

      this.realtimeChannel
        .on("broadcast", { event: "message" }, async ({ payload }) => {
          const msg = payload as GgMessage;
          // For DMs, only show if we're the sender or recipient
          if (msg.recipientGgNumber !== 0) {
            const myGg = this.state.currentUser.ggNumber;
            if (msg.senderGgNumber !== myGg && msg.recipientGgNumber !== myGg) {
              return; // Not our DM
            }
          }
          await this.receiveIncomingMessage(msg, true);
        })
        .on("broadcast", { event: "nudge" }, () => {
          this.triggerNudgeEffect();
        })
        .on("broadcast", { event: "reaction" }, ({ payload }) => {
          this.applyPeerReaction(payload as { chatId: string; messageId: string; emoji: string; userName: string });
        })
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          const typingData = payload as { chatId: string; userName: string; ggNumber: number };
          if (typingData.ggNumber === this.state.currentUser.ggNumber) return;
          this.state.typingUsers[typingData.chatId] = typingData.userName;
          this.notify();
          // Clear typing indicator after 2.5s
          setTimeout(() => {
            if (this.state.typingUsers[typingData.chatId] === typingData.userName) {
              delete this.state.typingUsers[typingData.chatId];
              this.notify();
            }
          }, 2500);
        })
        .on("presence", { event: "sync" }, () => {
          const presenceState = this.realtimeChannel?.presenceState() || {};
          const onlinePeersCount = Object.keys(presenceState).length;

          // Build dynamic live contacts from presence
          const liveGgNumbers = new Set<number>();
          for (const [_key, presences] of Object.entries(presenceState)) {
            const p = (presences as Record<string, unknown>[])[0];
            const peerGg = p.ggNumber as number;
            if (peerGg === this.state.currentUser.ggNumber) continue;
            liveGgNumbers.add(peerGg);

            const existing = this.state.contacts.find((c) => c.ggNumber === peerGg);
            if (!existing) {
              this.state.contacts.push({
                ggNumber: peerGg,
                id: `live-${peerGg}`,
                name: (p.name as string) || `Użytkownik #${peerGg}`,
                avatarUrl: p.avatarUrl as string | undefined,
                status: "online",
                statusDescription: "Online na GKgadu ☀️",
                isLivePeer: true,
                unreadCount: 0,
              });
            } else {
              existing.status = "online";
              if (p.name) existing.name = p.name as string;
              if (p.avatarUrl) existing.avatarUrl = p.avatarUrl as string;
            }
          }

          // Mark live peers who went offline
          for (const contact of this.state.contacts) {
            if (contact.isLivePeer && !liveGgNumbers.has(contact.ggNumber)) {
              contact.status = "offline";
            }
          }

          this.state.onlineCount = Math.max(1, onlinePeersCount);
          this.notify();
        })
        .on("presence", { event: "join" }, ({ newPresences }) => {
          const p = newPresences[0] as Record<string, unknown>;
          const peerGg = p.ggNumber as number;
          if (peerGg && peerGg !== this.state.currentUser.ggNumber) {
            if (this.state.soundEnabled) soundEngine.playGgDoor();
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await this.realtimeChannel?.track({
              ggNumber: this.state.currentUser.ggNumber,
              name: this.state.currentUser.name,
              avatarUrl: this.state.currentUser.avatarUrl,
              status: this.state.currentUser.status,
              onlineAt: new Date().toISOString(),
            });
          }
        });

      // Load cloud messages from Supabase for all initial rooms
      this.loadSupabaseCloudHistory("lounge");
      this.loadSupabaseCloudHistory("projects");
      this.loadSupabaseCloudHistory("b2b");
    } catch {
      // Realtime fallback to local mesh
    }
  }

  private async loadSupabaseCloudHistory(chatId: string) {
    try {
      const res = await fetchGkgaduMessagesFromSupabase(chatId, 50);
      if (res.success && res.data && res.data.length > 0) {
        const cloudMessages: GgMessage[] = res.data.map((row) => ({
          id: row.id,
          chatId: row.chat_id,
          recipientGgNumber: 0,
          senderGgNumber: row.sender_gg_number,
          senderName: row.sender_name,
          senderAvatar: row.sender_avatar || undefined,
          text: row.text,
          timestamp: row.timestamp,
          deliveryStatus: "delivered",
        }));

        if (!this.state.messages[chatId]) {
          this.state.messages[chatId] = [];
        }

        // Merge without duplicates
        for (const cMsg of cloudMessages) {
          if (!this.state.messages[chatId].some((m) => m.id === cMsg.id)) {
            this.state.messages[chatId].push(cMsg);
          }
        }
        this.state.messages[chatId].sort((a, b) => a.timestamp - b.timestamp);
        this.saveMessages();
        this.notify();
      }
    } catch {
      // Ignore cloud fetch errors
    }
  }

  public init(user: { id: string; fullName?: string | null; primaryEmailAddress?: { emailAddress: string } | null; imageUrl?: string } | null) {
    const wasLoggedIn = this.state.currentUser.isLoggedIn;
    if (user) {
      const numericGg = this.hashStringToGgNumber(user.id);
      const userName = user.fullName || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "Użytkownik GKgadu";
      this.state.currentUser = {
        ggNumber: numericGg,
        id: user.id,
        name: userName,
        avatarUrl: user.imageUrl,
        status: this.state.currentUser.status,
        statusDescription: this.state.currentUser.statusDescription,
        isLoggedIn: true,
        isVerified: true,
      };

      // If user just logged in via Clerk, publish SIEMA event to Kafka stream and broadcast to Lounge
      if (!wasLoggedIn) {
        gkgaduDataPipeline.kafkaPublish("gkgadu-auth-siema", user.id, {
          ggNumber: numericGg,
          userName,
          loginTime: Date.now(),
        });

        // Broadcast SIEMA notification message in Lounge
        const siemaMsg: GgMessage = {
          id: `siema-${Date.now()}`,
          chatId: "lounge",
          recipientGgNumber: 0,
          senderGgNumber: numericGg,
          senderName: userName,
          senderAvatar: user.imageUrl,
          text: `☀️ SIEMA! Zalogowałem się do GKgadu (GG #${numericGg}). Pozdrawiam wszystkich! 🚀`,
          timestamp: Date.now(),
          deliveryStatus: "delivered",
          reactions: { "☀️": [userName] },
        };

        if (!this.state.messages["lounge"]) {
          this.state.messages["lounge"] = [];
        }
        this.state.messages["lounge"].push(siemaMsg);
        this.saveMessages();

        // System notification & sound
        ggNotificationService.showNotification({
          title: `☀️ Nowe logowanie: ${userName}`,
          body: `SIEMA! GG #${numericGg} właśnie dołączył do GKgadu 2026.`,
        });

        if (this.broadcastChannel) {
          this.broadcastChannel.postMessage({ type: "NEW_MESSAGE", payload: siemaMsg });
        }

        // Broadcast SIEMA to Supabase Realtime for other users
        if (this.realtimeChannel) {
          this.realtimeChannel.send({
            type: "broadcast",
            event: "message",
            payload: siemaMsg,
          });
        }
      }

      // Re-track presence with updated user info
      if (this.realtimeChannel) {
        this.realtimeChannel.track({
          ggNumber: numericGg,
          name: userName,
          avatarUrl: user.imageUrl,
          status: this.state.currentUser.status,
          onlineAt: new Date().toISOString(),
        });
      }
    } else {
      this.state.currentUser = {
        ggNumber: 7482910,
        id: "guest-user",
        name: "Gość GKgadu",
        status: "online",
        statusDescription: "Przeglądam portfolio GK.dev 🌐",
        isLoggedIn: false,
        isVerified: false,
      };
    }
    this.isInitialized = true;
    this.notify();
  }

  public hashStringToGgNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const positive = Math.abs(hash);
    // Return 7-digit GG number between 2000000 and 9999999
    return 2000000 + (positive % 7999999);
  }

  public subscribe(fn: (state: GkGaduState) => void) {
    this.listeners.add(fn);
    fn(this.getState());
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): GkGaduState {
    return {
      ...this.state,
      contacts: [...this.state.contacts],
      messages: { ...this.state.messages },
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public setActiveChat(chatId: string) {
    this.state.activeChatId = chatId;
    // Mark messages as read for this contact
    const contact = this.state.contacts.find((c) => c.ggNumber.toString() === chatId);
    if (contact) {
      contact.unreadCount = 0;
    }
    this.notify();
  }

  public setStatus(status: GgStatus, description?: string) {
    this.state.currentUser.status = status;
    if (description !== undefined) {
      this.state.currentUser.statusDescription = description;
    }

    if (this.state.soundEnabled) {
      soundEngine.playGgStatus();
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_STATUS_KEY,
        JSON.stringify({
          status: this.state.currentUser.status,
          statusDescription: this.state.currentUser.statusDescription,
        })
      );
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: "STATUS_UPDATE",
        payload: {
          ggNumber: this.state.currentUser.ggNumber,
          name: this.state.currentUser.name,
          status: this.state.currentUser.status,
          statusDescription: this.state.currentUser.statusDescription,
        },
      });
    }

    this.notify();
  }

  public toggleSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.notify();
  }

  public broadcastTyping() {
    if (!this.realtimeChannel || !this.state.currentUser.isLoggedIn) return;
    this.realtimeChannel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        chatId: this.state.activeChatId,
        userName: this.state.currentUser.name,
        ggNumber: this.state.currentUser.ggNumber,
      },
    });
  }

  public async sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const activeId = this.state.activeChatId;
    const recipientNum = activeId === "lounge" ? 0 : parseInt(activeId, 10);

    // Handle slash commands
    if (trimmed.startsWith("/")) {
      const parts = trimmed.split(" ");
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ");

      if (cmd === "/nudge" || cmd === "/puk") {
        this.sendNudge();
        return;
      }
      if (cmd === "/shrug") {
        return this.sendMessage("¯\\_(ツ)_/¯");
      }
      if (cmd === "/roll") {
        const num = Math.floor(Math.random() * 100) + 1;
        return this.sendMessage(`🎲 Wyrzucono: **${num}** / 100`);
      }
      if (cmd === "/moneta" || cmd === "/flip") {
        const side = Math.random() > 0.5 ? "Orzeł 🦅" : "Reszka 🪙";
        return this.sendMessage(`🪙 Wynik rzutu monetą: **${side}**`);
      }
      if (cmd === "/poll" || cmd === "/ankieta") {
        const question = arg || "Szybka ankieta technologiczna: React 19 vs Next.js 15?";
        return this.sendMessage(`📊 **ANKIETA:** ${question}\n*(Zagłosuj reagując emotką pod tą wiadomością! ☀️ / 🚀 / 🔥)*`);
      }
      if (cmd === "/gra" || cmd === "/game") {
        return this.sendMessage(`🎮 **MINIGRA GG:**\nZagrajmy w zgadnij liczbę! Wylosowałem liczbę od 1 do 10. Zgaduj na czacie! 🎯`);
      }
      if (cmd === "/help" || cmd === "/pomoc") {
        return this.sendMessage(`ℹ️ **Dostępne komendy GKgadu:**\n- \`/roll\` - rzut kością (1-100)\n- \`/moneta\` - rzut monetą\n- \`/poll <pytanie>\` - ankieta\n- \`/nudge\` lub \`/puk\` - potrząśnięcie oknem\n- \`/shrug\` - ¯\\_(ツ)_/¯\n- \`/status <nowy opis>\` - zmiana opisu\n- \`/clear\` - wyczyszczenie czatu`);
      }
      if (cmd === "/clear") {
        this.state.messages[activeId] = [];
        this.saveMessages();
        this.notify();
        return;
      }
      if (cmd === "/status" && arg) {
        this.updateUserStatus(this.state.currentUser.status, arg);
        return this.sendMessage(`🔄 Zmieniono opis statusu na: "${arg}"`);
      }
    }

    const message: GgMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      chatId: activeId,
      recipientGgNumber: recipientNum,
      senderGgNumber: this.state.currentUser.ggNumber,
      senderName: this.state.currentUser.name,
      senderAvatar: this.state.currentUser.avatarUrl,
      text: trimmed,
      timestamp: Date.now(),
      isEncrypted: true,
      deliveryStatus: "sent",
      reactions: {},
    };

    // Store in in-memory Redis cache & Kafka event stream
    gkgaduDataPipeline.redisSet(`msg:${message.id}`, message, 86400000);
    gkgaduDataPipeline.kafkaPublish("gkgadu-messages", message.id, message);

    if (!this.state.messages[activeId]) {
      this.state.messages[activeId] = [];
    }
    this.state.messages[activeId].push(message);
    this.saveMessages();
    this.notify();

    // Encrypt payload for network broadcast
    try {
      const encrypted = await encryptMessage(trimmed, activeId);
      const networkPayload = {
        ...message,
        encryptedPayload: encrypted,
      };

      // Broadcast through WebSockets & Local Mesh
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: "NEW_MESSAGE", payload: networkPayload });
      }
      if (this.realtimeChannel) {
        this.realtimeChannel.send({
          type: "broadcast",
          event: "message",
          payload: networkPayload,
        });
      }
    } catch {
      // Fallback
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: "NEW_MESSAGE", payload: message });
      }
    }

    // Mark as delivered after brief network ACK
    setTimeout(() => {
      message.deliveryStatus = "delivered";
      this.notify();
    }, 400);

    // Persist to Supabase Database (Real-time Cloud Sync)
    persistGkgaduMessageToSupabase({
      id: message.id,
      chatId: message.chatId,
      senderGgNumber: message.senderGgNumber,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      text: message.text,
      timestamp: message.timestamp,
    });

    // Real-Time Intelligent Living Chat Responses
    this.handleRealtimePeerReply(activeId, trimmed);
  }

  public addReaction(messageId: string, emoji: string) {
    const activeId = this.state.activeChatId;
    const messages = this.state.messages[activeId];
    if (!messages) return;

    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) {
      msg.reactions = {};
    }
    if (!msg.reactions[emoji]) {
      msg.reactions[emoji] = [];
    }

    const userName = this.state.currentUser.name;
    const userIndex = msg.reactions[emoji].indexOf(userName);

    if (userIndex >= 0) {
      msg.reactions[emoji].splice(userIndex, 1);
      if (msg.reactions[emoji].length === 0) {
        delete msg.reactions[emoji];
      }
    } else {
      msg.reactions[emoji].push(userName);
      if (this.state.soundEnabled) {
        soundEngine.playPop(1100, 0.03);
      }
    }

    this.saveMessages();
    this.notify();

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: "REACTION",
        payload: { chatId: activeId, messageId, emoji, userName },
      });
    }
    if (this.realtimeChannel) {
      this.realtimeChannel.send({
        type: "broadcast",
        event: "reaction",
        payload: { chatId: activeId, messageId, emoji, userName },
      });
    }
  }

  public sendNudge() {
    const activeId = this.state.activeChatId;
    const recipientNum = activeId === "lounge" ? 0 : parseInt(activeId, 10);

    const nudgeMsg: GgMessage = {
      id: `nudge-${Date.now()}`,
      chatId: activeId,
      recipientGgNumber: recipientNum,
      senderGgNumber: this.state.currentUser.ggNumber,
      senderName: this.state.currentUser.name,
      text: "💥 *PUK-PUK!* (Potrząśnięcie oknem)",
      timestamp: Date.now(),
      isNudge: true,
    };

    if (!this.state.messages[activeId]) {
      this.state.messages[activeId] = [];
    }
    this.state.messages[activeId].push(nudgeMsg);
    this.saveMessages();

    this.triggerNudgeEffect();

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: "NUDGE", payload: nudgeMsg });
    }
    if (this.realtimeChannel) {
      this.realtimeChannel.send({
        type: "broadcast",
        event: "nudge",
        payload: nudgeMsg,
      });
    }
    this.notify();
  }

  private triggerNudgeEffect() {
    if (this.state.soundEnabled) {
      soundEngine.playGgNudge();
    }
    this.state.isNudgeActive = true;
    this.notify();
    setTimeout(() => {
      this.state.isNudgeActive = false;
      this.notify();
    }, 600);
  }

  private async receiveIncomingMessage(
    msg: GgMessage & { encryptedPayload?: EncryptedPayload },
    isRemote = true
  ) {
    const targetChatId = msg.recipientGgNumber === 0 ? (msg.chatId || "lounge") : msg.senderGgNumber.toString();

    // If message is encrypted, decrypt with room/chat secret
    if (msg.encryptedPayload) {
      try {
        const decrypted = await decryptMessage(msg.encryptedPayload, targetChatId);
        msg.text = decrypted;
        msg.isEncrypted = true;
      } catch {
        // keep fallback text
      }
    }

    if (!this.state.messages[targetChatId]) {
      this.state.messages[targetChatId] = [];
    }

    // Check if message already exists
    const exists = this.state.messages[targetChatId].some((m) => m.id === msg.id);
    if (!exists) {
      this.state.messages[targetChatId].push({
        ...msg,
        deliveryStatus: "delivered",
      });
      this.saveMessages();

      if (this.state.soundEnabled) {
        soundEngine.playGgMessage();
      }

      // Increment unread count if not in current view
      if (this.state.activeChatId !== targetChatId) {
        const contact = this.state.contacts.find((c) => c.ggNumber.toString() === targetChatId);
        if (contact) {
          contact.unreadCount = (contact.unreadCount || 0) + 1;
        }
      }
    }

    this.notify();
  }

  private applyPeerReaction(payload: { chatId: string; messageId: string; emoji: string; userName: string }) {
    const messages = this.state.messages[payload.chatId];
    if (!messages) return;

    const msg = messages.find((m) => m.id === payload.messageId);
    if (!msg) return;

    if (!msg.reactions) {
      msg.reactions = {};
    }
    if (!msg.reactions[payload.emoji]) {
      msg.reactions[payload.emoji] = [];
    }

    const idx = msg.reactions[payload.emoji].indexOf(payload.userName);
    if (idx >= 0) {
      msg.reactions[payload.emoji].splice(idx, 1);
      if (msg.reactions[payload.emoji].length === 0) {
        delete msg.reactions[payload.emoji];
      }
    } else {
      msg.reactions[payload.emoji].push(payload.userName);
      if (this.state.soundEnabled) {
        soundEngine.playPop(1100, 0.03);
      }
    }
    this.saveMessages();
    this.notify();
  }

  private updatePeerStatus(payload: { ggNumber: number; name: string; status: GgStatus; statusDescription: string }) {
    let existing = this.state.contacts.find((c) => c.ggNumber === payload.ggNumber);
    if (!existing) {
      existing = {
        ggNumber: payload.ggNumber,
        id: `peer-${payload.ggNumber}`,
        name: payload.name,
        status: payload.status,
        statusDescription: payload.statusDescription,
        isCustomPeer: true,
      };
      this.state.contacts.push(existing);
      if (this.state.soundEnabled) soundEngine.playGgDoor();
    } else {
      existing.status = payload.status;
      existing.statusDescription = payload.statusDescription;
    }
    this.notify();
  }

  public exportChatHistory(chatId: string) {
    const list = this.state.messages[chatId] || [];
    if (list.length === 0) return;

    let chatTitle = "Pokój Główny";
    if (chatId === "projects") chatTitle = "Strefa Projektów";
    else if (chatId === "b2b") chatTitle = "Konsultacje B2B";
    else {
      const c = this.state.contacts.find((x) => x.ggNumber.toString() === chatId);
      if (c) chatTitle = `${c.name} (GG: ${c.ggNumber})`;
    }

    const lines = [
      `======================================================================`,
      `  ARCHIWUM ROZMOWY GKgadu 2026`,
      `  Rozmówca/Kanał: ${chatTitle}`,
      `  Data eksportu: ${new Date().toLocaleString("pl-PL")}`,
      `======================================================================`,
      ``,
    ];

    list.forEach((m) => {
      const dateStr = new Date(m.timestamp).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      lines.push(`[${dateStr}] <${m.senderName}>: ${m.text}`);
    });

    lines.push(``, `--- Wygenerowano w komunikatorze GKgadu (GK.dev) ---`);

    const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `archiwum_gkgadu_${chatId}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private handleRealtimePeerReply(chatId: string, userText: string) {
    if (chatId === "1001") {
      this.handleAuthorAutoReply(userText);
    } else if (chatId === "1002") {
      this.handleAiBotReply(userText);
    } else if (chatId === "lounge") {
      this.handleLoungeRoomReply(userText);
    } else if (chatId === "projects") {
      this.handleProjectsRoomReply(userText);
    } else if (chatId === "b2b") {
      this.handleB2bRoomReply(userText);
    }
  }

  private handleLoungeRoomReply(userText: string) {
    const peers = [
      { name: "Grzegorz (GK.dev)", num: 1001, desc: "Siema! Dzięki za aktywność na Lounge ☀️" },
      { name: "Krzysztof [DevOps]", num: 4281093, desc: "Potwierdzam, WebSockets i pipeline działają stabilnie!" },
      { name: "Magda [Product Lead]", num: 5192847, desc: "Świetny UX tego czatu, przypomina stare dobre czasy GG :)" },
    ];
    const peer = peers[Math.floor(Math.random() * peers.length)];

    this.state.typingUsers["lounge"] = peer.name;
    this.notify();

    setTimeout(() => {
      delete this.state.typingUsers["lounge"];
      const replyMsg: GgMessage = {
        id: `lounge-rep-${Date.now()}`,
        chatId: "lounge",
        recipientGgNumber: 0,
        senderGgNumber: peer.num,
        senderName: peer.name,
        text: peer.desc,
        timestamp: Date.now(),
        reactions: { "☀️": [peer.name] },
      };
      this.receiveIncomingMessage(replyMsg, false);
    }, 1500);
  }

  private handleProjectsRoomReply(userText: string) {
    this.state.typingUsers["projects"] = "Grzegorz (GK.dev)";
    this.notify();

    setTimeout(() => {
      delete this.state.typingUsers["projects"];
      const replyMsg: GgMessage = {
        id: `proj-rep-${Date.now()}`,
        chatId: "projects",
        recipientGgNumber: 0,
        senderGgNumber: 1001,
        senderName: "Grzegorz (GK.dev)",
        text: `Co do projektów: architekturę buduję na React 19 + TypeScript + Supabase Realtime + Edge Functions. Jeśli masz pytania o konkretny projekt, pytaj śmiało! 💻`,
        timestamp: Date.now(),
      };
      this.receiveIncomingMessage(replyMsg, false);
    }, 1400);
  }

  private handleB2bRoomReply(userText: string) {
    this.state.typingUsers["b2b"] = "GKgadu AI Consultant";
    this.notify();

    setTimeout(() => {
      delete this.state.typingUsers["b2b"];
      const replyMsg: GgMessage = {
        id: `b2b-rep-${Date.now()}`,
        chatId: "b2b",
        recipientGgNumber: 0,
        senderGgNumber: 1002,
        senderName: "GKgadu AI Consultant",
        text: `W sprawach wycen B2B i audytów kodu zapraszam do kontaktu: kontakt@gkdev.pl lub przez formularz szybkiej wyceny w zakładce Kontakt! 💼`,
        timestamp: Date.now(),
        isAi: true,
      };
      this.receiveIncomingMessage(replyMsg, false);
    }, 1200);
  }

  private handleAuthorAutoReply(userText: string) {
    const replies = [
      "Dzięki za wiadomość na GKgadu! Jeśli planujesz projekt webowy w React 19 / TypeScript, chętnie omówię szczegóły. 💻",
      "Przeczytałem! Możesz też zostawić namiary w zakładce Kontakt lub przejrzeć moje case studies w sekcji Projekty. 🚀",
      "Super, że testujesz GKgadu! Napisz mi, jak podoba Ci się interfejs i odtwarzacz GKinAmp. 🎵",
      "Jestem dostępny do projektów komercyjnych (Mid Fullstack Developer) — odezwij się śmiało również na kontakt@gkdev.pl!",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    // Set typing indicator
    this.state.typingUsers["1001"] = "Grzegorz (GK.dev)";
    this.notify();

    setTimeout(() => {
      delete this.state.typingUsers["1001"];
      const authorMsg: GgMessage = {
        id: `auth-rep-${Date.now()}`,
        chatId: "1001",
        recipientGgNumber: this.state.currentUser.ggNumber,
        senderGgNumber: 1001,
        senderName: "Grzegorz (GK.dev)",
        text: reply,
        timestamp: Date.now(),
      };
      this.receiveIncomingMessage(authorMsg, false);
    }, 1400);
  }

  private handleAiBotReply(userText: string) {
    let reply = "Jestem GKgadu AI Botem. Mogę pomóc Ci w wycenie projektu, podpowiedzieć technologie lub opowiedzieć o portfolio Grzegorza!";
    const lower = userText.toLowerCase();

    if (lower.includes("cena") || lower.includes("wycena") || lower.includes("koszt") || lower.includes("stawka")) {
      reply = "Wycena zależy od zakresu! Sprawdź interaktywny kalkulator w sekcji Kontakt — pozwala natychmiast oszacować budżet i czas wdrożenia.";
    } else if (lower.includes("stack") || lower.includes("technologie") || lower.includes("react") || lower.includes("node")) {
      reply = "Główny stack Grzegorza to React 19, Next.js 15, TypeScript 5, Tailwind CSS, Node.js, PostgreSQL, Supabase oraz AWS.";
    } else if (lower.includes("cv") || lower.includes("resume") || lower.includes("doświadczenie")) {
      reply = "Grzegorz to Mid Fullstack Developer (Samouk ze Szczecina). W sekcji 'O Mnie' możesz otworzyć jego pełne interaktywne CV i zapisać jako PDF!";
    } else if (lower.includes("kontakt") || lower.includes("mail") || lower.includes("telefon")) {
      reply = "Możesz napisać bezpośrednio na kontakt@gkdev.pl lub skorzystać z formularza w sekcji Kontakt na dole strony.";
    }

    // Set typing indicator
    this.state.typingUsers["1002"] = "GKgadu AI Bot";
    this.notify();

    setTimeout(() => {
      delete this.state.typingUsers["1002"];
      const botMsg: GgMessage = {
        id: `bot-rep-${Date.now()}`,
        chatId: "1002",
        recipientGgNumber: this.state.currentUser.ggNumber,
        senderGgNumber: 1002,
        senderName: "GKgadu AI Bot",
        text: reply,
        timestamp: Date.now(),
        isAi: true,
      };
      this.receiveIncomingMessage(botMsg, false);
    }, 1100);
  }
}

export const gkGaduEngine = new GkGaduEngine();
