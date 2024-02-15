import type { CopiedModuleName } from "@src/store/types"

export type CatalogListSelectProps = {
  catalogModuleName: CopiedModuleName<'catalog'> | 'catalog',
  selectedItems: string[],
  toggleSelect: (itemId: string) => void
}