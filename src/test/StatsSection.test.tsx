import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsSection from "@/components/StatsSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("StatsSection Component Suite", () => {
  it("renders metric cards with I18n translations", () => {
    render(
      <I18nProvider>
        <StatsSection />
      </I18nProvider>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
