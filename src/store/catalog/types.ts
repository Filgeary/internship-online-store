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
  category: string
}

type IReadonlyQueryParams = {
  readonly [K in keyof IQueryParams]: IQueryParams[K]
}

export type CatalogItemResponse = Pick<CatalogItem, '_id' | 'price' | 'title'>

export interface CatalogState {
  readonly list: CatalogItem[],
  readonly params: IReadonlyQueryParams,
  readonly count: number,
  readonly waiting: boolean
}

export type CatalogConfig = {
  urlEditing: boolean
}