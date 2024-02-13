import React, { createContext, useMemo, useState} from "react"
import translate from "./translate"
import { ILangs, IAllLangs } from "./types"

interface II18nProvide {
  children: React.ReactNode
}

export interface II18nContext {
  lang: ILangs
  setLang: (value: ILangs) => void
  t: (text: IAllLangs, plural?: number) => string
}

/**
 * @type {React.Context<{}>}
 */
export const I18nContext = createContext<II18nContext>({} as II18nContext)

 /**
  * Обертка над провайдером контекста, чтобы управлять изменениями в контексте
  * @param children
  * @return {JSX.Element}
  */
export const I18nProvider: React.FC<II18nProvide> = ({ children }) => {
  const [lang, setLang] = useState<ILangs>("ru")

  const i18n = useMemo<II18nContext>(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text, number) => translate(lang, text, number),
    }),
    [lang]
  )

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
}
