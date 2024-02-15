import type { TranslateFn } from "@src/i18n/types"
import type { Article } from "@src/types"

export type ArticleCardProps = {
  article: Partial<Pick<
    Article, 
    'description' | 'madeIn' | 
    'category' | 'edition' | 
    'price' | 'title' | 
    '_id'
  >>, 
  onAdd: (_id: string, itemTitle: string) => void, 
  t: TranslateFn
}