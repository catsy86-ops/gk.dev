import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Animated3dLogo } from "@/components/ui/Animated3dLogo";

describe("BrandLogo & Animated3dLogo Suite", () => {
  it("renders 3D cybernetic logo with text, monogram, and telemetry by default", () => {
    render(<BrandLogo />);
    expect(screen.getAllByText("GK").length).toBeGreaterThan(0);
    expect(screen.getByText(/\.dev|\.DEV/i)).toBeInTheDocument();
  });

  it("renders pure 3D monogram badge without wordmark when showWordmark is false (Navbar mode)", () => {
    render(<BrandLogo showWordmark={false} />);
    expect(screen.getByText("GK")).toBeInTheDocument();
    expect(screen.queryByText(/\.DEV/i)).not.toBeInTheDocument();
  });

  it("renders Animated3dLogo in hero size", () => {
    render(<Animated3dLogo size="hero" />);
    expect(screen.getAllByText("GK").length).toBeGreaterThan(0);
    expect(screen.getByText(/\.DEV/i)).toBeInTheDocument();
  });
});
