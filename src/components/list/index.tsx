import { memo } from "react";
import "./style.css";

type IListProps = {
  list: [{ _id: string | number }];
  renderItem: (item: { _id: string | number }) => React.ReactNode;
};

function List({ list, renderItem }: IListProps) {
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
