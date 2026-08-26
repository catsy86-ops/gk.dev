import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import Index from "@/pages/Index";
import { I18nProvider } from "@/components/I18nProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

describe("Index Page & App Tree Rendering Suite", () => {
  it("renders Index page without any ErrorBoundary crash", () => {
    const { unmount } = render(
      <MotionConfig reducedMotion="always">
        <I18nProvider>
          <TooltipProvider>
            <Index />
          </TooltipProvider>
        </I18nProvider>
      </MotionConfig>
    );

    // Verify main landmarks and sections render cleanly
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getAllByText(/Grzegorz/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Zobacz projekty")).toBeInTheDocument();
    expect(screen.getByText("Napisz do mnie")).toBeInTheDocument();

    // Verify ErrorBoundary fallback is NOT shown
    expect(
      screen.queryByText(/Sekcja "Aplikacja" nie mogła się załadować/i)
    ).not.toBeInTheDocument();

    unmount();
  }, 15000);
});
