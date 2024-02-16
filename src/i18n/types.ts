import ru from './translations/ru.json'

export type ILangs = 'ru' | 'en'

export type IAllLangs = keyof typeof ru

export type ITranslateFn = (
  lang: ILangs,
  text: IAllLangs,
  plural?: number
) => string
