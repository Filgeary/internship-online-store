import type { TMethod, TParams } from '../types';
import ApiService from '../api';

async function categoriesController(params: TParams, method: TMethod) {
  const result = await ApiService.categories(params, method);

  return {
    categories: {
      list: result.items,
    },
  };
}

export default categoriesController;
