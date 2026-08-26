/**
 * Procedural Web Audio UI Sound Synthesizer
 * Zero random click/pop noise — micro-interactions remain 100% silent.
 */

export type SoundProfile = "minimal" | "mechanical" | "arcade";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private profile: SoundProfile = "minimal";

  constructor() {
    // Strictly muted by default
    this.isMuted = true;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getProfile(): SoundProfile {
    return this.profile;
  }

  public setProfile(newProfile: SoundProfile): void {
    this.profile = newProfile;
  }

  public playClick() {
    // Completely silent
  }

  public playPop(_freq = 520, _duration = 0.06) {
    // Completely silent
  }

  public playChime() {
    // Completely silent
  }

  public playMatrixGlitch() {
    // Completely silent
  }
}

export const soundEngine = new SoundEngine();
