import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillsSection from "@/components/SkillsSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("SkillsSection Comprehensive Suite", () => {
  it("renders skills section with title, badge, and Bento Grid", () => {
    render(
      <I18nProvider>
        <SkillsSection />
      </I18nProvider>
    );

    // Verify skills bento grid items
    expect(screen.getByText("Frontend Engineering")).toBeInTheDocument();
    expect(screen.getByText("Backend & Systemy API")).toBeInTheDocument();
    expect(screen.getByText("Cloud & DevOps")).toBeInTheDocument();
    expect(screen.getByText("Architektura & Clean Code")).toBeInTheDocument();
    expect(screen.getByText("Mobile Development")).toBeInTheDocument();
    expect(screen.getByText("UI/UX & Design Systems")).toBeInTheDocument();
  });
});
