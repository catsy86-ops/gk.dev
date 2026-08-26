import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onOpenTerminal?: () => void;
  onOpenPassport?: () => void;
  onOpenEstimator?: () => void;
  onFocusSearch?: () => void;
  onTriggerMatrix?: () => void;
}

export function useKeyboardShortcuts({
  onOpenTerminal,
  onOpenPassport,
  onOpenEstimator,
  onFocusSearch,
  onTriggerMatrix,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check key
      const key = e.key.toLowerCase();

      if (key === "/" && onFocusSearch) {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      if (key === "m" && onTriggerMatrix) {
        e.preventDefault();
        onTriggerMatrix();
        return;
      }

      if (key === "t" && onOpenTerminal) {
        e.preventDefault();
        onOpenTerminal();
        return;
      }

      if (key === "p" && onOpenPassport) {
        e.preventDefault();
        onOpenPassport();
        return;
      }

      if (key === "e" && onOpenEstimator) {
        e.preventDefault();
        onOpenEstimator();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenTerminal, onOpenPassport, onOpenEstimator, onFocusSearch, onTriggerMatrix]);
}
