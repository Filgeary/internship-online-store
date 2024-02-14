import StoreModule from "../module";
import { InitialStateLocale } from "./type";

class LocaleState extends StoreModule<InitialStateLocale> {
  initState(): InitialStateLocale {
    return {
      lang: "ru",
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: "ru" | "en") {
    this.setState({ lang }, "Установлена локаль");
  }
}

export default LocaleState;
