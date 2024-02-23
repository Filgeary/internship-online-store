import { createContext, useMemo, useState } from 'react';
import translate from './translate';

import { TUserTranslateFn } from './types';

export type TI18nContextState = {
  lang: TLangs;
  setLang: (value: TLangs) => void;
  t: TUserTranslateFn;
};

export const I18nContext = createContext<TI18nContextState>({} as TI18nContextState);

type I18nProviderProps = {
  children?: React.ReactNode;
};

/**
 * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
 */
export function I18nProvider({ children }: I18nProviderProps): JSX.Element {
  const [lang, setLang] = useState<TLangs>('ru');

  const i18n = useMemo<TI18nContextState>(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text, number) => translate(lang, text, number),
    }),
    [lang]
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
