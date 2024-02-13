import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import {Link} from "react-router-dom";

interface ItemCatalogModalProps {
  item: {
    _id: string,
    title: string,
    price: number
  },
  link: string,
  onSelect: (_id: string) => void,
  labelCurr: string,
  isSelected: boolean
}

function ItemCatalogModal({onSelect = () => {}, labelCurr = '₽',...props}: ItemCatalogModalProps){

  const cn = bem('ItemCatalogModal');

  const callbacks = {
    onSelect: () => onSelect(props.item._id),
  }

  return (
    <div className={cn({selected: props.isSelected})} onClick={callbacks.onSelect}>
      <div className={cn('title')}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {labelCurr}</div>
      </div>
    </div>
  );
}

export default memo(ItemCatalogModal);
