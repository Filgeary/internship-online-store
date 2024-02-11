import StoreModule from "../module";

export type TCategoryList = {
  title: string;
  _id: string;
};

export type TCategoriesState = {
  list: TCategoryList[];
  waiting: boolean;
};
/**
 * Список категорий
 */
class CategoriesState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): TCategoriesState {
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

    const res = await this.services.api.request({
      url: `/api/v1/categories?fields=_id,title,parent(_id)&limit=*`,
    });

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

export default CategoriesState;
