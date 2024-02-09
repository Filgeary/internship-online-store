import StoreModule from "../module";
import exclude from "@src/utils/exclude";
import type { InitialStateCatalog, Params, ResponseCatalog } from "./type";

/**
 * Состояние каталога - параметры фильтра исписок товара
 */
class CatalogState extends StoreModule<"catalog"> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): InitialStateCatalog {
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
      selected: [],
      waiting: false,
    };
  }

  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams: Partial<Params> = {}): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams: Partial<Params> = {};

    if (!this.config.ignoreURL) {
      if (urlParams.has("page"))
        validParams.page = Number(urlParams.get("page")) || 1;
      if (urlParams.has("limit"))
        validParams.limit = Math.min(Number(urlParams.get("limit")) || 10, 50);
      if (urlParams.has("sort"))
        validParams.sort = urlParams.get("sort") || undefined;
      if (urlParams.has("query"))
        validParams.query = urlParams.get("query") || undefined;
      if (urlParams.has("category"))
        validParams.category = urlParams.get("category") || undefined;
    }
    await this.setParams(
      { ...this.initState().params, ...validParams, ...newParams },
      true
    );
  }

  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams: Partial<Params> = {}): Promise<void> {
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
  async setParams(newParams: Partial<Params> = {}, replaceHistory: boolean = false): Promise<void> {
    const params = { ...this.getState().params, ...newParams };

    // Установка новых параметров и признака загрузки
    this.setState(
      {
        ...this.getState(),
        params,
        waiting: true,
      },
      "Установлены параметры каталога"
    );
    if (!this.config.ignoreURL) {
      // Сохранить параметры в адрес страницы
      let urlSearch = new URLSearchParams(
        exclude(params, this.initState().params)
      ).toString();
      const url =
        window.location.pathname +
        (urlSearch ? `?${urlSearch}` : "") +
        window.location.hash;
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
    );

    const res = await this.services.api.request<ResponseCatalog>({
      url: `/api/v1/articles?${new URLSearchParams(apiParams)}`,
    });

    if (res.status === 200) {
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

  /**
   * Выделение записи по id
   * @param _id
   */
  selectItem(_id: string) {
    const exist = this.getState().selected.includes(_id);
    if (!exist) {
      this.setState(
        {
          ...this.getState(),
          selected: [...this.getState().selected, _id],
        },
        "Выделение товара"
      );
    } else {
      const selectedItems = this.getState().selected.filter(
        (item: string) => item !== _id
      );
      this.setState(
        {
          ...this.getState(),
          selected: selectedItems,
        },
        "Выделение с товара снято"
      );
    }
  }

  resetSelectedItems() {
    this.setState(
      { ...this.getState(), selected: [] },
      "Сброс выбранных товаров"
    );
  }
}

export default CatalogState;
