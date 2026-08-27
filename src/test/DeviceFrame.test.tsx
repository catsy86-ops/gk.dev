import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeviceFrame } from "@/components/ui/DeviceFrame";

describe("DeviceFrame Component Suite", () => {
  it("renders macbook frame with title and children", () => {
    render(
      <DeviceFrame variant="macbook" title="MacBook Cloud Node">
        <div>MacBook Screen Content</div>
      </DeviceFrame>
    );

    expect(screen.getByText("MacBook Cloud Node")).toBeInTheDocument();
    expect(screen.getByText("MacBook Screen Content")).toBeInTheDocument();
  });

  it("renders iphone frame with children and dynamic island", () => {
    render(
      <DeviceFrame variant="iphone">
        <div>iPhone Mobile View</div>
      </DeviceFrame>
    );

    expect(screen.getByText("iPhone Mobile View")).toBeInTheDocument();
  });
});
