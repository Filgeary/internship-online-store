// eslint-disable-next-line import/no-cycle
import StoreModule from '../module';
import { type ICountriesInitState } from './types';

const firstItem = {
  code: null,
  order: 0,
  title: 'Все',
  _id: '0',
};

/**
 * Список стран
 */
class CountriesState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICountriesInitState {
    return {
      list: [firstItem],
      selected: [firstItem._id],
      waiting: false,
    };
  }

  /**
   * Загрузка списка стран
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, 'Ожидание загрузки списка стран');

    const res = await this.services.api.request({
      url: `/api/v1/countries?fields=_id,title,code,order&limit=*`,
    });

    // Товар загружен успешно
    this.setState(
      {
        ...this.getState(),
        list: [firstItem, ...res.data.result.items],
        selected: [firstItem._id],
        waiting: false,
      },
      'Список стран загружен'
    );
  }

  // Добавляет или снимает выделение с итемов (если они были выделены ранее)
  // TODO: типизировать items, написать док комменты
  select(items: any) {
    const itemsIdArray = items instanceof Array ? items : [items];
    const removeFromSelected = [];
    const addToSelected = [];
    itemsIdArray.forEach((id) => {
      if (this.getState().selected.includes(id)) removeFromSelected.push(id);
      else addToSelected.push(id);
    });

    const newSelected = this.getState().selected.filter((id) => !removeFromSelected.find((itemId) => id === itemId));

    this.setState(
      {
        ...this.getState(),
        selected: [...newSelected, ...addToSelected],
      },
      'Выделены страны'
    );
  }

  // Добавляет или снимает выделение с итема
  // TODO: типизировать item, написать док комменты
  selectOne(itemId: string) {
    let newSelectedId;
    if (this.getState().selected.includes(itemId)) newSelectedId = firstItem._id;
    else newSelectedId = itemId;

    this.setState(
      {
        ...this.getState(),
        selected: [newSelectedId],
      },
      'Выделены страны'
    );
  }

  deselectAll() {
    this.setState(
      {
        ...this.getState(),
        selected: [firstItem._id],
      },
      'Выделение со стран снято'
    );
  }
}

export default CountriesState;
