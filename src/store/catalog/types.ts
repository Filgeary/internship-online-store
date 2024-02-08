import { TArticle } from "../article/types"

export type TItem={
    id:string|number, 
    selected:boolean
  }

export type TParams={
    page: number,
    limit: number,
    sort: string,
    query: string,
    category: string,
}

export type TCatalogState = {
    list: TArticle[],
        params: TParams,
        count: number,
        selectedItems: TItem[],
        waiting: boolean,
  }

