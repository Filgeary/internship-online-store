import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import {Link} from "react-router-dom";
import Button from "@src/components/button";
import InputNumber from "../input-number";
import { IAddProductCardProps } from "./types";
import './style.css';

function AddProductCard(props: IAddProductCardProps) {
  const cn = bem('AddProductCard');

  return (
    <div className={cn()}>
      {/*<p>{props.item.title}</p>*/}

      <div className={cn('item')}>
        <div className={cn('title')}>
          <Link to={`/articles/${props.item._id}`} onClick={props.onCloseAll}>{props.item.title}</Link>
        </div>
        <div className={cn('right')}>
          <div className={cn('cell')}>{numberFormat(props.item.price)} ₽</div>
          <div className={cn('cellMini')}>x</div>
          <InputNumber
            placeholder={'шт'}
            minValue={1}
            maxValue={9999}
            value={props.value}
            updateValue={props.updateValue}
          />
          <div className={cn('cellMini')}>=</div>
          <div className={cn('cellTotal')}><b>{numberFormat(props.pcsSumm)} ₽</b></div>
        </div>
      </div>

      <div className={cn('buttons')}>
        <Button value='Отмена' onClick={props.onCancel} />
        <Button value='Ок' onClick={props.onOk} disabled={!Boolean(props.pcsSumm)} />
      </div>
    </div>
  );
}

AddProductCard.propTypes = {
  //sum: PropTypes.number,
  //t: PropTypes.func
};

AddProductCard.defaultProps = {
  //sum: 0,
  //t: (text) => text
}

export default memo(AddProductCard);
