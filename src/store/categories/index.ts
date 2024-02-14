import StoreModule from "../module";
import { InitialStateCategories, ResponseDataCategories } from "./type";


/**
 * Список категорий
 */
class CategoriesState extends StoreModule<InitialStateCategories> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): InitialStateCategories {
    return {
      list: [],
      waiting: false,
    };
  }

  /**
   * Загрузка списка товаров
   */
  async load() {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки категорий"
    );

    const res = await this.services.api.request<ResponseDataCategories>({
      url: `/api/v1/categories?fields=_id,title,parent(_id)&limit=*`,
    });

    if (res.status === 200) {
      // Товар загружен успешно
      this.setState(
        {
          ...this.getState(),
          list: res.data.result.items,
          waiting: false,
        },
        "Категории загружены"
      );
    }
  }
}

export default CategoriesState;
