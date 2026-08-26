import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OfflineNetworkIndicator } from "@/components/OfflineNetworkIndicator";

describe("OfflineNetworkIndicator Component Suite", () => {
  it("renders without crashing in online mode", () => {
    const { container } = render(<OfflineNetworkIndicator />);
    expect(container).toBeDefined();
  });

  it("displays offline warning banner when network disconnects", () => {
    // Mock navigator.onLine as false
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);

    render(<OfflineNetworkIndicator />);
    // When offline, indicator text should be rendered
    window.dispatchEvent(new Event("offline"));

    expect(
      screen.getByText(/Tryb offline — pełna zawartość strony i GKinAmp działają/i)
    ).toBeInTheDocument();
  });
});
