import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollLock } from "@/hooks/use-scroll-lock";

describe("useScrollLock hook & modal-open cursor management", () => {
  beforeEach(() => {
    document.body.className = "";
    document.body.style.overflow = "";
  });

  it("adds modal-open class and locks overflow when isLocked is true", () => {
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.classList.contains("modal-open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.classList.contains("modal-open")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("does not add modal-open class when isLocked is false", () => {
    renderHook(() => useScrollLock(false));

    expect(document.body.classList.contains("modal-open")).toBe(false);
  });
});
