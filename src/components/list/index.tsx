import { memo } from "react";
import "./style.css";

type TListProps = {
  list: [{ _id: string | number }];
  renderItem: (item: { _id: string | number }) => React.ReactNode;
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
