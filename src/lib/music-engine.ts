/**
 * GKinAmp Web Audio Engine & DSP FX Processor
 * Features:
 * - Multi-Voice MIDI Sequencer (Classics: Sweet Dreams, Axel F, Popcorn, Sandstorm, etc.)
 * - 432Hz Ambient Polyphonic Drone Synthesizers
 * - DSP Effects Rack (8D Spatial Surround, Vinyl Crackle, Reverb Room, Mega Bass Boost)
 * - Custom File Player (MP3, WAV, OGG, FLAC) with Drag & Drop
 * - Live Microphone Input Visualizer
 * - Real-Time WAV Audio Recorder
 * - 16-Band FFT Frequency & Waveform Time-Domain Extraction
 */

export const NOTE_FREQS: Record<string, number> = {
  C2: 65.41, "C#2": 69.30, Db2: 69.30, D2: 73.42, "D#2": 77.78, Eb2: 77.78, E2: 82.41, F2: 87.31,
  "F#2": 92.50, Gb2: 92.50, G2: 98.00, "G#2": 103.83, Ab2: 103.83, A2: 110.00, "A#2": 116.54, Bb2: 116.54, B2: 123.47,
  C3: 130.81, "C#3": 138.59, Db3: 138.59, D3: 146.83, "D#3": 155.56, Eb3: 155.56, E3: 164.81, F3: 174.61,
  "F#3": 185.00, Gb3: 185.00, G3: 196.00, "G#3": 207.65, Ab3: 207.65, A3: 220.00, "A#3": 233.08, Bb3: 233.08, B3: 246.94,
  C4: 261.63, "C#4": 277.18, Db4: 277.18, D4: 293.66, "D#4": 311.13, Eb4: 311.13, E4: 329.63, F4: 349.23,
  "F#4": 369.99, Gb4: 369.99, G4: 392.00, "G#4": 415.30, Ab4: 415.30, A4: 440.00, "A#4": 466.16, Bb4: 466.16, B4: 493.88,
  C5: 523.25, "C#5": 554.37, Db5: 554.37, D5: 587.33, "D#5": 622.25, Eb5: 622.25, E5: 659.25, F5: 698.46,
  "F#5": 739.99, Gb5: 739.99, G5: 783.99, "G#5": 830.61, Ab5: 830.61, A5: 880.00, "A#5": 932.33, Bb5: 932.33, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.00, B6: 1975.53,
  "-": 0,
};

export type TrackCategory = "midi" | "ambient" | "custom";
export type PlayerSkin = "classic" | "cyberpunk" | "matrix" | "vaporwave";
export type VisualizerMode = "bars" | "waveform" | "starfield" | "tunnel";
export type EqPreset = "lofi" | "deep-bass" | "ambient" | "vocal" | "techno" | "flat";

export interface MidiStep {
  lead?: string;
  bass?: string;
  chord?: string[];
  drum?: "kick" | "snare" | "hihat" | "clap" | "none";
}

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  genre: string;
  category: TrackCategory;
  duration: string;
  bpm: number;
  bitrate: string;
  samplerate: string;
  sequence?: MidiStep[];
  frequencies?: number[];
  baseFreq?: number;
  customBuffer?: AudioBuffer;
}

export const SOUNDSCAPE_TRACKS: TrackInfo[] = [
  // ── 🎹 RETRO MIDI & SYNTH CLASSICS ────────────────────────────────
  {
    id: "voodoo-people",
    title: "Voodoo People (Chiptune 90s Rave)",
    artist: "The Prodigy / GK Rework",
    genre: "Big Beat / Chiptune",
    category: "midi",
    duration: "2:45",
    bpm: 140,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "D2", lead: "D4", drum: "kick" },
      { bass: "D2", lead: "F4", drum: "hihat" },
      { bass: "D2", lead: "G4", drum: "none" },
      { bass: "D2", lead: "Ab4", drum: "snare" },
      { bass: "D2", lead: "G4", drum: "kick" },
      { bass: "D2", lead: "F4", drum: "hihat" },
      { bass: "C2", lead: "D4", drum: "none" },
      { bass: "C2", lead: "C4", drum: "snare" },
      { bass: "D2", lead: "D4", drum: "kick" },
      { bass: "D2", lead: "F4", drum: "hihat" },
      { bass: "D2", lead: "G4", drum: "none" },
      { bass: "D2", lead: "Ab4", drum: "snare" },
      { bass: "F2", lead: "A4", drum: "kick" },
      { bass: "F2", lead: "G4", drum: "hihat" },
      { bass: "G2", lead: "F4", drum: "none" },
      { bass: "G2", lead: "D4", drum: "snare" },
    ],
  },
  {
    id: "aerodynamic",
    title: "Aerodynamic (Synth Neo-Solo)",
    artist: "Daft Punk / GK Retro Synth",
    genre: "French House / Electro",
    category: "midi",
    duration: "3:10",
    bpm: 123,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "D3", lead: "D5", drum: "kick" },
      { bass: "D3", lead: "F5", drum: "hihat" },
      { bass: "D3", lead: "A5", drum: "none" },
      { bass: "D3", lead: "D6", drum: "snare" },
      { bass: "Bb2", lead: "Bb5", drum: "kick" },
      { bass: "Bb2", lead: "D6", drum: "hihat" },
      { bass: "Bb2", lead: "F6", drum: "none" },
      { bass: "Bb2", lead: "D6", drum: "snare" },
      { bass: "C3", lead: "C6", drum: "kick" },
      { bass: "C3", lead: "E5", drum: "hihat" },
      { bass: "C3", lead: "G5", drum: "none" },
      { bass: "C3", lead: "C6", drum: "snare" },
      { bass: "A2", lead: "A5", drum: "kick" },
      { bass: "A2", lead: "C6", drum: "hihat" },
      { bass: "A2", lead: "E5", drum: "none" },
      { bass: "A2", lead: "A5", drum: "snare" },
    ],
  },
  {
    id: "sweet-dreams",
    title: "Sweet Dreams (Are Made of This)",
    artist: "Eurythmics",
    genre: "Synthpop / New Wave",
    category: "midi",
    duration: "3:36",
    bpm: 126,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "C2", lead: "C4", drum: "kick" },
      { bass: "C3", lead: "C4", drum: "hihat" },
      { bass: "Eb3", lead: "Eb4", drum: "none" },
      { bass: "C3", lead: "C4", drum: "snare" },
      { bass: "Ab2", lead: "Ab3", drum: "kick" },
      { bass: "Ab2", lead: "Ab3", drum: "hihat" },
      { bass: "G2", lead: "G3", drum: "none" },
      { bass: "G2", lead: "G3", drum: "snare" },
      { bass: "C2", lead: "G4", drum: "kick" },
      { bass: "C3", lead: "Eb4", drum: "hihat" },
      { bass: "Eb3", lead: "C4", drum: "none" },
      { bass: "C3", lead: "D4", drum: "snare" },
      { bass: "Ab2", lead: "Eb4", drum: "kick" },
      { bass: "Ab2", lead: "D4", drum: "hihat" },
      { bass: "G2", lead: "C4", drum: "none" },
      { bass: "G2", lead: "B3", drum: "snare" },
    ],
  },
  {
    id: "axel-f",
    title: "Axel F (Beverly Hills Cop)",
    artist: "Harold Faltermeyer",
    genre: "Synthwave / 80s OST",
    category: "midi",
    duration: "3:00",
    bpm: 118,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "F2", lead: "F4", drum: "kick" },
      { bass: "F2", lead: "-", drum: "hihat" },
      { bass: "F2", lead: "Ab4", drum: "none" },
      { bass: "F2", lead: "-", drum: "snare" },
      { bass: "F2", lead: "F4", drum: "kick" },
      { bass: "F2", lead: "F4", drum: "hihat" },
      { bass: "Bb2", lead: "Bb4", drum: "none" },
      { bass: "Bb2", lead: "F4", drum: "snare" },
      { bass: "Eb2", lead: "Eb4", drum: "kick" },
      { bass: "F2", lead: "F4", drum: "hihat" },
      { bass: "F2", lead: "-", drum: "none" },
      { bass: "F2", lead: "C5", drum: "snare" },
      { bass: "F2", lead: "-", drum: "kick" },
      { bass: "F2", lead: "F4", drum: "hihat" },
      { bass: "F2", lead: "F4", drum: "none" },
      { bass: "Db3", lead: "Db5", drum: "snare" },
      { bass: "C3", lead: "C5", drum: "kick" },
      { bass: "Ab2", lead: "Ab4", drum: "hihat" },
      { bass: "F2", lead: "F4", drum: "none" },
      { bass: "C3", lead: "C5", drum: "snare" },
      { bass: "F3", lead: "F5", drum: "kick" },
      { bass: "F2", lead: "F4", drum: "hihat" },
      { bass: "Eb2", lead: "Eb4", drum: "none" },
      { bass: "Eb2", lead: "Eb4", drum: "snare" },
      { bass: "C2", lead: "C4", drum: "kick" },
      { bass: "G2", lead: "G4", drum: "hihat" },
      { bass: "F2", lead: "F4", drum: "none" },
      { bass: "F2", lead: "-", drum: "snare" },
    ],
  },
  {
    id: "popcorn",
    title: "Popcorn (Original Synth Classic)",
    artist: "Gershon Kingsley",
    genre: "Chiptune / Electro",
    category: "midi",
    duration: "2:30",
    bpm: 132,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "A2", lead: "A4", drum: "kick" },
      { bass: "A2", lead: "G4", drum: "hihat" },
      { bass: "A2", lead: "A4", drum: "none" },
      { bass: "E2", lead: "E4", drum: "snare" },
      { bass: "C3", lead: "C4", drum: "kick" },
      { bass: "E2", lead: "E4", drum: "hihat" },
      { bass: "A2", lead: "A3", drum: "none" },
      { bass: "A2", lead: "-", drum: "snare" },
      { bass: "A2", lead: "A4", drum: "kick" },
      { bass: "A2", lead: "B4", drum: "hihat" },
      { bass: "C3", lead: "C5", drum: "none" },
      { bass: "B2", lead: "B4", drum: "snare" },
      { bass: "C3", lead: "C5", drum: "kick" },
      { bass: "A2", lead: "A4", drum: "hihat" },
      { bass: "B2", lead: "B4", drum: "none" },
      { bass: "E2", lead: "E4", drum: "snare" },
    ],
  },
  {
    id: "sandstorm",
    title: "Sandstorm (16th-Note Rave Riff)",
    artist: "Darude",
    genre: "Trance / Rave",
    category: "midi",
    duration: "3:45",
    bpm: 136,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "B2", lead: "B4", drum: "kick" },
      { bass: "B2", lead: "B4", drum: "hihat" },
      { bass: "B2", lead: "B4", drum: "none" },
      { bass: "B2", lead: "B4", drum: "snare" },
      { bass: "B2", lead: "B4", drum: "kick" },
      { bass: "B2", lead: "B4", drum: "hihat" },
      { bass: "B2", lead: "B4", drum: "none" },
      { bass: "B2", lead: "B4", drum: "snare" },
      { bass: "E2", lead: "E5", drum: "kick" },
      { bass: "E2", lead: "E5", drum: "hihat" },
      { bass: "E2", lead: "E5", drum: "none" },
      { bass: "E2", lead: "E5", drum: "snare" },
      { bass: "D2", lead: "D5", drum: "kick" },
      { bass: "D2", lead: "D5", drum: "hihat" },
      { bass: "A2", lead: "A4", drum: "none" },
      { bass: "A2", lead: "A4", drum: "snare" },
    ],
  },
  {
    id: "take-on-me",
    title: "Take On Me (Synth Lead Riff)",
    artist: "A-ha",
    genre: "80s Synthpop",
    category: "midi",
    duration: "3:48",
    bpm: 168,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "B2", lead: "F#4", drum: "kick" },
      { bass: "B2", lead: "F#4", drum: "hihat" },
      { bass: "B2", lead: "D4", drum: "none" },
      { bass: "B2", lead: "B3", drum: "snare" },
      { bass: "E2", lead: "B3", drum: "kick" },
      { bass: "E2", lead: "E4", drum: "hihat" },
      { bass: "E2", lead: "E4", drum: "none" },
      { bass: "E2", lead: "E4", drum: "snare" },
      { bass: "A2", lead: "G#4", drum: "kick" },
      { bass: "A2", lead: "G#4", drum: "hihat" },
      { bass: "A2", lead: "A4", drum: "none" },
      { bass: "A2", lead: "B4", drum: "snare" },
      { bass: "D2", lead: "A4", drum: "kick" },
      { bass: "D2", lead: "A4", drum: "hihat" },
      { bass: "D2", lead: "F#4", drum: "none" },
      { bass: "D2", lead: "E4", drum: "snare" },
    ],
  },
  {
    id: "rickroll",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    genre: "80s Dance Pop",
    category: "midi",
    duration: "3:32",
    bpm: 114,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "Bb2", lead: "F4", drum: "kick" },
      { bass: "Bb2", lead: "G4", drum: "hihat" },
      { bass: "Bb2", lead: "Bb4", drum: "none" },
      { bass: "Bb2", lead: "G4", drum: "snare" },
      { bass: "C3", lead: "D5", drum: "kick" },
      { bass: "C3", lead: "D5", drum: "hihat" },
      { bass: "C3", lead: "C5", drum: "none" },
      { bass: "C3", lead: "-", drum: "snare" },
      { bass: "F2", lead: "F4", drum: "kick" },
      { bass: "F2", lead: "G4", drum: "hihat" },
      { bass: "F2", lead: "Bb4", drum: "none" },
      { bass: "F2", lead: "G4", drum: "snare" },
      { bass: "G2", lead: "C5", drum: "kick" },
      { bass: "G2", lead: "C5", drum: "hihat" },
      { bass: "G2", lead: "Bb4", drum: "none" },
      { bass: "G2", lead: "A4", drum: "snare" },
    ],
  },
  {
    id: "tetris-theme",
    title: "Tetris (Korobeiniki 8-Bit Theme)",
    artist: "Hirokazu Tanaka",
    genre: "8-Bit Retro Gaming",
    category: "midi",
    duration: "1:45",
    bpm: 140,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "E2", lead: "E5", drum: "kick" },
      { bass: "E3", lead: "B4", drum: "hihat" },
      { bass: "E2", lead: "C5", drum: "none" },
      { bass: "E3", lead: "D5", drum: "snare" },
      { bass: "A2", lead: "C5", drum: "kick" },
      { bass: "A3", lead: "B4", drum: "hihat" },
      { bass: "A2", lead: "A4", drum: "none" },
      { bass: "A3", lead: "A4", drum: "snare" },
      { bass: "D2", lead: "C5", drum: "kick" },
      { bass: "D3", lead: "E5", drum: "hihat" },
      { bass: "G2", lead: "D5", drum: "none" },
      { bass: "G3", lead: "C5", drum: "snare" },
      { bass: "E2", lead: "B4", drum: "kick" },
      { bass: "E3", lead: "C5", drum: "hihat" },
      { bass: "E2", lead: "D5", drum: "none" },
      { bass: "E3", lead: "E5", drum: "snare" },
    ],
  },
  {
    id: "final-countdown",
    title: "The Final Countdown (Brass Lead)",
    artist: "Europe",
    genre: "Arena Rock / Synth",
    category: "midi",
    duration: "5:10",
    bpm: 118,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "B2", lead: "F#4", drum: "kick" },
      { bass: "B2", lead: "E4", drum: "hihat" },
      { bass: "B2", lead: "F#4", drum: "none" },
      { bass: "B2", lead: "B3", drum: "snare" },
      { bass: "G2", lead: "G4", drum: "kick" },
      { bass: "G2", lead: "F#4", drum: "hihat" },
      { bass: "G2", lead: "G4", drum: "none" },
      { bass: "G2", lead: "E4", drum: "snare" },
      { bass: "A2", lead: "G4", drum: "kick" },
      { bass: "A2", lead: "F#4", drum: "hihat" },
      { bass: "A2", lead: "G4", drum: "none" },
      { bass: "A2", lead: "A3", drum: "snare" },
      { bass: "D2", lead: "F#4", drum: "kick" },
      { bass: "D2", lead: "E4", drum: "hihat" },
      { bass: "D2", lead: "F#4", drum: "none" },
      { bass: "D2", lead: "D4", drum: "snare" },
    ],
  },
  {
    id: "super-mario",
    title: "Super Mario Bros (Overworld Chiptune)",
    artist: "Koji Kondo",
    genre: "Nintendo 8-Bit",
    category: "midi",
    duration: "2:15",
    bpm: 180,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    sequence: [
      { bass: "C3", lead: "E4", drum: "kick" },
      { bass: "C3", lead: "E4", drum: "hihat" },
      { bass: "C3", lead: "-", drum: "none" },
      { bass: "C3", lead: "E4", drum: "snare" },
      { bass: "C3", lead: "-", drum: "kick" },
      { bass: "C3", lead: "C4", drum: "hihat" },
      { bass: "C3", lead: "E4", drum: "none" },
      { bass: "C3", lead: "-", drum: "snare" },
      { bass: "G2", lead: "G4", drum: "kick" },
      { bass: "G2", lead: "-", drum: "hihat" },
      { bass: "G2", lead: "-", drum: "none" },
      { bass: "G2", lead: "-", drum: "snare" },
      { bass: "G2", lead: "G3", drum: "kick" },
      { bass: "G2", lead: "-", drum: "hihat" },
      { bass: "G2", lead: "-", drum: "none" },
      { bass: "G2", lead: "-", drum: "snare" },
    ],
  },

  // ── 🧘 RELAXING 432Hz AMBIENT SOUNDSCAPES ─────────────────────────
  {
    id: "cyber-lofi",
    title: "Cyber Lofi Chill (432Hz Harmonic)",
    artist: "GKinAmp AI Synthesizer",
    genre: "Ambient Lo-Fi",
    category: "ambient",
    duration: "∞ LIVE",
    bpm: 72,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [216, 270, 324, 432, 540, 648],
    baseFreq: 432,
  },
  {
    id: "deep-focus",
    title: "Deep Focus Flow (Binaural Alpha 10Hz)",
    artist: "GKinAmp Cognitive Engine",
    genre: "Binaural Focus",
    category: "ambient",
    duration: "∞ LIVE",
    bpm: 60,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [108, 118, 216, 226, 324],
    baseFreq: 216,
  },
  {
    id: "midnight-synth",
    title: "Midnight Code Jam (Warm Analog Dream)",
    artist: "GKinAmp Synthwave Lab",
    genre: "Dreamwave Synth",
    category: "ambient",
    duration: "∞ LIVE",
    bpm: 85,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [130.81, 164.81, 196.0, 246.94, 329.63],
    baseFreq: 261.63,
  },
  {
    id: "zen-rainfall",
    title: "Zen Rainfall & Cloud Resonance",
    artist: "GKinAmp Atmosphere",
    genre: "Nature Ambient",
    category: "ambient",
    duration: "∞ LIVE",
    bpm: 50,
    bitrate: "320 kbps",
    samplerate: "44.1 kHz",
    frequencies: [144, 180, 216, 288, 360],
    baseFreq: 144,
  },
];

export interface DspFxState {
  spatial8D: boolean;
  vinylCrackle: boolean;
  reverb: boolean;
  bassBoost: boolean;
}

export interface MusicEngineState {
  isPlaying: boolean;
  track: TrackInfo;
  volume: number;
  balance: number;
  preset: EqPreset;
  pitchSpeed: number;
  currentNote: string;
  currentStep: number;
  totalSteps: number;
  dsp: DspFxState;
  isRecording: boolean;
  isMicActive: boolean;
  tracks: TrackInfo[];
}

class MusicEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private bassBoostFilter: BiquadFilterNode | null = null;
  private stereoPanner: StereoPannerNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;

  // Custom tracks list
  private tracks: TrackInfo[] = [...SOUNDSCAPE_TRACKS];
  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.65;
  private balance = 0;
  private preset: EqPreset = "lofi";
  private pitchSpeed = 1.0;
  private currentNote = "READY";
  private currentStep = 0;

  // DSP State
  private dsp: DspFxState = {
    spatial8D: false,
    vinylCrackle: false,
    reverb: false,
    bassBoost: false,
  };

  // 8D Audio Rotation LFO
  private spatialAngle = 0;
  private spatialInterval: NodeJS.Timeout | null = null;

  // Vinyl Crackle
  private vinylNode: AudioBufferSourceNode | null = null;
  private vinylGain: GainNode | null = null;

  // Microphone stream
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isMicActive = false;

  // Recording
  private mediaRecorder: MediaRecorder | null = null;
  private recordDestination: MediaStreamAudioDestinationNode | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

  // Custom audio source
  private customSourceNode: AudioBufferSourceNode | null = null;
  private customStartTime = 0;

  // Active nodes & timers
  private activeNodes: (OscillatorNode | GainNode | AudioNode)[] = [];
  private stepInterval: NodeJS.Timeout | null = null;
  private ambientInterval: NodeJS.Timeout | null = null;

  private listeners: Set<(state: MusicEngineState) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const savedVol = localStorage.getItem("gk_gkinamp_volume");
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
      }
      this.initMediaSession();
    }
  }

  private initMediaSession() {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler("play", () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.prevTrack();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        this.nextTrack();
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        this.pause();
      });
    } catch {
      // Browsers without full mediaSession support
    }
  }

  private updateMediaSessionMetadata() {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      const track = this.getTrack();
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: `GK.dev Cyber Audio (${track.genre})`,
        artwork: [
          { src: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
        ],
      });
      navigator.mediaSession.playbackState = this.isPlaying ? "playing" : "paused";
    } catch {
      // Ignored
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
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.85;

        // EQ Filter
        this.filterNode = this.ctx.createBiquadFilter();
        this.applyPresetFilter(this.preset);

        // Mega Bass Boost Filter (Low-shelf 120Hz +12dB)
        this.bassBoostFilter = this.ctx.createBiquadFilter();
        this.bassBoostFilter.type = "lowshelf";
        this.bassBoostFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
        this.bassBoostFilter.gain.setValueAtTime(this.dsp.bassBoost ? 12 : 0, this.ctx.currentTime);

        // Echo / Reverb Delay Loop
        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
        this.delayFeedbackGain = this.ctx.createGain();
        this.delayFeedbackGain.gain.setValueAtTime(this.dsp.reverb ? 0.35 : 0, this.ctx.currentTime);

        this.delayNode.connect(this.delayFeedbackGain);
        this.delayFeedbackGain.connect(this.delayNode);

        // Panner & Master Gain
        this.stereoPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        if (this.stereoPanner) {
          this.stereoPanner.pan.setValueAtTime(this.balance, this.ctx.currentTime);
        }

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        // Pipeline: filter -> bassBoost -> delay -> masterGain -> panner -> analyser -> destination
        this.filterNode.connect(this.bassBoostFilter);
        this.bassBoostFilter.connect(this.masterGain);

        if (this.delayNode) {
          this.bassBoostFilter.connect(this.delayNode);
          this.delayNode.connect(this.masterGain);
        }

        if (this.stereoPanner) {
          this.masterGain.connect(this.stereoPanner);
          this.stereoPanner.connect(this.analyser);
        } else {
          this.masterGain.connect(this.analyser);
        }

        this.analyser.connect(this.ctx.destination);

        // MediaRecorder stream destination
        if (this.ctx.createMediaStreamDestination) {
          this.recordDestination = this.ctx.createMediaStreamDestination();
          this.masterGain.connect(this.recordDestination);
        }
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
        this.filterNode.frequency.setTargetAtTime(2800, now, 0.1);
        this.filterNode.Q.setTargetAtTime(2.5, now, 0.1);
        break;
      case "flat":
        this.filterNode.type = "allpass";
        break;
      case "lofi":
      default:
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setTargetAtTime(1200, now, 0.1);
        this.filterNode.Q.setTargetAtTime(1.5, now, 0.1);
        break;
    }
  }

  public subscribe(fn: (state: MusicEngineState) => void) {
    this.listeners.add(fn);
    fn(this.getState());
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): MusicEngineState {
    const track = this.tracks[this.currentTrackIndex] || this.tracks[0];
    return {
      isPlaying: this.isPlaying,
      track,
      volume: this.volume,
      balance: this.balance,
      preset: this.preset,
      pitchSpeed: this.pitchSpeed,
      currentNote: this.currentNote,
      currentStep: this.currentStep,
      totalSteps: track.sequence?.length || 16,
      dsp: { ...this.dsp },
      isRecording: this.isRecording,
      isMicActive: this.isMicActive,
      tracks: [...this.tracks],
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
    this.updateMediaSessionMetadata();
  }

  public getTrack(): TrackInfo {
    return this.tracks[this.currentTrackIndex] || this.tracks[0];
  }

  public getTracks(): TrackInfo[] {
    return [...this.tracks];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackDescription(): string {
    const track = this.getTrack();
    return `${track.artist} - ${track.title} (${track.genre}, ${track.bpm} BPM)`;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getPreset(): EqPreset {
    return this.preset;
  }

  public getPitchSpeed(): number {
    return this.pitchSpeed;
  }

  public getDsp(): DspFxState {
    return { ...this.dsp };
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
    if (this.stereoPanner && this.ctx && !this.dsp.spatial8D) {
      this.stereoPanner.pan.setTargetAtTime(this.balance, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public setPreset(preset: EqPreset) {
    this.preset = preset;
    this.applyPresetFilter(preset);
    this.notify();
  }

  public setPitchSpeed(val: number) {
    this.pitchSpeed = Math.max(0.75, Math.min(1.35, val));
    if (this.isPlaying && this.getTrack().category !== "custom") {
      this.restartCurrent();
    }
    this.notify();
  }

  // ── DSP Controls ──────────────────────────────────────────────────
  public toggleSpatial8D() {
    this.dsp.spatial8D = !this.dsp.spatial8D;
    if (this.dsp.spatial8D) {
      this.startSpatial8D();
    } else {
      this.stopSpatial8D();
    }
    this.notify();
  }

  private startSpatial8D() {
    this.stopSpatial8D();
    this.spatialInterval = setInterval(() => {
      if (!this.stereoPanner || !this.ctx || !this.isPlaying) return;
      this.spatialAngle += 0.05;
      const panVal = Math.sin(this.spatialAngle);
      this.stereoPanner.pan.setTargetAtTime(panVal, this.ctx.currentTime, 0.1);
    }, 60);
  }

  private stopSpatial8D() {
    if (this.spatialInterval) {
      clearInterval(this.spatialInterval);
      this.spatialInterval = null;
    }
    if (this.stereoPanner && this.ctx) {
      this.stereoPanner.pan.setTargetAtTime(this.balance, this.ctx.currentTime, 0.05);
    }
  }

  public toggleVinylCrackle() {
    this.dsp.vinylCrackle = !this.dsp.vinylCrackle;
    if (this.dsp.vinylCrackle && this.isPlaying) {
      this.startVinylNoise();
    } else {
      this.stopVinylNoise();
    }
    this.notify();
  }

  private startVinylNoise() {
    this.stopVinylNoise();
    if (!this.ctx || !this.filterNode) return;

    // Generate 2 seconds of pink noise buffer with sporadic pop spikes
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      let sample = b0 + b1 + b2 + white * 0.05;
      // Add random pop clicks
      if (Math.random() < 0.0004) {
        sample += (Math.random() - 0.5) * 4;
      }
      data[i] = sample * 0.04;
    }

    this.vinylNode = this.ctx.createBufferSource();
    this.vinylNode.buffer = buffer;
    this.vinylNode.loop = true;

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.vinylNode.connect(this.vinylGain);
    this.vinylGain.connect(this.filterNode);
    this.vinylNode.start();
  }

  private stopVinylNoise() {
    if (this.vinylNode) {
      try {
        this.vinylNode.stop();
        this.vinylNode.disconnect();
      } catch {
        // Ignored
      }
      this.vinylNode = null;
    }
    if (this.vinylGain) {
      this.vinylGain.disconnect();
      this.vinylGain = null;
    }
  }

  public toggleReverb() {
    this.dsp.reverb = !this.dsp.reverb;
    if (this.delayFeedbackGain && this.ctx) {
      this.delayFeedbackGain.gain.setTargetAtTime(
        this.dsp.reverb ? 0.38 : 0,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  public toggleBassBoost() {
    this.dsp.bassBoost = !this.dsp.bassBoost;
    if (this.bassBoostFilter && this.ctx) {
      this.bassBoostFilter.gain.setTargetAtTime(
        this.dsp.bassBoost ? 12 : 0,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  // ── Drag & Drop Audio File Loader ─────────────────────────────────
  public async loadUserAudioFile(file: File): Promise<TrackInfo> {
    this.initContext();
    if (!this.ctx) throw new Error("AudioContext not ready");

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

    const minutes = Math.floor(audioBuffer.duration / 60);
    const seconds = Math.floor(audioBuffer.duration % 60)
      .toString()
      .padStart(2, "0");

    const newTrack: TrackInfo = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local User Upload",
      genre: "Custom Audio",
      category: "custom",
      duration: `${minutes}:${seconds}`,
      bpm: 120,
      bitrate: "Lossless PCM",
      samplerate: `${(audioBuffer.sampleRate / 1000).toFixed(1)} kHz`,
      customBuffer: audioBuffer,
    };

    this.tracks.unshift(newTrack);
    this.currentTrackIndex = 0;
    this.play();
    this.notify();
    return newTrack;
  }

  // ── Microphone Live In Mode ───────────────────────────────────────
  public async enableMicInput(): Promise<boolean> {
    this.initContext();
    if (!this.ctx) return false;

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      // Connect to analyser without echoing to speakers to prevent feedback loop
      this.micSource.connect(this.analyser!);
      this.isMicActive = true;
      this.currentNote = "MIC LIVE";
      this.notify();
      return true;
    } catch {
      this.isMicActive = false;
      return false;
    }
  }

  public disableMicInput() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.isMicActive = false;
    this.notify();
  }

  // ── Audio WAV Recording ───────────────────────────────────────────
  public startRecording(): boolean {
    if (!this.recordDestination || !window.MediaRecorder) return false;

    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.recordDestination.stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };
    this.mediaRecorder.start();
    this.isRecording = true;
    this.notify();
    return true;
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        this.isRecording = false;
        this.notify();
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
        this.isRecording = false;
        this.notify();
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }

  // ── Frequency & Time Domain Data Extraction ───────────────────────
  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16).fill(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data.slice(0, 16);
  }

  public getTimeDomainData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32).fill(128);
    }
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.filterNode) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.dsp.spatial8D) this.startSpatial8D();
    if (this.dsp.vinylCrackle) this.startVinylNoise();

    this.notify();
    this.startCurrentTrack();
  }

  public pause() {
    this.isPlaying = false;
    this.currentNote = "PAUSED";
    this.stopPlayback();
    this.stopSpatial8D();
    this.stopVinylNoise();
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
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.currentStep = 0;
    if (this.isPlaying) {
      this.restartCurrent();
    }
    this.notify();
  }

  public prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.currentStep = 0;
    if (this.isPlaying) {
      this.restartCurrent();
    }
    this.notify();
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < this.tracks.length) {
      this.currentTrackIndex = index;
      this.currentStep = 0;
      if (this.isPlaying) {
        this.restartCurrent();
      }
      this.notify();
    }
  }

  private restartCurrent() {
    this.stopPlayback();
    this.startCurrentTrack();
  }

  private stopPlayback() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }

    if (this.customSourceNode) {
      try {
        this.customSourceNode.stop();
        this.customSourceNode.disconnect();
      } catch {
        // Ignored
      }
      this.customSourceNode = null;
    }

    this.activeNodes.forEach((node) => {
      try {
        if ("stop" in node) {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Node already stopped/disconnected
      }
    });
    this.activeNodes = [];
  }

  private startCurrentTrack() {
    this.stopPlayback();
    if (!this.ctx || !this.filterNode) return;

    const track = this.tracks[this.currentTrackIndex] || this.tracks[0];

    if (track.category === "custom" && track.customBuffer) {
      this.startCustomAudio(track.customBuffer);
    } else if (track.category === "midi" && track.sequence) {
      this.startMidiSequencer(track);
    } else {
      this.startAmbientDrone(track);
    }
  }

  private startCustomAudio(buffer: AudioBuffer) {
    if (!this.ctx || !this.filterNode) return;
    this.customSourceNode = this.ctx.createBufferSource();
    this.customSourceNode.buffer = buffer;
    this.customSourceNode.connect(this.filterNode);
    this.customSourceNode.start(0);
    this.customStartTime = this.ctx.currentTime;
    this.currentNote = "PLAYING";
  }

  // ── MIDI Step Sequencer ───────────────────────────────────────────
  private startMidiSequencer(track: TrackInfo) {
    if (!this.ctx || !this.filterNode || !track.sequence) return;

    const sequence = track.sequence;
    const effectiveBpm = track.bpm * this.pitchSpeed;
    const stepDurationSec = 60 / effectiveBpm / 4;
    const stepIntervalMs = stepDurationSec * 1000;

    let step = 0;

    const playStep = () => {
      if (!this.ctx || !this.filterNode || !this.isPlaying) return;

      const currentStepData = sequence[step % sequence.length];
      this.currentStep = step % sequence.length;
      const now = this.ctx.currentTime;

      if (currentStepData.lead && currentStepData.lead !== "-") {
        this.currentNote = currentStepData.lead;
        const freq = NOTE_FREQS[currentStepData.lead];
        if (freq) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq * this.pitchSpeed, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.16, now + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + stepDurationSec * 0.95);

          osc.connect(gain);
          gain.connect(this.filterNode);

          osc.start(now);
          osc.stop(now + stepDurationSec);
          this.activeNodes.push(osc, gain);
        }
      }

      if (currentStepData.bass && currentStepData.bass !== "-") {
        const bassFreq = NOTE_FREQS[currentStepData.bass];
        if (bassFreq) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();

          bassOsc.type = "triangle";
          bassOsc.frequency.setValueAtTime(bassFreq * this.pitchSpeed, now);

          bassGain.gain.setValueAtTime(0.001, now);
          bassGain.gain.linearRampToValueAtTime(0.24, now + 0.01);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDurationSec * 0.9);

          bassOsc.connect(bassGain);
          bassGain.connect(this.filterNode);

          bassOsc.start(now);
          bassOsc.stop(now + stepDurationSec);
          this.activeNodes.push(bassOsc, bassGain);
        }
      }

      if (currentStepData.drum && currentStepData.drum !== "none") {
        this.playDrumSound(currentStepData.drum, now);
      }

      this.notify();
      step++;
    };

    playStep();
    this.stepInterval = setInterval(playStep, stepIntervalMs);
  }

  private playDrumSound(type: "kick" | "snare" | "hihat" | "clap", time: number) {
    if (!this.ctx || !this.filterNode) return;

    if (type === "kick") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.15);
      this.activeNodes.push(osc, gain);
    } else if (type === "snare") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.1);
      this.activeNodes.push(osc, gain);
    } else if (type === "hihat") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(8000, time);
      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.05);
      this.activeNodes.push(osc, gain);
    }
  }

  private startAmbientDrone(track: TrackInfo) {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    this.currentNote = "432Hz";

    const freqs = track.frequencies || [216, 270, 324, 432];
    const baseFreq = track.baseFreq || 432;

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(baseFreq * 0.25 * this.pitchSpeed, now);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);
    subOsc.connect(subGain);
    subGain.connect(this.filterNode);
    subOsc.start(now);
    this.activeNodes.push(subOsc, subGain);

    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.filterNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f * this.pitchSpeed, now);
      osc.detune.setValueAtTime((idx - 2) * 4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.05 / Math.sqrt(freqs.length), now + 2 + idx * 0.3);

      if (panner) {
        panner.pan.setValueAtTime((idx / (freqs.length - 1)) * 1.6 - 0.8, now);
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

    let step = 0;
    this.ambientInterval = setInterval(() => {
      if (!this.ctx || !this.filterNode || !this.isPlaying) return;
      step++;
      const currentNow = this.ctx.currentTime;
      const targetFreq = 800 + Math.sin(step * 0.2) * 500;
      this.filterNode.frequency.setTargetAtTime(targetFreq, currentNow, 1.2);
    }, 2000);
  }
}

export const musicEngine = new MusicEngine();
