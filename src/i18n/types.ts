import type I18nService from '.'
import * as translations from './translations'

export enum LangCodes {
  ru = 'ru',
  en = 'en',
  //При добавлении нового языка передается его код
} 

export enum LangTitles {
  ru = 'Русккий',
  en = 'English',
  //При добавлении нового языка передается его название
}

type Translations = typeof translations
//Код языка
export type LangCode = keyof Translations
//Ключи для перевода
export type TranslateKey = keyof Translations[LangCode]

//Хелпер для получения типов с ключами, по которым возвращаются переводы
type StringTranslations<T> = { [P in keyof T as T[P] extends string ? P : never]: T[P] }
//Хелпер для получения типов с ключами, по которым возвращаются объекты плюрализации
type ObjectTranslations<T> = { [P in keyof T as T[P] extends object ? P : never]: T[P] }

//Ключи, по которым возвращается перевод
export type StringTranslateKey = keyof StringTranslations<Translations[LangCode]>
//Ключи, по которым возвращается объект плюрализации
export type PluralTranslateKey = keyof ObjectTranslations<Translations[LangCode]>

//Объекты плюрализации по языкам
export type PluralObjects = {
  [K in keyof Translations]: Translations[K][PluralTranslateKey]
}

//Доступные языки
export type AvaliableLang = {
  value: LangCodes,
  title: LangTitles
}

export type I18nConfig = {
  avaliableLangs: AvaliableLang[],
  defaultLang: LangCodes
}

export type TranslateFn = I18nService['translate']
