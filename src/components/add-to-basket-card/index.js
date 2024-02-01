import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import {Link} from "react-router-dom";
import Button from "@src/components/button";
import './style.css';
import Input from "../input";

function AddToBasketCard(props) {
  const cn = bem('AddToBasketCard');

  return (
    <div className={cn()}>
      {/*<p>{props.item.title}</p>*/}

      <div className={cn('item')}>
        <div className={cn('title')}>
          <Link to={`/articles/${props.item._id}`} onClick={props.onCancel}>{props.item.title}</Link>
        </div>
        <div className={cn('right')}>
          <div className={cn('cell')}>{numberFormat(props.item.price)} ₽</div>
          <div className={cn('cellMini')}>x</div>
          <div className={cn('cell')}>
            <Input
              value={String(props.value)}
              onChange={props.updateValue}
              placeholder={'шт'}
              theme={'nano'}
              validation={'onlyNumber'}
              defaultValue={'1'}
              autoFocus={true}
            /> шт
          </div>
          {/* <div className={cn('cell')}>{numberFormat(props.item.amount || 0)} шт</div> */}
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

AddToBasketCard.propTypes = {
  //sum: PropTypes.number,
  //t: PropTypes.func
};

AddToBasketCard.defaultProps = {
  //sum: 0,
  //t: (text) => text
}

export default memo(AddToBasketCard);
