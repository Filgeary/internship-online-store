import type { TMethod, TParams } from '../types';
import ApiService from '../api';

async function catalogController(params: TParams, method: TMethod) {
  const result = await ApiService.articles(params, method);

  return {
    catalog: {
      list: result.items,
      count: result.items.length,
    },
  };
}

export default catalogController;
