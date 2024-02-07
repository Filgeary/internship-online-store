import { cn as bem } from '@bem-react/classname';
import { memo } from "react";

import numberFormat from "@src/utils/number-format";

import './style.css';

type Props = {
  onOpen: () => void,
  sum: number,
  amount: number,
  t: Function
}

function BasketTool({ onOpen, t, sum = 0, amount = 0 }: Props) {
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

export default memo(BasketTool);
