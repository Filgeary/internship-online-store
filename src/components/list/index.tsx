import React, { memo } from 'react';
import './style.css';

type ListProps = {
  list: TItem[];
  renderItem: (item: TItem) => React.ReactNode;
};

function List({ list, renderItem }: ListProps) {
  return (
    <div className='List'>
      {list.map((item) => (
        <div key={item._id} className='List-item'>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default memo(List);
