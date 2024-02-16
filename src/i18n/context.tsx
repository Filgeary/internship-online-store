import { createContext, useMemo, useState } from 'react';
import translate from './translate';

import type { TLangs, TTextToTranslate } from './translate';

export type TTranslate = (text: TTextToTranslate, number?: number) => string;

type Ti18nContext = {
  lang: TLangs;
  setLang: (lang: TLangs) => void;
  t: TTranslate;
};

export const I18nContext = createContext<Ti18nContext>({} as Ti18nContext);

type Props = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: Props) {
  const [lang, setLang] = useState<TLangs>('ru');

  const i18n: Ti18nContext = useMemo(
    () => ({
      // Код языка
      lang,
      // Функция для смены языка
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text: TTextToTranslate, number?: number) => translate(lang, text, number),
    }),
    [lang],
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
