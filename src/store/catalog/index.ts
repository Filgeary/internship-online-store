import StoreModule from "../module";
import exclude from "@src/utils/exclude";
import Store from "@src/store";
import {CurrentModuleConfig} from "@src/config";
import {AllModules} from "@src/store/types";

export type TSort = 'order' | 'title.ru' | '-price' | 'edition'
export interface Params {
  page: number,
  limit: number,
  sort: TSort,
  query: string,
  category: string
}

type TCatalogConfig = CurrentModuleConfig['catalog']

/**
 * Состояние каталога - параметры фильтра и список товара
 */
class CatalogState extends StoreModule<'catalog', TCatalogConfig> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState():{
    list: any[],
    params: Params,
    count: number,
    waiting: boolean,
  } {
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
    }
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams: Params = {} as Params): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams = {} as Params;
    if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
    if (urlParams.has('limit')) validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50);
    if (urlParams.has('sort')) validParams.sort = urlParams.get('sort') as TSort;
    if (urlParams.has('query')) validParams.query = urlParams.get('query') as string;
    if (urlParams.has('category')) validParams.category = urlParams.get('category') as string;
    await this.setParams({...this.initState().params, ...validParams, ...newParams}, true);
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams: Params = {} as Params): Promise<void> {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = {...this.initState().params, ...newParams};
    // Установка параметров и загрузка данных
    await this.setParams(params);
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)4
   * @returns {Promise<void>}
   */
  async setParams(newParams: Partial<Params> = {} as Partial<Params>, replaceHistory: boolean = false): Promise<void> {
    const params = {...this.getState().params, ...newParams};

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true
    }, 'Установлены параметры каталога');

    // Копиям каталога будет запрещено изменять url
    if (this.config.entryURLParams) {
      // Сохранить параметры в адрес страницы
      let urlSearch = new URLSearchParams(exclude(params, this.initState().params)).toString();
      const url = window.location.pathname + (urlSearch ? `?${urlSearch}` : '') + window.location.hash;
      if (replaceHistory) {
        window.history.replaceState({}, '', url);
      } else {
        window.history.pushState({}, '', url);
      }
    }

    const apiParams: Record<string, string> = exclude({
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
      waiting: false
    }, 'Загружен список товаров из АПИ');
  }
}
export default CatalogState;
