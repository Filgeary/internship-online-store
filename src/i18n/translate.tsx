import * as translations from './translations';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
export default function translate(lang: string, text: string, plural?: number): string {
  let result = translations[lang] && (text in translations[lang])
    ? translations[lang][text]
    : text;

    if (typeof plural !== 'undefined'){
      const key = new Intl.PluralRules(lang).select(plural);
      if (key in result) {
      result = result[key];
    }
  }

  return result;
}
