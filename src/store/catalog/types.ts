import { IResult } from '../types'

export interface IParams {
  page: number
  limit: number
  sort: string
  query: string
  category: string
  madeIn: string
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
  sort?: string | null
  query?: string | null
  category?: string | null
  madeIn?: string | null
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

export interface IProduct {
  id: string
  order?: number
  isDeleted?: boolean
  proto?: {}
  name?: string
  title: string
  description: string
  price: number
  madeIn?: {
    _id: string
    _type: string
  }
  edition?: number
  photo?: {}
  category?: {
    _id: string
    _type: string
  }
  favorites?: []
}

export interface IApiResponseProduct {
  data: {
      result: {
        _id: 'string'
        _type: 'string'
        order: 'string'
        dateCreate: 'string'
        dateUpdate: 'string'
        isDeleted: true
        isNew: true
        proto: {
          _id: 'string'
          _type: 'string'
        }
        name: 'string'
        title: 'Unknown Type: string,object'
        description: 'Unknown Type: string,object'
        price: 0
        madeIn: {
          _id: 'string'
          _type: 'string'
        }
        edition: 0
        photo: {
          _id: 'string'
          _type: 'string'
        }
        category: {
          _id: 'string'
          _type: 'string'
        }
        favorites: ['string']
        isFavorite: false
      }
  }
  headers: any
  status: number
}
