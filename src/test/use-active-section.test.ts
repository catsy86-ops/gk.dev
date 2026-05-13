import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useActiveSection } from "@/hooks/use-active-section";
import { triggerIntersection } from "./setup";

describe("useActiveSection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns empty string when no sections exist", () => {
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe("");
  });

  it("detects active section from observed elements", async () => {
    const el = document.createElement("section");
    el.id = "o-mnie";
    document.body.appendChild(el);

    const { result } = renderHook(() => useActiveSection());

    triggerIntersection([{ target: el, isIntersecting: true, intersectionRatio: 0.5 }]);

    await waitFor(() => {
      expect(result.current).toBe("o-mnie");
    });
  });

  it("disconnects observer on unmount", () => {
    const disconnect = vi.fn();
    const orig = window.IntersectionObserver;
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect,
      takeRecords: vi.fn(),
      unobserve: vi.fn(),
      root: null,
      rootMargin: "0px",
      thresholds: [0],
    })) as unknown as typeof IntersectionObserver;

    const { unmount } = renderHook(() => useActiveSection());
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    window.IntersectionObserver = orig;
  });
});
