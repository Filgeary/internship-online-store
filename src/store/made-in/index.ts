import StoreModule from "../module";
import type { MadeInConfig, MadeInState, IMadeInResponse } from "./types";

/**
 * Список стран изготовителей
 */
class MadeInModule extends StoreModule<MadeInState, MadeInConfig> {    
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): MadeInState {
    return {
      list: [],
      waiting: false
    };
  }

  /**
   * Загрузка списка стран изготовителей
   */
  async load(): Promise<void> {
    this.setState({...this.getState(), waiting: true}, 'Ожидание загрузки стран изготовления');

    const res = await this.services.api.request<{items: IMadeInResponse[]}>({
      url: `api/v1/countries?lang=ru&limit=*&skip=0&fields=_id,_key,code,title`
    });

    // Стран изготовители загружены успешно
    this.setState({
      ...this.getState(),
      list: res.data.result.items.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        }
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        }
        return 0;
      }),
      waiting: false
    }, 'Стран изготовители загружены');
  }

}

export default MadeInModule;
