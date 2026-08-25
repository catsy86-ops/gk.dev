import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeAccentPicker } from "@/components/ThemeAccentPicker";
import { setGlobalAccent } from "@/lib/theme";

describe("ThemeAccentPicker", () => {
  it("renders palette trigger and allows selecting accents", () => {
    render(<ThemeAccentPicker />);

    const trigger = screen.getByRole("button", { name: /Wybierz akcent kolorystyczny/i });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    const emeraldBtn = screen.getByRole("button", { name: /Akcent: Cyber Emerald/i });
    expect(emeraldBtn).toBeInTheDocument();

    fireEvent.click(emeraldBtn);
  });

  it("updates CSS variables when setGlobalAccent is called", () => {
    setGlobalAccent("emerald");
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("160 84% 39%");
  });
});
