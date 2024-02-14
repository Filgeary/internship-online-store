// @ts-nocheck

import { translations } from './translations';

import { TAllFlattenKeys, TAllLangsPick, TTranslateFn } from './types';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
const translate: TTranslateFn = (
  lang: TLangs,
  text: TAllLangsPick | Array<TAllFlattenKeys>,
  plural?: number
): string => {
  let result = Array.isArray(text) ? text : (text = text.split('->'));

  // В любом случае получим массив, но если передали только верхний ключ - будет лишь 1 элемент
  if (result.length > 1) {
    result = translations[lang];
    for (const key of text) result = result[key];
  } else {
    result = translations?.[lang]?.[text] ?? text;
  }

  if (typeof plural !== 'undefined' && typeof result === 'object') {
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in result) {
      result = result[key as keyof TPlurals];
    }
  }

  return typeof result === 'object' ? text : result;
};

const res1 = translate('ru', 'auth.login');
const res2 = translate('ru', [
  'test',
  'levelOneTest.testing1',
  'levelTwoTest.testing2',
]);
const res3 = translate(
  'ru',
  'test->levelOneTest.testing1->levelTwoTest.testing2'
);

console.log(res1);
console.log(res2);
console.log(res3);

type TPlurals =
  | {
      one: string;
      other: string;
    }
  | { one: string; other: string; few: string; many: string };

export default translate;
