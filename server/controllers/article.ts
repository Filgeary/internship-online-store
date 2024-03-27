import type { TMethod, TParams } from '../types';
import ApiService from '../api';

async function articleController(params: TParams, method: TMethod) {
  const result = await ApiService.singleArticle(params, method);

  return {
    article: {
      data: result,
    },
  };
}

export default articleController;
