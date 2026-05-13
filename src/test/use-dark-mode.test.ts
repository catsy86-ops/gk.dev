import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDarkMode } from "@/hooks/use-dark-mode";

describe("useDarkMode", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("starts in light mode by default when no stored preference and system is light", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });

  it("starts in dark mode when localStorage has dark theme", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
  });

  it("toggles between dark and light", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(false);
  });

  it("adds dark class to html when dark", () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class from html when light", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists preference to localStorage", () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
