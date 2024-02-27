import exclude from "@src/utils/exclude";
import StoreModule from "../module";
import { ICountriesInitState, ICountriesResponse } from "./types";

/**
 * Список категорий
 */
class CountriesState extends StoreModule<ICountriesInitState> {
  private limit: number = 10;
  /**
   * Начальное состояние
   */
  initState(): ICountriesInitState {
    return {
      list: [],
      waiting: false,
    };
  }

  /**
   * Загрузка стран
   */
  async load() {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки стран"
    );

    const res = await this.services.api.request<ICountriesResponse>({
      url: `/api/v1/countries?fields=_id,title,code&limit=*`,
    });

    this.setState(
      {
        list: res.data.result.items,
        waiting: false,
      },
      `Страны загружены`
    );
  }
}

export default CountriesState;
