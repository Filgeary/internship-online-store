import ru from './translations/ru.json';
import en from './translations/en.json';

export type TRuLang = typeof ru;
export type TEnLang = typeof en;

export type TAllLangsPick = keyof (TRuLang | TEnLang);

export type TTranslateFn = (lang: TLangs, text: TAllLangsPick, plural: number) => string;
export type TUserTranslateFn = (text: TAllLangsPick, plural?: number) => string;
