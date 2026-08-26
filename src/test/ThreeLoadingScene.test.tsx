import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ThreeLoadingScene } from "@/components/ThreeLoadingScene";

describe("ThreeLoadingScene Component Suite", () => {
  it("renders container cleanly and mounts without errors", () => {
    const { container } = render(<ThreeLoadingScene />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
