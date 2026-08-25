import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AmbientBackground } from "@/components/AmbientBackground";

describe("AmbientBackground", () => {
  it("renders ambient orbs container", () => {
    const { container } = render(<AmbientBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
