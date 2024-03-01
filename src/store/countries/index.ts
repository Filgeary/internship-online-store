import StoreModule from "../module";

export type TCountries = {
  title: string;
  _id: string;
  _key: string;
  code: string;
};

export type TCountriesState = {
  list: TCountries[];
  selected: TCountries[];
  waiting: boolean;
  skip: number;
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
      skip: 0,
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
      url: `/api/v1/countries?lang=ru&limit=10&skip=0&fields=%2A`,
    });

    // Страны загружены успешно
    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        selected: [],
        waiting: false,
        skip: 10,
      },
      "Страны загружены"
    );
  }

  async loadSkip() {
    this.setState(
      { ...this.getState(), waiting: true },

      "Ожидание загрузки стран"
    );

    const res = await this.services.api.request({
      url: `/api/v1/countries?lang=ru&limit=10&skip=${
        this.getState().skip
      }&fields=%2A`,
    });
    let number = this.getState().skip;
    if (res.data.result.items) {
      number += 10;
    }
    this.setState(
      {
        ...this.getState(),
        list: [...this.getState().list, ...res.data.result.items],
        selected: [...this.getState().selected],
        waiting: false,
        skip: number,
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
      url: `/api/v1/countries?search[query]=${value}&limit=0`,
    });

    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        waiting: false,
        skip: 10,
      },
      "Страны загружены"
    );
  }

  selectCountry(item: TCountries) {
    let exist = false;
    const selected = this.getState().selected.map((el) => {
      if (el._id === item._id) {
        exist = true;
      }
      return el;
    });

    if (!exist) {
      this.setState(
        {
          ...this.getState(),
          selected: [...selected, item],
        },
        "Выбор стран(ы) для фильтрации"
      );
    } else {
      this.setState(
        {
          ...this.getState(),
          selected: selected.filter((el) => el._id !== item._id),
        },
        "Выбор стран(ы) для фильтрации"
      );
    }
  }
}

export default CountriesState;
