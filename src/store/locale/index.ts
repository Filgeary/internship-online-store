import StoreModule from "../module";
import { LocaleConfig, Locales, type LocaleState } from "./types";

class LocaleModule extends StoreModule<LocaleState, LocaleConfig> {
  initState(): LocaleState {
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

export default LocaleModule;
