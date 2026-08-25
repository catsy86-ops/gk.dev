import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

describe("SpotlightCard", () => {
  it("renders children inside spotlight card container", () => {
    render(
      <SpotlightCard>
        <div>Spotlight Content</div>
      </SpotlightCard>
    );

    expect(screen.getByText("Spotlight Content")).toBeInTheDocument();
  });
});
