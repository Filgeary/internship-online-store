export interface ICategoryResponse {
  readonly _id: string,
  readonly title: string
  readonly parent: null | {
    readonly _id: string
  }
}

export interface ICategory extends ICategoryResponse {}

export interface CategoriesState {
  readonly list: ICategory[],
  readonly waiting: boolean
}

export type CategoriesConfig = {}