import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";
import { translations, type Language } from "@/lib/i18n-dictionary";
import { I18nContext } from "@/lib/i18n-context";

export interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [lang, setLang] = useState<Language>("pl");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gk_lang") as Language | null;
      if (saved && (saved === "pl" || saved === "en")) {
        setLang(saved);
      }
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    soundEngine.playPop(750, 0.03);
    hapticLight();
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("gk_lang", newLang);
      document.documentElement.lang = newLang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(lang === "pl" ? "en" : "pl");
  }, [lang, setLanguage]);

  return (
    <I18nContext.Provider
      value={{
        lang,
        t: translations[lang],
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
