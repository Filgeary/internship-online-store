import translations from './translations';

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

  let result = (lang === "en" || lang === "ru") &&
    translations[lang] && text in translations[lang]
      ? translations[lang][text]
      : text;

  if (typeof plural !== "undefined" && typeof result === "object") {
    const key = new Intl.PluralRules(lang).select(plural);

    if (key in result) {
      result = result[key as keyof typeof result];
    }
  }
  return result as string;
}
