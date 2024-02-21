import { memo } from "react";
import numberFormat from "@src/utils/number-format";
import { cn as bem } from "@bem-react/classname";
import { Link } from "react-router-dom";
import "./style.css";

export type TItemSelectProps = {
  onSelect: (e: any) => void;
  item: any;
  selected: any;
  onSetItem: (e: any) => void;
};

function ItemSelect(props: TItemSelectProps) {
  const cn = bem("ItemSelect");

  const callbacks = {
    onSelect: () => {
      props.onSetItem(props.item);
      props.onSelect(props.item._id);
    },
  };

  return (
    <div
      className={
        props.selected._id === props.item._id ? cn() + " " + "selected" : cn()
      }
      onClick={callbacks.onSelect}
    >
      <div className={cn("flag")}>{props.item.code}</div>
      <div className={cn("country")}>
        {props.item.title.length < 21
          ? props.item.title
          : `${props.item.title.substring(0, 21)}...`}
      </div>
    </div>
  );
}

ItemSelect.defaultProps = {
  onRemove: () => {},
  labelCurr: "₽",
  labelUnit: "шт",
  labelDelete: "Удалить",
};

export default memo(ItemSelect);
