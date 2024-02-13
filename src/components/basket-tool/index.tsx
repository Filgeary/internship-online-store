import { memo } from 'react';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "../../utils/number-format";
import { BasketToolPropsType } from './types';
import './style.css';

function BasketTool({sum, amount, onOpen, t}: BasketToolPropsType) {
  const cn = bem('BasketTool');
  return (
    <div className={cn()}>
      <span className={cn('label')}>{t('basket.inBasket')}</span>
      <span className={cn('total')}>
        {amount
          ? `${amount} ${t('basket.articles', amount)} / ${numberFormat(sum)} ₽`
          : t('basket.empty')
        }
      </span>
      <button onClick={onOpen}>{t('basket.open')}</button>
    </div>
  );
}

// BasketTool.defaultProps = {
//   onOpen: () => {},
//   sum: 0,
//   amount: 0,
//   t: (text) => text
// }

export default memo(BasketTool);
