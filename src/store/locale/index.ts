import StoreModule from "../module";
import { ILocaleInitState } from "./types";

class LocaleState extends StoreModule {

  initState(): ILocaleInitState {
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
