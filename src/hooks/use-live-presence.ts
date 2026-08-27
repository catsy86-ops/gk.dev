import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight } from "@/lib/haptics";
import { triggerConfetti } from "@/lib/confetti";
import { toast } from "@/hooks/use-toast";

export interface LivePresenceUser {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  lastSeen: number;
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];

export function useLivePresence() {
  const [onlineUsers, setOnlineUsers] = useState<LivePresenceUser[]>([]);
  const [activeHighFive, setActiveHighFive] = useState<string | null>(null);
  const myIdRef = useRef<string>(`user_${Math.random().toString(36).substring(2, 7)}`);
  const myColorRef = useRef<string>(COLORS[Math.floor(Math.random() * COLORS.length)]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const sendHighFive = useCallback(() => {
    soundEngine.playChime();
    hapticMedium();
    triggerConfetti();
    toast({
      title: "✋ Przybito piątkę!",
      description: "Wysłano sygnał High-Five do aktywnych osób na stronie.",
    });

    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "high_five",
        payload: { fromId: myIdRef.current },
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const channel = supabase.channel("live_co_presence", {
      config: { broadcast: { self: false } },
    });

    channelRef.current = channel;

    channel
      .on("broadcast", { event: "high_five" }, (payload) => {
        soundEngine.playPop(900, 0.05);
        hapticLight();
        setActiveHighFive(payload.payload?.fromId || "ktoś");
        toast({
          title: "✋ Ktoś przybił Ci piątkę!",
          description: "Odwiedzający stronę wysłał sygnał High-Five!",
        });
        setTimeout(() => setActiveHighFive(null), 3000);
      })
      .subscribe();

    return () => {
      channel.unsubscribe().catch(() => {});
    };
  }, []);

  return {
    onlineUsers,
    activeHighFive,
    sendHighFive,
  };
}
