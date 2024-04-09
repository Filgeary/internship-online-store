import { TCatalogArticle } from '../catalog/types';
import StoreModule from '../module';

import { TAdminState } from './types';

class AdminStore extends StoreModule<TAdminState> {
  initState(): TAdminState {
    return {
      articles: {
        list: [],
        count: 0,
        active: null,
        activeFetching: false,
      },
      cities: {
        list: [],
        count: 0,
        active: null,
        activeFetching: false,
      },
    };
  }

  /**
   * Запрос товаров из апи
   */
  async fetchArticles() {
    try {
      const res = await this.services.api.request<{
        items: TArticle[];
        count: number;
      }>({
        url: `/api/v1/articles?limit=10&fields=items(_id, title, price)`,
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
    }
  }

  /**
   * Запрос городов из апи
   */
  async fetchCities() {
    try {
      const res = await this.services.api.request<{
        items: any[];
        count: number;
      }>({
        url: `/api/v1/cities?limit=10&fields=items(_id, title, population)`,
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

      this.setState(newState, 'Загружен список товаров из АПИ для админки');
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Удалить товар из апи
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
   * Удалить город из апи
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
}

export default AdminStore;
