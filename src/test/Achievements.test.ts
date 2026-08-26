import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAchievements } from "@/hooks/use-achievements";

describe("Achievements & Gamification Hook Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with zero unlocked achievements and correct totalCount", () => {
    const { result } = renderHook(() => useAchievements());
    expect(result.current.unlockedCount).toBe(0);
    expect(result.current.totalXp).toBe(0);
    expect(result.current.rank.title).toBe("Visitor");
    expect(result.current.totalCount).toBeGreaterThan(5);
  });

  it("unlocks an achievement and updates totalXp and rank", () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      result.current.unlock("terminal_hacker");
    });

    expect(result.current.unlockedCount).toBe(1);
    expect(result.current.totalXp).toBe(50);
    expect(result.current.achievements.find((a) => a.id === "terminal_hacker")?.unlockedAt).not.toBeNull();
  });
});
