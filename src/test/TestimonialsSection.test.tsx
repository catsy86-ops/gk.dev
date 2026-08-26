import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TestimonialsSection from "@/components/TestimonialsSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("TestimonialsSection Comprehensive Suite", () => {
  it("renders testimonials, customer quotes, and client review cards", () => {
    render(
      <I18nProvider>
        <TestimonialsSection />
      </I18nProvider>
    );

    // Section title / badge
    expect(screen.getByText("Rekomendacje & Social Proof")).toBeInTheDocument();

    // Verify first client is visible
    expect(screen.getByText("Anna Kowalska")).toBeInTheDocument();
    expect(screen.getByText("CEO, TechStart")).toBeInTheDocument();
  });
});
