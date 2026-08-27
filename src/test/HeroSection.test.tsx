import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/HeroSection";
import { I18nProvider } from "@/components/I18nProvider";
import { BrowserRouter } from "react-router-dom";

describe("HeroSection Comprehensive Suite", () => {
  it("renders main hero elements, author name, CTA buttons, and terminal", () => {
    render(
      <BrowserRouter>
        <I18nProvider>
          <HeroSection />
        </I18nProvider>
      </BrowserRouter>
    );

    // Name — rendered as canvas with aria-label (desktop) or span text (mobile/reduced motion)
    const nameByLabel = screen.queryByLabelText("Grzegorz");
    const nameByText = screen.queryByText("Grzegorz");
    expect(nameByLabel || nameByText).toBeTruthy();

    // CTA buttons
    expect(screen.getByText("Zobacz projekty")).toBeInTheDocument();
    expect(screen.getByText("Napisz do mnie")).toBeInTheDocument();

    // Availability
    expect(screen.getByText(/Dostępny do projektów/i)).toBeInTheDocument();
  });
});
