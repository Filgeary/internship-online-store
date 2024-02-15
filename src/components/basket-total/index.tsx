import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import type { BasketTotalProps } from "./types";
import './style.css';

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

BasketTotal.propTypes = {
  sum: PropTypes.number,
  t: PropTypes.func
};

BasketTotal.defaultProps = {
  sum: 0,
  t: (text: string) => text
}

export default memo(BasketTotal);
