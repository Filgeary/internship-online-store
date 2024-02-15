import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import type { ArticleCardProps } from "./types";
import './style.css';



function ArticleCard({article, onAdd, t}: ArticleCardProps) {
  const cn = bem('ArticleCard');
  return (
    <div className={cn()}>
      <div className={cn('description')}>{article.description}</div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{t('article.country')}:</div>
        <div className={cn('value')}>{article.madeIn?.title} ({article.madeIn?.code})</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{t('article.category')}:</div>
        <div className={cn('value')}>{article.category?.title}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{t('article.release')}:</div>
        <div className={cn('value')}>{article.edition}</div>
      </div>
      <div className={cn('prop', {size: 'big'})}>
        <div className={cn('label')}>{t('article.price')}:</div>
        <div className={cn('value')}>{
          article.price && `${numberFormat(article.price)} ₽`
        }</div>
      </div>
      <button onClick={() => {
        if (!article._id || !article.title) return
        onAdd(article._id, article.title)
      }}>{t('article.add')}</button>
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
  t: PropTypes.func
};

ArticleCard.defaultProps = {
  onAdd: () => {},
  t: (text: string) => text
}

export default memo(ArticleCard);
