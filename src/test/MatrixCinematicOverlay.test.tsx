import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatrixCinematicOverlay } from "@/components/MatrixCinematicOverlay";

describe("MatrixCinematicOverlay Component Suite", () => {
  it("renders Matrix HUD and countdown when active", () => {
    const handleClose = vi.fn();
    render(<MatrixCinematicOverlay isActive={true} onClose={handleClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/NEURAL REALITY BREACH/i)).toBeInTheDocument();
    expect(screen.getByText(/GK.DEV MATRIX/i)).toBeInTheDocument();
  });

  it("triggers onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<MatrixCinematicOverlay isActive={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: /Wyłącz tryb Matrix/i });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("does not render when isActive is false", () => {
    render(<MatrixCinematicOverlay isActive={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
