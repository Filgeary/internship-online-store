import StoreModule from "../module"
import { ICountriesInitState, IApiResponseCountries } from "./types"

/**
 * Список категорий
 */
class CountriesState extends StoreModule<ICountriesInitState> {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICountriesInitState {
    return {
      list: [],
      waiting: false
    };
  }

  /**
   * Загрузка списка стран
   */
  async load() {
    this.setState({...this.getState(), waiting: true}, 'Ожидание загрузки стран');

    const res: IApiResponseCountries = await this.services.api.request({
      url: `/api/v1/countries?lang=ru&limit=228&skip=0&fields=%2A`
    })
    // Список стран загружен успешно
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      waiting: false
    }, 'Список стран загружен');
  }

}

export default CountriesState