import StoreModule from "../module";
import exclude from "@src/utils/exclude";
import { ICatalogConfig, ICatalogInitState, ICatalogResponseApi, ICatalogStateValidParams } from "./types";

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule<ICatalogInitState, ICatalogConfig> {

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
        category: '',
        madeIn: '',
      },
      count: 0,
      waiting: false
    }
  }

  initConfig(): ICatalogConfig {
    return {
      readParams: false,
      saveParams: false
    }
  }

  /**
   * Смена ожидания
   * @param [waiting] {Boolean}
   */
  setWaiting(waiting: boolean) {
    this.setState({
      ...this.getState(),
      waiting
    }, "Смена состояния ожидания");
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams = {}) {
    let validParams = {} as ICatalogStateValidParams;
    if (this.config.readParams !== false) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
      if (urlParams.has('limit')) validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50);
      if (urlParams.has('sort')) validParams.sort = urlParams.get('sort') ?? '';
      if (urlParams.has('query')) validParams.query = urlParams.get('query') ?? '';
      if (urlParams.has('category')) validParams.category = urlParams.get('category') ?? '';
      if (urlParams.has('madeIn')) validParams.madeIn = urlParams.get('madeIn') ?? '';
    }
    console.log(validParams);
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
   * @returns {Promise<void>}
   */
  async setParams(newParams: Partial<ICatalogStateValidParams> = {}, replaceHistory = false) {
    const params = {...this.getState().params, ...newParams};

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params,
      waiting: true
    }, 'Установлены параметры каталога');

    // Сохранить параметры в адрес страницы
    if (this.config.saveParams !== false) {
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
      'search[category]': params.category,
      'search[madeIn]': params.madeIn
    }, {
      skip: 0,
      'search[query]': '',
      'search[category]': '',
      'search[madeIn]': ''
    });

    const res = await this.services.api.request<ICatalogResponseApi>({url: `/api/v1/articles?${new URLSearchParams(apiParams)}`});
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      count: res.data.result.count,
      waiting: false
    }, 'Загружен список товаров из АПИ');
  }
}

export default CatalogState;
