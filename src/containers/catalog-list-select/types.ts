import { CreateStoreModuleName } from "@src/store/types"

export type CatalogListSelectProps = {
  catalogModuleName: CreateStoreModuleName<'catalog'>
  selectedItems: string[],
  toggleSelect: (itemId: string) => void
}