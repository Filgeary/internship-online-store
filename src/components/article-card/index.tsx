import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';

import numberFormat from '@src/utils/number-format';

import type { TTranslate } from '@src/i18n/context';
import type { IArticle } from '@src/types/IArticle';

import './style.css';

type Props = {
  article: IArticle | null;
  onAdd: (id: string) => void;
  t: TTranslate;
};

function ArticleCard({ article, onAdd, t }: Props) {
  const cn = bem('ArticleCard');

  if (!article) {
    return null;
  }

  return (
    <div className={cn()}>
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
      <button onClick={() => onAdd(article._id)}>{t('article.add')}</button>
    </div>
  );
}

export default memo(ArticleCard);
