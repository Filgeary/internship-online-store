import * as translations from "./export";

// Тип объекта переводов
type TTranslations = typeof translations;

// Формы числительных `"zero" | "one" | "two" | "few" | "many" | "other"`
type IntersectionsOfPluralization = Intl.LDMLPluralRule;

// Перебор всех ключей в объекте из джейнерика по его же ключам, возвращает объединение типов значений свойств обьекта ObjectType
type ValueOfTypeKeys<ObjectType> = ObjectType[keyof ObjectType];
/**
 * Тип для глубинного перебора ключей и составления строчных значений его вложенных полей через "."
 * Разрешен перебор значений плюрализации, для получения значений по ней (исходя из обсуждений на созвоне)
 * @example {
 *    "menu": {
 *      "main": "Main"
 *    },
 * }
 * будет иметь значение menu.main
 * */
export type DeepKeysOfType<SourceObject, KeyPrefix extends string = ''> = ValueOfTypeKeys<{
  // Перебирая значения корневого обьекта, проверяем соотносятся ли его ключи с ключами плюрализации
  [Key in keyof SourceObject]: keyof SourceObject[Key] extends IntersectionsOfPluralization
    ?
      // Если они соотносятся, то записываем имя поля по которому они доступны и записываем, значения каждой плюрализации
      | `${KeyPrefix}${Key & string}`
      // Рекурсивно записываем все ключи из обьекта плюрализации, чтобы к ним был доступ
      | DeepKeysOfType<SourceObject[Key], `${KeyPrefix}${Key & string}.`>
    : SourceObject[Key] extends object
    ?
      // Если данный ключ является объектом, то рекурсивно перебираем его тип, для получения всех ключей
      DeepKeysOfType<SourceObject[Key], `${KeyPrefix}${Key & string}.`>
    :
      // Если же значение является строкой, то просто возвращаем его как значение ключа (это же условие позволит выйти из "рекурсивного" типа)
      `${KeyPrefix}${Key & string}`;
}>;

type AllTransferKeys = DeepKeysOfType<TTranslations['ru']>;

// Тип для "фильтрации" типов из некоторого переданного
// Делим T на подстроки, и проверяем, если у нее в конце есть строка с одним из значений IntersectionsOfPluralization,
// то выводим всю строку, тем самым, выберем только те строки, которые являются как-бы конечными
type FilteredTypes<T extends string> = T extends `${infer _Prefix}.${IntersectionsOfPluralization}` ? T : never;
// Удаление приставки с плюрализацией у полученного обледенения строк, то есть выбор только предыдущих значений
type RemovePluralModification<T extends string> = T extends `${infer Prefix}.${IntersectionsOfPluralization}` ? Prefix : T;

// Все ключи у которых на конце есть значения плюрализации
type KeysTranslationsPluralization = FilteredTypes<AllTransferKeys>;
const keysWithPluralization: KeysTranslationsPluralization = 'modalAdd.article.many' || 'basket.articles.few' // и так далее
// Все ключи у которых в "подчинении" есть ключи плюрализации
type KeysWithPluralValue = RemovePluralModification<KeysTranslationsPluralization>;
const keysWithPluralValue: KeysWithPluralValue = 'basket.articles' || 'modalAdd.article' // то есть те поля у которых есть объект плюрализации
// Ключи исключающие из себя ключи с объектами плюрализации
type ExcludingKeysWithPlural = Exclude<AllTransferKeys, KeysWithPluralValue>
//const excludingKeysWithPlural: ExcludingKeysWithPlural = 'basket.articles'  // 'basket.articles' | 'modalAdd.article' - будет ошибкой типов

type Lang = keyof TTranslations


// Перегрузки функции с разными принимаемыми типами
// @todo Почему при вызове функции с ключами соотносящимися с типом KeysWithPluralValue, перегрузка не сравнивает их по типам, а только по количеству аргументов
export function transitionPoint(lang: Lang, text: ExcludingKeysWithPlural): string
export function transitionPoint(lang: Lang, text: KeysWithPluralValue, plural: number): string
export function transitionPoint(lang: Lang, text: KeysWithPluralValue | ExcludingKeysWithPlural, plural?: number | undefined): string {
  // Делим строку на массив ключей, чтобы достать значения из перевода
  const keysTransfer = text.split('.')
  // Текущая "позиция" перевода, то есть на каком этапе мы находимся, будет изменяться в цикле
  let currentTransfer: string | Record<string, string | object> = translations[lang]
  // Цикл для перебора ключей и получения значений по ним, выбран "for" для выхода из функции если мы дошли до момента, когда результирующее значение стало строкой
  for (let i = 0; i < keysTransfer.length; i++) {
    const currentKey: string = keysTransfer[i]
    currentTransfer = currentTransfer[currentKey] as Record<string, string | object> | string
    if (typeof currentTransfer === 'string') return currentTransfer
  }
  if (plural !== undefined) {
    const key: Intl.LDMLPluralRule = new Intl.PluralRules(lang).select(plural);
    if (key in currentTransfer) return currentTransfer[key] as string
    else {
      console.error(`По данному ключу плюрализации ${key} не было найдено подходящего поля, пожалуйста добавьте значение плюрализации`)
      return text
    }
  }
  return text
}
transitionPoint('ru', 'basket.articles', 11)
// @todo как здесь, при вызове TS пытается сравнить 'basket.articles' с ExcludingKeysWithPlural, хотя по сути должен требовать 3-ий аргумент
transitionPoint('ru', 'basket.articles', 11)

