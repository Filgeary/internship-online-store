import isString from '@src/utils/is-string';
import * as translations from './translations';
import { TextTranslationKeys, TranslationsKeys } from './types';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 */
export default function translate(lang: TranslationsKeys, text: TextTranslationKeys, plural?: number): string {
  let result = translations[lang][text] as Record<Intl.LDMLPluralRule, string> | string;

  if (typeof plural !== 'undefined' && typeof result !== "string"){
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in result) {
      result = result[key];
      return result;
    }
  }
  if (!isString(result)) {
    return text;
  }
  return result;
}
