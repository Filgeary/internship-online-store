export type CmsArticleStateType = {
  waiting: boolean,
}

export type ArticleDTOType = {
  _id:string,
  name: string,
  title: string,
  price: number,
  description: string,
  madeIn: {
    _id: string,
  },
  category: {
    _id: string
  }
}
