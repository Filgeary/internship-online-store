import {PropsWithChildren, createContext, useMemo, useState} from "react";
import translate from "./translate";
import { Lang, Text } from "./type";

export interface Translate {
  lang: Lang;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
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
  const [lang, setLang] = useState<Lang>("ru");

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
