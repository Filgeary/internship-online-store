import {createContext, useMemo, useState} from "react";
import translate from "./translate";
import { Dictionary, LanguagesKeys, Translations } from "./types";

/**
 * @type {React.Context<{}>}
 */
export const I18nContext = createContext<{
    lang: LanguagesKeys;
    setLang: (value: LanguagesKeys) => void;
    t: (text: keyof Translations[LanguagesKeys], number?: number) => string;
  }
>(null);

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 * @param children
 * @return {JSX.Element}
 */
export function I18nProvider({children}) {

  const [lang, setLang] = useState<LanguagesKeys>('ru');

  const i18n = useMemo(() => ({
    // Код локали
    lang,
    // Функция для смены локали
    setLang,
    // Функция для локализации текстов с замыканием на код языка
    t: (text: keyof Translations[LanguagesKeys], number?: number) => translate(lang, text, number)
  }), [lang]);

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}

