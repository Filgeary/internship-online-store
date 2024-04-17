import { ArticleType } from "../../store/article/types";
import { ArticleDTOType } from "../../store/cms-article/types";

export function convertAtricleToFormItem(article: ArticleType) {
  return {
    _id: article._id?.toString(),
    name: article.name,
    title: article.title,
    price: article.price,
    category: article.category._id,
    madeIn: article.madeIn?._id,
    description: article.description,
  }
}

export function convertFormItemToArticleDTO(item: any): ArticleDTOType {
  return {
    _id: item._id,
    name: item.name ? item.name : `article-${item.title}`,
    title: item.title,
    price: item.price,
    description: item.description,
    madeIn: {
      _id: item.madeIn,
    },
    category: {
      _id: item.category
    }
  }
}
