import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GravityTextCanvas } from "@/components/ui/GravityTextCanvas";

vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => false,
}));

describe("GravityTextCanvas", () => {
  it("renders canvas element with aria-label", () => {
    render(<GravityTextCanvas text="Grzegorz" fontSize={80} aria-label="Grzegorz" />);
    const canvas = screen.getByRole("img", { name: "Grzegorz" });
    expect(canvas).toBeDefined();
  });
});
