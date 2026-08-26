import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { I18nProvider } from "@/components/I18nProvider";

describe("LanguageToggle Component Suite", () => {
  it("renders current language and toggles between PL and EN", () => {
    render(
      <I18nProvider>
        <LanguageToggle variant="bordered" />
      </I18nProvider>
    );

    const button = screen.getByRole("button", { name: /zmień język/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/pl/i)).toBeInTheDocument();

    // Toggle
    fireEvent.click(button);
    expect(screen.getByText(/en/i)).toBeInTheDocument();

    // Toggle back
    fireEvent.click(button);
    expect(screen.getByText(/pl/i)).toBeInTheDocument();
  });
});
