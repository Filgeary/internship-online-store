import { memo} from "react";
import './style.css';
import { ItemType } from "../item-basket";

interface ListProps {
  list: ItemType[];
  renderItem: (item: ItemType) => JSX.Element;
}

function List({list, renderItem}: ListProps){
  return (
    <div className='List'>{
      list.map(item =>
        <div key={item._id} className='List-item'>
          {renderItem(item)}
        </div>
      )}
    </div>
  )
}

export default memo(List);
