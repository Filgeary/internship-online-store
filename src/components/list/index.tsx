import React, {memo} from "react";
import PropTypes from 'prop-types';
import Item from "../item";
import { IListProps } from "./types";
import './style.css';

function List({list, renderItem}: IListProps){
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

List.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  renderItem: PropTypes.func,
};

List.defaultProps = {
  renderItem: (item: any) => {},
}

export default memo(List);
