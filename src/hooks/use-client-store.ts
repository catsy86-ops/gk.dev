import { useState, useEffect, useCallback } from "react";
import { clientStore, type ClientStoreState } from "@/lib/client-store";

export const useClientStore = () => {
  const [state, setState] = useState<ClientStoreState>(clientStore.getState());

  useEffect(() => {
    const handleUpdate = () => {
      setState(clientStore.getState());
    };
    window.addEventListener("gkdev_store_updated", handleUpdate);
    return () => window.removeEventListener("gkdev_store_updated", handleUpdate);
  }, []);

  const toggleBookmark = useCallback((articleId: string) => {
    return clientStore.toggleBookmark(articleId);
  }, []);

  const isBookmarked = useCallback(
    (articleId: string) => {
      return state.bookmarks.includes(articleId);
    },
    [state.bookmarks]
  );

  return {
    state,
    bookmarks: state.bookmarks,
    briefs: state.briefs,
    bookings: state.bookings,
    isBookmarked,
    toggleBookmark,
    saveBrief: clientStore.saveBrief,
    removeBrief: clientStore.removeBrief,
    saveBooking: clientStore.saveBooking,
    removeBooking: clientStore.removeBooking,
  };
};
