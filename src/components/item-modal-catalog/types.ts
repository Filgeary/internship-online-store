import { CatalogArticleType } from "../../store/catalog/types";

export type ItemModalCatalogPropsType = {
  item: CatalogArticleType;
  labelCurr?: string;
  labelAdd?: string;
  selected: boolean;
  onAdd: (id: string) => void
}
