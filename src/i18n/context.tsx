import {createContext, useMemo, useState} from "react";
import translate, { type TDictionary, type TLangKeys } from "./translate";

export type Tt = <Lang extends TLangKeys>(text?: TDictionary[Lang], number?: number) => ReturnType<typeof translate>;
  //                                         код (тип) языка ^^^^

export interface II18n {
  lang: TLangKeys,
  setLang: React.Dispatch<React.SetStateAction<TLangKeys>>,
  t: Tt,
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
export function I18nProvider({ children }: { children: React.ReactNode }) {

  const [lang, setLang] = useState<TLangKeys>('ru');

  const i18n = useMemo(() => ({
    // Код локали
    lang,
    // Функция для смены локали
    setLang,
    // Функция для локализации текстов с замыканием на код языка
    t: (text: TDictionary[typeof lang], number) => translate(lang, text, number)
    //                    ^^^^^^^^^^^
    //                    передаём код (тип) языка
  } as II18n), [lang]);

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}
