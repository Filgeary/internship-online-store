import * as translations from './translations-recursion'
import { LangCodes } from './types';

type Translations = typeof translations

export type PluralForm = 'one' | 'few' | 'many' | 'other'
export type PluralObjects = {
  [K in PluralForm]: string
}

type StringForms<T extends object> = 
{
    [K in keyof T]: `${K extends string 
      // Добавляем ключ, если не является ключом для плюрализации
      ? K extends PluralForm ? "" : K
      : ''}${T[K] extends object 
        // если тип по ключу - объект,
        // и если ключи типа по ключю не являются ключами для плюрализации,
        // то переходи в рекурсию
        ? keyof T[K] extends PluralForm ? never : `.${StringForms<T[K]>}`
          : ''}`
  }[keyof T]


type AllForms<T extends object> =
{
  [K in keyof T]: `${K extends string 
    ? K extends PluralForm ? "" : K
    : ''}${T[K] extends object 
      ? `${keyof T[K] extends PluralForm ? '' : '.'}${AllForms<T[K]>}`
      : ''}`
}[keyof T]


export type TranslateKey = AllForms<Translations[LangCodes]>
export type StringTranslateKey = StringForms<Translations[LangCodes]>
export type PluralTranslateKey = Exclude<TranslateKey, StringTranslateKey>

// type S = StringTranslateKey  PluralTranslateKey