import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileDock } from "@/components/MobileDock";

describe("MobileDock", () => {
  it("renders mobile navigation items and action button", () => {
    render(<MobileDock />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("O mnie")).toBeInTheDocument();
    expect(screen.getByText("Stack")).toBeInTheDocument();
    expect(screen.getByText("Projekty")).toBeInTheDocument();
    expect(screen.getByText("Napisz")).toBeInTheDocument();
  });
});
