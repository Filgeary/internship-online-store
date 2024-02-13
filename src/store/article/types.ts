export type ArticleStateType = {
  waiting: false,
  data: ArticleType | null
}

export type ArticleType = {
  _id: string | number,
  title: string,
  description: string,
  madeIn: ArticleMadeInType,
  category: ArticleCategoryType,
  edition: string | number,
  price: number,
}

export type ArticleMadeInType = {
  title: string,
  code: string,
}

export type ArticleCategoryType = {
  title: string,
}
