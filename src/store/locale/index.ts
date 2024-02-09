import StoreModule from "../module"

export interface ILocaleInitState {
  lang: string
}

class LocaleState extends StoreModule {

  initState() {
    return {
      lang: 'ru'
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: string) {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
