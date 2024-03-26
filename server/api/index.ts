import axios from 'axios';
import { TMethod, TParams } from '../types';

export const apiInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

type TResponse = {
  items: Array<object>;
};

class ApiService {
  /**
   * Запрос статей с заданными параметрами и методом
   */
  static async articles(params: TParams, method: TMethod): Promise<TResponse> {
    const response = await apiInstance[method]('/articles', {
      params: {
        limit: 10,
        page: params.page || 1,
        fields: 'items(*)',
        sort: params.sort || 'order',
        category: params.category || null,
        madeIn: params.countries || null,
        skip: 10 * (Number(params.page) - 1),
      },
    });
    const result = response.data.result;

    return result;
  }

  /**
   * Запрос категорий с заданными параметрами и методом
   */
  static async categories(params: TParams, method: TMethod): Promise<TResponse> {
    const response = await apiInstance[method]('/categories', {
      params: {
        fields: '_id,title,parent(_id)',
        limit: '*',
      },
    });
    const result = response.data.result;

    return result;
  }
}

export default ApiService;
