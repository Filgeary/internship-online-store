import * as translations from './translations';

type Lang = keyof typeof translations;
export type Text = keyof typeof translations["ru"];

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
export default function translate(
  lang: string,
  text: Text,
  plural?: number
): string {

  let result =
    translations[lang as Lang] &&
    text in translations[lang as Lang]
      ? translations[lang as Lang][text]
      : text;

  if (typeof plural !== "undefined" && typeof result === "object") {
    const key = new Intl.PluralRules(lang).select(plural);

    if (key in result) {
      result = result[key as keyof typeof result];
    }
  }
  return result as string;
}
