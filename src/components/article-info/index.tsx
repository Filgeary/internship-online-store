import './style.css';
import { memo } from 'react';

import { cn as bem } from '@bem-react/classname';
import numberFormat from '@src/utils/number-format';

type TProps = {
  article: TArticle;
};

function ArticleInfo(props: TProps) {
  const { article } = props;
  const cn = bem('ArticleInfo');

  return (
    <>
      <div className={cn('description')}>{article.description}</div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Страна производитель:</div>
        <div className={cn('value')}>
          {article.madeIn?.title} ({article.madeIn?.code})
        </div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Категория:</div>
        <div className={cn('value')}>{article.category?.title}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Год выпуска:</div>
        <div className={cn('value')}>{article.edition}</div>
      </div>
      <div className={cn('prop', { size: 'big' })}>
        <div className={cn('label')}>Цена:</div>
        <div className={cn('value')}>{numberFormat(article.price)} ₽</div>
      </div>
    </>
  );
}

export default memo(ArticleInfo);
