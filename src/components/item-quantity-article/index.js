import React from 'react';
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import numberFormat from "@src/utils/number-format";

function ItemQuantityArticle(props) {
  const cn = bem('ItemQuantityArticle');

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  );
}

export default ItemQuantityArticle;
