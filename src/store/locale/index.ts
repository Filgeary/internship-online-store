import StoreModule from "../module";

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
  setLang(lang) {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
