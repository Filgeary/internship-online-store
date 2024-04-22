import StoreModule from '../module'
import exclude from '@src/utils/exclude'
import {
  IIinitCatalogState,
  IValidParams,
  ISelected,
  IApiResponseCatalog,
  IParams,
  IProduct,
  IApiResponseProduct,
} from './types'

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule<IIinitCatalogState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): IIinitCatalogState {
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
    }
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams: object = {}): Promise<void> {
    let urlParams
    if (typeof window !== 'undefined') {
      urlParams = new URLSearchParams(window.location?.search)
    } else urlParams = new URLSearchParams('')

    let validParams: IValidParams = {}
    if (urlParams.has('page')) validParams.page = Number(urlParams.get('page')) || 1
    if (urlParams.has('limit'))
      validParams.limit = Math.min(Number(urlParams.get('limit')) || 10, 50)
    if (urlParams.has('sort')) validParams.sort = urlParams.get('sort')
    if (urlParams.has('query')) validParams.query = urlParams.get('query')
    if (urlParams.has('category')) validParams.category = urlParams.get('category')
    if (urlParams.has('madeIn')) validParams.madeIn = urlParams.get('madeIn')
    await this.setParams({ ...this.initState().params, ...validParams, ...newParams }, true)
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams: object = {}): Promise<void> {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = { ...this.initState().params, ...newParams }
    // Установка параметров и загрузка данных
    await this.setParams(params)
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)
   * @returns {Promise<void>}
   */
  async setParams(
    newParams: object = {},
    replaceHistory: boolean = false,
    hide = false,
    selected: ISelected[] = [],
  ): Promise<void> {
    const params: IParams = { ...this.getState().params, ...newParams }

    // Установка новых параметров
    this.setState(
      {
        ...this.getState(),
        params,
      },
      'Установлены параметры каталога',
    )

    // Сохранить параметры в адрес страницы
    let urlSearch = new URLSearchParams(exclude(params, this.initState().params) as any).toString()
    if (typeof window !== 'undefined') {
      const url =
        window?.location.pathname + (urlSearch ? `?${urlSearch}` : '') + window?.location.hash

      if (!hide) {
        if (replaceHistory) {
          window?.history.replaceState({}, '', url)
        } else {
          window?.history.pushState({}, '', url)
        }
      }
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
    )

    const res: IApiResponseCatalog = await this.services.api.request({
      url: `/api/v1/articles?${new URLSearchParams(apiParams as any)}`,
    })

    if (selected.length > 0) {
      res.data.result.items.map(product => {
        const filteredProduct = selected.some(item => product._id === item.id)

        if (filteredProduct) {
          return (product.selectedGoods = true)
        } else {
          return product
        }
      })
    }

    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        count: res.data.result.count,
        waiting: false,
      },
      'Загружен список товаров из АПИ',
    )
  }

  /**
   * Редактирование товара
   */
  async productEditing(product: IProduct) {
    
    const res: IApiResponseProduct = await this.services.api.request({
      url: `/api/v1/articles/${product.id}?fields=*&lang=ru`,
      method: 'PUT',
      body: JSON.stringify({
        order: 8,
        isDeleted: true,
        proto: {},
        name: 'string',
        title: product.title,
        description: product.description,
        price: product.price,
        madeIn: {
          _id: '65f8321bf3360f03347a60b1',
          _type: 'country',
        },
        edition: 2012,
        photo: {},
        category: {
          _id: '65f8322bf3360f03347a6bd5',
          _type: 'category',
        },
        favorites: [],
      }),
    })
    const index = this.getState().list.findIndex((item) => item._id === product.id)

    const copyList = this.getState().list

    if(index !== -1) copyList[index] = res.data.result

    this.setState(
      {
        ...this.getState(),
        list: copyList
      },
      'Товар отредактирован',
    )
  }
}

export default CatalogState
