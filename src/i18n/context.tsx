import { createContext, useMemo, useState } from "react";
import translate from "./translate";

type II18nProviderProps = {
  children?: React.ReactNode;
};

export type II18nMemo = {
  lang?: string;
  setLang?: (value: string) => void;
  t?: (text: string | string, plural?: number) => string;
};
/**
 * @type {React.Context<{}>}
 */
export const I18nContext: React.Context<{}> = createContext({});

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 * @param children
 * @return {JSX.Element}
 */
export function I18nProvider(fn: II18nProviderProps): JSX.Element {
  const [lang, setLang] = useState("ru");

  const i18n = useMemo<II18nMemo>(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text: string, number: number) => translate(lang, text, number),
    }),
    [lang]
  );

  return (
    <I18nContext.Provider value={i18n}>{fn.children}</I18nContext.Provider>
  );
}
