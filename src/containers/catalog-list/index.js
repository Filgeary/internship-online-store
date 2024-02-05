import {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Spinner from "@src/components/spinner";
import Paginator from "../paginator";

function CatalogList() {
  const store = useStore();

  const select = useSelector(state => ({
    list: state.catalog.list,
    waiting: state.catalog.waiting,
  }));

  const storeName = {
    count: "count",
    catalog: "catalog"
  }

  const callbacks = {
    addToBasket: useCallback( async( _id ) => {
      store.actions.modals
        .open(storeName.count)
        .then((count) => store.actions.basket.addToBasket(_id, count))
        .catch((err) => console.error(err.message));
      }, [store])
  };

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.addToBasket, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Paginator storeName={storeName.catalog}/>
    </Spinner>
  );
}

export default CatalogList;
