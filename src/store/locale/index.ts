import { Language } from "@src/i18n/types";
import StoreModule from "../module";
import { ILocaleState } from "./types";

class LocaleState extends StoreModule<ILocaleState> {
  initState(): ILocaleState {
    return {
      lang: "ru",
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: Language) {
    this.setState({ lang }, "Установлена локаль");
  }
}

export default LocaleState;
