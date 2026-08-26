/**
 * GKinAmp Web Audio Procedural Music & Soundscape Synthesizer
 * Generates rich, relaxing 432Hz ambient Lo-Fi soundscapes, binaural focus waves, and melodic synth pads
 * with zero external mp3 files, zero latency, and full 16-band FFT audio analysis.
 */

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  bitrate: string;
  samplerate: string;
  frequencies: number[];
  baseFreq: number;
}

export type EqPreset = "lofi" | "deep-bass" | "ambient" | "vocal" | "techno" | "flat";

export const SOUNDSCAPE_TRACKS: TrackInfo[] = [
  {
    id: "cyber-lofi",
    title: "01. Cyber Lofi Chill (432Hz Harmonic)",
    artist: "GKinAmp AI Synthesizer",
    genre: "Ambient Lo-Fi",
    duration: "∞ LIVE",
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [216, 270, 324, 432, 540, 648], // 432Hz harmonic series
    baseFreq: 432,
  },
  {
    id: "deep-focus",
    title: "02. Deep Focus Flow (Binaural Alpha 10Hz)",
    artist: "GKinAmp Cognitive Engine",
    genre: "Binaural Focus",
    duration: "∞ LIVE",
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [108, 118, 216, 226, 324], // 10Hz binaural delta for alpha wave state
    baseFreq: 216,
  },
  {
    id: "midnight-synth",
    title: "03. Midnight Code Jam (Warm Analog Dream)",
    artist: "GKinAmp Synthwave Lab",
    genre: "Dreamwave Synth",
    duration: "∞ LIVE",
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [130.81, 164.81, 196.0, 246.94, 329.63], // C Major 7 / E Minor lush pads
    baseFreq: 261.63,
  },
  {
    id: "zen-rainfall",
    title: "04. Zen Rainfall & Cloud Resonance",
    artist: "GKinAmp Atmosphere",
    genre: "Nature Ambient",
    duration: "∞ LIVE",
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [144, 180, 216, 288, 360],
    baseFreq: 144,
  },
];

class MusicEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private stereoPanner: StereoPannerNode | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.65;
  private balance = 0; // -1 (L) to +1 (R)
  private currentPreset: EqPreset = "lofi";
  private activeNodes: (OscillatorNode | GainNode | StereoPannerNode | BiquadFilterNode)[] = [];
  private chordInterval: NodeJS.Timeout | null = null;
  private listeners: Set<
    (state: {
      isPlaying: boolean;
      track: TrackInfo;
      volume: number;
      balance: number;
      preset: EqPreset;
    }) => void
  > = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const savedVol = localStorage.getItem("gk_gkinamp_volume");
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64; // 32 frequency bins for visualizer
        this.analyser.smoothingTimeConstant = 0.85;

        this.filterNode = this.ctx.createBiquadFilter();
        this.applyPresetFilter(this.currentPreset);

        this.stereoPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        if (this.stereoPanner) {
          this.stereoPanner.pan.setValueAtTime(this.balance, this.ctx.currentTime);
        }

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.filterNode.connect(this.masterGain);
        if (this.stereoPanner) {
          this.masterGain.connect(this.stereoPanner);
          this.stereoPanner.connect(this.analyser);
        } else {
          this.masterGain.connect(this.analyser);
        }
        this.analyser.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private applyPresetFilter(preset: EqPreset) {
    if (!this.filterNode || !this.ctx) return;
    const now = this.ctx.currentTime;
    switch (preset) {
      case "deep-bass":
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setTargetAtTime(600, now, 0.1);
        this.filterNode.Q.setTargetAtTime(3.0, now, 0.1);
        break;
      case "ambient":
        this.filterNode.type = "bandpass";
        this.filterNode.frequency.setTargetAtTime(1400, now, 0.1);
        this.filterNode.Q.setTargetAtTime(1.0, now, 0.1);
        break;
      case "vocal":
        this.filterNode.type = "peaking";
        this.filterNode.frequency.setTargetAtTime(2000, now, 0.1);
        this.filterNode.Q.setTargetAtTime(2.0, now, 0.1);
        break;
      case "techno":
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setTargetAtTime(2400, now, 0.1);
        this.filterNode.Q.setTargetAtTime(2.5, now, 0.1);
        break;
      case "flat":
        this.filterNode.type = "allpass";
        break;
      case "lofi":
      default:
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setTargetAtTime(1100, now, 0.1);
        this.filterNode.Q.setTargetAtTime(1.5, now, 0.1);
        break;
    }
  }

  public subscribe(
    fn: (state: {
      isPlaying: boolean;
      track: TrackInfo;
      volume: number;
      balance: number;
      preset: EqPreset;
    }) => void
  ) {
    this.listeners.add(fn);
    fn({
      isPlaying: this.isPlaying,
      track: SOUNDSCAPE_TRACKS[this.currentTrackIndex],
      volume: this.volume,
      balance: this.balance,
      preset: this.currentPreset,
    });
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    const state = {
      isPlaying: this.isPlaying,
      track: SOUNDSCAPE_TRACKS[this.currentTrackIndex],
      volume: this.volume,
      balance: this.balance,
      preset: this.currentPreset,
    };
    this.listeners.forEach((fn) => fn(state));
  }

  public getTrack(): TrackInfo {
    return SOUNDSCAPE_TRACKS[this.currentTrackIndex];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getPreset(): EqPreset {
    return this.currentPreset;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("gk_gkinamp_volume", this.volume.toString());
    }
    this.notify();
  }

  public setBalance(val: number) {
    this.balance = Math.max(-1, Math.min(1, val));
    if (this.stereoPanner && this.ctx) {
      this.stereoPanner.pan.setTargetAtTime(this.balance, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public setPreset(preset: EqPreset) {
    this.currentPreset = preset;
    this.applyPresetFilter(preset);
    this.notify();
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16).fill(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data.slice(0, 16);
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.filterNode) return;

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.notify();

    this.startSoundscape();
  }

  public pause() {
    this.isPlaying = false;
    this.stopSoundscape();
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % SOUNDSCAPE_TRACKS.length;
    if (this.isPlaying) {
      this.stopSoundscape();
      this.startSoundscape();
    }
    this.notify();
  }

  public prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + SOUNDSCAPE_TRACKS.length) % SOUNDSCAPE_TRACKS.length;
    if (this.isPlaying) {
      this.stopSoundscape();
      this.startSoundscape();
    }
    this.notify();
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < SOUNDSCAPE_TRACKS.length) {
      this.currentTrackIndex = index;
      if (this.isPlaying) {
        this.stopSoundscape();
        this.startSoundscape();
      }
      this.notify();
    }
  }

  private stopSoundscape() {
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }

    this.activeNodes.forEach((node) => {
      try {
        if ("stop" in node) {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Node already stopped
      }
    });
    this.activeNodes = [];
  }

  private startSoundscape() {
    this.stopSoundscape();
    if (!this.ctx || !this.filterNode) return;

    const track = SOUNDSCAPE_TRACKS[this.currentTrackIndex];
    const now = this.ctx.currentTime;

    // Sub-bass root drone (smooth 54-108Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(track.baseFreq * 0.25, now);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.exponentialRampToValueAtTime(0.18, now + 2);
    subOsc.connect(subGain);
    subGain.connect(this.filterNode);
    subOsc.start(now);
    this.activeNodes.push(subOsc, subGain);

    // Warm Ambient Polyphonic Chord Layers
    track.frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Subtle detune for rich analog tape flutter
      osc.detune.setValueAtTime((idx - 2) * 4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(
        0.05 / Math.sqrt(track.frequencies.length),
        now + 2 + idx * 0.4
      );

      if (panner) {
        panner.pan.setValueAtTime((idx / (track.frequencies.length - 1)) * 1.6 - 0.8, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.filterNode);
        this.activeNodes.push(osc, gain, panner as unknown as GainNode);
      } else {
        osc.connect(gain);
        gain.connect(this.filterNode);
        this.activeNodes.push(osc, gain);
      }

      osc.start(now);
    });

    // Slow organic filter swell LFO
    let step = 0;
    this.chordInterval = setInterval(() => {
      if (!this.ctx || !this.filterNode || !this.isPlaying) return;
      step++;
      const currentNow = this.ctx.currentTime;
      const targetFreq = 800 + Math.sin(step * 0.2) * 500;
      this.filterNode.frequency.setTargetAtTime(targetFreq, currentNow, 1.2);
    }, 2000);
  }
}

export const musicEngine = new MusicEngine();
