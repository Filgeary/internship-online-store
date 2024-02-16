import StoreModule from '../module';

type InitialLocaleState = {
  lang: string;
};

class LocaleState extends StoreModule<InitialLocaleState> {
  initState(): InitialLocaleState {
    return {
      lang: 'ru',
    };
  }

  setLang(lang: string) {
    this.setState({ lang }, 'Установлена локаль');
  }
}

export default LocaleState;
