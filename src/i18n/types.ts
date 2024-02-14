import * as langs from './translations';

export type TRuLang = typeof langs.translations.ru;
export type TEnLang = typeof langs.translations.en;

export type TAllLangsPick = keyof (TRuLang | TEnLang);

export type TLangsStruct = typeof langs;
export type TLangs = keyof typeof langs.translations;

export type TTreeBuilder<Property> = {
  [key in keyof Property]: TTreeBuilder<Property[key]>;
};

type TTree = TTreeBuilder<TLangsStruct['translations']>;

// Утилита для преобразования всех ключей в Union-тип
type TFlattenKeys<T> = T extends object
  ? { [K in keyof T]: K | TFlattenKeys<T[K]> }[keyof T]
  : never;

// Все ключи объекта как Union-тип
export type TAllFlattenKeys = TFlattenKeys<
  typeof langs.translations.en | typeof langs.translations.ru
>;

export type TTranslateFn = (
  lang: TLangs,
  text: TAllLangsPick | Array<TAllFlattenKeys> | string[] | string,
  plural?: number
) => string;
export type TUserTranslateFn = (text: TAllLangsPick, plural?: number) => string;
