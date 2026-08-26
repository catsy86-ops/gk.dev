import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/GlowButton";

describe("Button & Interactive Elements State Suite", () => {
  it("renders standard button variants correctly", () => {
    const { rerender } = render(<Button variant="default">Domyślny</Button>);
    expect(screen.getByRole("button", { name: "Domyślny" })).toBeInTheDocument();

    rerender(<Button variant="destructive">Usuń</Button>);
    expect(screen.getByRole("button", { name: "Usuń" })).toBeInTheDocument();

    rerender(<Button variant="outline">Zarys</Button>);
    expect(screen.getByRole("button", { name: "Zarys" })).toBeInTheDocument();

    rerender(<Button variant="glow">Połysk</Button>);
    expect(screen.getByRole("button", { name: "Połysk" })).toBeInTheDocument();

    rerender(<Button variant="glass">Szkło</Button>);
    expect(screen.getByRole("button", { name: "Szkło" })).toBeInTheDocument();
  });

  it("handles click events and blocks clicks when disabled", () => {
    const handleClick = vi.fn();
    const { rerender } = render(<Button onClick={handleClick}>Aktywny</Button>);

    const activeBtn = screen.getByRole("button", { name: "Aktywny" });
    fireEvent.click(activeBtn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<Button onClick={handleClick} disabled>Zablokowany</Button>);
    const disabledBtn = screen.getByRole("button", { name: "Zablokowany" });
    expect(disabledBtn).toBeDisabled();
    fireEvent.click(disabledBtn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders GlowButton and handles interactive clicks", () => {
    const handleClick = vi.fn();
    render(
      <GlowButton onClick={handleClick} glowColor="rgba(59,130,246,0.5)">
        Kliknij mnie
      </GlowButton>
    );

    const glowBtn = screen.getByRole("button", { name: "Kliknij mnie" });
    expect(glowBtn).toBeInTheDocument();
    fireEvent.click(glowBtn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
