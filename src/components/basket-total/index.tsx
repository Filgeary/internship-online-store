import { memo } from 'react';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "../../utils/number-format";
import { BasketTotalPropsType } from './types';
import './style.css';

function BasketTotal({sum, t}: BasketTotalPropsType) {
  const cn = bem('BasketTotal');
  return (
    <div className={cn()}>
      <span className={cn('cell')}>{t('basket.total')}</span>
      <span className={cn('cell')}> {numberFormat(sum)} ₽</span>
      <span className={cn('cell')}></span>
    </div>
  );
}

// BasketTotal.defaultProps = {
//   sum: 0,
//   t: (text) => text
// }

export default memo(BasketTotal);
