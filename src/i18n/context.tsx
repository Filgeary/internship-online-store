import React, {createContext, useMemo, useState} from "react";
import translate, {Lang} from "./translate";
import {TranslationKeys} from "@src/i18n/translations";

export type TranslateFunction = (key: TranslationKeys, number?: number) => string;

// Интерфейс экспортируемого контекста
export interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslateFunction;
}

/**
 * @type {React.Context<{}>}
 */
export const I18nContext = createContext<I18nContextType>({} as I18nContextType);

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 * @param children
 * @return {JSX.Element}
 */
export function I18nProvider({children}: { children: React.ReactNode }): React.JSX.Element {

  const [lang, setLang] = useState<Lang>('ru');

  const i18n: I18nContextType = useMemo(() => ({
    // Код локали
    lang,
    // Функция для смены локали
    setLang,
    // Функция для локализации текстов с замыканием на код языка
    t: (text, number) => translate(lang, text, number)
  }), [lang]);

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}
