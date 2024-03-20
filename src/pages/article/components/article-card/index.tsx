import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';
import {TranslateFunction} from "@src/shared/i18n/context";
import numberFormat from "@src/shared/utils/number-format";

interface Props {
    article: IArticle,
    onAdd: (_id: string) => void,
    t: TranslateFunction
}

const ArticleCard: React.FC<Props> = ({article, onAdd, t}) => {
  const cn = bem('ArticleCard');
  return (
    <div className={cn()}>
      <div className={cn('description')}>{article.description}</div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Страна производитель:</div>
        <div className={cn('value')}>{article.madeIn?.title} ({article.madeIn?.code})</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Категория:</div>
        <div className={cn('value')}>{article.category?.title}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Год выпуска:</div>
        <div className={cn('value')}>{article.edition}</div>
      </div>
      <div className={cn('prop', {size: 'big'})}>
        <div className={cn('label')}>Цена:</div>
        <div className={cn('value')}>{numberFormat(article.price)} ₽</div>
      </div>
      <button onClick={() => onAdd(article._id)}>{t('article.add')}</button>
    </div>
  );
}


export default memo(ArticleCard);
