import { CatalogArticleType } from "../../store/catalog/types";
import { CategoryType } from "../../store/categories/types";

export type TableArticleType = {
  key: string | number;
  title: string;
  price: number;
  category: string;
  edition: any;
}

export default function tableCatalogDataFormat(initial: CatalogArticleType[], category: CategoryType[]) {

  const categoryMap: Record<string, string> = {};
  category.forEach(el => categoryMap[el._id] = el.title)

  const result: TableArticleType[] = initial.map(el => {
    return {
      key: el._id,
      title: el.title,
      price: el.price,
      category: categoryMap[el.category._id],
      edition: el.edition,
    }
  })

  return result;
}
