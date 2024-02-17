/* eslint-disable import/namespace */

import * as translations from './translations';

export type TTextToTranslate = keyof (typeof translations)['en'];
export type TLangs = 'en' | 'ru';

/**
 * Перевод фразы по словарю
 */
export default function translate(lang: TLangs, text: TTextToTranslate, numberToPlural?: number) {
  const result = translations[lang] && text in translations[lang] ? translations[lang][text] : text;

  if (typeof result === 'string') {
    return result;
  }

  if (typeof result === 'object' && typeof numberToPlural !== 'undefined') {
    const key = new Intl.PluralRules(lang).select(numberToPlural);
    if (key in result) {
      // @ts-expect-error Incomplete shape of Intl.PluralRules
      return result[key];
    } else {
      return result.other;
    }
  }
}
