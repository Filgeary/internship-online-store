import StoreModule from "../module";

type InitialCategoriesState = {
  list: any[];
  waiting: boolean;
}

/**
 * Список категорий
 */
class CategoriesState extends StoreModule<InitialCategoriesState> {
  initState(): InitialCategoriesState {
    return {
      list: [],
      waiting: false
    };
  }

  /**
   * Загрузка списка товаров
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, 'Ожидание загрузки категорий');

    const res = await this.services.api.request({
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
