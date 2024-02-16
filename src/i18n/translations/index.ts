import translationsAll from './export';

// Тип языков
export type TranslationsType = typeof translationsAll;
// Языки переводов
export type Lang = keyof TranslationsType;
// Перебор всех значений в переводах
export type TextTranslate = keyof TranslationsType[Lang]


// Тип для объединения всех переводов в пересечение типов
// С помощью U extends any мы проверяем присваивается ли джейнерик типу any и если да то возвращаем функцию, которая принимает U тип в качестве аргумента
// После этого происходит проверка присвоения с функции слева и функции справа
// После если одну функцию можно присвоить другой то выводится тип I, тем самым как бы все варианты для перевода превращаются в обобщенный тип
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type AllTranslationsValues = TranslationsType[keyof TranslationsType];
type AllKeys = UnionToIntersection<AllTranslationsValues>;
export type KeysTranslationsAll = keyof AllKeys;


//@todo сделать так чтобы обязательный параметр был не всегда one
export interface PluralKey {
  "one"?: string,
  "other"?: string,
  "two"?: string,
  "few"?: string,
  "many"?: string,
  "zero"?: string,
}

export type Translation<Translate> = {
  [translationKey in keyof Translate]: string | PluralKey;
};

export type Translations = {
  [keyTranslate in Lang]: Translation<TranslationsType[keyTranslate]>;
};

const translations: Translations = translationsAll;

export default translations;
