import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProjectSvgThumbnail } from "@/components/ProjectSvgThumbnail";

describe("ProjectSvgThumbnail Component Suite", () => {
  it("renders SVG graphics for known project identifiers without crashing", () => {
    const { container } = render(
      <ProjectSvgThumbnail
        projectId="rezerwacje"
        category="SaaS & Web App"
        accent="#3b82f6"
        isHovered={false}
      />
    );

    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  it("handles fallback and hover states smoothly", () => {
    const { container } = render(
      <ProjectSvgThumbnail
        projectId="unknown-future-project"
        category="AI / ML"
        accent="#10b981"
        isHovered={true}
      />
    );

    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });
});
