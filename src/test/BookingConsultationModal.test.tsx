import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookingConsultationModal } from "@/components/BookingConsultationModal";
import { I18nProvider } from "@/components/I18nProvider";

describe("BookingConsultationModal", () => {
  it("renders modal when open and allows submitting booking", () => {
    const handleClose = vi.fn();

    render(
      <I18nProvider>
        <BookingConsultationModal isOpen={true} onClose={handleClose} />
      </I18nProvider>
    );

    expect(screen.getByRole("dialog", { name: "Rezerwacja Konsultacji 1:1" })).toBeInTheDocument();
    expect(screen.getByText("Architektura SaaS & Skalowalność")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("Jan Kowalski");
    const emailInput = screen.getByPlaceholderText("jan@firma.pl");

    fireEvent.change(nameInput, { target: { value: "Piotr Nowak" } });
    fireEvent.change(emailInput, { target: { value: "piotr@test.pl" } });

    const submitBtn = screen.getByText("Potwierdź rezerwację terminu");
    fireEvent.click(submitBtn);

    expect(screen.getByText("Termin zarezerwowany!")).toBeInTheDocument();
  });
});
