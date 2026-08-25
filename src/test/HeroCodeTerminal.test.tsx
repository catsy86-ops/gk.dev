import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HeroCodeTerminal } from "@/components/HeroCodeTerminal";

describe("HeroCodeTerminal", () => {
  it("renders with default architect.ts tab and code content", () => {
    render(<HeroCodeTerminal />);
    expect(screen.getByText("architect.ts")).toBeInTheDocument();
    expect(screen.getByText(/Senior Fullstack Engineer/i)).toBeInTheDocument();
    expect(screen.getByText("READY")).toBeInTheDocument();
  });

  it("switches tabs when clicked", async () => {
    render(<HeroCodeTerminal />);
    const stackTab = screen.getByText("stack.json");
    fireEvent.click(stackTab);
    await waitFor(() => {
      expect(screen.getByText(/SOLID/i)).toBeInTheDocument();
    });

    const metricsTab = screen.getByText("vitals.log");
    fireEvent.click(metricsTab);
    await waitFor(() => {
      expect(screen.getByText(/SYSTEM DIAGNOSTICS/i)).toBeInTheDocument();
    });
  });
});
