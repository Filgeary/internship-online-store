import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';

type BasketToolProps = {
  onOpen: () => void;
  t?: (text: string, amount?: number) => string;
  sum?: number;
  amount?: number;
};

const defaultProps: BasketToolProps = {
  onOpen: () => {},
  sum: 0,
  amount: 0,
  t: (text: string) => text,
};

BasketTool.defaultProps = defaultProps;

function BasketTool({sum, amount, onOpen, t}: BasketToolProps) {
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
