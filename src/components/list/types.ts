import { ReactNode } from "react";
import { CatalogArticleType } from "../../store/catalog/types";

export type ListPropsType = {
  list: CatalogArticleType[];
  renderItem: (item: CatalogArticleType) => ReactNode;
}
