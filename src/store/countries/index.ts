import StoreModule from "../module";
import { CountriesAPIResponseType, CountriesStateType, CountryType } from "./types";

/**
 * Список стран
 */
class CountriesState extends StoreModule<CountriesStateType> {
  waiting: boolean;
  list: CountryType;

  /**
   * Начальное состояние
   */
  initState(): CountriesStateType {
    return {
      list: [],
      waiting: false
    };
  }

  /**
   * Загрузка списка стран
   */
  async load(): Promise<void> {
    this.setState({...this.getState(), waiting: true}, "Ожидаем загрузки стран");

    const res: CountriesAPIResponseType = await this.services.api.request({
      url: `/api/v1/countries?fields=_id,title,code&limit=*`
    })

    this.setState({
      ...this.getState(),
      waiting: false,
      list: res.data.result.items,
    }, "Страны загружены");
  }
}

export default CountriesState;
