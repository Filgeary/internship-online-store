import StoreModule from "../module";

type InitialState = {
  lang: string
}

class LocaleState extends StoreModule<'locale'> {
  initState(): InitialState {
    return {
      lang: 'ru'
    };
  }

  setLang(lang: string) {
    this.setState({ lang }, 'Установлена локаль');
  }
}

export default LocaleState;
