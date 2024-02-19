import StoreModule from '../module';
import { TCountry, TCountriesConfig, TCountriesState } from './types';

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

    const res = await this.services.api.request<{ items: TCountry[] }>({
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

  /**
   * Загрузить страну по id
   */
  async loadById(id: string) {
    this.setState({ ...this.getState(), waiting: true });

    const res = await this.services.api.request<TCountry>({
      url: `/api/v1/countries/${id}?lang=ru&fields=%2A`,
    });

    const country = res.data.result;

    this.setState(
      {
        ...this.getState(),
        list: [country],
        waiting: false,
      },
      `Страна c id ${id} успешно получена`
    );
  }
}

export default CountriesStore;
