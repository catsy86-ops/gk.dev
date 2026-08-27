import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight, hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useAchievements } from "@/hooks/use-achievements";

interface BiosSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiosSimulatorModal = ({ isOpen, onClose }: BiosSimulatorModalProps) => {
  const { unlock } = useAchievements();
  const [selectedRow, setSelectedRow] = useState(0);
  const [cpuClock, setCpuClock] = useState("4.80 GHz (Overclocked)");
  const [threeJsBuffer, setThreeJsBuffer] = useState("ULTRA 60 FPS");
  const [audioSynthesizer, setAudioSynthesizer] = useState("WEB AUDIO DSP [ON]");
  const [matrixState, setMatrixState] = useState("ENABLED");

  const biosSettings = [
    { label: "CPU FREQUENCY CLOCK", value: cpuClock, onChange: () => setCpuClock((prev) => prev.includes("4.80") ? "5.40 GHz (MAX BOOST 🔥)" : "4.80 GHz (Overclocked)") },
    { label: "THREE.JS WEBGL RENDER BUFFER", value: threeJsBuffer, onChange: () => setThreeJsBuffer((prev) => prev.includes("ULTRA") ? "TURBO (120Hz)" : "ULTRA 60 FPS") },
    { label: "SOUND SYNTHESIZER ENGINE", value: audioSynthesizer, onChange: () => setAudioSynthesizer((prev) => prev.includes("ON") ? "MUTED [OFF]" : "WEB AUDIO DSP [ON]") },
    { label: "MATRIX CYBER RAIN OVERLAY", value: matrixState, onChange: () => setMatrixState((prev) => prev === "ENABLED" ? "DISABLED" : "ENABLED") },
    { label: "BOOT TO LYNX TEXT-ONLY MODE", value: "[PRESS ENTER TO EXECUTE]", onChange: () => { soundEngine.playChime(); toast({ title: "Tryb Lynx aktywny!", description: "Załadowano minimalistyczny profil tekstowy." }); } },
    { label: "SAVE CHANGES AND EXIT SETUP", value: "[F10 / ESC]", onChange: () => { onClose(); } },
  ];

  useEffect(() => {
    if (!isOpen) return;
    unlock("matrix_unleashed");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "F10") {
        e.preventDefault();
        soundEngine.playClick();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        soundEngine.playPop(700, 0.02);
        hapticLight();
        setSelectedRow((prev) => (prev + 1) % biosSettings.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        soundEngine.playPop(700, 0.02);
        hapticLight();
        setSelectedRow((prev) => (prev - 1 + biosSettings.length) % biosSettings.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        soundEngine.playPop(950, 0.04);
        hapticMedium();
        biosSettings[selectedRow]?.onChange();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedRow, biosSettings, onClose, unlock]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-6 bg-black text-[#55ffff] font-mono select-none overflow-hidden">
        {/* CRT Scanline Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-20 opacity-70" />

        {/* BIOS Main Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-4xl h-[92dvh] bg-[#0000aa] border-4 border-[#aaaaaa] p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,170,0.8)] flex flex-col justify-between z-10 text-xs sm:text-sm"
        >
          {/* Header */}
          <div className="border-b-2 border-[#55ffff] pb-3 text-center space-y-1">
            <h1 className="bg-[#aaaaaa] text-[#0000aa] font-extrabold text-sm sm:text-base px-2 py-0.5 inline-block">
              ROM PCI/ISA BIOS SETUP UTILITY — GK.DEV ENGINEERING SYSTEM (C) 2026
            </h1>
            <div className="flex justify-between text-[11px] text-[#ffffff] px-2 pt-1">
              <span>PROCESSOR: AMD Ryzen 9 / Fullstack Samouk Core</span>
              <span>MEMORY TEST: 65536KB OK</span>
            </div>
          </div>

          {/* Settings Table */}
          <div className="space-y-2 py-4 flex-1 overflow-y-auto">
            {biosSettings.map((setting, idx) => {
              const isSelected = selectedRow === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedRow(idx);
                    setting.onChange();
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#ffff55] text-[#0000aa] font-bold" : "text-[#ffffff] hover:bg-[#000088]"
                  }`}
                >
                  <span>{setting.label}</span>
                  <span className="font-bold">{setting.value}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Info & Help Box */}
          <div className="border-2 border-[#55ffff] bg-[#000088] p-3 text-[11px] space-y-1 text-[#ffffff]">
            <p className="text-[#ffff55] font-bold">Nawigacja BIOS Setup:</p>
            <p>↑ / ↓ : Wybór pozycji | ENTER / SPACJA : Zmiana wartości | ESC / F10 : Zapisz i Wyjdź</p>
            <p className="text-[#55ffff]">Portfolio Grzegorz (GK.dev) v2026.08 — System Ready & Operational.</p>
          </div>

          {/* Bottom Action */}
          <div className="flex justify-between items-center pt-2 text-[10px] text-[#aaaaaa]">
            <span>F1: General Help | F5: Previous Values | F7: Optimized Defaults</span>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#aaaaaa] text-[#0000aa] font-bold px-3 py-1 hover:bg-[#ffffff] cursor-pointer"
            >
              [ ZAMKNIJ BIOS ]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default BiosSimulatorModal;
