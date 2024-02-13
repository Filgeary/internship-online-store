import * as translations from './translations';

type importTranslations = typeof translations;
export type TranslationsKeys = keyof importTranslations;
export type TextTranslationKeys = keyof importTranslations[TranslationsKeys];

export type TranslateFunc = (text: TextTranslationKeys, plural?: number) => string;