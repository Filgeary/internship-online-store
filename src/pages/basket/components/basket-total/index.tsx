import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';
import {TranslateFunction} from "@src/shared/services/i18n/context";
import numberFormat from "@src/shared/utils/number-format";

interface Props {
    sum: number,
    t: TranslateFunction
}

const BasketTotal: React.FC<Props> = ({sum, t}) => {
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
