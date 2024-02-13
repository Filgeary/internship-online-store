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

// translate('en', 'article.add->disabled->purpleTheme');

export type TTranslateFn = (
  lang: TLangs,
  text: TAllLangsPick,
  plural: number
) => string;
export type TUserTranslateFn = (text: TAllLangsPick, plural?: number) => string;
