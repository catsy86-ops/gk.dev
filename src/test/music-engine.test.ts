import { describe, it, expect } from "vitest";
import { musicEngine, SOUNDSCAPE_TRACKS } from "@/lib/music-engine";

describe("MusicEngine / GKinAmp Ambient Synthesizer Suite", () => {
  it("initializes with first track and default volume", () => {
    const track = musicEngine.getTrack();
    expect(track.id).toBe(SOUNDSCAPE_TRACKS[0].id);
    expect(musicEngine.getVolume()).toBeGreaterThan(0);
    expect(musicEngine.getIsPlaying()).toBe(false);
  });

  it("updates volume within bounded range [0, 1]", () => {
    musicEngine.setVolume(0.85);
    expect(musicEngine.getVolume()).toBe(0.85);

    musicEngine.setVolume(1.5);
    expect(musicEngine.getVolume()).toBe(1);

    musicEngine.setVolume(-0.5);
    expect(musicEngine.getVolume()).toBe(0);
  });

  it("updates balance and preset", () => {
    musicEngine.setBalance(0.5);
    expect(musicEngine.getBalance()).toBe(0.5);

    musicEngine.setPreset("deep-bass");
    expect(musicEngine.getPreset()).toBe("deep-bass");
  });

  it("switches to next and previous tracks", () => {
    musicEngine.nextTrack();
    expect(musicEngine.getTrack().id).toBe(SOUNDSCAPE_TRACKS[1].id);

    musicEngine.prevTrack();
    expect(musicEngine.getTrack().id).toBe(SOUNDSCAPE_TRACKS[0].id);
  });

  it("selects track by index", () => {
    musicEngine.selectTrack(2);
    expect(musicEngine.getTrack().id).toBe(SOUNDSCAPE_TRACKS[2].id);
  });

  it("returns 16-band frequency byte data without crashing", () => {
    const data = musicEngine.getFrequencyData();
    expect(data.length).toBe(16);
  });
});
