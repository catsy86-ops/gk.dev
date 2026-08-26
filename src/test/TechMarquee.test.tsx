import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TechMarquee from "@/components/TechMarquee";
import { I18nProvider } from "@/components/I18nProvider";

describe("TechMarquee Component Suite", () => {
  it("renders tech marquee tracks and skill badges correctly", () => {
    render(
      <I18nProvider>
        <TechMarquee />
      </I18nProvider>
    );

    // Section title exists
    expect(screen.getByText(/Technologie, z którymi/i)).toBeInTheDocument();

    // Check for popular core technologies in the marquee
    expect(screen.getAllByText(/React/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TypeScript/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Next\.js/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tailwind/i).length).toBeGreaterThan(0);
  });
});
