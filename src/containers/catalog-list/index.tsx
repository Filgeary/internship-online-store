import {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Spinner from "@src/components/spinner";
import Paginator from "../paginator";
import { ItemType } from "@src/components/item-basket/type";

function CatalogList() {
  const store = useStore();

  const select = useSelector((state) => ({
    list: state.catalog.list,
    waiting: state.catalog.waiting,
  }));

  const callbacks = {
    addToBasket: useCallback( async( _id: string ) => {
      store.actions.modals
        .open('count')
        .then((count) => store.actions.basket.addToBasket(_id, Number(count)));
      }, [store])
  };

  const {t} = useTranslate();

  const renders = {
    item: useCallback(
      (item: ItemType) => (
        <Item
          item={item}
          onAdd={callbacks.addToBasket}
          link={`/articles/${item._id}`}
          labelAdd={t("article.add")}
          labelCurr="₽"
        />
      ),
      [callbacks.addToBasket, t]
    ),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Paginator storeName={'catalog'}/>
    </Spinner>
  );
}

export default CatalogList;
