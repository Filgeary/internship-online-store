import { TCatalogArticle, TCatalogEntities } from '../catalog/types';
import StoreModule from '../module';

import { TActionsWithActive, TAdminState, TCity } from './types';

class AdminStore extends StoreModule<TAdminState> {
  initState(): TAdminState {
    return {
      articles: {
        fetching: false,
        active: null,
        actionWithActive: '',
        list: [],
        count: 0,
        activeFetching: false,
      },
      cities: {
        fetching: false,
        active: null,
        actionWithActive: '',
        list: [],
        count: 0,
        activeFetching: false,
      },
    };
  }

  /**
   * Объединённый метод для удобного внешнего использования
   */
  async fetchEntities(entityStr: TCatalogEntities) {
    switch (entityStr) {
      case 'articles':
        return this.fetchAllArticles();
      case 'cities':
        return this.fetchAllCities();
    }
  }

  /**
   * Запросить все товары
   */
  async fetchAllArticles() {
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        fetching: true,
      },
    });

    try {
      const limit = '*';
      const res = await this.services.api.request<{
        items: TArticle[];
        count: number;
      }>({
        url: `/api/v1/articles?limit=${limit}&fields=items(_id, title, price, category(_id, title)),count`,
        timeout: 5000,
      });
      this.setState({
        ...this.getState(),
        articles: {
          ...this.getState().articles,
          list: res.data.result.items,
          count: res.data.result.count,
        },
      });
    } catch (err) {
      alert(err.message);
    } finally {
      this.setState({
        ...this.getState(),
        articles: {
          ...this.getState().articles,
          fetching: false,
        },
      });
    }
  }

  /**
   * Запросить все города из апи
   */
  async fetchAllCities() {
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        fetching: true,
      },
    });

    try {
      const limit = 100;
      const res = await this.services.api.request<{
        items: any[];
        count: number;
      }>({
        url: `/api/v1/cities?limit=${limit}&fields=items(_id, title, population),count`,
        timeout: 5000,
      });
      this.setState({
        ...this.getState(),
        cities: {
          ...this.getState().cities,
          list: res.data.result.items,
          count: res.data.result.count,
        },
      });
    } catch (err) {
      alert(err.message);
    } finally {
      this.setState({
        ...this.getState(),
        cities: {
          ...this.getState().cities,
          fetching: false,
        },
      });
    }
  }

  /**
   * Добавить товар в БД
   */
  async addArticle(article: TCatalogArticle) {
    const extendedArticle = {
      ...article,
      name: `article-test-${crypto.randomUUID()}`,
      category: {
        _id: article.category._id,
        _type: 'category',
      },
    };

    try {
      const res = await this.services.api.request<TCatalogArticle>({
        url: `/api/v1/articles`,
        method: 'POST',
        timeout: 5000,
        body: JSON.stringify(extendedArticle),
      });

      if (res.status === 200) {
        this.store.actions.catalog.append(res.data.result);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Удалить товар из БД
   */
  async removeArticle(id: string) {
    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${id}`,
        method: 'DELETE',
        timeout: 5000,
      });

      if (res.status === 403) {
        throw new Error('Недостаточно прав!');
      }

      if (res.status === 200) {
        this.store.actions.catalog.remove(id);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Добавить город в БД
   */
  async addCity(city: TCity) {
    try {
      const res = await this.services.api.request<TCity>({
        url: `/api/v1/cities`,
        method: 'POST',
        timeout: 5000,
        body: JSON.stringify(city),
      });

      if (res.status === 200) {
        this.store.actions.catalog.append(res.data.result);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Удалить город из БД
   */
  async removeCity(id: string) {
    try {
      const res = await this.services.api.request({
        url: `/api/v1/cities/${id}`,
        method: 'DELETE',
        timeout: 5000,
      });

      if (res.status === 403) {
        throw new Error('Недостаточно прав!');
      }

      if (res.status === 200) {
        this.store.actions.catalog.remove(id);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Установить активный товар
   */
  async setActiveArticle(id: string, action: TActionsWithActive = '') {
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        active: id,
        actionWithActive: action,
      },
    });
  }

  /**
   * Изменить товар
   */
  async editArticle(article: TCatalogArticle) {
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        activeFetching: true,
      },
    });

    console.log('Получил:', article);
    try {
      const response = await this.services.api.request({
        url: `/api/v1/articles/${article._id}`,
        method: 'PUT',
        body: JSON.stringify(article),
        timeout: 5000,
      });

      if (response.status === 200) {
        this.store.actions.catalog.edit(article._id, article);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      this.setState({
        ...this.getState(),
        articles: {
          ...this.getState().articles,
          activeFetching: false,
        },
      });
    }
  }

  /**
   * Изменить город
   */
  async editCity(city: TCity) {
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        activeFetching: true,
      },
    });

    console.log('Получил:', city);
    try {
      const response = await this.services.api.request({
        url: `/api/v1/cities/${city._id}`,
        method: 'PUT',
        body: JSON.stringify(city),
        timeout: 5000,
      });

      if (response.status === 200) {
        this.store.actions.catalog.edit(city._id, city);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      this.setState({
        ...this.getState(),
        cities: {
          ...this.getState().cities,
          activeFetching: false,
        },
      });
    }
  }

  /**
   * Установить активный город
   */
  async setActiveCity(id: string, action: TActionsWithActive = '') {
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        active: id,
        actionWithActive: action,
      },
    });
  }
}

export default AdminStore;
