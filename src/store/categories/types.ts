export interface ICategoryResponse {
  _id: string,
  title: string
  parent: null | {
    _id: string
  }
}

export interface ICategory extends ICategoryResponse {}

export interface CategoriesState {
  list: ICategory[],
  waiting: boolean
}

export type CategoriesConfig = {}