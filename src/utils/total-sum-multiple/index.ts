import { TCatalogArticle } from '@src/store/catalog/types';

type TCategoryResult = { title: string; price: number };

function totalSumMultiple(articlesList: TCatalogArticle[]): TCategoryResult[] {
  const categories: Map<string, TCategoryResult> = new Map();

  articlesList.forEach((article) => {
    const categoryId = article.category._id;
    const categoryTitle = article.category.title;

    const alreadyBeenSum = categories.get(categoryId)?.price || 0;

    const resultSum = Number((article.price + alreadyBeenSum).toFixed(2));
    const resultCategory = { title: categoryTitle, price: resultSum };

    categories.set(categoryId, resultCategory);
  });

  const result = [...categories.values()];

  return result;
}

export default totalSumMultiple;
