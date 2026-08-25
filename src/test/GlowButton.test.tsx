import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlowButton } from "@/components/ui/GlowButton";

describe("GlowButton", () => {
  it("renders button and triggers onClick with animation", () => {
    const handleClick = vi.fn();
    render(
      <GlowButton variant="glow" size="default" onClick={handleClick}>
        Test Button
      </GlowButton>
    );

    const btn = screen.getByRole("button", { name: /test button/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders as anchor link when href is provided", () => {
    render(
      <GlowButton variant="glass" href="#kontakt">
        Link Button
      </GlowButton>
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#kontakt");
  });
});
