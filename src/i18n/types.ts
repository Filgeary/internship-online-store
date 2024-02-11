import * as translations from "./translations";

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)[Language];

export type TranslateFunc = (text: TranslationKey, number?: number) => string;

export type PlurableString = {
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other?: string;
  zero?: string;
};
