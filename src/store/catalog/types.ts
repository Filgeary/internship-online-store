export interface ICatalogInitState {
  list: Array<Record<string, unknown>>;
  params: {
    page: number;
    limit: number;
    sort: 'order' | 'title.ru' | '-price' | 'edition';
    query: string;
    category: string;
  };
  isInitParams: boolean;
  lock: boolean;
  count: number;
  waiting: boolean;
}
