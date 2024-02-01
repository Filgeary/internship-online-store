import StoreModule from "../module";


/**
 * Список категорий
 */
class CategoriesState extends StoreModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
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

    const res = await this.store.actions.categories.getCategories()

    // Товар загружен успешно
    this.setState({
      ...this.getState(),
      list: res.items,
      waiting: false
    }, 'Категории загружены');
  }

  /**
   * Отдельно подгрузка категорий
   * @description Разделение этой части логики позволяет подгружать данные для других компонентов где требуется подгрузить список категорий, не затрагивая при этом CategoriesState
   * @return {Object}
   * */
  async getCategories() {
    const res =  await this.services.api.request({
      url: `/api/v1/categories?fields=_id,title,parent(_id)&limit=*`
    });
    return res.data.result;
  }

}

export default CategoriesState;
