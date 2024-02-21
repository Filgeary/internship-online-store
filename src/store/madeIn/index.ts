import StoreModule from "../module";

export type TMadeInList = {
  title: string;
  _id: string;
  code:string;

};

export type TMadeInState = {
  list: TMadeInList[];
  waiting: boolean;
};
/**
 * Список стран
 */
class MadeInState extends StoreModule<TMadeInState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): TMadeInState {
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

export default MadeInState;
