import { isSuccessResponse } from '@src/api';
import exclude from '@src/utils/exclude';
import StoreModule from '../module';

import type { IArticle, IArticles } from '@src/types/IArticle';

type InitialCatalogState = {
  list: IArticle[];
  params: {
    page: number;
    limit: number;
    sort: string;
    query: string;
    category: string;
    madeIn: string;
  };
  count: number;
  waiting: boolean;
};

type CatalogConfig = {
  shouldWriteToBrowserHistory: boolean;
};

/**
 * Состояние каталога - параметры фильтра и список товара
 */
class CatalogState extends StoreModule<InitialCatalogState, CatalogConfig> {
  initState(): InitialCatalogState {
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
      waiting: false,
    };
  }

  initConfig(): CatalogConfig {
    return {} as CatalogConfig;
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   */
  async initParams(newParams: InitialCatalogState['params'] | object = {}) {
    const shouldWriteToBrowserHistory =
      this.name !== 'catalog' ? this.config.shouldWriteToBrowserHistory : true;

    const urlParams = new URLSearchParams(
      shouldWriteToBrowserHistory ? window.location.search : '',
    );
    const validParams = {} as InitialCatalogState['params'];
    if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1;
    if (urlParams.has('limit'))
      validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50);
    if (urlParams.has('sort')) validParams.sort = urlParams.get('sort') || '';
    if (urlParams.has('query')) validParams.query = urlParams.get('query') || '';
    if (urlParams.has('category')) validParams.category = urlParams.get('category') || '';
    if (urlParams.has('madeIn')) validParams.madeIn = urlParams.get('madeIn') || '';
    await this.setParams({ ...this.initState().params, ...validParams, ...newParams }, true);
  }

  /**
   * Сброс параметров к начальным
   */
  async resetParams(newParams: InitialCatalogState['params'] | object = {}) {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = { ...this.initState().params, ...newParams };
    // Установка параметров и загрузка данных
    await this.setParams(params);
  }

  /**
   * Установка параметров и загрузка списка товаров
   */
  async setParams(newParams: InitialCatalogState['params'] | object = {}, replaceHistory = false) {
    const shouldWriteToBrowserHistory =
      this.name !== 'catalog' ? this.config.shouldWriteToBrowserHistory : true;
    const params = { ...this.getState().params, ...newParams };

    // Установка новых параметров и признака загрузки
    this.setState(
      {
        ...this.getState(),
        params,
        waiting: true,
      },
      'Установлены параметры каталога',
    );

    // Сохранить параметры в адрес страницы
    const urlSearch = new URLSearchParams(exclude(params, this.initState().params)).toString();
    let url;

    if (shouldWriteToBrowserHistory) {
      url = window.location.pathname + (urlSearch ? `?${urlSearch}` : '') + window.location.hash;

      if (replaceHistory) {
        window.history.replaceState({}, '', url);
      } else {
        window.history.pushState({}, '', url);
      }
    } else {
      url = `?${urlSearch}`;
    }

    const apiParams = exclude(
      {
        limit: params.limit,
        skip: (params.page - 1) * params.limit,
        fields: 'items(*),count',
        sort: params.sort,
        'search[query]': params.query,
        'search[category]': params.category,
        'search[madeIn]': params.madeIn,
      },
      {
        skip: 0,
        'search[query]': '',
        'search[category]': '',
        'search[madeIn]': '',
      },
    );

    const res = await this.services.api.request<IArticles>({
      url: `/api/v1/articles?${new URLSearchParams(apiParams)}`,
    });

    if (isSuccessResponse(res.data)) {
      this.setState(
        {
          ...this.getState(),
          list: res.data.result.items,
          count: res.data.result.count,
          waiting: false,
        },
        'Загружен список товаров из АПИ',
      );
    }
  }
}

export default CatalogState;
