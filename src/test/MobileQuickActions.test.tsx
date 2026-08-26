import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileQuickActions } from "@/components/MobileQuickActions";

describe("MobileQuickActions", () => {
  it("renders quick actions sheet when open and handles actions", () => {
    const onClose = vi.fn();
    render(<MobileQuickActions isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/Centrum Narzędzi & Akcji/i)).toBeInTheDocument();
    expect(screen.getByText(/Terminal Deweloperski \(CLI\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Udostępnij profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Zapisz wizytówkę/i)).toBeInTheDocument();
    expect(screen.getByText(/Pobierz CV \(PDF\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Napisz Email/i)).toBeInTheDocument();

    const shareBtn = screen.getByText(/Udostępnij profil/i);
    fireEvent.click(shareBtn);
  });
});
