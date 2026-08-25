import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TerminalDialog } from "@/components/TerminalDialog";

describe("TerminalDialog", () => {
  it("renders terminal dialog when open and responds to help command", () => {
    const onClose = vi.fn();
    render(<TerminalDialog isOpen={true} onClose={onClose} />);

    expect(screen.getByText("gk@dev-terminal:~")).toBeInTheDocument();
    expect(screen.getByText("GK.dev Interactive Shell v2.6.0 [x86_64-pc-none-elf]")).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.getByText("Dostępne polecenia:")).toBeInTheDocument();
  });
});
