import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import Button from "../button";

function BasketControls(props) {
  const cn = bem('BasketControls');
  const btnText = props.sum ? 'Выбрать ещё товар' : 'Выбрать товар';
  return (
    <div className={cn()}>
      { /* TODO: Для теста, удалить потом */}
      <Button className={cn('addMore')} onClick={props.onAddMore} value={btnText} />
    </div>
  );
}

BasketControls.propTypes = {
  //sum: PropTypes.number,
  //t: PropTypes.func
};

BasketControls.defaultProps = {
  //sum: 0,
  //t: (text) => text
}

export default memo(BasketControls);
