import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { TCountries } from "@src/store/countries";
import useSelector from "@src/hooks/use-selector";

export type TItemSelectProps = {
  onSelect: (item: TCountries) => void;
  item: TCountries;
  onReset: () => void;
  select?:boolean
};

function ItemSelect(props: TItemSelectProps) {
  const cn = bem("ItemSelect");
  const selected: TCountries[] = useSelector(
    (state) => state.countries.selected || []
  );
  const select = selected.find((el) => el._id === props.item._id);

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
      className={!!select ? cn("selected") : cn()}
      onClick={callbacks.onSelect}
    >
      <div className={cn("flag")}>{props.item.code}</div>
      <div className={cn("country")}>
        {props.item.title?.length <= 21
          ? props.item.title
          : `${props.item.title?.substring(0, 21)}...`}
      </div>
    </div>
  );
}

export default memo(ItemSelect);
