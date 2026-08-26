import { useI18n } from "@/lib/i18n";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  variant?: "ghost" | "bordered";
}

export const LanguageToggle = ({ variant = "ghost" }: LanguageToggleProps) => {
  const { lang, toggleLanguage } = useI18n();

  const baseStyles =
    variant === "ghost"
      ? "h-7 px-2 rounded-full flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
      : "relative h-8 sm:h-9 px-2.5 rounded-full border border-border bg-secondary flex items-center justify-center gap-1 text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95 cursor-pointer shadow-sm";

  return (
    <button
      type="button"
      onClick={() => {
        soundEngine.playPop(750, 0.03);
        hapticLight();
        toggleLanguage();
      }}
      className={baseStyles}
      aria-label={`Zmień język (obecny: ${lang.toUpperCase()})`}
      title={`Przełącz język: ${lang === "pl" ? "English" : "Polski"}`}
    >
      <Globe className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-bold text-foreground uppercase">{lang}</span>
    </button>
  );
};

export default LanguageToggle;
