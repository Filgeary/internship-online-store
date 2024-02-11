import { createContext, useMemo, useState } from "react";
import translate, { TLang } from "./translate";
import { TDictionaryKeys } from "./translations";

export type TI18nContext = {
  lang: TLang;
  setLang: (lang: TLang) => void;
  t: (key: TDictionaryKeys, number?: number) => string;
};

/**
 * @type {React.Context<{}>}
 */

export const I18nContext: React.Context<TI18nContext> =
  createContext<TI18nContext>({} as TI18nContext);

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 * @param children
 * @return {JSX.Element}
 */
export function I18nProvider({ children }: {children:React.ReactNode}): JSX.Element {
  const [lang, setLang] = useState<TLang>("ru");

  const i18n = useMemo(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (key: TDictionaryKeys, number?: number) =>
        translate(lang, key, number),
    }),
    [lang]
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
