import StoreModule from "../module";
import type { ICategoriesState, ICategoryResponse } from "./types";

/**
 * Список категорий
 */
class CategoriesState extends StoreModule<ICategoriesState> {    
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICategoriesState {
    return {
      list: [],
      waiting: false
    };
  }

  /**
   * Загрузка списка товаров
   */
  async load(): Promise<void> {
    this.setState({...this.getState(), waiting: true}, 'Ожидание загрузки категорий');

    const res = await this.services.api.request<{items: ICategoryResponse[]}>({
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
