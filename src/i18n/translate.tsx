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
  text: TAllLangsPick | Array<TAllFlattenKeys> | string[] | string,
  plural?: number
): string => {
  let result:
    | string[]
    | string
    | Record<TAllFlattenKeys | keyof TPlurals | string, any> = Array.isArray(
    text
  )
    ? text
    : (text = text.split('->'));

  // В любом случае получим массив, но если передали только верхний ключ - будет лишь 1 элемент
  if (result.length > 1) {
    result = translations[lang];
    for (const key of text) {
      if (typeof result === 'object') result = result[key] as string;
    }
  } else {
    const translateKey = text[0] as TAllLangsPick;
    result = translations?.[lang]?.[translateKey] ?? text;
  }

  if (typeof plural !== 'undefined' && typeof result === 'object') {
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in result) {
      result = (result as TPlurals)[key as keyof TPlurals];
    }
  }

  return (typeof result === 'object' ? text : result) as string;
};

// const res1 = translate('ru', 'auth.login');
// const res2 = translate('ru', [
//   'one',
//   'levelOneTest.testing1',
//   'levelTwoTest.testing2',
// ]);
// const res3 = translate(
//   'ru',
//   'test->levelOneTest.testing1->levelTwoTest.testing2' as string
// );

// console.log(res1);
// console.log(res2);
// console.log(res3);

type TPlurals =
  | {
      one: string;
      other: string;
    }
  | { one: string; other: string; few: string; many: string };

export default translate;
