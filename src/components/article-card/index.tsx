import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "../../utils/number-format";
import './style.css';
import { ArticleType } from "../../store/article/types";

type ArticleCardPropsType = {
  article: ArticleType;
  onAdd: (id: string | number, title: string) => void;
  t: (value: string) => string;
}

function ArticleCard({article, onAdd, t}: ArticleCardPropsType) {
  const cn = bem('ArticleCard');
  return (
    <div className={cn()}>
      <div className={cn('description')}>{article?.description}</div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Страна производитель:</div>
        <div className={cn('value')}>{article?.madeIn?.title} ({article?.madeIn?.code})</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Категория:</div>
        <div className={cn('value')}>{article?.category?.title}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Год выпуска:</div>
        <div className={cn('value')}>{article?.edition}</div>
      </div>
      <div className={cn('prop', {size: 'big'})}>
        <div className={cn('label')}>Цена:</div>
        <div className={cn('value')}>{numberFormat(article?.price)} ₽</div>
      </div>
      <button onClick={() => onAdd(article?._id, article?.title)}>{t('article.add')}</button>
    </div>
  );
}

// ArticleCard.propTypes = {
//   article: PropTypes.shape({
//     _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     description: PropTypes.string,
//     madeIn: PropTypes.object,
//     category: PropTypes.object,
//     edition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     price: PropTypes.number
//   }).isRequired,
//   onAdd: PropTypes.func,
//   t: PropTypes.func
// };

export default memo(ArticleCard);
