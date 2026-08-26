import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FaqSection from "@/components/FaqSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("FaqSection Comprehensive Suite", () => {
  it("renders FAQ accordion items and expands answer on click", async () => {
    render(
      <I18nProvider>
        <FaqSection />
      </I18nProvider>
    );

    // Section badge
    expect(screen.getByText("Baza Wiedzy & FAQ")).toBeInTheDocument();

    // Verify first question exists
    const firstQuestion = screen.getByText(/Jak wygląda proces współpracy i rozliczeń\?/i);
    expect(firstQuestion).toBeInTheDocument();

    // Click trigger to expand
    fireEvent.click(firstQuestion);

    // Verify answer is visible
    expect(await screen.findByText(/Zaczynamy od bezpłatnej rozmowy/i)).toBeInTheDocument();
  });
});
