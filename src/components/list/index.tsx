import React, {memo} from "react";
import './style.css';
import {IArticle} from "../../../types/IArticle";

interface Props {
  list: IArticle[],
  renderItem: (item: IArticle) => React.ReactNode
}

const List: React.FC<Props> = ({list, renderItem}) => {
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
