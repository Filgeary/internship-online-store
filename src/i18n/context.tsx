import {PropsWithChildren, createContext, useMemo, useState} from "react";
import translate, { Text } from "./translate";

export interface Translate {
  lang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
  t: (text: Text, number?: number) => string;
}

/**
 * @type {React.Context<{}>}
 */
export const I18nContext: React.Context<Translate> = createContext<Translate>({lang: "ru", setLang: () => {}, t: () => ""});

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 * @param children
 * @return {JSX.Element}
 */
export function I18nProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const [lang, setLang] = useState("ru");

  const i18n = useMemo(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text: Text, number?: number) => translate(lang, text, number),
    }),
    [lang]
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
