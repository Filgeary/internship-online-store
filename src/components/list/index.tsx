import { memo } from 'react';
import { ListPropsType } from './types';
import './style.css';

function List({list, renderItem}: ListPropsType){
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

// List.defaultProps = {
//   renderItem: (item) => {},
// }

export default memo(List);
