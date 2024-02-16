import React, {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import {IArticle} from "../../../types/IArticle";
import {ExtendedModulesKey} from "@src/store/types";

interface Props {
  stateName?: ExtendedModulesKey<'catalog'>,
}

const CatalogList: React.FC<Props> = ({stateName = 'catalog'}) => {

  const store = useStore();

  const {t} = useTranslate();

  const select = useSelector(state => ({
    list: state[stateName].list,
    params: state[stateName].params,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
  }));

  const callbacks = {
    addToBasket: useCallback(async (item: IArticle) => {
      const result: number = await store.actions.modals.open('adding', {...item}) as number
      if (result > 0) {
        await store.actions.basket.addToBasket(item._id, result)
      }
    }, []),
    // Пагинация
    onPaginate: useCallback((page: number) => {
      // @ts-ignore
      store.actions[stateName].setParams({page})
    }, [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({
        page: String(page),
        limit: String(select.params.limit),
        sort: select.params.sort,
        query: select.params.query
      })}`;
    }, [select.params.limit, select.params.sort, select.params.query])
  }

  const renders = {
    item: useCallback((item: IArticle) =>
        <Item item={item} onAdd={callbacks.addToBasket}
              link={`/articles/${item._id}`} labelAdd={t('article.add')}/>,
      [callbacks.addToBasket, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.params.page}
                  limit={select.params.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
