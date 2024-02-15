import type { CatalogItem } from "@src/types"
import type { To } from "react-router-dom"

export type ItemProps = {
  item: Pick<CatalogItem, '_id' | 'title' | 'price'>,
  link: To,
  labelAdd: string,
  labelCurr: string,
  onAdd: (_id: string, title: string) => void
}