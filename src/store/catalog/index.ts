import StoreModule from "../module"
import exclude from "@src/utils/exclude"
import { IIinitCatalogState, IValidParams, ISelected, IApiResponseCatalog, IParams } from "./types"

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule {
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
        sort: "order",
        query: "",
        category: "",
      },
      count: 0,
      waiting: false,
    };
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams: object = {}): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams: IValidParams = {};
    if (urlParams.has("page"))
      validParams.page = Number(urlParams.get("page")) || 1;
    if (urlParams.has("limit"))
      validParams.limit = Math.min(Number(urlParams.get("limit")) || 10, 50);
    if (urlParams.has("sort")) validParams.sort = urlParams.get("sort");
    if (urlParams.has("query")) validParams.query = urlParams.get("query");
    if (urlParams.has("category"))
      validParams.category = urlParams.get("category");
    await this.setParams(
      { ...this.initState().params, ...validParams, ...newParams },
      true
    )
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams: object = {}): Promise<void> {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const params = { ...this.initState().params, ...newParams };
    // Установка параметров и загрузка данных
    await this.setParams(params);
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
    selected: ISelected[] = []
  ): Promise<void> {
    const params: IParams = { ...this.getState().params, ...newParams }

    // Установка новых параметров и признака загрузки
    this.setState(
      {
        ...this.getState(),
        params,
        waiting: true,
      },
      "Установлены параметры каталога"
    );

    // Сохранить параметры в адрес страницы
    let urlSearch = new URLSearchParams(
      exclude(params, this.initState().params)
    ).toString();
    const url =
      window.location.pathname +
      (urlSearch ? `?${urlSearch}` : "") +
      window.location.hash;

    if (!hide) {
      if (replaceHistory) {
        window.history.replaceState({}, "", url);
      } else {
        window.history.pushState({}, "", url);
      }
    }

    const apiParams = exclude(
      {
        limit: params.limit,
        skip: (params.page - 1) * params.limit,
        fields: "items(*),count",
        sort: params.sort,
        "search[query]": params.query,
        "search[category]": params.category,
      },
      {
        skip: 0,
        "search[query]": "",
        "search[category]": "",
      }
    )

    const res: IApiResponseCatalog = await this.services.api.request({
      url: `/api/v1/articles?${new URLSearchParams(apiParams)}`,
    });

    if (selected.length > 0) {
      res.data.result.items.map((product) => {
        const filteredProduct = selected.some(
          (item) => product._id === item.id
        );

        if (filteredProduct) {
          return (product.selectedGoods = true);
        } else {
          return product;
        }
      });
    }

    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        count: res.data.result.count,
        waiting: false,
      },
      "Загружен список товаров из АПИ"
    );
  }
}

export default CatalogState;
