import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { ItemType } from "../item-basket";

interface SelectableItemProps {
  item: ItemType;
  onSelect: (_id: string) => void;
  labelCurr: string;
  selected: boolean
}

function SelectableItem(props: SelectableItemProps) {
  const cn = bem("SelectableItem");

  const onSelect = () => {
    props.onSelect(props.item._id);
  };

  return (
    <div className={cn({ selected: props.selected })} onClick={onSelect}>
      <div className={cn("title")}>{props.item.title}</div>
      <div className={cn("price")}>
        {numberFormat(props.item.price)} {props.labelCurr}
      </div>
    </div>
  );
}

export default memo(SelectableItem);
