import StoreModule from "../module";

type TLocaleState = {
  lang: TLangs;
};

class LocaleState extends StoreModule {

  initState(): TLocaleState {
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
