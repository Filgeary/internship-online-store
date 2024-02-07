import { cn as bem } from "@bem-react/classname";
import { memo } from "react";

import type { IArticle } from "@src/types/IArticle";
import numberFormat from "@src/utils/number-format";

import "./style.css";

type Props = {
  item: IArticle;
  isSelected: boolean;
  onSelectItem: (id: string | number, checked: boolean) => void;
  onAdd: (id: string | number) => void;
  labelCurr?: string;
  labelAdd?: string;
};

const ItemModalCatalog = ({
  item,
  isSelected,
  onSelectItem,
  onAdd,
  labelCurr = "₽",
  labelAdd = "Добавить"
}: Props) => {
  const cn = bem("ItemModalCatalog");

  const callbacks = {
    onAdd: () => onAdd(item._id),
  };

  return (
    <div className={cn({ selected: isSelected })}>
      <input
        type="checkbox"
        name="selectedItem"
        id={"selectedItem" + item._id}
        className={cn("checkbox")}
        checked={isSelected}
        onChange={(evt) =>
          onSelectItem(item._id, evt.target.checked)
        }
      />
      <div className={cn("title")}>{item.title}</div>
      <div className={cn("actions")}>
        <div className={cn("price")}>
          {numberFormat(item.price)} {labelCurr}
        </div>
        <button onClick={callbacks.onAdd}>{labelAdd}</button>
      </div>
    </div>
  );
};

export default memo(ItemModalCatalog);
