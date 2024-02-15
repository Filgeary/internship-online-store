import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import useServices from "@src/hooks/use-services";
import { CatalogItem } from "@src/types";

function CatalogList() {
  const store = useStore();
  const services = useServices()
  const {t} = useTranslate()

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id: string, itemTitle: string) => new Promise<number | undefined>(
       (res => {
        store.actions.modals.open({
          type: store.actions.modals.types.amount,
          resolve: res,
          extraData: {
            getTitle: async () => (
              t('amount-dialog.items-amount') + ' ' + (
                await services.api.getItemTitle(_id) || itemTitle
              )
            )
          }
        })
      })
    ).then(amount => {
      if (amount) {
        store.actions.basket.addToBasket(_id, amount)
      }
    }), [store]),
    // Пагинация
    onPaginate: useCallback((page: number) => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({page: String(page), limit: String(select.limit), sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const renders = {
    item: useCallback((item: CatalogItem) => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.addToBasket, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
