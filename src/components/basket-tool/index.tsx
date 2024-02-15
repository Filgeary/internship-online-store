import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';
import numberFormat from '@src/utils/number-format';
import './style.css';

import { TAllLangsPick, TUserTranslateFn } from '@src/i18n/types';

type BasketToolProps = {
  onOpen: () => void;
  t?: TUserTranslateFn;
  sum?: number;
  amount?: number;
};

// https://github.com/facebook/react/pull/16210

// const defaultProps: BasketToolProps = {
//   onOpen: () => {},
//   sum: 0,
//   amount: 0,
//   t: (text: TAllLangsPick) => text,
// };

// BasketTool.defaultProps = defaultProps;

function BasketTool(props: BasketToolProps) {
  const { sum = 0, amount = 0, onOpen = () => {}, t = (text: TAllLangsPick) => text } = props;

  const cn = bem('BasketTool');
  return (
    <div className={cn()}>
      <span className={cn('label')}>{t('basket.inBasket')}</span>
      <span className={cn('total')}>
        {amount
          ? `${amount} ${t('basket.articles', amount)} / ${numberFormat(sum)} ₽`
          : t('basket.empty')}
      </span>
      <button onClick={onOpen}>{t('basket.open')}</button>
    </div>
  );
}

export default memo(BasketTool);
