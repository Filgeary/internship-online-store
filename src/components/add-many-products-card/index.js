import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import Button from "@src/components/button";
import './style.css';

function AddManyProductsCard(props) {
  const cn = bem('AddManyProductsCard');

  return (
    <div className={cn()}>

      <div className={cn('content')}>
        {props.children}
      </div>

      <div className={cn('buttons')}>
        <Button value='Добавить выбранные' onClick={props.onAddAll} />
        <Button value='Отмена' onClick={props.onCancel} />
      </div>
    </div>
  );
}

AddManyProductsCard.propTypes = {
  //sum: PropTypes.number,
  //t: PropTypes.func
};

AddManyProductsCard.defaultProps = {
  //sum: 0,
  //t: (text) => text
}

export default memo(AddManyProductsCard);
