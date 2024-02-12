import { memo } from "react";

import './style.css';

type Props = {
  list: any[];
  renderItem: (item: any) => JSX.Element
}

function List({ list, renderItem }: Props) {
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
