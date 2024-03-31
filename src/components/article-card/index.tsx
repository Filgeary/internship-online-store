import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { TDictionaryKeys } from "@src/i18n/translations";
import { TArticle } from "@src/store/catalog/types";

type TArticleCardProps = {
  article: TArticle;
  onAdd: (id: string) => void;
  t: (text: TDictionaryKeys) => string;
};

function ArticleCard({ article, onAdd, t }: TArticleCardProps) {
  const cn = bem("ArticleCard");

  return (
    <div className={cn()}>
      <div className={cn("description")}>{article.description}</div>
      <div className={cn("prop")}>
        <div className={cn("label")}>Страна производитель:</div>
        <div className={cn("value")}>
          {article.madeIn?.title} ({article.madeIn?.code})
        </div>
      </div>
      <div className={cn("prop")}>
        <div className={cn("label")}>Категория:</div>
        <div className={cn("value")}>{article.category?.title}</div>
      </div>
      <div className={cn("prop")}>
        <div className={cn("label")}>Год выпуска:</div>
        <div className={cn("value")}>{article.edition}</div>
      </div>
      <div className={cn("prop", { size: "big" })}>
        <div className={cn("label")}>Цена:</div>
        <div className={cn("value")}>{numberFormat(article.price)} ₽</div>
      </div>
      <button onClick={() => onAdd(article._id)}>{t("article.add")}</button>
    </div>
  );
}


 ArticleCard.defaultProps = {
  onAdd: () => {},
  t: (text: any) => text
} 


export default memo(ArticleCard);
