/**
 * Procedural Web Audio UI Sound Synthesizer
 * Generates subtle, crisp micro-interaction sounds with zero external audio files (<1 KB).
 * Supports switchable acoustic profiles: Minimal, Mechanical Keyboard, Retro 8-Bit Arcade.
 * Equipped with hardware debounce/throttling to prevent sound clutter and audio glitches.
 */

export type SoundProfile = "minimal" | "mechanical" | "arcade";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private profile: SoundProfile = "minimal";
  private lastPlayTime: number = 0;
  private readonly minIntervalMs = 70; // Prevent overlapping audio triggers

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gk_sound_enabled");
      this.isMuted = saved !== "true";
      const savedProfile = localStorage.getItem("gk_sound_profile") as SoundProfile;
      if (savedProfile === "minimal" || savedProfile === "mechanical" || savedProfile === "arcade") {
        this.profile = savedProfile;
      }
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private shouldThrottle(): boolean {
    const now = performance.now();
    if (now - this.lastPlayTime < this.minIntervalMs) {
      return true;
    }
    this.lastPlayTime = now;
    return false;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("gk_sound_enabled", (!this.isMuted).toString());
    }
    if (!this.isMuted) {
      this.playPop(600, 0.05);
    }
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
    if (typeof window !== "undefined") {
      localStorage.setItem("gk_sound_profile", newProfile);
    }
    if (!this.isMuted) {
      this.playClick();
    }
  }

  public playClick() {
    if (this.isMuted || this.shouldThrottle()) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.profile === "mechanical") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (this.profile === "arcade") {
        osc.type = "square";
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.setValueAtTime(980, now + 0.02);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Ignore audio errors
    }
  }

  public playPop(freq = 520, duration = 0.06) {
    if (this.isMuted || this.shouldThrottle()) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.profile === "arcade" ? "square" : "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + duration);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio errors
    }
  }

  public playChime() {
    if (this.isMuted || this.shouldThrottle()) return;
    this.init();
    if (!this.ctx) return;

    try {
      const freqs =
        this.profile === "arcade"
          ? [523.25, 659.25, 783.99, 1046.5]
          : [587.33, 880, 1174.66];

      const now = this.ctx.currentTime;

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.045;

        osc.type = this.profile === "arcade" ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Cyberpunk Matrix Reality Glitch Sound
   */
  public playMatrixGlitch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore audio errors
    }
  }
}

export const soundEngine = new SoundEngine();
