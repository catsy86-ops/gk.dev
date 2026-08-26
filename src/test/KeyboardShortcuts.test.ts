import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

describe("Keyboard Shortcuts Hook Suite", () => {
  it("triggers shortcut callbacks when key is pressed outside inputs", () => {
    const onOpenTerminal = vi.fn();
    const onOpenPassport = vi.fn();
    const onOpenEstimator = vi.fn();
    const onFocusSearch = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onOpenTerminal,
        onOpenPassport,
        onOpenEstimator,
        onFocusSearch,
      })
    );

    // Press 't'
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "t" }));
    expect(onOpenTerminal).toHaveBeenCalled();

    // Press 'p'
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "p" }));
    expect(onOpenPassport).toHaveBeenCalled();

    // Press 'e'
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "e" }));
    expect(onOpenEstimator).toHaveBeenCalled();

    // Press '/'
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    expect(onFocusSearch).toHaveBeenCalled();
  });
});
