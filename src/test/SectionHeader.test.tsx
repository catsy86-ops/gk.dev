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
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Moje");
    expect(heading).toHaveTextContent("umiejętności");
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
    const { container } = render(<SectionHeader badge="Test" title="Moje" highlight="projekty" gradient />);
    const gradientEl = container.querySelector(".bg-gradient-to-r");
    expect(gradientEl).toBeTruthy();
  });

  it("does not apply gradient class by default", () => {
    const { container } = render(<SectionHeader badge="Test" title="Moje" highlight="projekty" />);
    const gradientEl = container.querySelector(".bg-gradient-to-r");
    expect(gradientEl).toBeFalsy();
  });

  it("renders as h2 heading", () => {
    render(<SectionHeader badge="Test" title="Moje" highlight="projekty" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
