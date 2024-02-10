import translations from "@src/i18n/translations";

// Тип для языков
export type Lang = 'ru' | 'en';

/**
 * Перевод фразу по словарю
 */
export default function translate(lang: Lang, text: string, plural?: number): string {
  let result = translations[lang] && (text in translations[lang])
    ? translations[lang][text]
    : text;
  if (typeof plural !== 'undefined' && typeof result !== 'string') {
    const key = new Intl.PluralRules(lang).select(plural);
    if (typeof result === 'object' && key in result) {
      result = result[key];
    }
  }
  return typeof result === 'string' ? result : text.toString();
}
