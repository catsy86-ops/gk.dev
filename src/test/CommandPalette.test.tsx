import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandPalette } from "@/components/CommandPalette";

describe("CommandPalette", () => {
  it("does not render dialog when isOpen is false", () => {
    render(<CommandPalette isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByPlaceholderText(/Szukaj sekcji/i)).not.toBeInTheDocument();
  });

  it("renders search input and options when isOpen is true", () => {
    render(<CommandPalette isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Szukaj sekcji/i)).toBeInTheDocument();
    expect(screen.getByText(/Start \/ Główna/i)).toBeInTheDocument();
    expect(screen.getByText(/Realizacje & Case Studies/i)).toBeInTheDocument();
  });

  it("filters items based on user query", () => {
    render(<CommandPalette isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Szukaj sekcji/i);
    fireEvent.change(input, { target: { value: "Projekty" } });
    expect(screen.getByText(/Realizacje & Case Studies/i)).toBeInTheDocument();
  });
});
