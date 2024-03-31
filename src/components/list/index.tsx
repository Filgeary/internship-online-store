import { memo } from "react";
import "./style.css";
import { TBasketArticle } from "@src/store/basket/types";
import { TArticle } from "@src/store/catalog/types";

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

 List.defaultProps = {
  renderItem: (item: any) => {},
} 

export default memo(List);
