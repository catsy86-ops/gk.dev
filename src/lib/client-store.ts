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
    return JSON.parse(raw);
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
    return newBooking;
  },

  removeBooking(id: string) {
    const state = getInitialState();
    saveState({ ...state, bookings: state.bookings.filter((b) => b.id !== id) });
  },
};
