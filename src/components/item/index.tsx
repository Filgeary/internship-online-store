import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { Link } from "react-router-dom";
import useSelector from "@src/hooks/use-selector";
import { TArticle } from "@src/store/article/types";
import { TItem } from "@src/store/catalog/types";
import { TKey, TKeyModules } from "@src/store/types";


type TItemProps<T> = {
  item: TArticle;
  link: string;
  onAdd: (id: string | number) => void;
  labelCurr: string;
  labelAdd: string;
  catalog?: boolean;
  onSelect: (item:TArticle) => void;
  storeName:TKey<T extends TKeyModules ? T : "catalog">
};

function Item(props: TItemProps<''>) {
  const cn = bem("Item");

  const selected : TItem[] = useSelector(
    (state) => (props.catalog && state[props.storeName].selectedItems) || []
  );
  const select = selected.find(
    (el) => el.id == props.item._id
  );
  const callbacks = {
    onAdd: () => props.onAdd(props.item._id),
    onSelect: () => {
      props.onSelect(props.item);
    },
  };
 

  return (
    <div
      className={
        !props.catalog
          ? cn()
          : select?.selected
          ? cn() + " " + cn("pointer") + " " + cn("selected")
          : cn() + " " + cn("pointer")
      }
      onClick={props.catalog ? callbacks.onSelect : undefined}
    >
      <div className={cn("title")}>
        {props.catalog ? (
          props.item.title
        ) : (
          <Link to={props.link}>{props.item.title}</Link>
        )}
      </div>
      <div className={cn("actions")}>
        <div className={cn("price")}>
          {numberFormat(props.item.price)} {props.labelCurr}
        </div>
        {!props.catalog && (
          <button onClick={callbacks.onAdd}>{props.labelAdd}</button>
        )}
      </div>
    </div>
  );
}

/* Item.defaultProps = {
  onAdd: () => {},
  labelCurr: "₽",
  labelAdd: "Добавить",
  onSelect: () => {},
}; */

export default memo(Item);
