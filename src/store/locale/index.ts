import StoreModule from '../module';
import { TLocaleState } from './types';

class LocaleState extends StoreModule<'locale'> {
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
