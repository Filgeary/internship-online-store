import { useCallback, memo } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Paginator from "../paginator";
import List from "@src/components/list";
import Spinner from "@src/components/spinner";
import SelectableItem from "@src/components/selectable-item";
import { ItemType } from "@src/components/item-basket/type";
import { StoreNames } from "../catalog-filter/type";

function CatalogListSelectable(props: StoreNames) {
  const store = useStore();

  const select = useSelector((state) => ({
    list: state[props.storeName]!.list,
    waiting: state[props.storeName]!.waiting,
    selected: state[props.storeName]!.selected,
  }));

  const callbacks = {
    onSelect: useCallback(
      (_id: string) => {
        store.actions[props.storeName]!.selectItem(_id);
      },
      [store]
    ),
  };

  const renders = {
    items: useCallback(
      (item: ItemType) => {
        let selected = false;
        if (select.selected.includes(item._id)) {
          selected = true;
        }
        return (
          <SelectableItem
            item={item}
            selected={selected}
            onSelect={callbacks.onSelect}
            labelCurr="₽"
          />
        );
      },
      [callbacks.onSelect, select.selected]
    ),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.items} />
      <Paginator storeName={props.storeName} />
    </Spinner>
  );
}

export default memo(CatalogListSelectable);
