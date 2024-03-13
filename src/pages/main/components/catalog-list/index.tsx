import React, {memo, useCallback} from "react";
import useStore from "../../ww-old-hooks-postponed/use-store";
import useSelector from "../../ww-old-hooks-postponed/use-selector";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import Item from "@src/ww-old-components-postponed/item";
import List from "@src/ww-old-components-postponed/list";
import Pagination from "@src/ww-old-components-postponed/pagination";
import Spinner from "@src/ww-old-components-postponed/spinner";
import {IArticle} from "../../../types/IArticle";
import {ExtendedModulesKey} from "@src/ww-old-store-postponed-modals/types";

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
