import type {default as en} from './translations/en.json';
import type {default as ru} from './translations/ru.json';

export type TranslateKey = keyof typeof en & keyof typeof ru

export enum LangCodes {
  ru = 'ru',
  en = 'en'
} 
export enum LangTitles {
  ru = 'Русккий',
  en = 'English'
}

type LangRu = {
  value: LangCodes.ru,
  title: LangTitles.ru,
}

type LangEn = {
  value: LangCodes.en,
  title: LangTitles.en,
}

export type AvaliableLang = LangRu | LangEn