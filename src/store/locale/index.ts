import StoreModule from '../module';
import { TLocaleConfig, TLocaleState } from './types';

class LocaleState extends StoreModule<TLocaleState, TLocaleConfig> {
  readonly config: TLocaleConfig;

  initState(): TLocaleState {
    return {
      lang: 'ru',
    };
  }

  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang: TLangs) {
    this.setState({ lang }, 'Установлена локаль');
  }
}

export default LocaleState;
