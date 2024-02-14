import StoreModule from "../module";
import { ICategoriesInitState, ICategoriesResponse } from "./types";


/**
 * Список категорий
 */
class CategoriesState extends StoreModule<ICategoriesInitState> {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICategoriesInitState {
    return {
      list: [],
      waiting: false
    };
  }

  /**
   * Загрузка списка товаров
   */
  async load() {
    this.setState({...this.getState(), waiting: true}, 'Ожидание загрузки категорий');

    const res = await this.services.api.request<ICategoriesResponse>({
      url: `/api/v1/categories?fields=_id,title,parent(_id)&limit=*`
    });

    // Товар загружен успешно
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      waiting: false
    }, 'Категории загружены');
  }

}

export default CategoriesState;
