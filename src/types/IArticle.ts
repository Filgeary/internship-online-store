export interface IArticle {
  _id: string
  _type: string
  order: string
  dateCreate: string
  dateUpdate: string
  isDeleted: boolean
  isNew: boolean
  proto: Proto
  name: string
  title: string
  description: string
  price: number
  madeIn: MadeIn
  edition: number
  photo: Photo
  category: Category
  favorites: string[]
  isFavorite: boolean
}

interface Proto {
  _id: string
  _type: string
}

interface MadeIn {
  _id: string
  _type: string
  title?: string
  code?: string
  [key: string]: string | undefined
}

interface Photo {
  _id: string
  _type: string
  [key: string]: string
}

interface Category {
  _id: string
  _type: string
  title?: string
  [key: string]: string | undefined
}
