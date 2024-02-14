import * as translations from './translations';
import { Lang, Text } from './type';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
export default function translate(
  lang: Lang,
  text: Text,
  plural?: number
): string {

  let result = translations[lang][text];

  if (typeof plural !== "undefined" && typeof result === "object") {
    const key = new Intl.PluralRules(lang).select(plural);

    if (key in result) {
      result = result[key as keyof typeof result];
    }
  }

  return typeof result === "string" ? result : text;
}
