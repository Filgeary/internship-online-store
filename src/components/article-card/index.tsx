import './style.css';

import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';

import { TUserTranslateFn } from '@src/i18n/types';

import ArticleInfo from '../article-info';

type ArticleCardProps = {
  article: TArticle;
  onAdd: (id: string | number) => void;
  t: TUserTranslateFn;
};

function ArticleCard(props: ArticleCardProps) {
  const { article, onAdd, t } = props;
  const cn = bem('ArticleCard');

  return (
    <div className={cn()}>
      <ArticleInfo article={article} />
      <button onClick={() => onAdd(article._id)}>{t('article.add')}</button>
    </div>
  );
}

export default memo(ArticleCard);
