import { ExtendedModulesKeys, ModulesKeys } from "../../store/types";

export type CatalogModalPropsType<T> = {
  storeSlice: ExtendedModulesKeys<T extends ModulesKeys ? T : "catalog">;
  close: (value?: string[]) => void
}
