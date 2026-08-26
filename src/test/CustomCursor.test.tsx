import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CustomCursor from "@/components/CustomCursor";

describe("CustomCursor Suite", () => {
  it("renders custom cursor portal into body", () => {
    render(<CustomCursor />);
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    expect(dot).toBeInTheDocument();
    expect(ring).toBeInTheDocument();
  });
});
