import { CatalogArticleType } from "../../store/catalog/types";

export type ItemPropsType = {
  item: CatalogArticleType;
  link: string;
  labelAdd: string;
  labelCurr?: string;
  onAdd: (id: string | number, name: string) => void;
}
