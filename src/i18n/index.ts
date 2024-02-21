import Services from '@src/services';
import * as translationsRecursion from './translations';
import type { Config } from '@src/config';
import type { PluralTranslateKey, PluralObjects, StringTranslateKey, TranslateKey, LangCodes, AvaliableLang, LangCode } from './types';

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

function isUndefined(value: undefined | number)
: value is undefined {
  return (typeof value) === 'undefined'
}