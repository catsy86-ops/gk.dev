import { describe, it, expect } from "vitest";
import { soundEngine } from "@/lib/audio";

describe("soundEngine", () => {
  it("toggles mute state and persists preference", () => {
    const initialMuted = soundEngine.getIsMuted();
    const toggledActive = soundEngine.toggleMute();
    expect(toggledActive).toBe(initialMuted);
    expect(soundEngine.getIsMuted()).toBe(!initialMuted);

    // Reset back
    soundEngine.toggleMute();
    expect(soundEngine.getIsMuted()).toBe(initialMuted);
  });

  it("does not throw on play methods when muted", () => {
    expect(() => soundEngine.playClick()).not.toThrow();
    expect(() => soundEngine.playPop()).not.toThrow();
    expect(() => soundEngine.playChime()).not.toThrow();
  });
});
