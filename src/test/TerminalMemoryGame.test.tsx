import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TerminalMemoryGame } from "@/components/ui/TerminalMemoryGame";

vi.mock("@/hooks/use-achievements", () => ({
  useAchievements: () => ({ unlock: vi.fn() }),
}));
vi.mock("@/lib/audio", () => ({
  soundEngine: { playPop: vi.fn(), playChime: vi.fn() },
}));
vi.mock("@/lib/haptics", () => ({ hapticLight: vi.fn(), hapticSuccess: vi.fn() }));
vi.mock("@/lib/confetti", () => ({ triggerConfetti: vi.fn() }));

describe("TerminalMemoryGame", () => {
  it("renders 16 card buttons on a 4x4 grid", () => {
    const onExit = vi.fn();
    render(<TerminalMemoryGame theme="matrix" onExit={onExit} />);
    const cards = screen.getAllByRole("button");
    // 16 game cards + exit button
    expect(cards.length).toBeGreaterThanOrEqual(16);
  });

  it("renders STACK MEMORY GAME heading", () => {
    render(<TerminalMemoryGame theme="cyber" onExit={vi.fn()} />);
    expect(screen.getByText(/STACK MEMORY GAME/i)).toBeDefined();
  });

  it("exits when exit button is clicked", () => {
    const onExit = vi.fn();
    render(<TerminalMemoryGame theme="matrix" onExit={onExit} />);
    const exitBtn = screen.getByText(/Wyjdź/);
    fireEvent.click(exitBtn);
    expect(onExit).toHaveBeenCalledTimes(1);
  });
});
