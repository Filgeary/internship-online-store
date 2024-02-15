export type Article = {
  _id: string,
  title: string,
  description: string,
  price: number,
  madeIn: {
    title: string,
    code: string,
    _id: string
  },
  edition: number,
  category: {
    title: string,
    _id: string
  }
}

export type CatalogItem = {
  price: number
  title: string
  _id: string
}

export type BasketItem = {
  price: number, 
  title: string,
  _id: string,
  amount: number,
}

export type ProfileData = {
  email: String,
  profile: {
    name: string,
    phone: string,
  }
}