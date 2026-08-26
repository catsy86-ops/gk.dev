import { useEffect } from "react";

let lockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Custom hook to lock body scrolling when a modal or dialog is open.
 * Handles multiple open modals gracefully without causing layout shift.
 * Automatically adds 'modal-open' class to restore native visible cursor.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof document === "undefined") return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      // Compensate for scrollbar width to prevent layout shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    }

    lockCount++;

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        document.body.classList.remove("modal-open");
      }
    };
  }, [isLocked]);
}
