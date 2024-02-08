import StoreModule from "../module";

class LocaleState extends StoreModule {

  initState(): {lang: "ru" | "en"} {
    return {
      lang: 'ru'
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: "ru" | "en") {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
