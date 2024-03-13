export type TSort = 'order' | 'title.ru' | '-price' | 'edition'
export interface Params {
  page: number,
  limit: number,
  sort: TSort,
  query: string,
  category: string,
  madeIn: string
}

export type TCatalogState = {
  list: IArticle[],
  params: Params,
  count: number,
  waiting: boolean,
}

export type TCatalogConfig = {entryURLParams: boolean}
