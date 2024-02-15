import {memo} from "react";
import PropTypes from 'prop-types';
import type { ListProps } from "./types";
import './style.css';

function List<T extends {
  _id: string | number
}>({list, renderItem}: ListProps<T>){
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

// List.propTypes = {
//   list: PropTypes.arrayOf(PropTypes.shape({
//     _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//   })).isRequired,
//   renderItem: PropTypes.func,
// };

// List.defaultProps = {
//   renderItem: (item) => {},
// }

export default memo(List) as typeof List;
