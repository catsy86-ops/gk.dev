import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BorderBeam } from "@/components/ui/BorderBeam";

describe("BorderBeam", () => {
  it("renders BorderBeam element without crash", () => {
    const { container } = render(<BorderBeam size={200} duration={10} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
