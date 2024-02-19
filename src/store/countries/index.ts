// eslint-disable-next-line import/no-cycle
import StoreModule from '../module';
import { type ICountriesInitState } from './types';

const firstItem = {
  code: null,
  order: 0,
  title: 'Все',
  _id: 0,
};

/**
 * Список стран
 */
class CountriesState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICountriesInitState {
    return {
      list: [],
      selected: [firstItem],
      waiting: false,
    };
  }

  /**
   * Загрузка списка стран
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, 'Ожидание загрузки списка стран');

    const res = await this.services.api.request({
      url: `/api/v1/countries?fields=_id,title,code,order&limit=*`,
    });

    // Товар загружен успешно
    this.setState(
      {
        ...this.getState(),
        list: [firstItem, ...res.data.result.items],
        selected: [firstItem],
        waiting: false,
      },
      'Список стран загружен'
    );
  }
}

export default CountriesState;
