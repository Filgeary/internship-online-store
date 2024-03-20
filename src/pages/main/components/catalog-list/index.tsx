import React, {memo, useCallback} from "react";
import {ExtendedModulesKey} from "@src/shared/store/types";
import useStore from "@src/shared/hooks/use-store";
import useTranslate from "@src/shared/hooks/use-translate";
import useSelector from "@src/shared/hooks/use-selector";
import Item from "@src/shared/ui/elements/item";
import Spinner from "@src/shared/ui/layout/spinner";
import List from "@src/shared/ui/elements/list";
import Pagination from "@src/widgets/pagination";

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
