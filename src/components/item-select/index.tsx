import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { TCountries } from "@src/store/countries";
import useSelector from "@src/hooks/use-selector";

export type TItemSelectProps = {
  onSelect: (item: TCountries) => void;
  item: TCountries;
  onReset: () => void;
  select?: boolean;
  selected: TCountries[];
  count?: string;
  selectedList?: boolean;
};

function ItemSelect(props: TItemSelectProps) {
  const cn = bem("ItemSelect");

  const select = props.selected.find((el) => el._id === props.item._id);

  const callbacks = {
    onSelect: () => {
      if (props.item.title !== "Все") {
        props.onSelect(props.item);
      } else {
        props.onReset();
      }
    },
  };

  return (
    <div
      className={
        !!props.selectedList
          ? cn("selectedList")
          : !!select
          ? cn("selected")
          : cn()
      }
      onClick={callbacks.onSelect}
    >
      <div className={cn("group")}>
        <div className={cn("flag")}>{props.item.code}</div>
        <div className={cn("country")}>{props.item.title}</div>
      </div>
      {props.count && <div className={cn("count")}>{props.count}</div>}
    </div>
  );
}

export default memo(ItemSelect);
