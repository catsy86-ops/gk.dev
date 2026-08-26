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
} from "lucide-react";
import {
  musicEngine,
  SOUNDSCAPE_TRACKS,
  TrackInfo,
  EqPreset,
} from "@/lib/music-engine";
import { hapticLight } from "@/lib/haptics";

interface WinampPlayerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const WinampPlayer = ({ isOpen = true, onClose }: WinampPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(musicEngine.getTrack());
  const [volume, setVolume] = useState(musicEngine.getVolume());
  const [balance, setBalance] = useState(musicEngine.getBalance());
  const [preset, setPreset] = useState<EqPreset>(musicEngine.getPreset());
  const [isShaded, setIsShaded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showEq, setShowEq] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [freqBars, setFreqBars] = useState<number[]>(Array(16).fill(4));
  const [marqueeOffset, setMarqueeOffset] = useState(0);

  const animFrameRef = useRef<number>(0);

  // Subscribe to engine state changes
  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.track);
      setVolume(state.volume);
      setBalance(state.balance);
      setPreset(state.preset);
    });
    return () => unsubscribe();
  }, []);

  // Guarantee sound is stopped if player is closed or unmounted
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

  // Track elapsed playback timer
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
      setMarqueeOffset((prev) => (prev + 1) % 90);
    }, 200);
    return () => clearInterval(marqueeInterval);
  }, []);

  // Real-time FFT Frequency Visualizer Loop
  useEffect(() => {
    const renderVisualizer = () => {
      if (isPlaying) {
        const rawData = musicEngine.getFrequencyData();
        const normalized = Array.from(rawData).map((val) =>
          Math.max(4, Math.floor((val / 255) * 28))
        );
        setFreqBars(normalized);
      } else {
        setFreqBars((prev) => prev.map((v) => Math.max(2, v * 0.9)));
      }
      animFrameRef.current = requestAnimationFrame(renderVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(renderVisualizer);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePlay = useCallback(() => {
    hapticLight();
    musicEngine.play();
  }, []);

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

  const handlePresetChange = (p: EqPreset) => {
    setPreset(p);
    musicEngine.setPreset(p);
  };

  const marqueeText = `*** GK.DEV GKinAmp v2026.4 // ${currentTrack.title.toUpperCase()} // ${currentTrack.artist.toUpperCase()} // ${currentTrack.genre.toUpperCase()} ***       `;
  const visibleMarquee = marqueeText.slice(marqueeOffset) + marqueeText.slice(0, marqueeOffset);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      drag
      dragMomentum={false}
      className="fixed bottom-16 right-4 sm:right-6 md:bottom-6 z-50 select-none font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-t-lg rounded-b-md overflow-hidden border border-[#3b82f6]/40 bg-[#0f172a]/95 backdrop-blur-2xl w-[320px] sm:w-[370px]"
      style={{
        boxShadow: "0 0 30px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* ── Title Bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] border-b border-[#475569]/60 cursor-grab active:cursor-grabbing text-[11px] font-bold text-slate-200">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent font-black">
            GKinAmp 2026
          </span>
          <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-extrabold">
            CYBER
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
        <div className="p-3 bg-gradient-to-b from-[#0b1120] to-[#020617] text-slate-200 space-y-2.5">
          {/* LCD Matrix Display */}
          <div className="rounded border border-emerald-500/30 bg-[#03150d] p-2.5 shadow-inner relative overflow-hidden">
            {/* CRT Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40" />

            <div className="flex items-start justify-between gap-2">
              {/* Green Time Counter */}
              <div className="flex flex-col">
                <div className="text-[22px] font-black tracking-tight text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-mono leading-none">
                  {formatTime(elapsedSeconds)}
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
                  <span>{currentTrack.bitrate}</span>
                  <span>•</span>
                  <span>STEREO</span>
                </div>
              </div>

              {/* 16-Band Real-Time EQ Spectrum Analyzer */}
              <div className="flex items-end gap-[2px] h-8 px-1.5 py-0.5 rounded bg-black/60 border border-emerald-500/20">
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
            </div>

            {/* Marquee Track Title Display */}
            <div className="mt-2 px-1.5 py-0.5 rounded bg-black/70 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold truncate tracking-wide drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
              {visibleMarquee.slice(0, 40)}
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
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
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

            {/* Additional Mode & Drawer Toggles */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`h-7 w-7 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isShuffle
                    ? "bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Shuffle (Losowa kolejność)"
              >
                <Shuffle className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`h-7 w-7 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isRepeat
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Repeat (Zapętlanie utworu)"
              >
                <Repeat className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`h-7 px-2 rounded border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
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
                className={`h-7 px-2 rounded border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  showEq
                    ? "bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400"
                }`}
                title="Korektor graficzny (EQ)"
              >
                <Sliders className="h-3 w-3" />
                <span>EQ</span>
              </button>
            </div>
          </div>

          {/* Volume & Balance Dual Controls */}
          <div className="grid grid-cols-2 gap-3 pt-1 px-1 border-t border-slate-800">
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

          {/* Playlist Drawer */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-2 border-t border-slate-800 overflow-hidden"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>GKinAmp PLAYLIST ({SOUNDSCAPE_TRACKS.length})</span>
                  <span className="text-emerald-400">432Hz HARMONICS</span>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {SOUNDSCAPE_TRACKS.map((t, idx) => {
                    const isSelected = currentTrack.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          musicEngine.selectTrack(idx);
                          musicEngine.play();
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-[10px] transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold"
                            : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isSelected && isPlaying ? (
                            <Radio className="h-3 w-3 text-emerald-400 shrink-0 animate-pulse" />
                          ) : (
                            <span className="text-slate-500 font-mono text-[9px]">
                              {idx + 1}.
                            </span>
                          )}
                          <span className="truncate">{t.title}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 shrink-0 ml-1">
                          {t.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EQ Equalizer Drawer */}
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
