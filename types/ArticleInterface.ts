export interface MadeIn {
  _id: string,
  code: string,
  title: string
}

export interface Category {
  _id: string,
  title: string
}

export interface ArticleInterface {
  _id: string,
  _type?: string,
  category?: Category,
  dateCreate?: string,
  description?: string,
  edition?: number,
  key?: string,
  madeIn?: MadeIn,
  name?: string,
  order?: number,
  price: number,
  title: string,
  amount?: number
}

/*
* interface Article {
    _id: string,
    _type: string,
    category: Category,
    dateCreate: string,
    dateUpdate: string,
    description: string,
    edition: number,
    isDeleted: boolean,
    isFavorite: boolean,
    isNew: boolean,
    key: string,
    madeIn: MadeIn,
    photo: object,
    name: string,
    order: number,
    price: number,
    title: string
}
* */
