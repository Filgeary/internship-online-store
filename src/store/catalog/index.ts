import StoreModule from "../module";
import exclude from "@src/utils/exclude";
import { ESort}  from "./types";
import type { IArticleResponse, ICatalogState, IQueryParams } from "./types";
import type Store from "..";

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule<ICatalogState> {
  constructor(...params: [Store, string, any]) {
    super(...params)
    if (typeof params[2].urlEditing === 'undefined') {
      this.config.urlEditing = true 
    }
  }

  // /**
  //  * Начальное состояние
  //  * @return {Object}
  //  */
  initState() {
    return {
      list: [],
      params: {
        page: 1,
        limit: 10,
        sort: ESort.order,
        query: '',
        category: '',
      },
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
  async initParams(newParams: Partial<IQueryParams> = {}): Promise<void> {
    if (this.config.urlEditing) {
      const urlParams = new URLSearchParams(window.location.search);
      let validParams: Partial<IQueryParams> = {};
      if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
      if (urlParams.has('limit')) validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50);
      if (urlParams.has('sort')) validParams.sort = String(urlParams.get('sort')) as ESort;
      if (urlParams.has('query')) validParams.query = String(urlParams.get('query'));
      if (urlParams.has('category')) validParams.category = String(urlParams.get('category'));
      await this.setParams({...this.initState().params, ...validParams, ...newParams}, true);
    } else {
      await this.setParams({...this.initState().params});
    }
  }
   

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams: Partial<IQueryParams> = {}): Promise<void> {
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
  async setParams(newParams: Partial<IQueryParams> = {}, replaceHistory: boolean = false): Promise<void> {
    const params = {...this.getState().params, ...newParams};
    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true
    }, 'Установлены параметры каталога');

    if (this.config.urlEditing) {
      // Сохранить параметры в адрес страницы
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

    const res = await this.services.api.request<{items: IArticleResponse[], count: number}>({url: `/api/v1/articles?${new URLSearchParams(apiParams)}`});
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      count: res.data.result.count,
      waiting: false
    }, 'Загружен список товаров из АПИ');
  }
}

export default CatalogState;
