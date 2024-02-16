export interface MadeIn {
  _id: string,
  code: string,
  title: string
}

// Категории
export interface Category {
  _id: string,
  title: string
}

// Те поля что не используются в компонентах я пометил как необязательные
export interface IArticle {
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
  amount: number
}
