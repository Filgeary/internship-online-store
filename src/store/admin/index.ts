import { TCatalogArticle } from '../catalog/types';
import StoreModule from '../module';

import { TAdminState, TCity } from './types';

class AdminStore extends StoreModule<TAdminState> {
  initState(): TAdminState {
    return {
      articles: {
        list: [],
        fetching: false,
        count: 0,
        limit: 5,
        page: 1,
        active: null,
        activeFetching: false,
      },
      cities: {
        list: [],
        fetching: false,
        count: 0,
        limit: 5,
        page: 1,
        active: null,
        activeFetching: false,
      },
    };
  }

  /**
   * Запрос товаров из апи
   */
  async fetchArticles() {
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        fetching: true,
      },
    });

    try {
      const { limit, page } = this.getState().articles;
      const skip = (page - 1) * limit;
      const res = await this.services.api.request<{
        items: TArticle[];
        count: number;
      }>({
        url: `/api/v1/articles?limit=${limit}&skip=${skip}&fields=items(_id, title, price, category(_id, title)),count`,
        timeout: 5000,
      });
      const newState = {
        ...this.getState(),
        articles: {
          ...this.getState().articles,
          list: res.data.result.items,
          count: res.data.result.count,
        },
      };

      this.setState(newState, 'Загружен список товаров из АПИ для админки');
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
      const limit = 100;
      const res = await this.services.api.request<{
        items: TArticle[];
        count: number;
      }>({
        url: `/api/v1/articles?limit=${limit}&fields=items(_id, title, price, category(_id, title)),count`,
        timeout: 5000,
      });
      const newState = {
        ...this.getState(),
        articles: {
          ...this.getState().articles,
          list: res.data.result.items,
          count: res.data.result.count,
        },
      };

      this.setState(newState, 'Загружен список товаров из АПИ для админки');
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
   * Запрос городов из апи
   */
  async fetchCities() {
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        fetching: true,
      },
    });

    try {
      const { limit, page } = this.getState().cities;
      const skip = (page - 1) * limit;
      const res = await this.services.api.request<{
        items: any[];
        count: number;
      }>({
        url: `/api/v1/cities?limit=${limit}&skip=${skip}&fields=items(_id, title, population),count`,
        timeout: 5000,
      });
      const newState = {
        ...this.getState(),
        cities: {
          ...this.getState().cities,
          list: res.data.result.items,
          count: res.data.result.count,
        },
      };

      this.setState(newState, 'Загружен список городов из АПИ для админки');
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
      const newState = {
        ...this.getState(),
        cities: {
          ...this.getState().cities,
          list: res.data.result.items,
          count: res.data.result.count,
        },
      };

      this.setState(newState, 'Загружен список городов из АПИ для админки');
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
        _id: article.category,
        _type: 'category',
      },
    };

    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles`,
        method: 'POST',
        timeout: 5000,
        body: JSON.stringify(extendedArticle),
      });
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Удалить товар из БД
   */
  async removeArticle(id: string) {
    try {
      const response = await this.services.api.request({
        url: `/api/v1/articles/${id}`,
        method: 'DELETE',
        timeout: 5000,
      });

      if (response.status === 200) {
        this.setState({
          ...this.getState(),
          articles: {
            ...this.getState().articles,
            list: this.getState().articles.list.filter((article) => article._id !== id),
            count: this.getState().articles.count - 1,
          },
        });
      }
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Добавить город в БД
   */
  async addCity(city: TCity) {
    console.log('Добавляю в БД:', city);

    try {
      const res = await this.services.api.request({
        url: `/api/v1/cities`,
        method: 'POST',
        timeout: 5000,
        body: JSON.stringify(city),
      });
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Удалить город из БД
   */
  async removeCity(id: string) {
    try {
      const response = await this.services.api.request({
        url: `/api/v1/cities/${id}`,
        method: 'DELETE',
        timeout: 5000,
      });

      if (response.status === 200) {
        this.setState({
          ...this.getState(),
          cities: {
            ...this.getState().cities,
            list: this.getState().cities.list.filter((city) => city._id !== id),
            count: this.getState().cities.count - 1,
          },
        });
      }
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Установить активный товар
   */
  async setActiveArticle(id: string) {
    console.log('Делаю товар активным:', id);
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        active: id,
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
        this.setState({
          ...this.getState(),
          articles: {
            ...this.getState().articles,
            list: this.getState().articles.list.map((existArticle) => {
              if (existArticle._id === article._id) {
                return article;
              }

              return existArticle;
            }),
          },
        });
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
        this.setState({
          ...this.getState(),
          cities: {
            ...this.getState().cities,
            list: this.getState().cities.list.map((existCity) => {
              if (existCity._id === city._id) {
                return city;
              }

              return existCity;
            }),
          },
        });
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
  async setActiveCity(id: string) {
    console.log('Делаю город активным:', id);
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        active: id,
      },
    });
  }

  /**
   * Установить страницу товаров
   */
  setArticlesPage(page: number) {
    console.log('Поставлю текущую страницу товаров:', page);
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        page,
      },
    });
  }

  /**
   * Установить страницу городов
   */
  setCitiesPage(page: number) {
    console.log('Поставлю текущую страницу городов:', page);
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        page,
      },
    });
  }

  /**
   * Установить лимит товаров на одной странице
   */
  setArticlesLimit(pageSize: number) {
    this.setState({
      ...this.getState(),
      articles: {
        ...this.getState().articles,
        limit: pageSize,
      },
    });
  }

  /**
   * Установить лимит товаров на одной странице
   */
  setCitiesLimit(pageSize: number) {
    this.setState({
      ...this.getState(),
      cities: {
        ...this.getState().cities,
        limit: pageSize,
      },
    });
  }
}

export default AdminStore;
