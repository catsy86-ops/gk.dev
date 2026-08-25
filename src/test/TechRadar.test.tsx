import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechRadar } from "@/components/TechRadar";

describe("TechRadar", () => {
  it("renders TechRadar and displays core telemetry nodes", () => {
    render(<TechRadar />);

    expect(screen.getByText("Radar Architektury & Kompetencji")).toBeInTheDocument();
    expect(screen.getAllByText("React 19")[0]).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});
