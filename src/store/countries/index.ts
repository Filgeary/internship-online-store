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
      url: `/api/v1/countries?lang=ru&limit=*&skip=0&fields=*`,
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
      url: `/api/v1/countries/${id}?lang=ru&fields=*`,
    });

    const country = res.data.result;

    this.setState(
      {
        ...this.getState(),
        list: [...this.getState().list, country],
        waiting: false,
      },
      `Страна c id ${id} успешно получена`
    );
  }

  /**
   * Загрузить несколько стран по id
   */
  async loadManyByIds(ids: string[]) {
    this.setState({ ...this.getState(), waiting: true });

    const res = await this.services.api.request<{ items: TCountry[] }>({
      url: `/api/v1/countries/?search[ids]=${ids.join('|')}&lang=ru&fields=*`,
    });

    const { items } = res.data.result;

    this.setState(
      {
        ...this.getState(),
        list: items,
        waiting: false,
      },
      `Страны ${ids} успешно получены`
    );
  }
}

export default CountriesStore;
