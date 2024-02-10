import Services from '@src/services';
import * as translations from './translations';
import { LangCodes, AvaliableLang, TranslateKey } from './types';
import type { Config } from '@src/config';

class I18nService {

  private services: Services
  private config: Config['i18n']
  private listeners: Function[]
  private lang: LangCodes
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
      //@ts-ignore
      this.services.api.config.langHeader,
      this.lang
    )
  }

  public subscribe(listener: (lang: LangCodes) => void): Function {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  public getLang(): LangCodes {
    return this.lang
  }

  public setLang(lang: LangCodes): void {
    if (this.avaliableLangs.find(l => l.value === lang)) this.lang = lang
    this.services.api.setHeader(
      //@ts-ignore
      this.services.api.config.langHeader,
      this.lang
    )
    for (const listener of this.listeners) listener(this.lang);
  }

  public getAvaliableLags(): AvaliableLang[] {
    return this.avaliableLangs
  }
  
  
/**
 * Перевод фразы по словарю
 * @param text {String} Текст для перевода
 * @param lang {String | undefined} Код языка
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
  public translate(text: TranslateKey, plural?: number, lang?: LangCodes): undefined | string {
    let result = translations[lang || this.lang] && (text in translations[lang || this.lang])
      ? (translations[lang || this.lang][text])
      : text;

    if (typeof result === 'object') {
      if (typeof plural !== 'undefined') {
        const key = new Intl.PluralRules(lang || this.lang).select(plural);
        if (key in result) {
          return result[key];
        } else {
          return undefined
        }
      }
    } else {
      return result;
    }
  }
}

export default I18nService;