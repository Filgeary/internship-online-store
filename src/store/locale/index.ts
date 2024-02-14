import { TranslationsKeys } from "@src/i18n/types";
import StoreModule from "../module";

interface ILocaleInitState {
  lang: TranslationsKeys
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
  setLang(lang: TranslationsKeys) {
    this.setState({lang}, 'Установлена локаль');
  }
}

export default LocaleState;
