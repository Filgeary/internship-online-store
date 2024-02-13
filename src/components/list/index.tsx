import {memo} from "react";
import './style.css';

interface ListProps {
  list: {
    _id: string
  }[],
  renderItem: (item: { _id: string }) => React.ReactNode,
}

function List({list, renderItem}: ListProps){
  return (
    <div className='List'>{
      list.map((item) =>
        <div key={item._id} className='List-item'>
          {renderItem(item)}
        </div>
      )}
    </div>
  )
}

export default memo(List);
