import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingScreen } from "@/components/LoadingScreen";

describe("LoadingScreen", () => {
  it("renders with initialization text and progress elements", () => {
    render(<LoadingScreen onComplete={vi.fn()} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/Inicjalizacja architektury/i)).toBeInTheDocument();
    expect(screen.getByText("SYSTEM BOOT")).toBeInTheDocument();
  });
});
