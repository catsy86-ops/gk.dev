import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Palette } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";
import { accentThemes, setGlobalAccent, type AccentTheme } from "@/lib/theme";

export const ThemeAccentPicker = () => {
  const [activeAccent, setActiveAccent] = useState<string>("blue");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("accent-theme");
    if (saved && accentThemes.some((t) => t.id === saved)) {
      setActiveAccent(saved);
      setGlobalAccent(saved);
    }
  }, []);

  const handleSelect = (theme: AccentTheme) => {
    soundEngine.playPop(850, 0.04);
    hapticLight();
    setActiveAccent(theme.id);
    setGlobalAccent(theme.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Palette Trigger Button */}
      <button
        onClick={() => {
          soundEngine.playClick();
          setIsOpen((prev) => !prev);
        }}
        className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95"
        aria-label="Wybierz akcent kolorystyczny"
        title="Personalizuj akcent kolorystyczny"
        aria-expanded={isOpen}
      >
        <Palette className="h-4 w-4 text-primary" strokeWidth={1.8} />
      </button>

      {/* Floating Accent Palette Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl p-2 shadow-2xl flex items-center gap-1.5"
          >
            {accentThemes.map((theme) => {
              const isSelected = activeAccent === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme)}
                  style={{ backgroundColor: theme.colorHex }}
                  className={`relative h-6 w-6 rounded-full transition-transform focus:outline-none ${
                    isSelected
                      ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`Akcent: ${theme.name}`}
                  title={theme.name}
                />
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
};
