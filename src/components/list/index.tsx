import React, {memo} from "react";
import './style.css';

type ListProps = {
  list: Array<{ _id: string }>,
  renderItem: (elem: { _id: string }) => React.ReactNode;
};

const defaultProps: Omit<ListProps, "list"> = {
  renderItem: () => <></>
};

List.defaultProps = defaultProps;

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
