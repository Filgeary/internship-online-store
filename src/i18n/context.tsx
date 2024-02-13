import {createContext, useMemo, useState} from "react";
import translate from "./translate";
import { TranslateFunc, TranslationsKeys } from "./types";

interface I18nProviderProps {
  children: React.ReactNode
}

/**
 * @type {React.Context<{}>}
 */
export const I18nContext = createContext({});

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 * @param children
 * @return {JSX.Element}
 */
export function I18nProvider({children}: I18nProviderProps) {

  const [lang, setLang] = useState<TranslationsKeys>('ru');

  const i18n = useMemo(() => ({
    // Код локали
    lang,
    // Функция для смены локали
    setLang,
    // Функция для локализации текстов с замыканием на код языка
    t: ((text, number) => translate(lang, text, number)) as TranslateFunc
  }), [lang]);

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}
