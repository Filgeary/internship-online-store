import React, {memo} from "react";
import './style.css';
import {ArticleInterface} from "../../../types/ArticleInterface";

interface Props {
  list: ArticleInterface[],
  renderItem: (item: ArticleInterface) => React.ReactNode
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
