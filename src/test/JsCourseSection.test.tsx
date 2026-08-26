import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JsCourseSection } from "@/components/JsCourseSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("JsCourseSection Comprehensive Suite", () => {
  it("renders JS course header, module navigation, and progress tracker", () => {
    render(
      <I18nProvider>
        <JsCourseSection />
      </I18nProvider>
    );

    // Header and badge
    expect(screen.getByText(/Darmowy Crash Course • Open Knowledge/i)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript \(ES6\+\)/i)).toBeInTheDocument();

    // Module pills
    expect(screen.getAllByText(/Fundamenty & ES6\+/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Metody Tablic/i)).toBeInTheDocument();
    expect(screen.getByText(/Asynchroniczność/i)).toBeInTheDocument();

    // Active lesson theory & code
    expect(screen.getByText(/Nowoczesna Składnia: let\/const/i)).toBeInTheDocument();
    expect(screen.getByText(/MDN Official Guide/i)).toBeInTheDocument();
  });

  it("switches modules and handles interactive quiz answer submission", () => {
    render(
      <I18nProvider>
        <JsCourseSection />
      </I18nProvider>
    );

    // Switch to Module 2 (Metody Tablic)
    const arrayModuleBtn = screen.getByText(/Metody Tablic/i);
    fireEvent.click(arrayModuleBtn);

    expect(screen.getByText(/Potęga Metod Tablicowych: map, filter, reduce/i)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript.info Tutorial/i)).toBeInTheDocument();

    // Interactive Quiz Option selection
    const optionB = screen.getByText(/65/i);
    fireEvent.click(optionB);

    const submitBtn = screen.getByRole("button", { name: /Sprawdź odpowiedź/i });
    fireEvent.click(submitBtn);

    // Positive feedback on correct answer
    expect(screen.getByText(/Świetnie! Poprawna odpowiedź\./i)).toBeInTheDocument();
  });

  it("handles code copy and virtual console code execution", () => {
    render(
      <I18nProvider>
        <JsCourseSection />
      </I18nProvider>
    );

    // Copy code button
    const copyBtn = screen.getByRole("button", { name: /Kopiuj/i });
    expect(copyBtn).toBeInTheDocument();
    fireEvent.click(copyBtn);

    // Run code button (Sandbox)
    const runBtn = screen.getByRole("button", { name: /Uruchom/i });
    expect(runBtn).toBeInTheDocument();
    fireEvent.click(runBtn);

    // Virtual console rendered
    expect(screen.getByText(/Virtual Console Sandbox/i)).toBeInTheDocument();
  });
});
