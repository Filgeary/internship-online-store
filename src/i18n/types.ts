import * as langs from './translations';

export type TRuLang = typeof langs.translations.ru;
export type TEnLang = typeof langs.translations.en;

export type TAllLangsPick = keyof (TRuLang | TEnLang);

// Утилита для преобразования всех ключей в Union-тип
type TFlattenKeys<T> = T extends object
  ? { [K in keyof T]: K | TFlattenKeys<T[K]> }[keyof T]
  : never;

// Все ключи объекта как Union-тип
export type TAllFlattenKeys = TFlattenKeys<
  typeof langs.translations.en | typeof langs.translations.ru
>;

export type TTextArrows = `${TAllFlattenKeys}->${TAllFlattenKeys}${string}`;

export type TTranslateFn = (
  lang: TLangs,
  text: TAllLangsPick | TTextArrows | Array<TAllFlattenKeys>,
  plural?: number
) => string;
export type TUserTranslateFn = (
  text: TAllLangsPick | TTextArrows | Array<TAllFlattenKeys>,
  plural?: number
) => string;
