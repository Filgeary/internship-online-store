import { IResult } from "../types"

export interface IParams {
    page: number
    limit: number
    sort: string
    query: string
    category: string
  }

export interface IIinitCatalogState {
    list: IResult[]
    params: IParams
    count: number
    waiting: boolean
    }

export interface IValidParams {
    page?: number
    limit?: number
    sort?:  string | null
    query?: string | null
    category?: string | null
}

export interface ISelected {
    id: string
    quantity: number
}

export interface IApiResponseCatalog {
    data: {
        result: {
            items: IResult[]
            count: number
        }
      }
      headers: any
      status: number
}