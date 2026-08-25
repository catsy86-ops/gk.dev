import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HolographicCard } from "@/components/ui/HolographicCard";

describe("HolographicCard", () => {
  it("renders children inside holographic card container", () => {
    render(
      <HolographicCard>
        <div>Holographic Content</div>
      </HolographicCard>
    );

    expect(screen.getByText("Holographic Content")).toBeInTheDocument();
  });
});
