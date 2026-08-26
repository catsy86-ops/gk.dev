import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/components/I18nProvider";

describe("Footer Component Suite", () => {
  it("renders footer brand logo, navigation links, and social links without errors", () => {
    render(
      <I18nProvider>
        <Footer />
      </I18nProvider>
    );

    expect(screen.getAllByLabelText(/GK\.dev/i)[0]).toBeInTheDocument();
    expect(screen.getByText("GRZEGORZ • DEV")).toBeInTheDocument();
    expect(screen.getByText("Nawigacja")).toBeInTheDocument();
    expect(screen.getByText("Social Media & Kontakt")).toBeInTheDocument();
    expect(screen.getByText(/Wszelkie prawa zastrzeżone/i)).toBeInTheDocument();
    expect(screen.getByText(/Clean Code/i)).toBeInTheDocument();
  });

  it("handles smooth scrolling for internal section links", () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <I18nProvider>
        <Footer />
      </I18nProvider>
    );

    const aboutLink = screen.getByText("O mnie");
    fireEvent.click(aboutLink);
  });
});
