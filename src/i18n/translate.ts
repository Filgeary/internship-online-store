import translations, { TDictionaryKeys } from "./translations";

export type TLang = "ru" | "en";

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
export default function translate(
  lang: TLang,
  text: TDictionaryKeys,
  plural?: number
): string {
  let result =
    translations[lang] && text in translations[lang]
      ? translations[lang][text]
      : text;
  if (typeof result === "string") {
    return result;
  }
  if (typeof plural !== "undefined" && typeof result === "object") {
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in result) {
      result = result[key as keyof typeof result];
    }
  }

  return result as string;
}
