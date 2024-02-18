import type { Article } from "@src/types"

export interface ArticleState {
  data: Partial<Article>
  waiting: boolean
}

export type ArticleResponse = Pick<
  Article,
  '_id' | 'category' | 
  'description' | 'edition' | 
  'madeIn' | 'price' | 
  'title'
>

export type ArticleConfig = {}