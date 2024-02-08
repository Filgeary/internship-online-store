import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "../../utils/number-format";
import './style.css';

interface Props {
    sum: number,
    amount: number,
    onOpen: () => void,
    t: (key: string, amount?: number) => string
}

const BasketTool: React.FC<Props> = ({sum, amount, onOpen, t}) => {
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
