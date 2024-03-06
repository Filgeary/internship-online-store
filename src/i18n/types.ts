import * as translations from './translations';

type importTranslations = typeof translations;
export type TextTranslationKeys = keyof importTranslations["en"];

export type TranslateFunc = (text: TextTranslationKeys, plural?: number) => string;