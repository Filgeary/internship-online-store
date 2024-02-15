import { CatalogItem } from "@src/types"

export type ItemSelectProps = {
  item: Pick<CatalogItem, '_id' | 'price' | 'title'>,
  selected: boolean,
  labelCurr: string,
  onClick: (_id: string) => void
}