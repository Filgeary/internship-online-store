import type { CatalogItem } from "@src/types"

export enum ESort { 
  order = 'order',
  titleRu = 'title.ru',
  priceDec = '-price',
  edition = 'edition' 
}

export type Sort = keyof typeof ESort

export interface IQueryParams {
  page: number,
  limit: number,
  sort: Sort,
  query: string,
  category: string,
  madeIn: string
}

type IReadonlyQueryParams = {
  [K in keyof IQueryParams]: IQueryParams[K]
}

export type CatalogItemResponse = Pick<CatalogItem, '_id' | 'price' | 'title'>

export interface CatalogState {
  list: CatalogItem[],
  params: IReadonlyQueryParams,
  count: number,
  waiting: boolean
}

export type CatalogConfig = {
  urlEditing: boolean
}