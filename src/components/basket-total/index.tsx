import { memo, FC } from 'react';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';

interface IBasketTotalProps {
  sum?: number
  t: (text: string, number?: number) => string
}
const BasketTotal: FC<IBasketTotalProps> = ({ sum = 0, t }) => {
  const cn = bem('BasketTotal');
  return (
    <div className={cn()}>
      <span className={cn('cell')}>{t('basket.total')}</span>
      <span className={cn('cell')}> {numberFormat(sum)} ₽</span>
      <span className={cn('cell')}></span>
    </div>
  );
}

export default memo(BasketTotal);
