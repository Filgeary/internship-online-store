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

