import Services from '@src/services';
import * as translations from './translations';
import * as translationsRecursion from './translations-recursion';
// import { LangCodes, AvaliableLang, TranslateKey, StringTranslateKey, PluralTranslateKey, PluralObjects, LangCode } from './types';
import type { Config } from '@src/config';
import { PluralTranslateKey, PluralObjects, StringTranslateKey, TranslateKey } from './types-recursion';
import { AvaliableLang, LangCode, LangCodes } from './types';

class I18nService {

  private services: Services
  readonly config: Config['i18n']
  private listeners: Function[]
  private lang: LangCode
  private avaliableLangs: AvaliableLang[]


  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config: Config['i18n']) {
    this.services = services;
    this.config = config
    this.lang = config.defaultLang
    this.listeners = []
    this.avaliableLangs = config.avaliableLangs
    this.services.api.setHeader(
      this.services.api.config.langHeader,
      this.lang
    )
  }

  public subscribe(listener: (lang: LangCodes) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  public getLang(): LangCode {
    return this.lang
  }

  public setLang(lang: LangCode): void {
    if (this.avaliableLangs.find(l => l.value === lang)) this.lang = lang
    this.services.api.setHeader(
      this.services.api.config.langHeader,
      this.lang
    )
    for (const listener of this.listeners) listener(this.lang);
  }

  public getAvaliableLags(): AvaliableLang[] {
    return this.avaliableLangs
  }
  
// /**
//  * Перевод фразы по словарю
//  * @param textKey {TranslateKey} Текст для перевода
//  * @param plural {Number} Число для плюрализации
//  * @returns {String} Переведенный текст
//  */
//   public translate(textKey: StringTranslateKey): string;
//   public translate(textKey: PluralTranslateKey, plural: number): string;
//   public translate(textKey: TranslateKey, plural?: number | undefined): string {
//     let result: string
//     if (isStringTranslateKey(textKey)) {
//       result = translations[this.lang]?.[textKey] || textKey
//     } else if (isPluralTranslateKey(textKey)) {
//       if (isUndefined(plural)) {
//         result = textKey
//         console.error(`For the pluralization object in the dictionary, it is required to provide a plural`)
//       } else {
//         const object = translations[this.lang]?.[textKey] || textKey
//         const key = new Intl.PluralRules(this.lang).select(plural) as keyof PluralObjects[LangCode];
//         if (key in object) {
//           result = (object as PluralObjects[LangCode])[key];
//         } else {
//           result = textKey
//           console.error(`The pluralization object in the dictionary does not contain a key for the transmitted form: ${key}, plural object is: ${JSON.stringify(object)}`)
//         }
//       }
//     } else {
//       result = textKey
//       console.error('The passed key does not exist in the dictionary or provided in unvalid format')
//     }
//     return result
//   }

  public translate(textKey: StringTranslateKey): string;
  public translate(textKey: PluralTranslateKey, plural: number): string;
  public translate(textKey: TranslateKey, plural?: number | undefined): string {
    let result: string
    
    const keys = textKey.split('.')
    let object = translationsRecursion[this.lang] as {} | string
    for (let i = 0; i < keys.length; i++) {
      object = object[keys[i] as keyof object]
    }
    if (typeof object === 'string') result = object
    else if (typeof object === 'object') {
      if (isUndefined(plural)) {
        result = textKey
      } else {
        const key = new Intl.PluralRules(this.lang).select(plural) as keyof PluralObjects;
        if (key in object) {
          result = (object as PluralObjects)[key];
        } else {
          result = textKey
        }
      }
    } else {
      result = textKey
    }

    return result
  }
}

export default I18nService;

// function isPluralTranslateKey(text: TranslateKey)
//   : text is PluralTranslateKey {
//     let result = true
//     for (let lang of Object.values(LangCodes)) {
//       if ((typeof translations[lang][text]) !== 'object') {
//         result = false
//       }
//     }
//     return result
//   }

// function isStringTranslateKey(text: TranslateKey)
// : text is StringTranslateKey {
//   let result = true
//   for (let lang of Object.values(LangCodes)) {
//     if ((typeof translations[lang][text]) !== 'string') {
//       result = false
//     }
//   }
//   return result
// }

function isUndefined(value: undefined | number)
: value is undefined {
  return (typeof value) === 'undefined'
}