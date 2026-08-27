import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Minus,
  X,
  ListMusic,
  Radio,
  Sliders,
  Sparkles,
  Maximize2,
  Shuffle,
  Repeat,
  Gauge,
  Music,
  Activity,
  Waves,
  Gamepad2,
  Mic,
  Circle,
  Disc3,
  Compass,
  Palette,
  Upload,
} from "lucide-react";
import {
  musicEngine,
  TrackInfo,
  EqPreset,
  TrackCategory,
  PlayerSkin,
  VisualizerMode,
  DspFxState,
} from "@/lib/music-engine";
import { hapticLight, hapticSuccess, hapticSelection } from "@/lib/haptics";
import { useAchievements } from "@/hooks/use-achievements";

interface WinampPlayerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SKIN_CONFIGS: Record<
  PlayerSkin,
  {
    name: string;
    border: string;
    bg: string;
    titleBar: string;
    lcdBg: string;
    lcdText: string;
    lcdBorder: string;
    glow: string;
    accent: string;
    btnActive: string;
  }
> = {
  classic: {
    name: "Classic 1998 Gunmetal",
    border: "border-[#475569]/80",
    bg: "bg-[#1e293b]/95",
    titleBar: "bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] border-[#475569]/60",
    lcdBg: "bg-[#03150d]",
    lcdText: "text-emerald-400",
    lcdBorder: "border-emerald-500/30",
    glow: "0 0 25px rgba(16, 185, 129, 0.25)",
    accent: "text-emerald-400",
    btnActive: "bg-emerald-600 text-white border-emerald-400",
  },
  cyberpunk: {
    name: "Cyberpunk 2077 Neon",
    border: "border-fuchsia-500/80",
    bg: "bg-[#090014]/95",
    titleBar: "bg-gradient-to-r from-fuchsia-950 via-purple-900 to-cyan-950 border-fuchsia-500/50",
    lcdBg: "bg-[#120024]",
    lcdText: "text-cyan-300",
    lcdBorder: "border-cyan-500/40",
    glow: "0 0 35px rgba(217, 70, 239, 0.4)",
    accent: "text-fuchsia-400",
    btnActive: "bg-fuchsia-600 text-white border-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.7)]",
  },
  matrix: {
    name: "Matrix Phosphor CRT",
    border: "border-emerald-500/80",
    bg: "bg-[#020b06]/95",
    titleBar: "bg-gradient-to-r from-black via-emerald-950 to-black border-emerald-500/60",
    lcdBg: "bg-black",
    lcdText: "text-emerald-300",
    lcdBorder: "border-emerald-400/50",
    glow: "0 0 30px rgba(16, 185, 129, 0.45)",
    accent: "text-emerald-400",
    btnActive: "bg-emerald-500 text-black font-black border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.8)]",
  },
  vaporwave: {
    name: "Vaporwave Sunset 80s",
    border: "border-pink-500/70",
    bg: "bg-[#180828]/95",
    titleBar: "bg-gradient-to-r from-indigo-900 via-pink-900 to-amber-900 border-pink-400/50",
    lcdBg: "bg-[#240c38]",
    lcdText: "text-pink-300",
    lcdBorder: "border-pink-400/40",
    glow: "0 0 30px rgba(244, 114, 182, 0.35)",
    accent: "text-pink-400",
    btnActive: "bg-gradient-to-r from-pink-500 to-indigo-500 text-white border-pink-300",
  },
};

export const WinampPlayer = ({ isOpen = true, onClose }: WinampPlayerProps) => {
  const { unlock } = useAchievements();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(musicEngine.getTrack());
  const [tracks, setTracks] = useState<TrackInfo[]>(musicEngine.getTracks());
  const [volume, setVolume] = useState(musicEngine.getVolume());
  const [balance, setBalance] = useState(musicEngine.getBalance());
  const [preset, setPreset] = useState<EqPreset>(musicEngine.getPreset());
  const [pitchSpeed, setPitchSpeed] = useState(musicEngine.getPitchSpeed());
  const [currentNote, setCurrentNote] = useState("READY");
  const [dsp, setDsp] = useState<DspFxState>(musicEngine.getDsp());
  const [isRecording, setIsRecording] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  // Customization & Tools
  const [skin, setSkin] = useState<PlayerSkin>("classic");
  const [visMode, setVisMode] = useState<VisualizerMode>("bars");
  const [activeCategory, setActiveCategory] = useState<TrackCategory>("midi");
  const [isShaded, setIsShaded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showEq, setShowEq] = useState(false);
  const [showDsp, setShowDsp] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);

  // Telemetry & Visuals
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [freqBars, setFreqBars] = useState<number[]>(Array(16).fill(4));
  const [waveData, setWaveData] = useState<number[]>(Array(32).fill(128));
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Rhythm Game State
  const [gameScore, setGameScore] = useState(0);
  const [gameCombo, setGameCombo] = useState(0);
  const [gameTargetLane, setGameTargetLane] = useState<number | null>(null);

  const animFrameRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Subscribe to engine state updates
  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.track);
      setTracks(state.tracks);
      setVolume(state.volume);
      setBalance(state.balance);
      setPreset(state.preset);
      setPitchSpeed(state.pitchSpeed);
      setCurrentNote(state.currentNote);
      setDsp(state.dsp);
      setIsRecording(state.isRecording);
      setIsMicActive(state.isMicActive);
    });
    return () => unsubscribe();
  }, []);

  // Stop sound if closed or unmounted
  useEffect(() => {
    if (!isOpen) {
      musicEngine.pause();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      musicEngine.pause();
    };
  }, []);

  // Elapsed playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Scrolling LCD marquee
  useEffect(() => {
    const marqueeInterval = setInterval(() => {
      setMarqueeOffset((prev) => (prev + 1) % 120);
    }, 180);
    return () => clearInterval(marqueeInterval);
  }, []);

  // Rhythm minigame beat generator
  useEffect(() => {
    let gameInterval: NodeJS.Timeout | null = null;
    if (showGame && isPlaying) {
      gameInterval = setInterval(() => {
        setGameTargetLane(Math.floor(Math.random() * 4));
      }, Math.max(300, 60000 / (currentTrack.bpm * pitchSpeed)));
    }
    return () => {
      if (gameInterval) clearInterval(gameInterval);
    };
  }, [showGame, isPlaying, currentTrack.bpm, pitchSpeed]);

  // Real-time Visualizer Animation Loop (Bars, Waveform, Oscilloscope, Tunnel)
  useEffect(() => {
    const renderVisualizer = () => {
      if (isPlaying || isMicActive) {
        const rawData = musicEngine.getFrequencyData();
        const normalized = Array.from(rawData).map((val) =>
          Math.max(4, Math.floor((val / 255) * 28))
        );
        setFreqBars(normalized);

        const rawWave = musicEngine.getTimeDomainData();
        setWaveData(Array.from(rawWave.slice(0, 32)));
      } else {
        setFreqBars((prev) => prev.map((v) => Math.max(2, v * 0.9)));
      }
      animFrameRef.current = requestAnimationFrame(renderVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(renderVisualizer);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, isMicActive]);

  // Global Winamp Power-User Hotkeys (Space, Z, X, C, V, B, M, ArrowUp/Down)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form fields
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.code === "Space") {
        e.preventDefault();
        hapticLight();
        if (isPlaying) {
          musicEngine.pause();
        } else {
          musicEngine.play();
        }
      } else if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        hapticLight();
        musicEngine.prevTrack();
        setElapsedSeconds(0);
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        hapticLight();
        musicEngine.nextTrack();
        setElapsedSeconds(0);
      } else if (e.key === "x" || e.key === "X") {
        e.preventDefault();
        hapticLight();
        musicEngine.play();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        hapticLight();
        musicEngine.pause();
      } else if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        hapticLight();
        musicEngine.pause();
        setElapsedSeconds(0);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        hapticLight();
        if (volume > 0) {
          musicEngine.setVolume(0);
          setVolume(0);
        } else {
          musicEngine.setVolume(0.7);
          setVolume(0.7);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newVol = Math.min(1, volume + 0.05);
        musicEngine.setVolume(newVol);
        setVolume(newVol);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const newVol = Math.max(0, volume - 0.05);
        musicEngine.setVolume(newVol);
        setVolume(newVol);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPlaying, volume]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePlay = useCallback(() => {
    hapticLight();
    unlock("gkinamp_dj");
    musicEngine.play();
  }, [unlock]);

  const handlePause = useCallback(() => {
    hapticLight();
    musicEngine.pause();
  }, []);

  const handleStop = useCallback(() => {
    hapticLight();
    musicEngine.pause();
    setElapsedSeconds(0);
  }, []);

  const handleNext = useCallback(() => {
    hapticLight();
    musicEngine.nextTrack();
    setElapsedSeconds(0);
  }, []);

  const handlePrev = useCallback(() => {
    hapticLight();
    musicEngine.prevTrack();
    setElapsedSeconds(0);
  }, []);

  const handleClose = useCallback(() => {
    hapticLight();
    musicEngine.pause();
    if (onClose) onClose();
  }, [onClose]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    musicEngine.setVolume(val);
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBalance(val);
    musicEngine.setBalance(val);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPitchSpeed(val);
    musicEngine.setPitchSpeed(val);
  };

  const handlePresetChange = (p: EqPreset) => {
    setPreset(p);
    musicEngine.setPreset(p);
  };

  // Drag & Drop Handlers
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("audio") || file.name.match(/\.(mp3|wav|ogg|flac|m4a)$/i)) {
        try {
          await musicEngine.loadUserAudioFile(file);
          hapticSuccess();
        } catch {
          // File decode fallback
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 40) {
      handlePrev();
    } else if (diff < -40) {
      handleNext();
    }
    touchStartX.current = null;
  };

  // Recording Handler
  const handleToggleRecord = async () => {
    hapticSelection();
    if (isRecording) {
      const blob = await musicEngine.stopRecording();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gkinamp-session-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } else {
      musicEngine.startRecording();
    }
  };

  // Mic In Handler
  const handleToggleMic = async () => {
    hapticSelection();
    if (isMicActive) {
      musicEngine.disableMicInput();
    } else {
      await musicEngine.enableMicInput();
    }
  };

  // Rhythm Game Hit Handler
  const handleLaneHit = (lane: number) => {
    hapticLight();
    if (gameTargetLane === lane) {
      const newScore = gameScore + 100 * (gameCombo + 1);
      setGameScore(newScore);
      setGameCombo((prev) => prev + 1);
      setGameTargetLane(null);
      if (newScore >= 300) {
        unlock("beat_master");
      }
    } else {
      setGameCombo(0);
    }
  };

  const currentSkin = SKIN_CONFIGS[skin];
  const marqueeText = `*** GK.DEV GKinAmp v2026.4 // ${currentTrack.title.toUpperCase()} // ${currentTrack.artist.toUpperCase()} // ${currentTrack.genre.toUpperCase()} // BPM: ${Math.round(currentTrack.bpm * pitchSpeed)} // SKIN: ${currentSkin.name.toUpperCase()} ***         `;
  const visibleMarquee = marqueeText.slice(marqueeOffset) + marqueeText.slice(0, marqueeOffset);

  const filteredTracks = tracks.filter((t) => t.category === activeCategory);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      drag
      dragMomentum={false}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={handleDrop}
      className={`fixed bottom-20 left-2 right-2 sm:left-auto sm:right-6 sm:bottom-6 z-50 select-none font-mono text-xs shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-t-lg rounded-b-md overflow-hidden border ${currentSkin.border} ${currentSkin.bg} backdrop-blur-2xl w-auto sm:w-[385px] max-w-[calc(100vw-16px)]`}
      style={{
        boxShadow: `${currentSkin.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
      }}
    >
      {/* Hidden File Input for MP3 Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            musicEngine.loadUserAudioFile(e.target.files[0]);
          }
        }}
      />

      {/* Drag & Drop Highlight Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-emerald-950/90 border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center p-4 text-center">
          <Upload className="h-10 w-10 text-emerald-400 animate-bounce mb-2" />
          <p className="text-emerald-200 font-bold text-sm">UPUŚĆ PLIK AUDIO (MP3 / WAV / OGG)</p>
          <p className="text-emerald-400/80 text-[10px] mt-1">Zostanie natychmiast załadowany do GKinAmp</p>
        </div>
      )}

      {/* ── Title Bar ───────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between px-2.5 py-1.5 border-b cursor-grab active:cursor-grabbing text-[11px] font-bold text-slate-200 ${currentSkin.titleBar}`}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className={`h-3.5 w-3.5 ${currentSkin.accent} animate-pulse`} />
          <span className="tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent font-black">
            GKinAmp 2026
          </span>
          <span className="text-[8px] px-1 py-0.2 rounded bg-black/60 border border-white/20 text-emerald-300 font-extrabold uppercase">
            {skin}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsShaded(!isShaded)}
            className="h-4 w-4 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 cursor-pointer"
            title={isShaded ? "Rozwiń GKinAmp" : "Zwiń do paska"}
          >
            {isShaded ? <Maximize2 className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="h-4 w-4 rounded flex items-center justify-center bg-red-950/60 hover:bg-red-700 text-red-300 border border-red-800/50 cursor-pointer"
            title="Zamknij i zatrzymaj GKinAmp"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* ── Main Chassis Body ───────────────────────────────────── */}
      {!isShaded && (
        <div className="p-3 bg-black/40 text-slate-200 space-y-2.5">
          {/* LCD Matrix Screen */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`rounded border ${currentSkin.lcdBorder} ${currentSkin.lcdBg} p-2.5 shadow-inner relative overflow-hidden touch-pan-y`}
            title="Przesuń palcem w lewo/prawo, aby przełączyć utwór"
          >
            {/* CRT Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40" />

            <div className="flex items-start justify-between gap-2">
              {/* Green Time Counter & Note Telemetry */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-[22px] font-black tracking-tight ${currentSkin.lcdText} drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-mono leading-none`}
                  >
                    {formatTime(elapsedSeconds)}
                  </span>
                  <span className="text-[10px] font-bold text-cyan-300 bg-black/60 px-1 py-0.5 rounded border border-cyan-500/30">
                    {isMicActive ? "MIC LIVE" : currentNote}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[9px] text-emerald-500/90 font-bold uppercase tracking-wider">
                  <span
                    className={
                      isPlaying
                        ? "text-emerald-400 font-extrabold animate-pulse"
                        : "text-emerald-800"
                    }
                  >
                    {isPlaying ? "▶ PLAY" : "⏸ PAUSE"}
                  </span>
                  <span>•</span>
                  <span>{Math.round(currentTrack.bpm * pitchSpeed)} BPM</span>
                  <span>•</span>
                  {dsp.spatial8D && <span className="text-cyan-400 font-black">8D</span>}
                  {dsp.bassBoost && <span className="text-amber-400 font-black">BASS+</span>}
                </div>
              </div>

              {/* Visualizer Mode Toggle & Screen (Bars vs Oscilloscope vs Starfield) */}
              <div className="flex flex-col items-end gap-1">
                {visMode === "bars" && (
                  <div className="flex items-end gap-[2px] h-8 px-1.5 py-0.5 rounded bg-black/80 border border-emerald-500/20">
                    {freqBars.map((height, i) => (
                      <div key={i} className="w-[3px] bg-slate-900 h-full flex items-end">
                        <div
                          className="w-full rounded-t-sm transition-all duration-75"
                          style={{
                            height: `${Math.min(height, 28)}px`,
                            background:
                              height > 20
                                ? "#ef4444"
                                : height > 12
                                ? "#f59e0b"
                                : "#10b981",
                            boxShadow: isPlaying
                              ? "0 0 4px rgba(16, 185, 129, 0.6)"
                              : "none",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {visMode === "waveform" && (
                  <div className="h-8 w-24 px-1 rounded bg-black/80 border border-cyan-500/20 flex items-center justify-between overflow-hidden">
                    <svg className="h-full w-full" viewBox="0 0 32 32">
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        points={waveData
                          .map((val, idx) => `${idx},${((val - 128) / 128) * 14 + 16}`)
                          .join(" ")}
                      />
                    </svg>
                  </div>
                )}

                {visMode === "starfield" && (
                  <div className="h-8 w-24 rounded bg-black/80 border border-fuchsia-500/20 flex items-center justify-center overflow-hidden relative">
                    <div
                      className={`h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#d946ef] ${
                        isPlaying ? "animate-ping" : ""
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-around opacity-40">
                      <span className="text-[7px] text-cyan-400">✦</span>
                      <span className="text-[9px] text-fuchsia-300">★</span>
                      <span className="text-[6px] text-amber-400">✦</span>
                    </div>
                  </div>
                )}

                {visMode === "tunnel" && (
                  <div className="h-8 w-24 rounded bg-black/90 border border-emerald-500/40 flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_10px_rgba(16,185,129,0.3)]">
                    <div
                      className="absolute inset-0 border border-emerald-500/40 rounded-full transition-transform duration-75"
                      style={{
                        transform: `scale(${1 + (freqBars[0] || 4) / 18})`,
                        opacity: isPlaying ? 0.8 : 0.2,
                      }}
                    />
                    <div
                      className="absolute inset-1 border border-cyan-400/50 rounded-full transition-transform duration-75"
                      style={{
                        transform: `scale(${1 + (freqBars[4] || 4) / 24})`,
                        opacity: isPlaying ? 0.9 : 0.3,
                      }}
                    />
                    <div
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const modes: VisualizerMode[] = ["bars", "waveform", "starfield", "tunnel"];
                    const next = modes[(modes.indexOf(visMode) + 1) % modes.length];
                    setVisMode(next);
                  }}
                  className="text-[8px] font-bold text-slate-400 hover:text-slate-200 uppercase cursor-pointer"
                  title="Zmień tryb wizualizacji (Bars / Waveform / Starfield / 3D Tunnel)"
                >
                  VIS: {visMode}
                </button>
              </div>
            </div>

            {/* Marquee Track Title Display */}
            <div className="mt-2 px-1.5 py-0.5 rounded bg-black/70 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold truncate tracking-wide drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
              {visibleMarquee.slice(0, 42)}
            </div>
          </div>

          {/* Transport Control Buttons */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600/60 active:scale-95 text-slate-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Poprzedni utwór"
              >
                <SkipBack className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={handlePlay}
                className={`h-7 w-8 rounded border active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                  isPlaying
                    ? currentSkin.btnActive
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600/60"
                }`}
                title="Odtwarzaj"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={handlePause}
                className={`h-7 w-8 rounded border active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                  !isPlaying
                    ? "bg-amber-600 text-white border-amber-400"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600/60"
                }`}
                title="Pauza"
              >
                <Pause className="h-3.5 w-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600/60 active:scale-95 text-slate-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Stop"
              >
                <Square className="h-3 w-3 fill-current" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600/60 active:scale-95 text-slate-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Następny utwór"
              >
                <SkipForward className="h-3 w-3" />
              </button>
            </div>

            {/* Mode & Drawer Toggles */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`h-7 px-1.5 rounded border text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer ${
                  showPlaylist
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Lista odtwarzania (PL)"
              >
                <ListMusic className="h-3 w-3" />
                <span>PL</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEq(!showEq)}
                className={`h-7 px-1.5 rounded border text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer ${
                  showEq
                    ? "bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Korektor graficzny (EQ)"
              >
                <Sliders className="h-3 w-3" />
                <span>EQ</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDsp(!showDsp)}
                className={`h-7 px-1.5 rounded border text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer ${
                  showDsp || dsp.spatial8D || dsp.vinylCrackle || dsp.reverb || dsp.bassBoost
                    ? "bg-purple-950 border-purple-500 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Efekty DSP & 8D Surround (FX)"
              >
                <Waves className="h-3 w-3" />
                <span>FX</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSkins(!showSkins)}
                className={`h-7 px-1.5 rounded border text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer ${
                  showSkins
                    ? "bg-pink-950 border-pink-500 text-pink-300"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Wybór skórki (Skins)"
              >
                <Palette className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Quick Utility Tools: REC, MIC, UPLOAD, GAME */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-1">
              {/* WAV Recorder */}
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`h-6 px-1.5 rounded border text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-600 text-white border-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title={isRecording ? "Zatrzymaj i pobierz nagranie WAV" : "Nagraj sesję do pliku WAV"}
              >
                <Circle className={`h-2.5 w-2.5 fill-current ${isRecording ? "text-white" : "text-red-400"}`} />
                <span>{isRecording ? "REC ●" : "REC"}</span>
              </button>

              {/* Mic In */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`h-6 px-1.5 rounded border text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isMicActive
                    ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Wizualizator mikrofonu na żywo (MIC IN)"
              >
                <Mic className="h-2.5 w-2.5" />
                <span>MIC</span>
              </button>

              {/* Upload Local MP3 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-6 px-1.5 rounded border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                title="Załaduj własny plik MP3 / WAV"
              >
                <Upload className="h-2.5 w-2.5" />
                <span>LOAD</span>
              </button>
            </div>

            {/* Rhythm Minigame Toggle */}
            <button
              type="button"
              onClick={() => setShowGame(!showGame)}
              className={`h-6 px-2 rounded border text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                showGame
                  ? "bg-amber-500 text-black font-black border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-amber-400"
              }`}
              title="Minigra rytmiczna Beat Catcher"
            >
              <Gamepad2 className="h-3 w-3" />
              <span>BEAT GAME</span>
            </button>
          </div>

          {/* Volume, Balance & Tempo Speed Controls */}
          <div className="space-y-1.5 pt-1 px-1 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              {/* Volume */}
              <div className="flex items-center gap-1.5">
                {volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5 text-red-400 shrink-0" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  title={`Głośność: ${Math.round(volume * 100)}%`}
                />
                <span className="text-[9px] font-mono text-slate-400 shrink-0 w-6 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Balance Panning (L / R) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-400">L</span>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={balance}
                  onChange={handleBalanceChange}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  title={`Balans: ${balance < 0 ? `L ${Math.round(Math.abs(balance) * 100)}%` : balance > 0 ? `R ${Math.round(balance * 100)}%` : "CENTER"}`}
                />
                <span className="text-[9px] font-bold text-slate-400">R</span>
              </div>
            </div>

            {/* Pitch / Tempo Speed Control */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold shrink-0">
                <Gauge className="h-3 w-3 text-amber-400" />
                <span>PITCH:</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.35"
                step="0.05"
                value={pitchSpeed}
                onChange={handlePitchChange}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                title={`Tempo / Szybkość: ${Math.round(pitchSpeed * 100)}%`}
              />
              <span className="text-[9px] font-mono text-amber-300 shrink-0 w-8 text-right font-bold">
                {pitchSpeed.toFixed(2)}x
              </span>
            </div>
          </div>

          {/* ── Skin Switcher Drawer ─────────────────────────────── */}
          <AnimatePresence>
            {showSkins && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-slate-800 overflow-hidden space-y-1.5"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center justify-between">
                  <span>SELECT SKIN THEME</span>
                  <span>4 PRESETS</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(SKIN_CONFIGS) as PlayerSkin[]).map((skKey) => (
                    <button
                      key={skKey}
                      type="button"
                      onClick={() => {
                        hapticSelection();
                        setSkin(skKey);
                      }}
                      className={`p-1.5 rounded border text-[9px] font-bold text-left transition-all cursor-pointer ${
                        skin === skKey
                          ? "bg-slate-800 border-white text-white shadow-sm"
                          : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {SKIN_CONFIGS[skKey].name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DSP Effects Rack Drawer ──────────────────────────── */}
          <AnimatePresence>
            {showDsp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-slate-800 overflow-hidden space-y-2"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
                  <span>DSP EFFECTS PROCESSOR</span>
                  <span className="text-[8px] text-slate-400">SURROUND & VINTAGE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => musicEngine.toggleSpatial8D()}
                    className={`p-2 rounded border text-[10px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                      dsp.spatial8D
                        ? "bg-purple-950 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5" />
                      <span>8D SURROUND</span>
                    </div>
                    <span className="text-[8px]">{dsp.spatial8D ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => musicEngine.toggleVinylCrackle()}
                    className={`p-2 rounded border text-[10px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                      dsp.vinylCrackle
                        ? "bg-amber-950 border-amber-500 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Disc3 className="h-3.5 w-3.5" />
                      <span>VINYL TAPE</span>
                    </div>
                    <span className="text-[8px]">{dsp.vinylCrackle ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => musicEngine.toggleReverb()}
                    className={`p-2 rounded border text-[10px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                      dsp.reverb
                        ? "bg-cyan-950 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Waves className="h-3.5 w-3.5" />
                      <span>REVERB ECHO</span>
                    </div>
                    <span className="text-[8px]">{dsp.reverb ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => musicEngine.toggleBassBoost()}
                    className={`p-2 rounded border text-[10px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                      dsp.bassBoost
                        ? "bg-red-950 border-red-500 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" />
                      <span>MEGA BASS</span>
                    </div>
                    <span className="text-[8px]">{dsp.bassBoost ? "+12dB" : "OFF"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Rhythm Minigame Drawer ───────────────────────────── */}
          <AnimatePresence>
            {showGame && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-slate-800 overflow-hidden space-y-2"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>BEAT CATCHER RHYTHM GAME</span>
                  <span>SCORE: {gameScore} (x{gameCombo || 1})</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 h-14 bg-black/60 p-1.5 rounded border border-amber-500/30">
                  {[0, 1, 2, 3].map((lane) => (
                    <button
                      key={lane}
                      type="button"
                      onClick={() => handleLaneHit(lane)}
                      className={`h-full rounded flex flex-col items-center justify-center font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                        gameTargetLane === lane
                          ? "bg-amber-500 text-black shadow-[0_0_12px_#f59e0b] animate-pulse font-black scale-105"
                          : "bg-slate-800/80 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      <span className="text-[10px]">{["[A]", "[S]", "[D]", "[F]"][lane]}</span>
                      <span className="text-[8px]">{["BASS", "LEAD", "DRUM", "DROP"][lane]}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Playlist Drawer with Category Tabs ───────────────── */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-slate-800 overflow-hidden space-y-2"
              >
                {/* Category Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("midi")}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeCategory === "midi"
                        ? "bg-emerald-500 text-black shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Music className="h-2.5 w-2.5" />
                    <span>MIDI ({tracks.filter((t) => t.category === "midi").length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCategory("ambient")}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeCategory === "ambient"
                        ? "bg-cyan-500 text-black shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Radio className="h-2.5 w-2.5" />
                    <span>432Hz ({tracks.filter((t) => t.category === "ambient").length})</span>
                  </button>

                  {tracks.some((t) => t.category === "custom") && (
                    <button
                      type="button"
                      onClick={() => setActiveCategory("custom")}
                      className={`flex-1 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        activeCategory === "custom"
                          ? "bg-purple-500 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Upload className="h-2.5 w-2.5" />
                      <span>CUSTOM ({tracks.filter((t) => t.category === "custom").length})</span>
                    </button>
                  )}
                </div>

                {/* Track List */}
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {filteredTracks.map((t) => {
                    const globalIdx = tracks.findIndex((x) => x.id === t.id);
                    const isSelected = currentTrack.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          musicEngine.selectTrack(globalIdx);
                          musicEngine.play();
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-[10px] transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold shadow-sm"
                            : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isSelected && isPlaying ? (
                            <Radio className="h-3 w-3 text-emerald-400 shrink-0 animate-pulse" />
                          ) : (
                            <span className="text-slate-500 font-mono text-[9px]">
                              {globalIdx + 1}.
                            </span>
                          )}
                          <span className="truncate">{t.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 shrink-0 ml-1">
                          <span className="font-mono text-cyan-400/90">{t.bpm} BPM</span>
                          <span>{t.duration}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── EQ Equalizer Drawer ──────────────────────────────── */}
          <AnimatePresence>
            {showEq && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-slate-800 overflow-hidden space-y-2"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                  <span>GRAPHIC EQUALIZER</span>
                  <div className="flex items-center gap-1">
                    {(["lofi", "deep-bass", "ambient", "vocal", "techno", "flat"] as EqPreset[]).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePresetChange(p)}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                            preset === p
                              ? "bg-emerald-500 text-black shadow-sm font-black"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                          }`}
                        >
                          {p.replace("-", " ")}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-10 gap-1 h-16 bg-black/50 p-1.5 rounded border border-slate-800">
                  {[60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000].map((band, idx) => (
                    <div key={band} className="flex flex-col items-center justify-between h-full">
                      <div className="w-1.5 bg-emerald-500/30 rounded-full h-11 relative flex items-center justify-center">
                        <div
                          className="w-2.5 h-1.5 bg-emerald-400 rounded-sm shadow-sm"
                          style={{
                            transform: `translateY(${
                              Math.sin((idx + elapsedSeconds) * 0.4) * 12
                            }px)`,
                          }}
                        />
                      </div>
                      <span className="text-[7px] text-slate-500 font-mono">
                        {band >= 1000 ? `${band / 1000}k` : band}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default WinampPlayer;
