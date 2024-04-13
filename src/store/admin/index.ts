import { TCatalogArticle, TCatalogEntities } from '../catalog/types';
import StoreModule from '../module';

import { TActionsWithActive, TAdminState, TCity, TNote } from './types';

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
      notes: {
        list: [
          {
            _id: '1',
            title: 'Выучить JS',
            description: 'Таким образом новая модель организационной деятельности',
          },
          {
            _id: '2',
            title: 'Выучить TS',
            description: 'Задача организации, в особенности же постоянное',
          },
          {
            _id: '3',
            title: 'Выучить React',
            description: 'Значимость этих проблем настолько очевидна',
          },
        ],
        count: 3,
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
      const limit = 30;
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
      madeIn: {
        _id: article.madeIn._id,
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
        // this.store.actions.catalog.append(res.data.result);
        this.store.actions.catalog.initParams();
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

    console.log('Получил:', JSON.parse(JSON.stringify(article)));
    try {
      const response = await this.services.api.request({
        url: `/api/v1/articles/${article._id}`,
        method: 'PUT',
        body: JSON.stringify(article),
        timeout: 5000,
      });

      if (response.status === 200) {
        // this.store.actions.catalog.edit(article._id, article);
        this.store.actions.catalog.initParams();
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

  /**
   * Удалить заметку
   */
  deleteNote(id: string) {
    const newList = this.getState().notes.list.filter((note) => note._id !== id);

    this.setState({
      ...this.getState(),
      notes: {
        ...this.getState().notes,
        list: newList,
        count: this.getState().notes.count - 1,
      },
    });
  }

  /**
   * Добавить заметку
   */
  appendNote(note: TNote) {
    this.setState({
      ...this.getState(),
      notes: {
        ...this.getState().notes,
        list: [...this.getState().notes.list, note],
        count: this.getState().notes.count + 1,
      },
    });
  }

  /**
   * Установить список заметок
   */
  setNotesList(notesList: TNote[]) {
    this.setState({
      ...this.getState(),
      notes: {
        ...this.getState().notes,
        list: notesList,
        count: notesList.length,
      },
    });
  }
}

export default AdminStore;
