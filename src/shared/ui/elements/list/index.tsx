import React, {memo} from "react";
import {ListProps} from "@src/shared/ui/elements/list/types";
import './style.css';

const List: React.FC<ListProps> = ({list, renderItem}) => {
  return (
    <div className='List'>{
      list.map(item =>
        <div key={item._id} className='List-item' >
          {renderItem(item)}
        </div>
      )}
    </div>
  )
}

export default memo(List);
