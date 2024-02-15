import type { CopiedModuleName } from "@src/store/types";

export type CatalogFilterProps = {
  catalogModuleName: CopiedModuleName<'catalog'> | 'catalog',
}