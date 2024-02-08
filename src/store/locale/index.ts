import StoreModule from '../module';

type TLocaleState = {
  lang: TLangs;
};

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
