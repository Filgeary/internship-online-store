import * as modules from "./exports"
interface ImadeIn {
  _id: string
  _type: string
}

interface ICategory extends ImadeIn {}

export interface IResult {
  category: ICategory
  dateCreate: string
  dateUpdate: string
  description: string
  edition: number
  isDeleted: boolean
  isFavorite: boolean
  isNew: boolean
  madeIn: ImadeIn
  name: string
  order: number
  price: number
  proto: any
  title: string
  _id: string
  _key: string
  _type: string
  selectedGoods: boolean
}

export type ImportModules = typeof modules
export type IKeysModules = keyof ImportModules

export type IExtendedModules<T extends keyof ImportModules> = T | `${T}-${string}`

export type StoreState = {
  [key in IKeysModules as IExtendedModules<key>]: ReturnType<Actions[key]['initState']>
}

export type Actions = {
  [key in IKeysModules as IExtendedModules<key>]: InstanceType<ImportModules[key]>
}



