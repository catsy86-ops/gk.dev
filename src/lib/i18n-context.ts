import { createContext, useContext } from "react";
import { translations, type Language, type Translations } from "./i18n-dictionary";

export interface I18nContextType {
  lang: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const I18nContext = createContext<I18nContextType>({
  lang: "pl",
  t: translations.pl,
  setLanguage: () => {},
  toggleLanguage: () => {},
});

export const useI18n = (): I18nContextType => {
  return useContext(I18nContext);
};
