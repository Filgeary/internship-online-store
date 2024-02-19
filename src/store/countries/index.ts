import StoreModule from "../module";
import { ICountriesState } from "./types";

/**
 * Список категорий
 */
class CountriesState extends StoreModule {
  initState(): ICountriesState {
    return {
      list: [],
      waiting: false,
    };
  }
  /**
   * Загрузка списка товаров
   */
  async load() {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки категорий"
    );

    const res = await this.services.api.request({
      url: `/api/v1/countries?fields=_id,title,code&limit=*`,
    });

    // Товар загружен успешно
    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        waiting: false,
      },
      "Категории загружены"
    );
  }
}

export default CountriesState;
