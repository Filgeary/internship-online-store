import StoreModule from '../module';
import { TCountries, TCountriesConfig, TCountriesState } from './types';

class CountriesStore extends StoreModule<TCountriesState, TCountriesConfig> {
  readonly config: TCountriesConfig;

  initState(): TCountriesState {
    return {
      list: [],
      waiting: false,
    };
  }

  /**
   * Загрузить список стран с сервера
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, 'Грузим страны с сервера');

    const res = await this.services.api.request<{ items: TCountries[] }>({
      url: `/api/v1/countries?lang=ru&limit=*&skip=0&fields=%2A`,
    });

    const { items } = res.data.result;

    this.setState(
      {
        ...this.getState(),
        list: items,
        waiting: false,
      },
      'Страны успешно получены'
    );
  }
}

export default CountriesStore;
