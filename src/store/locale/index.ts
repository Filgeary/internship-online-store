import StoreModule from "../module";

export type TLocaleState = {
  lang: string;
};

class LocaleState extends StoreModule<TLocaleState> {
  initState(): TLocaleState {
    return {
      lang: "ru",
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: string) {
    this.setState({ lang }, "Установлена локаль");
  }
}

export default LocaleState;
