import { TMadeIn } from "../article/types";
import { TItem } from "../catalog/types";
import StoreModule from "../module";

export type TCountries = {
  title: string;
  _id: string;
  code: string;
};

export type TCountriesState = {
  list: TCountries[];
  selected: TItem[];
  waiting: boolean;
};
/**
 * Список стран
 */
class CountriesState extends StoreModule<TCountriesState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): TCountriesState {
    return {
      list: [],
      selected: [],
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

    // Страны загружены успешно
    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        selected: [],
        waiting: false,
      },
      "Страны загружены"
    );
  }

  async search(value: string) {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки стран"
    );

    const res = await this.services.api.request({
      url: `/api/v1/countries?search[query]=${value}&fields=items(_id,title,code)&limit=*`,
    });

    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        waiting: false,
      },
      "Страны загружены"
    );
  }

  removeSelectedItem(_id: string) {
    const selected = this.getState().selected.filter((item) => item.id !== _id);
    this.setState({
      ...this.getState(),
      selected,
    });
  }
}

export default CountriesState;
