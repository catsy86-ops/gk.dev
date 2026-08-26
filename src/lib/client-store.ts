import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface SavedBrief {
  id: string;
  date: string;
  projectType: string;
  timeline: string;
  content: string;
}

export interface ConsultationBooking {
  id: string;
  date: string;
  timeSlot: string;
  topic: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ClientStoreState {
  bookmarks: string[];
  briefs: SavedBrief[];
  bookings: ConsultationBooking[];
}

const STORAGE_KEY = "gkdev_client_store";

function getInitialState(): ClientStoreState {
  if (typeof window === "undefined") {
    return { bookmarks: [], briefs: [], bookings: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bookmarks: [], briefs: [], bookings: [] };
    const parsed = JSON.parse(raw);
    
    // Validate schema integrity against corruption or tampering (OWASP A08)
    const bookmarks = Array.isArray(parsed?.bookmarks)
      ? parsed.bookmarks.filter((b: unknown): b is string => typeof b === "string")
      : [];
    const briefs = Array.isArray(parsed?.briefs)
      ? parsed.briefs.filter(
          (br: unknown): br is SavedBrief =>
            typeof br === "object" &&
            br !== null &&
            typeof (br as SavedBrief).id === "string" &&
            typeof (br as SavedBrief).content === "string"
        )
      : [];
    const bookings = Array.isArray(parsed?.bookings)
      ? parsed.bookings.filter(
          (bk: unknown): bk is ConsultationBooking =>
            typeof bk === "object" &&
            bk !== null &&
            typeof (bk as ConsultationBooking).id === "string"
        )
      : [];

    return { bookmarks, briefs, bookings };
  } catch {
    return { bookmarks: [], briefs: [], bookings: [] };
  }
}

function saveState(state: ClientStoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("gkdev_store_updated"));
  } catch (e) {
    console.error("Failed to persist client store", e);
  }
}

export const clientStore = {
  getState(): ClientStoreState {
    return getInitialState();
  },

  isBookmarked(articleId: string): boolean {
    const state = getInitialState();
    return state.bookmarks.includes(articleId);
  },

  toggleBookmark(articleId: string): boolean {
    const state = getInitialState();
    const exists = state.bookmarks.includes(articleId);
    const nextBookmarks = exists
      ? state.bookmarks.filter((id) => id !== articleId)
      : [...state.bookmarks, articleId];

    saveState({ ...state, bookmarks: nextBookmarks });
    return !exists;
  },

  saveBrief(brief: Omit<SavedBrief, "id" | "date">): SavedBrief {
    const state = getInitialState();
    const newBrief: SavedBrief = {
      ...brief,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("pl-PL"),
    };
    saveState({ ...state, briefs: [newBrief, ...state.briefs.slice(0, 19)] });

    // Optional background sync with Supabase
    if (isSupabaseConfigured) {
      supabase
        .from("project_briefs")
        .insert({
          client_name: "Klient Portfela",
          email: "kontakt@gkdev.pl",
          project_type: brief.projectType,
          budget: "Do uzgodnienia",
          timeline: brief.timeline,
          description: brief.content,
          status: "saved_draft",
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase brief sync note:", error.message);
        })
        .catch(() => {});
    }

    return newBrief;
  },

  removeBrief(id: string) {
    const state = getInitialState();
    saveState({ ...state, briefs: state.briefs.filter((b) => b.id !== id) });
  },

  saveBooking(booking: Omit<ConsultationBooking, "id" | "createdAt">): ConsultationBooking {
    const state = getInitialState();
    const newBooking: ConsultationBooking = {
      ...booking,
      id: "bk_" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toLocaleDateString("pl-PL"),
    };
    saveState({ ...state, bookings: [newBooking, ...state.bookings] });

    // Optional background sync with Supabase
    if (isSupabaseConfigured) {
      supabase
        .from("consultations")
        .insert({
          full_name: booking.name,
          email: booking.email,
          date: booking.date + " " + booking.timeSlot,
          topic: booking.topic,
          status: "confirmed",
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase consultation sync note:", error.message);
        })
        .catch(() => {});
    }

    return newBooking;
  },

  removeBooking(id: string) {
    const state = getInitialState();
    saveState({ ...state, bookings: state.bookings.filter((b) => b.id !== id) });
  },
};
