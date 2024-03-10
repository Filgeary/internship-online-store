import StoreModule from "../module";
import {Tree} from "@src/utils/list-to-tree";
import {TCategoryData} from "../../../types/Response";

type TCategoriesState = {
  list: Tree[],
  waiting: boolean
}

/**
 * Список категорий
 */
class CategoriesState extends StoreModule<TCategoriesState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): TCategoriesState {
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

    const res: TCategoryData = await this.services.api.request({
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
