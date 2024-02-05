import * as translations from './translations';

class I18nService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
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

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  setLang(lang) {
    if (this.avaliableLangs.find(l => l.value === lang)) this.lang = lang
    this.services.api.setHeader(
      this.services.api.config.langHeader,
      this.lang
    )
    for (const listener of this.listeners) listener(this.lang);
  }
  
  
/**
 * Перевод фразы по словарю
 * @param text {String} Текст для перевода
 * @param lang {String | undefined} Код языка
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Переведенный текст
 */
  translate(text, plural, lang) {
    let result = translations[lang || this.lang] && (text in translations[lang || this.lang])
      ? translations[lang || this.lang][text]
      : text;

    if (typeof plural !== 'undefined') {
      const key = new Intl.PluralRules(lang || this.lang).select(plural);
      if (key in result) {
        result = result[key];
      }
    }

    return result;
  }
}

export default I18nService;