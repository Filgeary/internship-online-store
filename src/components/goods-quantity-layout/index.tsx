import {memo, ReactNode, FC} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';

interface IGoodsQuantityLayoutProps {
  children: ReactNode;
  handleCancelClick: () => void;
  handleAddClick: () => void;
}

const GoodsQuantityLayout: FC<IGoodsQuantityLayoutProps> = ({ children, handleCancelClick, handleAddClick }) => {
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

export default memo(GoodsQuantityLayout);