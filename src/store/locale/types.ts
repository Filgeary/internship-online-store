export enum Locales {
  en = 'en',
  ru = 'ru'
}

export interface LocaleState {
  readonly lang: Locales
}
export type LocaleConfig = {}