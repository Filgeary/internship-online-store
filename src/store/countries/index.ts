import StoreModule from "../module";
import { InitialStateCountries } from "./type";

class CountriesState extends StoreModule<InitialStateCountries> {
  initState(): InitialStateCountries {
    return {
      list: [],
      waiting: false,
      selected: [],
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
      url: `/api/v1/countries?search[query]=${value}&fields=items(_id,title,code)&limit=*`,
    });

    if (res.status === 200) {
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

  async loadById(ids: string) {
    this.setState({ ...this.getState(), waiting: true });
    
    const res = await this.services.api.request({
      url: `/api/v1/countries/?search[ids]=${ids}&fields=items(_id,title,code)&limit=*`,
    });

    this.setState(
      {
        ...this.getState(),
        selected: res.data.result.items,
        waiting: false,
      },
      `Страны ${ids} успешно получены`
    );
  }

  removeSelectedItem(_id: string) {
    const selected = this.getState().selected.filter(item => item._id !== _id);
    this.setState({
      ...this.getState(),
      selected
    })
  }
}

export default CountriesState;
