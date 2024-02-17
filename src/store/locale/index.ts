import StoreModule from "../module";
import { LocaleStateType, Locales } from "./types";

class LocaleState extends StoreModule<LocaleStateType> {

  lang: Locales

  initState(): LocaleStateType {
    return {
      lang: 'ru'
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: Locales) {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
