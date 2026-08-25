import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "@/components/ui/BrandLogo";

describe("BrandLogo", () => {
  it("renders GK.dev logo with text and monogram", () => {
    render(<BrandLogo />);
    expect(screen.getAllByText("GK").length).toBeGreaterThan(0);
    expect(screen.getByText(".dev")).toBeInTheDocument();
  });
});
