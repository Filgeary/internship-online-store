import StoreModule from "../module"
import { ICountriesInitState, IApiResponseCountries, IСountry } from "./types"

/**
 * Список стран
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

  async search(query: string) {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки стран"
    );

    const res: IApiResponseCountries = await this.services.api.request({
      url: `/api/v1/countries?search[query]=${query}&fields=items(_id,title,code),count&limit=*`,
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

  /**
   * Выделение записи 
   * @param id
   */
  selectСountry(id: string) {
    this.setState({
        ...this.getState(),
      list: this.getState().list.map((item: IСountry) => {
        if (item._id === id) {
          // Смена выделения
          return {
            ...item,
            selected: !item.selected
          }
        }
        // return item.selected ? {...item, selected: false} : item;
        return item
      })
    })
  }
}

export default CountriesState