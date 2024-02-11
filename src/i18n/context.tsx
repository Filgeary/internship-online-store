import { createContext, useMemo, useState } from "react";
import translate from "./translate";
import { Language, TranslateFunc, TranslationKey } from "./types";

type Translate = {
  lang: Language;
  setLang: React.Dispatch<React.SetStateAction<Language>>;
  t: TranslateFunc;
};

type I18nProviderProps = {
  children: React.ReactNode;
};

export const I18nContext = createContext<Translate>({} as Translate);

export function I18nProvider({ children }: I18nProviderProps) {
  const [lang, setLang] = useState<Language>("ru");

  const i18n = useMemo(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text: TranslationKey, number?: number) =>
        translate(lang, text, number),
    }),
    [lang]
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
