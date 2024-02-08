import { memo} from "react";
import type { ListProps } from "./type";
import './style.css';

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
