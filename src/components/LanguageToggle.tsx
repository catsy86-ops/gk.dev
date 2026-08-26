import { useI18n } from "@/lib/i18n";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";
import { Globe } from "lucide-react";

export const LanguageToggle = () => {
  const { lang, toggleLanguage } = useI18n();

  return (
    <button
      type="button"
      onClick={() => {
        soundEngine.playPop(750, 0.03);
        hapticLight();
        toggleLanguage();
      }}
      className="relative h-8 sm:h-9 px-2.5 rounded-full border border-border bg-secondary flex items-center justify-center gap-1 text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95 cursor-pointer shadow-sm"
      aria-label={`Zmień język (obecny: ${lang.toUpperCase()})`}
      title={`Przełącz język: ${lang === "pl" ? "English" : "Polski"}`}
    >
      <Globe className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-bold text-foreground uppercase">{lang}</span>
    </button>
  );
};

export default LanguageToggle;
