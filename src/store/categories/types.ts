
export interface ICategory {
    children: ICategory[]
    parent: {_id: string}
    title: string
   _id: string
  }

export interface ICategoriesInitState {
    list: ICategory[]
    waiting: boolean
  }

export interface IApiResponseCategory {
    data: {
        result: {
            items: ICategory[]
        }
      }
      headers: Record<string, string>
      status: number
}
  