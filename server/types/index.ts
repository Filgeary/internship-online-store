export type TMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type TParams = {
  category: string;
  countries: string;
  sort: string;
  page: string | number;
  articleId: string;
};
