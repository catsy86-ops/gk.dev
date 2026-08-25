import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileQuickActions } from "@/components/MobileQuickActions";

describe("MobileQuickActions", () => {
  it("renders quick actions sheet when open and handles actions", () => {
    const onClose = vi.fn();
    render(<MobileQuickActions isOpen={true} onClose={onClose} />);

    expect(screen.getByText("Szybki Kontakt & Udostępnianie")).toBeInTheDocument();
    expect(screen.getByText("Udostępnij profil")).toBeInTheDocument();
    expect(screen.getByText("Pobierz CV (PDF)")).toBeInTheDocument();
    expect(screen.getByText("Napisz Email")).toBeInTheDocument();
    expect(screen.getByText("Kopiuj Telefon")).toBeInTheDocument();

    const shareBtn = screen.getByText("Udostępnij profil");
    fireEvent.click(shareBtn);
  });
});
