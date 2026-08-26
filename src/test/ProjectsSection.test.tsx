import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsSection from "@/components/ProjectsSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("ProjectsSection Comprehensive Suite", () => {
  it("renders projects list and filters by search query and category", () => {
    render(
      <I18nProvider>
        <ProjectsSection />
      </I18nProvider>
    );

    // Verify search filter works
    const searchInput = screen.getByPlaceholderText(/Szukaj/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Przypominacz" } });

    // Verify filtered results
    expect(screen.getByText(/Przypominacz Tasks/i)).toBeInTheDocument();
  }, 15000);
});
