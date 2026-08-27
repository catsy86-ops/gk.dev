import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MagneticButton } from "@/components/ui/MagneticButton";

describe("MagneticButton Component Suite", () => {
  it("renders children properly inside magnetic container", () => {
    render(
      <MagneticButton>
        <button type="button">Test Button</button>
      </MagneticButton>
    );

    expect(screen.getByRole("button", { name: "Test Button" })).toBeInTheDocument();
  });

  it("handles mouse move and leave events without error", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <MagneticButton onClick={handleClick}>
        <span>Interactive Link</span>
      </MagneticButton>
    );

    const target = container.firstChild as HTMLElement;
    expect(target).toBeInTheDocument();

    fireEvent.mouseEnter(target);
    fireEvent.mouseMove(target, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(target);
    fireEvent.click(target);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
