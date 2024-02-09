import StoreModule from "../module";
import exclude from "../../utils/exclude";
import { CatalogArticleType, CatalogParamsType, CatalogStateType } from "./types";

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule {

  waiting: boolean;
  count: number;
  list: CatalogArticleType[];
  params: CatalogParamsType

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): CatalogStateType {
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
      waiting: false
    }
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams: CatalogParamsType): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams: CatalogParamsType;
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
   * @param [changeUrl] {Boolean} Менять параметры адресной строки браузера (true) или нет (false)
   * @return {Promise<void>}
   */
  async resetParams(newParams: CatalogParamsType | {} = {}, changeUrl: boolean = true): Promise<void> {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = {...this.initState().params, ...newParams};
    // Установка параметров и загрузка данных
    await this.setParams(params, false, changeUrl);
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)
   * @param [changeUrl] {Boolean} Заменить url адресной строки (true) или не менять адрес окна в браузере (false)
   * @returns {Promise<void>}
   */
  async setParams(
      newParams: CatalogParamsType | {} = {},
      replaceHistory: boolean = false,
      changeUrl: boolean = true
    ): Promise<void> {
    const params: CatalogParamsType = {...this.getState().params, ...newParams};

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true
    }, 'Установлены параметры каталога');

    if(changeUrl) {
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
