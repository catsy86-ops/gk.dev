import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env";

export interface Database {
  public: {
    Tables: {
      project_briefs: {
        Row: {
          id: string;
          user_id: string | null;
          client_name: string;
          email: string;
          project_type: string;
          budget: string;
          timeline: string;
          description: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          client_name: string;
          email: string;
          project_type: string;
          budget: string;
          timeline: string;
          description: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          client_name?: string;
          email?: string;
          project_type?: string;
          budget?: string;
          timeline?: string;
          description?: string;
          status?: string;
          created_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string | null;
          item_id: string;
          title: string;
          category: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          item_id: string;
          title: string;
          category: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          item_id?: string;
          title?: string;
          category?: string;
          url?: string;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          project_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          project_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          project_type?: string | null;
          created_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          date: string;
          topic: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          date: string;
          topic: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          date?: string;
          topic?: string;
          status?: string;
          created_at?: string;
        };
      };
      gkgadu_messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_gg_number: number;
          recipient_gg_number: number;
          sender_name: string;
          sender_avatar: string | null;
          text: string;
          timestamp: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender_gg_number: number;
          recipient_gg_number?: number;
          sender_name: string;
          sender_avatar?: string | null;
          text: string;
          timestamp: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          sender_gg_number?: number;
          recipient_gg_number?: number;
          sender_name?: string;
          sender_avatar?: string | null;
          text?: string;
          timestamp?: number;
          created_at?: string;
        };
      };
    };
  };
}

const supabaseUrl = ENV.supabase.url;
const supabaseAnonKey = ENV.supabase.anonKey;

export const isSupabaseConfigured = ENV.supabase.isConfigured;

// Create resilient typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Sprawdza stan połączenia z Supabase
 */
export async function checkSupabaseHealth(): Promise<{ isHealthy: boolean; latencyMs: number; error?: string }> {
  if (!isSupabaseConfigured) {
    return { isHealthy: false, latencyMs: 0, error: "Supabase not configured in .env.local" };
  }

  const start = performance.now();
  try {
    const { error } = await supabase.from("project_briefs").select("id").limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error && error.code !== "PGRST116") {
      return { isHealthy: false, latencyMs, error: error.message };
    }

    return { isHealthy: true, latencyMs };
  } catch (err) {
    return { isHealthy: false, latencyMs: 0, error: String(err) };
  }
}

/**
 * Zapisuje brief projektu w Supabase
 */
export async function syncBriefToSupabase(brief: {
  userId?: string | null;
  clientName: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}) {
  if (!isSupabaseConfigured) {
    return { success: true, mode: "local-fallback" };
  }

  try {
    const { data, error } = await supabase.from("project_briefs").insert({
      user_id: brief.userId || null,
      client_name: brief.clientName,
      email: brief.email,
      project_type: brief.projectType,
      budget: brief.budget,
      timeline: brief.timeline,
      description: brief.description,
      status: "pending",
    });

    if (error) {
      console.warn("Supabase brief sync note:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Supabase sync error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Zapisuje zapytanie z formularza kontaktowego w Supabase
 */
export async function saveContactMessageToSupabase(message: {
  name: string;
  email: string;
  message: string;
  projectType?: string;
}) {
  if (!isSupabaseConfigured) {
    return { success: true, mode: "local-fallback" };
  }

  try {
    const { data, error } = await supabase.from("contact_messages").insert({
      name: message.name,
      email: message.email,
      message: message.message,
      project_type: message.projectType || null,
    });

    if (error) {
      console.warn("Supabase contact message save note:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Zapisuje wiadomość GKgadu w chmurze Supabase
 */
export async function persistGkgaduMessageToSupabase(message: {
  id: string;
  chatId: string;
  senderGgNumber: number;
  recipientGgNumber: number;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: number;
}) {
  if (!isSupabaseConfigured) {
    return { success: true, mode: "local-fallback" };
  }

  try {
    const { data, error } = await supabase.from("gkgadu_messages").insert({
      id: message.id,
      chat_id: message.chatId,
      sender_gg_number: message.senderGgNumber,
      recipient_gg_number: message.recipientGgNumber,
      sender_name: message.senderName,
      sender_avatar: message.senderAvatar || null,
      text: message.text,
      timestamp: message.timestamp,
    });

    if (error) {
      console.warn("Supabase GKgadu message save note:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Pobiera najnowsze wiadomości GKgadu z Supabase
 */
export async function fetchGkgaduMessagesFromSupabase(chatId: string, limit = 50) {
  if (!isSupabaseConfigured) {
    return { success: false, data: [] };
  }

  try {
    const { data, error } = await supabase
      .from("gkgadu_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("timestamp", { ascending: true })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: String(err), data: [] };
  }
}
