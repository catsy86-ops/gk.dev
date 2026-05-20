import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "@/hooks/use-media-query";

type MediaQueryListener = (e: MediaQueryListEvent) => void;

const createMockMql = (matches: boolean) => {
  const listeners: MediaQueryListener[] = [];
  return {
    matches,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_, listener: MediaQueryListener) => {
      listeners.push(listener);
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    _listeners: listeners,
    _triggerChange: (newMatches: boolean) => {
      listeners.forEach((l) =>
        l({ matches: newMatches } as MediaQueryListEvent),
      );
    },
  };
};

describe("useMediaQuery", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial match state", () => {
    const mql = createMockMql(true);
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when query does not match", () => {
    const mql = createMockMql(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("updates when media query changes", () => {
    const mql = createMockMql(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);

    act(() => {
      mql._triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it("cleans up event listener on unmount", () => {
    const mql = createMockMql(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    unmount();

    expect(mql.removeEventListener).toHaveBeenCalled();
  });
});
