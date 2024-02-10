import StoreModule from "../module";
import { Locales, type ILocaleState } from "./types";

class LocaleState extends StoreModule<ILocaleState> {
  initState(): ILocaleState {
    return {
      lang: Locales.ru
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: Locales): void {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
