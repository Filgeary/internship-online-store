import { createContext, useMemo, useState } from "react";
import translate from "./translate";
import { Language, TranslateFunc, Word } from "./types";

type Translate = {
  lang: Language;
  setLang: React.Dispatch<React.SetStateAction<Language>>;
  t: TranslateFunc;
};

export const I18nContext = createContext<Translate>({} as Translate);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState<Language>("ru");

  const i18n = useMemo(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text: Word, number?: number) => translate(lang, text, number),
    }),
    [lang]
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
