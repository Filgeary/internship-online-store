import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import { IBasketTotalProps } from "./types";
import './style.css';

function BasketTotal({sum, t}: IBasketTotalProps) {
  const cn = bem('BasketTotal');
  return (
    <div className={cn()}>
      {sum
        ? (
          <>
            <span className={cn('cell')}>{t('basket.total')}</span>
            <span className={cn('cell')}> {numberFormat(sum)} ₽</span>
            <span className={cn('cell')}></span>
          </>
        )
        : (<span className={cn('content')}><h2>Нет товаров 😢</h2></span>)
      }
    </div>
  );
}

BasketTotal.propTypes = {
  sum: PropTypes.number,
  t: PropTypes.func
};

BasketTotal.defaultProps = {
  sum: 0,
  t: (text: unknown) => text
}

export default memo(BasketTotal);
