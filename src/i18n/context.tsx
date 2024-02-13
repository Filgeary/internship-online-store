import { createContext, useMemo, useState } from "react";
import translate from "./translate";

type i18nContext = {
  lang: string
  setLang: (lang: string) => void
  t: (text: string, number?: number) => string
}

export const I18nContext = createContext<i18nContext>({} as i18nContext);

type Props = {
  children: React.ReactNode
}

export function I18nProvider({ children }: Props) {
  const [lang, setLang] = useState('ru');

  const i18n: i18nContext = useMemo(() => ({
    // Код языка
    lang,
    // Функция для смены языка
    setLang,
    // Функция для локализации текстов с замыканием на код языка
    t: (text: string, number?: number) => translate(lang, text, number)
  }), [lang]);

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}
