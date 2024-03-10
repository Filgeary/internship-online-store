import StoreModule from "@src/store/module";

export type country = {
  _id: string,
  title: string,
  code: string
}

type TCountryState = {
  list: country[],
  waiting: boolean
}

class CountriesState extends StoreModule<TCountryState> {
  initState(): TCountryState {
    return {
      list: [],
      waiting: false,
    }
  }

  /**
   * Загрузка товаров по id
   */
  async load(): Promise<void> {
    this.setState({
      list: this.getState().list,
      waiting: true
    });
    const res = await this.services.api.request({
      url: `/api/v1/countries?lang=ru&sort=title&limit=100000&skip=0&fields=_id%2Ctitle%2Ccode`
    });
    if (res.status === 200) {
      // Товар загружен успешно
      this.setState({
        list: res.data.result.items,
        waiting: false
      }, 'Загружены страны из АПИ');
    }
    if (res.status === 400) {
      this.setState({
        list: [],
        waiting: false,
      });
    }
  }

  async loadMulti(countriesList: string[]) {
    const res = await this.services.api.request({url: `/api/v1/countries?search%5Bids%5D=${countriesList.join('|')}&fields=items(_id, title, code)`})
    return res.data.result.items
  }
}

export default CountriesState;
