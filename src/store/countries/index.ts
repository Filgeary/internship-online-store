import { isSuccessResponse } from '@src/api';
import StoreModule from '../module';

import type { ICountries, ICountry } from '@src/types/ICountry';

type InitialCountriesState = {
  list: ICountry[];
  waiting: boolean;
};

class CountriesState extends StoreModule<InitialCountriesState> {
  initState(): InitialCountriesState {
    return {
      list: [],
      waiting: false,
    };
  }

  /**
   * Загрузка списка стран
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, 'Ожидание загрузки стран');

    const res = await this.services.api.request<ICountries>({
      url: `/api/v1/countries?fields=_id,title,code&limit=*`,
    });

    if (isSuccessResponse(res.data)) {
      this.setState(
        {
          ...this.getState(),
          list: res.data.result.items,
          waiting: false,
        },
        'Страны загружены',
      );
    }
  }
}

export default CountriesState;
