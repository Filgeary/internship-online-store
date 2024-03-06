import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { TCountries } from "@src/store/countries";

export type TItemSelectProps = {
  item: TCountries;
  selected: TCountries[];
  count?: string;
  selectedList?: boolean;
  hovered?: string | null;
};

function ItemSelect(props: TItemSelectProps) {
  const cn = bem("ItemSelect");

  const select = props.selected.find((el) => el._id === props.item._id);

  return (
    <div
      className={
        !!props.selectedList
          ? cn("selectedList")
          : !!select
          ? cn("selected")
          : props.hovered === props.item?._id
          ? cn() + " " + cn("hovered")
          : cn()
      }
    >
      <div className={cn("group")}>
        <div className={cn("flag")}>{props.item?.code}</div>
        <div className={cn("country")}>{props.item?.title}</div>
      </div>
      {props.count && <div className={cn("count")}>{props.count}</div>}
    </div>
  );
}

export default memo(ItemSelect);
