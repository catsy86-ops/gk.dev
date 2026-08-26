import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WinampPlayer } from "@/components/WinampPlayer";

describe("WinampPlayer / GKinAmp Enterprise Component Suite", () => {
  it("renders GKinAmp player chassis with title, marquee, and transport buttons", () => {
    render(<WinampPlayer isOpen={true} />);

    expect(screen.getByText("GKinAmp 2026")).toBeInTheDocument();
    expect(screen.getByText("CYBER")).toBeInTheDocument();
    expect(screen.getByTitle("Odtwarzaj")).toBeInTheDocument();
    expect(screen.getByTitle("Pauza")).toBeInTheDocument();
    expect(screen.getByTitle("Stop")).toBeInTheDocument();
    expect(screen.getByTitle("Następny utwór")).toBeInTheDocument();
    expect(screen.getByTitle("Poprzedni utwór")).toBeInTheDocument();
  });

  it("toggles playlist drawer when PL button is clicked", () => {
    render(<WinampPlayer isOpen={true} />);

    const plBtn = screen.getByTitle("Lista odtwarzania (PL)");
    fireEvent.click(plBtn);

    expect(screen.getByText(/GKinAmp PLAYLIST/i)).toBeInTheDocument();
  });

  it("toggles graphic equalizer drawer when EQ button is clicked", () => {
    render(<WinampPlayer isOpen={true} />);

    const eqBtn = screen.getByTitle("Korektor graficzny (EQ)");
    fireEvent.click(eqBtn);

    expect(screen.getByText(/GRAPHIC EQUALIZER/i)).toBeInTheDocument();
  });

  it("calls onClose and pauses music when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<WinampPlayer isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByTitle("Zamknij i zatrzymaj GKinAmp");
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    render(<WinampPlayer isOpen={false} />);
    expect(screen.queryByText("GKinAmp 2026")).not.toBeInTheDocument();
  });
});
