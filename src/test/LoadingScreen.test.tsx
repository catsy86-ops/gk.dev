import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingScreen } from "@/components/LoadingScreen";

describe("LoadingScreen Component Suite", () => {
  it("renders with 3D GK.DEV brand and initialization elements", () => {
    render(<LoadingScreen onComplete={vi.fn()} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("GK.DEV")).toBeInTheDocument();
    expect(screen.getByText(/Matrix Rain/i)).toBeInTheDocument();
    expect(screen.getByText("INITIALIZING")).toBeInTheDocument();
  });
});
