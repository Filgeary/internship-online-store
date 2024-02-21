import * as translations from './translations'

type Translations = typeof translations

export enum LangTitles {
  ru = 'Русккий',
  en = 'English',
  //При добавлении нового языка передается его название
}


export enum LangCodes {
  ru = 'ru',
  en = 'en',
  //При добавлении нового языка передается его код
} 

export type LangCode = keyof Translations

export type AvaliableLang = {
  value: LangCodes,
  title: LangTitles
}


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
