import StoreModule from "../module";
import { ICountriesState } from "./types";

/**
 * Список стран
 */
class CountriesState extends StoreModule {
  initState(): ICountriesState {
    return {
      list: [],
      waiting: false,
    };
  }
  /**
   * Загрузка списка стран
   */
  async load() {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки стран"
    );

    const res = await this.services.api.request({
      url: `/api/v1/countries?fields=_id,title,code&limit=*`,
    });

    // Страны загружен успешно
    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        waiting: false,
      },
      "Страны загружены"
    );
  }
}

export default CountriesState;
