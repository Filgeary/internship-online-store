import * as translations from './translations';
import { LanguagesKeys, Translations } from './types';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
export default function translate<T extends LanguagesKeys>(
  lang: T,
  text: string,
  plural?: number): string {
  let result = translations[lang] && (text in translations[lang])
    ? translations[lang][text as keyof Translations[T]]
    : text;

  if (typeof plural !== 'undefined'){
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in Object(result)) {
      result = Object(result)[key];
    }
  }

  return result as string;
}

