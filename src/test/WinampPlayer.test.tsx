import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WinampPlayer } from "@/components/WinampPlayer";

describe("WinampPlayer / GKinAmp Pro Suite", () => {
  it("renders GKinAmp player chassis with title, marquee, and transport buttons", () => {
    render(<WinampPlayer isOpen={true} />);

    expect(screen.getByText("GKinAmp 2026")).toBeInTheDocument();
    expect(screen.getByTitle("Odtwarzaj")).toBeInTheDocument();
    expect(screen.getByTitle("Pauza")).toBeInTheDocument();
    expect(screen.getByTitle("Stop")).toBeInTheDocument();
    expect(screen.getByTitle("Następny utwór")).toBeInTheDocument();
    expect(screen.getByTitle("Poprzedni utwór")).toBeInTheDocument();
    expect(screen.getByText("REC")).toBeInTheDocument();
    expect(screen.getByText("MIC")).toBeInTheDocument();
    expect(screen.getByText("LOAD")).toBeInTheDocument();
    expect(screen.getByText("BEAT GAME")).toBeInTheDocument();
  });

  it("toggles playlist drawer with category tabs and tracks", () => {
    render(<WinampPlayer isOpen={true} />);

    const plBtn = screen.getByTitle("Lista odtwarzania (PL)");
    fireEvent.click(plBtn);

    expect(screen.getByText(/MIDI/i)).toBeInTheDocument();
    expect(screen.getByText(/432Hz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sweet Dreams/i).length).toBeGreaterThan(0);
  });

  it("toggles DSP Effects Rack when FX button is clicked", () => {
    render(<WinampPlayer isOpen={true} />);

    const fxBtn = screen.getByTitle(/Efekty DSP/i);
    fireEvent.click(fxBtn);

    expect(screen.getByText("DSP EFFECTS PROCESSOR")).toBeInTheDocument();
    expect(screen.getByText("8D SURROUND")).toBeInTheDocument();
    expect(screen.getByText("VINYL TAPE")).toBeInTheDocument();
    expect(screen.getByText("REVERB ECHO")).toBeInTheDocument();
    expect(screen.getByText("MEGA BASS")).toBeInTheDocument();
  });

  it("toggles Skins drawer and allows selecting Cyberpunk skin", () => {
    render(<WinampPlayer isOpen={true} />);

    const skinsBtn = screen.getByTitle(/Wybór skórki/i);
    fireEvent.click(skinsBtn);

    expect(screen.getByText("SELECT SKIN THEME")).toBeInTheDocument();
    const cyberBtn = screen.getByText("Cyberpunk 2077 Neon");
    fireEvent.click(cyberBtn);

    expect(screen.getByText("cyberpunk")).toBeInTheDocument();
  });

  it("toggles Rhythm minigame when BEAT GAME button is clicked", () => {
    render(<WinampPlayer isOpen={true} />);

    const gameBtn = screen.getByText("BEAT GAME");
    fireEvent.click(gameBtn);

    expect(screen.getByText(/BEAT CATCHER RHYTHM GAME/i)).toBeInTheDocument();
    expect(screen.getByText("[A]")).toBeInTheDocument();
    expect(screen.getByText("[S]")).toBeInTheDocument();
    expect(screen.getByText("[D]")).toBeInTheDocument();
    expect(screen.getByText("[F]")).toBeInTheDocument();
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
