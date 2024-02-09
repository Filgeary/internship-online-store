import StoreModule from "../module";
import exclude from "@src/utils/exclude";
import shallowequal from "shallowequal";
import { ICatalogInitState } from "./types";

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICatalogInitState {
    return {
      list: [],
      params: {
        page: 1,
        limit: 10,
        sort: 'order',
        query: '',
        category: ''
      },
      isInitParams: true, // Нужно, чтобы дизэйблить кнопку `Сбросить`
      lock: false, // Нужно, чтобы "Сбросить" уже после завершения загрузки с сервера
      count: 0,
      waiting: false
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
    let validParams: Record<string, unknown> = {};
    if (this.name === 'catalog') { // только для компонента 'catalog', не для его форков
      if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
      if (urlParams.has('limit')) validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50);
      if (urlParams.has('sort')) validParams.sort = urlParams.get('sort');
      if (urlParams.has('query')) validParams.query = urlParams.get('query');
      if (urlParams.has('category')) validParams.category = urlParams.get('category');
    }
    await this.setParams({...this.initState().params, ...validParams, ...newParams}, true);
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams = {}) {
    // Ожидаем завершения загрузки
    let lock = this.getState().lock;
    let i = 0;
    while (lock && i < 1000) {
      await new Promise(resolve => setTimeout(() => resolve(null), 100));
      lock = this.getState().lock;
      i++;
    }
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = {...this.initState().params, ...newParams};
    // Установка параметров и загрузка данных
    await this.setParams(params);
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)
   * @returns {Promise<void>}
   */
  async setParams(newParams = {}, replaceHistory = false) {
    const params = {...this.getState().params, ...newParams};

    const isInitParams = shallowequal(params, this.initState().params);

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true,
      isInitParams,
      lock: true,
    }, 'Установлены параметры каталога');

    // Сохранить параметры в адрес страницы
    if (this.name === 'catalog') { // только для компонента 'catalog', не для его форков
      let urlSearch = new URLSearchParams(exclude(params, this.initState().params)).toString();
      const url = window.location.pathname + (urlSearch ? `?${urlSearch}`: '') + window.location.hash;
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

    const res = await this.services.api.request({url: `/api/v1/articles?${new URLSearchParams(apiParams)}`});
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      count: res.data.result.count,
      waiting: false,
      lock: false,
    }, 'Загружен список товаров из АПИ');
  }
}

export default CatalogState;
