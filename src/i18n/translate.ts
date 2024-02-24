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
  text: keyof Translations[T],
  plural?: number): string {

  const tr: Translations = translations;

  type a = typeof tr['en']['basket.articles']

  let result = tr[lang] && (text in tr[lang])
    ? tr[lang][text]
    : text as string;

  if (typeof plural !== 'undefined'){
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in Object(result)) {
      result = Object(result)[key];
    }
  }

  return result;
}

