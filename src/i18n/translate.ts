import * as translations from './translations'
import { ITranslateFn, ILangs, IAllLangs } from "./types"

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
const translate: ITranslateFn = (lang: ILangs, text: IAllLangs, plural?: number): string => {
  let result = translations[lang] && (text in translations[lang])
    ? translations[lang][text]
    : text

  if (typeof plural !== 'undefined' && typeof result === 'object'){
    const key = new Intl.PluralRules(lang).select(plural)
    
    if (key in result) {
      result = result[key as keyof typeof result]
    }
  }

  return String(result)
}

export default translate
