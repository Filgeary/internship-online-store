import * as translations from './translations';

// Тип объекта, опционально содержащий формы множественного числа
type TPlural = Partial<{ [HowMany in Intl.LDMLPluralRule]: string }>
/* Вывод:
type TPlural = {
    zero?: string | undefined;
    one?: string | undefined;
    two?: string | undefined;
    few?: string | undefined;
    many?: string | undefined;
    other?: string | undefined;
}
*/

// Тип переводов
type TLangType = typeof translations;

// Ключи типа пареводов: `en | ru`
export type TLangKeys = keyof TLangType;

// Тип для подсказок автодополнения
export type TDictionary = {
  [Property in TLangKeys]: keyof TLangType[Property];
  //         вот тут магия ^^^^^
  //         сохраняем имена ключей в качестве типа поля Property
}
/* Вывод:
type TDictionary = {
    en: "basket.articles" | "title" | "menu.main" | "basket.title" ...;
    ru: "basket.articles" | "session.signOut" ...;
}
*/

// Вспомогательный рекурсивный тип
type TGenTree<T> = { [Property in keyof T]: TGenTree<T[Property]> }
//                        рекурсивный вызов ^^^^^^^^

// Строим дерево типа
type TDictionaryTree = TGenTree<TLangType>
/* Вывод:
type TDictionaryTree = {
  en: TGenTree<{
    "basket.articles": {
        one: string;
        other: string;
    };
    "title": string;
    "menu.main": string;
    "basket.title": string;
    ...
  }>;
  ru: TGenTree<...>;
}
*/

// Был ещё такой альтернативный вариант, но он менее универсальный и более громоздкий
type TDictionaryTreeTest1 = {
  [Property in TLangKeys]: {
    [Field in keyof TLangType[Property]]: TLangType[Property][Field] extends string ? string : TPlural;
  };
}
/* Вывод:
type TDictionaryTreeTest1 = {
  en: {
    "basket.articles": Partial<{
      zero: string;
      one: string;
      two: string;
      few: string;
      many: string;
      other: string;
    }>;
    title: string;
    ...
  }
}
*/

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
export default function translate<Lang extends TLangKeys>(lang: Lang, text?: TDictionary[Lang], plural?: number): string {
  if (!text) return '';
  const translationsLang = translations[lang] as TDictionaryTree[Lang];
  let result = translationsLang && (text in translationsLang)
    ? translationsLang[text]
    : text;

  if (typeof plural !== 'undefined') {
    const pluralResult = result as TPlural;
    const key: Intl.LDMLPluralRule = new Intl.PluralRules(lang).select(plural);
    if (key in pluralResult) {
      return pluralResult[key] as string ?? ''; // пустая строка если `undefined` (перевода нет)
    }
  }

  return result as string;
}
