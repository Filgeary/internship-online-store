export enum Locales {
  en = 'en',
  ru = 'ru'
}

export interface ILocaleState {
  readonly lang: Locales
}