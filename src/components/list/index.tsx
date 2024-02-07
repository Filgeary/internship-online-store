import { memo } from "react";

import { IArticle } from "@src/types/IArticle";

import './style.css';

type Props = {
  list: IArticle[];
  renderItem<T>(item: T): JSX.Element;
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
