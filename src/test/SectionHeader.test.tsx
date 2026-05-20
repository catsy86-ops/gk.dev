import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Star } from "lucide-react";

describe("SectionHeader", () => {
  it("renders badge text", () => {
    render(<SectionHeader badge="Moje projekty" title="Wybrane" highlight="realizacje" />);
    expect(screen.getByText("Moje projekty")).toBeInTheDocument();
  });

  it("renders title and highlight", () => {
    render(<SectionHeader badge="Test" title="Moje" highlight="umiejętności" />);
    expect(screen.getByText("Moje")).toBeInTheDocument();
    expect(screen.getByText("umiejętności")).toBeInTheDocument();
  });

  it("renders badge icon when provided", () => {
    render(
      <SectionHeader
        badge="Projekty"
        badgeIcon={<Star data-testid="badge-icon" className="h-3 w-3" />}
        title="Moje"
        highlight="projekty"
      />,
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });

  it("applies gradient class when gradient prop is true", () => {
    render(<SectionHeader badge="Test" title="Moje" highlight="projekty" gradient />);
    const highlight = screen.getByText("projekty");
    expect(highlight.className).toContain("bg-gradient-to-r");
  });

  it("does not apply gradient class by default", () => {
    render(<SectionHeader badge="Test" title="Moje" highlight="projekty" />);
    const highlight = screen.getByText("projekty");
    expect(highlight.className).not.toContain("bg-gradient-to-r");
  });

  it("renders as h2 heading", () => {
    render(<SectionHeader badge="Test" title="Moje" highlight="projekty" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
