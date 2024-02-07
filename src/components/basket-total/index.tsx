import { cn as bem } from '@bem-react/classname';
import { memo } from "react";

import numberFormat from "@src/utils/number-format";

import './style.css';

type Props = {
  sum: number
  t: Function
}

function BasketTotal({ sum, t }: Props) {
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
