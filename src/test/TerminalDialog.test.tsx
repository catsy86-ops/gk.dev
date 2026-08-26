import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TerminalDialog } from "@/components/TerminalDialog";

describe("TerminalDialog", () => {
  it("renders terminal dialog when open and responds to help and snake commands", () => {
    const onClose = vi.fn();
    render(<TerminalDialog isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/gk@dev-terminal:~/i)).toBeInTheDocument();
    expect(screen.getByText(/GK\.dev Interactive Shell v3\.0/i)).toBeInTheDocument();

    const input = screen.getByRole("textbox");

    // Test help command
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText(/Dostępne Polecenia Systemowe CLI:/i)).toBeInTheDocument();

    // Test neofetch command
    fireEvent.change(input, { target: { value: "neofetch" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText(/GK\.dev Architecture Cloud/i)).toBeInTheDocument();

    // Test snake mini-game launch
    fireEvent.change(input, { target: { value: "snake" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText(/RETRO SNAKE CLI/i)).toBeInTheDocument();
  });
});
