import {memo} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

function GoodsQuantityLayout({children, handleCancelClick, handleAddClick}){
  const cn = bem('Goods-quantity');
  return (
    <div className={cn()}>
      <div className={cn('wrap-input')}>
        <label className={cn('label')}>Количество товара</label>
        <div className={cn('input')}>
        {children}
        </div>
      </div>
      <div className={cn('wrap-button')}>
        <button className={cn('button')} onClick={handleCancelClick}>Отмена</button>
        <button className={cn('button')} onClick={handleAddClick}> Ок</button>
      </div>
    </div>
  )
}

GoodsQuantityLayout.propTypes = {
  children: PropTypes.node,
  handleCancelClick: PropTypes.func,
  handleAddClick: PropTypes.func
};

GoodsQuantityLayout.defaultProps = {
    handleCancelClick: () => {},
    handleAddClick: () => {},
  }

export default memo(GoodsQuantityLayout);