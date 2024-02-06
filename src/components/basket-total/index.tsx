import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import { TUserTranslateFn } from "@src/i18n/types";

type BasketTotalProps = {
  sum?: number;
  t: TUserTranslateFn;
};

const defaultProps: BasketTotalProps = {
  sum: 0,
  t: (text: string) => text,
};

BasketTotal.defaultProps = defaultProps;

function BasketTotal({sum, t}: BasketTotalProps) {
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
