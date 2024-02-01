import StoreModule from "../module";
import exclude from "@src/utils/exclude";

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      list: [],
      params: {
        page: 1,
        limit: 10,
        sort: 'order',
        query: '',
        category: ''
      },
      count: 0,
      waiting: false,
      queries: [],
    }
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams = {}) {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams = {};
    if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
    if (urlParams.has('limit')) validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50);
    if (urlParams.has('sort')) validParams.sort = urlParams.get('sort');
    if (urlParams.has('query')) validParams.query = urlParams.get('query');
    if (urlParams.has('category')) validParams.category = urlParams.get('category');
    await this.setParams({...this.initState().params, ...validParams, ...newParams}, true);
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams = {}) {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = {...this.initState().params, ...newParams};
    // Установка параметров и загрузка данных
    await this.setParams(params);
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)
   * @param [ignoreHistory] {Boolean} Нужно ли записывать стейт в window.history
   * @returns {Promise<void>}
   */
  async setParams(newParams = {}, replaceHistory = false, ignoreHistory = false) {
    const params = {...this.getState().params, ...newParams};

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true
    }, 'Установлены параметры каталога');

    // Сохранить параметры в адрес страницы
    let urlSearch = new URLSearchParams(exclude(params, this.initState().params)).toString();
    const url = window.location.pathname + (urlSearch ? `?${urlSearch}`: '') + window.location.hash;

    if (!ignoreHistory) {
      if (replaceHistory) {
        window.history.replaceState({}, '', url);
      } else {
        window.history.pushState({}, '', url);
      }
    }

    const apiParams = exclude({
      limit: params.limit,
      skip: (params.page - 1) * params.limit,
      fields: 'items(*),count',
      sort: params.sort,
      'search[query]': params.query,
      'search[category]': params.category
    }, {
      skip: 0,
      'search[query]': '',
      'search[category]': ''
    });

    let res = null;
    try {
      res = await this.services.api.request({url: `/api/v1/articles?${new URLSearchParams(apiParams)}`, timeout: 5000});
    } catch (err) {
      alert(err.message);
      return;
    }

    const newState = {
      ...this.getState(),
      list: res.data.result.items,
      count: res.data.result.count,
      waiting: false
    };

    this.setState(newState, 'Загружен список товаров из АПИ');
  }

  /**
   * Очистить список состояний
   * @param [clearBy] {Number} Насколько очистить
   */
  undoBy(clearBy = 1) {
    this.setState({
      ...this.getState(),
      queries: this.getState().queries.slice(0, clearBy),
    });
  }

  /**
   * Очистить список состояний
   */
  clearQueries() {
    const firstQuery = this.getState().queries[0];

    this.setState({
      ...this.getState(),
      queries: [],
    }, 'Очищен список состояний');

    // this.setParams(firstQuery);
    this.setState({
      ...this.getState(),
      ...firstQuery
    });
  }

  /**
   * Увеличить количество товара в корзине
   * @param item
   */
  incrementCount(item) {
    const list = this.getState().list.map((elem) => {
      if (elem._id === item._id) {
        return { ...elem, count: elem.count ? elem.count + 1 : 1 };
      }
      
      return elem;
    });

    this.setState({
      ...this.getState(),
      list,
    });
  }
}

export default CatalogState;
