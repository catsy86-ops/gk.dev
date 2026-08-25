import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";

describe("AvailabilityBadge", () => {
  it("renders availability status text", () => {
    render(<AvailabilityBadge />);
    expect(screen.getByText(/Dostępny do projektów/i)).toBeInTheDocument();
  });
});
