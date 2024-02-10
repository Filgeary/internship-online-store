import StoreModule from '../module';
import { TCategoriesState } from './types';

/**
 * Список категорий
 */
class CategoriesState extends StoreModule<'categories'> {
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
      'Ожидание загрузки категорий'
    );

    const res = await this.services.api.request<{ items: string[] }>({
      url: `/api/v1/categories?fields=_id,title,parent(_id)&limit=*`,
    });

    // Товар загружен успешно
    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        waiting: false,
      },
      'Категории загружены'
    );
  }
}

export default CategoriesState;
