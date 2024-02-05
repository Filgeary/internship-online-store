import StoreModule from "../module";


/**
 * Список категорий
 */
class CategoriesState extends StoreModule {

  constructor(...params) {
    super(...params)
    this.subscriptions = [this.services.i18n.subscribe(() => this.load())]
  }

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
