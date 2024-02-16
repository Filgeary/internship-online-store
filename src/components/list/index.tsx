import { memo } from "react";
import "./style.css";
import { TArticle } from "@src/store/article/types";
import { TBasketArticle } from "@src/store/basket/types";

type TListProps = {
  list: TArticle[] | TBasketArticle[];
  renderItem: (item: TArticle) => React.ReactNode;
};

function List({ list, renderItem }: TListProps) {
  return (
    <div className="List">
      {list.map((item) => (
        <div key={item._id} className="List-item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

/* List.defaultProps = {
  renderItem: (item: any) => {},
} */

export default memo(List);
