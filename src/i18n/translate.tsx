import { translations } from './translations';

import { TTranslateFn, TAllLangsPick } from './types';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
const translate: TTranslateFn = (lang: TLangs, text: TAllLangsPick, plural: number): string => {
  let result = translations?.[lang]?.[text] ?? text;

  if (typeof plural !== 'undefined' && typeof result === 'object'){
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in result) {
      result = result[key];
    }
  }

  return typeof result === 'object' ? text : result;
}

export default translate;
