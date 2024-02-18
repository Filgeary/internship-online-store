import StoreModule from "../module";
import type { CategoriesConfig, CategoriesState, ICategoryResponse } from "./types";

/**
 * Список категорий
 */
class CategoriesModule extends StoreModule<CategoriesState, CategoriesConfig> {    
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): CategoriesState {
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

export default CategoriesModule;
