export interface Article {
  readonly _id: string,
  readonly title: string,
  readonly description: string,
  readonly price: number,
  readonly madeIn: {
    readonly title: string,
    readonly code: string,
    readonly_id: string
  },
  readonly edition: number,
  readonly category: {
    readonly title: string,
    readonly _id: string
  }
}

export interface IArticleState {
  readonly data: Partial<Article>
  readonly waiting: boolean
}