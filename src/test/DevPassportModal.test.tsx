import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DevPassportModal } from "@/components/DevPassportModal";
import * as achievementsHook from "@/hooks/use-achievements";
import { soundEngine } from "@/lib/audio";

describe("DevPassportModal Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders DevPassportModal when open and displays badges", () => {
    render(<DevPassportModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Paszport Dewelopera & Osiągnięcia/i)).toBeInTheDocument();
    expect(screen.getByText("Terminal Hacker")).toBeInTheDocument();
    expect(screen.getByText("JavaScript Master")).toBeInTheDocument();
    expect(screen.getByText("PWA Pioneer")).toBeInTheDocument();
  });

  it("allows switching sound profiles to mechanical or arcade", () => {
    const setProfileSpy = vi.spyOn(soundEngine, "setProfile");

    render(<DevPassportModal isOpen={true} onClose={vi.fn()} />);

    const mechanicalBtn = screen.getByText("mechanical");
    fireEvent.click(mechanicalBtn);

    expect(setProfileSpy).toHaveBeenCalledWith("mechanical");
  });

  it("calls onClose when close button or escape is clicked", () => {
    const onClose = vi.fn();
    render(<DevPassportModal isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByLabelText("Zamknij paszport");
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
