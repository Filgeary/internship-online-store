export enum ESort { 
  order = 'order',
  titleRu = 'title.ru',
  priceDec = '-price',
  edition = 'edition' 
}

export interface IArticleResponse {
  readonly price: number
  readonly title: string
  readonly _id: string
}

export interface ICatalogItem extends IArticleResponse {}

export interface IQueryParams {
  page: number,
  limit: number,
  sort: ESort,
  query: string,
  category: string
}

type IReadonlyQueryParams = {
  readonly [K in keyof IQueryParams]: IQueryParams[K]
}



export interface ICatalogState {
  readonly list: ICatalogItem[],
  readonly params: IReadonlyQueryParams,
  readonly count: number,
  readonly waiting: boolean
}