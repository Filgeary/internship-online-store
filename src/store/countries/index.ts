import StoreModule from "../module";
import { InitialStateCountries } from "./type";

class CountriesState extends StoreModule<InitialStateCountries> {
  initState(): InitialStateCountries {
    return {
      list: [],
      waiting: false,
      count: 0,
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
      url: `/api/v1/countries?fields=items(_id,title,code),count&limit=*`,
    });

    if (res.status === 200) {
      // Страны загружены успешно
      this.setState(
        {
          ...this.getState(),
          list: res.data.result.items,
          waiting: false,
          count: res.data.result.count,
        },
        "Страны загружены"
      );
    }
  }

  async search(value: string) {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки стран"
    );

    const res = await this.services.api.request({
      url: `/api/v1/countries?search[query]=${value}&fields=items(_id,title,code),count&limit=*`,
    });

    if (res.status === 200) {
      this.setState(
        {
          ...this.getState(),
          list: res.data.result.items,
          count: res.data.result.count,
          waiting: false,
        },
        "Страны загружены"
      );
    }
  }
}

export default CountriesState;
