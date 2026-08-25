import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AiAssistantDialog } from "@/components/AiAssistantDialog";

describe("AiAssistantDialog", () => {
  it("renders assistant dialog and allows sending queries", async () => {
    const onClose = vi.fn();
    render(<AiAssistantDialog isOpen={true} onClose={onClose} />);

    expect(screen.getByText("GK AI Architect")).toBeInTheDocument();
    expect(screen.getByText(/100% Local • Free/i)).toBeInTheDocument();

    const quickChip = screen.getByText("Jaki jest główny stack technologiczny?");
    expect(quickChip).toBeInTheDocument();

    fireEvent.click(quickChip);
  });
});
