import { memo } from "react";
import PropTypes, { string } from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import Button from "@src/components/button";
import { IArticleCardProps } from "./types";
import './style.css';

function ArticleCard({article, onAdd, isDialogOpen, t}: IArticleCardProps) {
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
      <Button onClick={() => onAdd?.(article._id)} value={t?.('article.add')} isLoading={isDialogOpen} />
    </div>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    madeIn: PropTypes.object,
    category: PropTypes.object,
    edition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.number
  }).isRequired,
  onAdd: PropTypes.func,
  t: PropTypes.func,
  isDialogOpen: PropTypes.bool,
};

ArticleCard.defaultProps = {
  onAdd: () => {},
  t: (text: string): string => text,
  isDialogOpen: false,
}

export default memo(ArticleCard);
