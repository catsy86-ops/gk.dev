import { describe, it, expect } from "vitest";
import { musicEngine, SOUNDSCAPE_TRACKS, NOTE_FREQS } from "@/lib/music-engine";

describe("MusicEngine / GKinAmp Pro Synthesizer & DSP Suite", () => {
  it("contains MIDI classics and ambient soundscapes", () => {
    const midiTracks = SOUNDSCAPE_TRACKS.filter((t) => t.category === "midi");
    const ambientTracks = SOUNDSCAPE_TRACKS.filter((t) => t.category === "ambient");

    expect(midiTracks.length).toBeGreaterThanOrEqual(8);
    expect(ambientTracks.length).toBeGreaterThanOrEqual(4);

    const sweetDreams = midiTracks.find((t) => t.id === "sweet-dreams");
    expect(sweetDreams).toBeDefined();
    expect(sweetDreams?.sequence?.length).toBeGreaterThan(0);
  });

  it("maps note frequencies accurately", () => {
    expect(NOTE_FREQS["A4"]).toBe(440);
    expect(NOTE_FREQS["C4"]).toBeCloseTo(261.63, 1);
    expect(NOTE_FREQS["-"]).toBe(0);
  });

  it("updates volume, balance, pitch speed, and preset", () => {
    musicEngine.setVolume(0.85);
    expect(musicEngine.getVolume()).toBe(0.85);

    musicEngine.setBalance(-0.5);
    expect(musicEngine.getBalance()).toBe(-0.5);

    musicEngine.setPitchSpeed(1.2);
    expect(musicEngine.getPitchSpeed()).toBe(1.2);

    musicEngine.setPreset("techno");
    expect(musicEngine.getPreset()).toBe("techno");
  });

  it("toggles DSP effects (8D, Vinyl, Reverb, Bass Boost)", () => {
    musicEngine.toggleSpatial8D();
    expect(musicEngine.getDsp().spatial8D).toBe(true);
    musicEngine.toggleSpatial8D();
    expect(musicEngine.getDsp().spatial8D).toBe(false);

    musicEngine.toggleVinylCrackle();
    expect(musicEngine.getDsp().vinylCrackle).toBe(true);
    musicEngine.toggleVinylCrackle();
    expect(musicEngine.getDsp().vinylCrackle).toBe(false);

    musicEngine.toggleReverb();
    expect(musicEngine.getDsp().reverb).toBe(true);
    musicEngine.toggleReverb();
    expect(musicEngine.getDsp().reverb).toBe(false);

    musicEngine.toggleBassBoost();
    expect(musicEngine.getDsp().bassBoost).toBe(true);
    musicEngine.toggleBassBoost();
    expect(musicEngine.getDsp().bassBoost).toBe(false);
  });

  it("extracts frequency and time-domain waveform data safely", () => {
    const freq = musicEngine.getFrequencyData();
    expect(freq.length).toBe(16);

    const timeDomain = musicEngine.getTimeDomainData();
    expect(timeDomain.length).toBeGreaterThanOrEqual(16);
  });

  it("switches to next and previous tracks", () => {
    musicEngine.nextTrack();
    expect(musicEngine.getTrack().id).toBe(SOUNDSCAPE_TRACKS[1].id);

    musicEngine.prevTrack();
    expect(musicEngine.getTrack().id).toBe(SOUNDSCAPE_TRACKS[0].id);
  });
});
