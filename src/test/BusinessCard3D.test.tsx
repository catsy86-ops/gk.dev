import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BusinessCard3D } from "@/components/ui/BusinessCard3D";

vi.mock("@/hooks/use-achievements", () => ({
  useAchievements: () => ({ unlock: vi.fn(), achievements: [], totalXp: 0, unlockedCount: 0, totalCount: 0, rank: { title: "Visitor", level: "Guest", color: "" } }),
}));
vi.mock("@/lib/audio", () => ({ soundEngine: { playPop: vi.fn(), playChime: vi.fn() } }));
vi.mock("@/lib/haptics", () => ({ hapticMedium: vi.fn() }));

describe("BusinessCard3D", () => {
  it("renders front side with Grzegorz name and available badge", () => {
    render(<BusinessCard3D />);
    expect(screen.getByText("Grzegorz")).toBeDefined();
    expect(screen.getByText("Dostępny")).toBeDefined();
  });

  it("renders interactive button element", () => {
    render(<BusinessCard3D />);
    const card = screen.getByRole("button");
    expect(card).toBeDefined();
  });
});
