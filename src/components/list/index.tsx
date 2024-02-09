import { memo } from "react";
import "./style.css";

type ListProps = {
  list: { _id: string }[];
  renderItem: (item: { _id: string }) => React.ReactNode;
};

function List({ list, renderItem }: ListProps) {
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
  renderItem: (item) => {},
};

export default memo(List);
