import StoreModule from "../module"

export interface ILocaleInitState {
  lang: 'ru' | 'en'
}

class LocaleState extends StoreModule<ILocaleInitState> {

  initState(): ILocaleInitState {
    return {
      lang: 'ru'
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: 'ru' | 'en') {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
