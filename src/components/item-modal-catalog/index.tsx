import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "../../utils/number-format";
import { ItemModalCatalogPropsType } from "./types";
import './style.css';

function ItemModalCatalog(props: ItemModalCatalogPropsType){

  const cn = bem('Item');

  const callbacks = {
    onAdd: (_: any) => {
      props.onAdd(props.item._id.toString())
    },
  }

  return (
    <div className={props.selected ? "Item Item_selected": "Item"} onClick={callbacks.onAdd}>
      <div className={cn('title')}>
        {props.item.title}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  );
}


// ItemModalCatalog.defaultProps = {
//   onAdd: () => {},
//   labelCurr: '₽',
//   labelAdd: 'Добавить'
// }

export default memo(ItemModalCatalog);
