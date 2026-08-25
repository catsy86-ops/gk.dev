import { describe, it, expect, vi } from "vitest";
import { hapticLight, hapticMedium, hapticSuccess, hapticSelection } from "@/lib/haptics";

describe("haptics", () => {
  it("triggers navigator.vibrate when available", () => {
    const vibrateMock = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      value: vibrateMock,
      writable: true,
      configurable: true,
    });

    hapticLight();
    expect(vibrateMock).toHaveBeenCalledWith(8);

    hapticMedium();
    expect(vibrateMock).toHaveBeenCalledWith(15);

    hapticSuccess();
    expect(vibrateMock).toHaveBeenCalledWith([10, 30, 20]);

    hapticSelection();
    expect(vibrateMock).toHaveBeenCalledWith(5);
  });
});
